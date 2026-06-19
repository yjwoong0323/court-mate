import { useCallback, useEffect, useMemo, useState } from 'react'
import { createCourt, getCourts } from '../api/courtApi'
import { endGame, getPlayingGames, moveCurrentGame, startGame } from '../api/gameApi'
import {
  changePlayerAttendance,
  createPlayer,
  deletePlayer,
  getPlayers,
} from '../api/playerApi'
import { createEmptySlots, getElapsedSeconds, SLOT_COUNT } from '../utils/courtUtils'
import { getPlayerAttended } from '../utils/playerUtils'

export function useDashboardData() {
  const [courts, setCourts] = useState([])
  const [players, setPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingCourt, setIsCreatingCourt] = useState(false)
  const [isCreatingPlayer, setIsCreatingPlayer] = useState(false)
  const [changingAttendancePlayerId, setChangingAttendancePlayerId] = useState(null)
  const [deletingPlayerId, setDeletingPlayerId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [courtSlots, setCourtSlots] = useState({})
  const [courtGames, setCourtGames] = useState({})
  const [actionCourtId, setActionCourtId] = useState(null)
  const [moveMenuCourtId, setMoveMenuCourtId] = useState(null)
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(false)
  const [now, setNow] = useState(Date.now())

  const resetSelection = useCallback(() => {
    setSelectedPlayer(null)
    setSelectedSlot(null)
    setMoveMenuCourtId(null)
  }, [])

  const availablePlayers = useMemo(() => {
    const assignedPlayerIds = new Set(
      Object.values(courtSlots)
        .flat()
        .filter(Boolean)
        .map((player) => player.id),
    )

    return players.filter((player) => !assignedPlayerIds.has(player.id))
  }, [courtSlots, players])

  useEffect(() => {
    let ignore = false

    // 화면이 처음 열릴 때 코트, 선수, 진행 중인 게임을 함께 불러온다.
    Promise.all([getCourts(), getPlayers(), getPlayingGames()])
      .then(([courtData, playerData, playingGameData]) => {
        if (ignore) {
          return
        }

        const restoredSlots = {}
        const restoredGames = {}

        playingGameData.forEach((game) => {
          const startedAt = game.startedAt ? new Date(game.startedAt).getTime() : Date.now()

          restoredSlots[game.courtId] = Array.from(
            { length: SLOT_COUNT },
            (_, index) => game.players?.[index] ?? null,
          )
          restoredGames[game.courtId] = {
            id: game.id,
            status: game.status,
            startedAt,
            elapsedSeconds: 0,
          }
        })

        setCourts(courtData)
        setPlayers(playerData)
        setCourtSlots(restoredSlots)
        setCourtGames(restoredGames)
        setNow(Date.now())
        resetSelection()
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(error.message)
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [resetSelection])

  useEffect(() => {
    const hasPlayingGame = Object.values(courtGames).some((game) => game.status === 'PLAYING')

    if (!hasPlayingGame) {
      return undefined
    }

    const timerId = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [courtGames])

  const handleSelectPlayer = (player) => {
    setSelectedSlot(null)
    setMoveMenuCourtId(null)
    setSelectedPlayer((prevPlayer) => (prevPlayer?.id === player.id ? null : player))
  }

  const handleSlotClick = (courtId, slotIndex) => {
    if (courtGames[courtId]?.status === 'PLAYING') {
      return
    }

    if (selectedSlot && courtGames[selectedSlot.courtId]?.status === 'PLAYING') {
      return
    }

    const clickedPlayer = courtSlots[courtId]?.[slotIndex] ?? null

    if (clickedPlayer) {
      const isSameSlot =
        selectedSlot?.courtId === courtId && selectedSlot?.slotIndex === slotIndex

      setSelectedPlayer(isSameSlot ? null : clickedPlayer)
      setSelectedSlot(isSameSlot ? null : { courtId, slotIndex })
      setMoveMenuCourtId(null)
      return
    }

    if (!selectedPlayer) {
      return
    }

    setCourtSlots((prevSlotsByCourt) => {
      const currentSlots = prevSlotsByCourt[courtId] ?? createEmptySlots()

      if (currentSlots[slotIndex]) {
        return prevSlotsByCourt
      }

      // React 상태는 직접 수정하지 않고, 새 객체/새 배열을 만들어 교체한다.
      const nextSlotsByCourt = { ...prevSlotsByCourt }

      if (selectedSlot) {
        const sourceSlots = prevSlotsByCourt[selectedSlot.courtId] ?? createEmptySlots()
        const nextSourceSlots = [...sourceSlots]

        if (nextSourceSlots[selectedSlot.slotIndex]?.id === selectedPlayer.id) {
          nextSourceSlots[selectedSlot.slotIndex] = null
          nextSlotsByCourt[selectedSlot.courtId] = nextSourceSlots
        }
      }

      const nextTargetSlots = [...(nextSlotsByCourt[courtId] ?? currentSlots)]
      nextTargetSlots[slotIndex] = selectedPlayer
      nextSlotsByCourt[courtId] = nextTargetSlots

      return nextSlotsByCourt
    })

    setSelectedPlayer(null)
    setSelectedSlot(null)
    setMoveMenuCourtId(null)
  }

  const handleStartGame = async (courtId) => {
    const slots = courtSlots[courtId] ?? []
    const playerIds = slots.filter(Boolean).map((player) => player.id)

    if (playerIds.length !== SLOT_COUNT) {
      setErrorMessage('게임을 시작하려면 선수 4명을 모두 배치해야 합니다.')
      return
    }

    setActionCourtId(courtId)
    setErrorMessage('')

    try {
      const game = await startGame(courtId, playerIds)
      const startedAt = game.startedAt ? new Date(game.startedAt).getTime() : Date.now()

      setCourtGames((prevGames) => ({
        ...prevGames,
        [courtId]: {
          id: game.id,
          status: 'PLAYING',
          startedAt,
          elapsedSeconds: 0,
        },
      }))
      resetSelection()
      setNow(Date.now())
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setActionCourtId(null)
    }
  }

  const handleEndGame = async (courtId) => {
    const gameState = courtGames[courtId]

    if (!gameState || gameState.status !== 'PLAYING') {
      return
    }

    setActionCourtId(courtId)
    setErrorMessage('')

    try {
      await endGame(courtId)

      setCourtGames((prevGames) => ({
        ...prevGames,
        [courtId]: {
          ...gameState,
          status: 'FINISHED',
          endedAt: Date.now(),
          elapsedSeconds: getElapsedSeconds(gameState, Date.now()),
        },
      }))
      setMoveMenuCourtId(null)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setActionCourtId(null)
    }
  }

  const moveCourtSlots = (fromCourtId, toCourtId) => {
    setCourtSlots((prevSlotsByCourt) => {
      const sourceSlots = prevSlotsByCourt[fromCourtId] ?? createEmptySlots()
      const nextSlotsByCourt = { ...prevSlotsByCourt }

      nextSlotsByCourt[toCourtId] = Array.from(
        { length: SLOT_COUNT },
        (_, index) => sourceSlots[index] ?? null,
      )
      delete nextSlotsByCourt[fromCourtId]

      return nextSlotsByCourt
    })
  }

  const moveCourtGameState = (fromCourtId, toCourtId) => {
    setCourtGames((prevGames) => {
      const gameState = prevGames[fromCourtId]

      if (!gameState) {
        return prevGames
      }

      const nextGames = { ...prevGames }
      nextGames[toCourtId] = gameState
      delete nextGames[fromCourtId]
      return nextGames
    })
  }

  const handleToggleMoveMenu = (courtId) => {
    setSelectedPlayer(null)
    setSelectedSlot(null)
    setMoveMenuCourtId((prevCourtId) => (prevCourtId === courtId ? null : courtId))
  }

  const handleMoveCourt = async (fromCourtId, toCourtId) => {
    const fromSlots = courtSlots[fromCourtId] ?? []
    const toSlots = courtSlots[toCourtId] ?? []
    const fromPlayers = fromSlots.filter(Boolean)
    const toPlayers = toSlots.filter(Boolean)
    const fromGame = courtGames[fromCourtId]
    const toGame = courtGames[toCourtId]
    const fromCourt = courts.find((court) => court.id === fromCourtId)
    const targetCourt = courts.find((court) => court.id === toCourtId)

    if (!fromCourt || !targetCourt) {
      setErrorMessage('코트 정보를 찾을 수 없습니다.')
      return
    }

    if (fromCourt.courtType !== 'WAITING' && targetCourt.courtType !== 'ACTIVE') {
      setErrorMessage('진행 코트의 게임은 활성 코트로만 이동할 수 있습니다.')
      return
    }

    if (fromCourtId === toCourtId) {
      setErrorMessage('같은 코트로는 이동할 수 없습니다.')
      return
    }

    if (fromPlayers.length === 0) {
      setErrorMessage('이동할 선수가 없습니다.')
      return
    }

    if (toPlayers.length > 0 || toGame) {
      setErrorMessage('이동할 코트가 비어 있어야 합니다.')
      return
    }

    if (fromGame?.status === 'FINISHED') {
      setErrorMessage('종료된 게임은 이동할 수 없습니다.')
      return
    }

    setErrorMessage('')

    if (fromGame?.status === 'PLAYING') {
      setActionCourtId(fromCourtId)

      try {
        // 진행 중인 게임 이동은 백엔드 상태도 같이 바꿔야 한다.
        await moveCurrentGame(fromCourtId, toCourtId)
        moveCourtSlots(fromCourtId, toCourtId)
        moveCourtGameState(fromCourtId, toCourtId)
        resetSelection()
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setActionCourtId(null)
      }

      return
    }

    moveCourtSlots(fromCourtId, toCourtId)
    resetSelection()
  }

  const handleClearCourt = (courtId) => {
    setCourtSlots((prevSlotsByCourt) => {
      const nextSlotsByCourt = { ...prevSlotsByCourt }
      delete nextSlotsByCourt[courtId]
      return nextSlotsByCourt
    })

    setCourtGames((prevGames) => {
      const nextGames = { ...prevGames }
      delete nextGames[courtId]
      return nextGames
    })

    resetSelection()
  }

  const handleCreateCourt = async ({ name, courtType }) => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      setErrorMessage('코트 이름을 입력해야 합니다.')
      return false
    }

    setIsCreatingCourt(true)
    setErrorMessage('')

    try {
      const newCourt = await createCourt({
        name: trimmedName,
        courtType,
      })

      setCourts((prevCourts) => [...prevCourts, newCourt])
      return true
    } catch (error) {
      setErrorMessage(error.message)
      return false
    } finally {
      setIsCreatingCourt(false)
    }
  }

  const handleCreatePlayer = async ({ name, sex, level }) => {
    const trimmedName = name.trim()
    const trimmedLevel = level.trim()

    if (!trimmedName || !trimmedLevel) {
      setErrorMessage('선수 이름과 급수를 입력해야 합니다.')
      return false
    }

    setIsCreatingPlayer(true)
    setErrorMessage('')

    try {
      const newPlayer = await createPlayer({
        name: trimmedName,
        sex,
        level: trimmedLevel,
      })

      setPlayers((prevPlayers) => [...prevPlayers, newPlayer])
      return true
    } catch (error) {
      setErrorMessage(error.message)
      return false
    } finally {
      setIsCreatingPlayer(false)
    }
  }

  const handleChangePlayerAttendance = async (playerId) => {
    setChangingAttendancePlayerId(playerId)
    setErrorMessage('')

    try {
      await changePlayerAttendance(playerId)

      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          if (player.id !== playerId) {
            return player
          }

          const nextAttended = !getPlayerAttended(player)

          return {
            ...player,
            attended: nextAttended,
            isAttended: nextAttended,
          }
        }),
      )

      if (selectedPlayer?.id === playerId) {
        setSelectedPlayer(null)
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setChangingAttendancePlayerId(null)
    }
  }

  const handleDeletePlayer = async (playerId) => {
    setDeletingPlayerId(playerId)
    setErrorMessage('')

    try {
      await deletePlayer(playerId)

      setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== playerId))
      setCourtSlots((prevSlotsByCourt) => {
        const nextSlotsByCourt = {}

        Object.entries(prevSlotsByCourt).forEach(([courtId, slots]) => {
          nextSlotsByCourt[courtId] = slots.map((player) =>
            player?.id === playerId ? null : player,
          )
        })

        return nextSlotsByCourt
      })

      if (selectedPlayer?.id === playerId) {
        setSelectedPlayer(null)
      }

      if (
        selectedSlot &&
        courtSlots[selectedSlot.courtId]?.[selectedSlot.slotIndex]?.id === playerId
      ) {
        setSelectedSlot(null)
      }

      return true
    } catch (error) {
      setErrorMessage(error.message)
      return false
    } finally {
      setDeletingPlayerId(null)
    }
  }

  return {
    actionCourtId,
    availablePlayers,
    changingAttendancePlayerId,
    courtGames,
    courtSlots,
    courts,
    deletingPlayerId,
    errorMessage,
    handleChangePlayerAttendance,
    handleClearCourt,
    handleCreateCourt,
    handleCreatePlayer,
    handleDeletePlayer,
    handleEndGame,
    handleMoveCourt,
    handleSelectPlayer,
    handleSlotClick,
    handleStartGame,
    handleToggleMoveMenu,
    isCreatingCourt,
    isCreatingPlayer,
    isDashboardMenuOpen,
    isLoading,
    moveMenuCourtId,
    now,
    players,
    selectedPlayer,
    selectedSlot,
    setIsDashboardMenuOpen,
  }
}
