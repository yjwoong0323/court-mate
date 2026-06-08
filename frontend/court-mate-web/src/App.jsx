import { useEffect, useState } from 'react'
import { IconRefresh } from '@tabler/icons-react'
import './App.css'
import { getCourts } from './api/courtApi'
import { endGame, moveCurrentGame, startGame } from './api/gameApi'
import { changePlayerAttendance, createPlayer, getPlayers } from './api/playerApi'
import CourtBoard from './components/CourtBoard'
import PlayerList from './components/PlayerList'

function getPlayerAttended(player) {
  return player.attended ?? player.isAttended ?? false
}

function getElapsedSeconds(gameState, now) {
  if (!gameState?.startedAt) {
    return 0
  }

  if (gameState.status === 'FINISHED') {
    return gameState.elapsedSeconds ?? 0
  }

  return Math.max(0, Math.floor((now - gameState.startedAt) / 1000))
}

function App() {
  const SLOT_COUNT = 4

  const [courts, setCourts] = useState([])
  const [players, setPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingPlayer, setIsCreatingPlayer] = useState(false)
  const [changingAttendancePlayerId, setChangingAttendancePlayerId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [courtSlots, setCourtSlots] = useState({})
  const [courtGames, setCourtGames] = useState({})
  const [actionCourtId, setActionCourtId] = useState(null)
  const [moveMenuCourtId, setMoveMenuCourtId] = useState(null)
  const [now, setNow] = useState(Date.now())

  const assignedPlayerIds = new Set(
    Object.values(courtSlots)
      .flat()
      .filter(Boolean)
      .map((player) => player.id),
  )
  const availablePlayers = players.filter((player) => !assignedPlayerIds.has(player.id))

  const loadPageData = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }

    setErrorMessage('')

    try {
      const [courtData, playerData] = await Promise.all([getCourts(), getPlayers()])
      setCourts(courtData)
      setPlayers(playerData)
      setSelectedPlayer(null)
      setSelectedSlot(null)
      setCourtSlots({})
      setCourtGames({})
      setMoveMenuCourtId(null)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    Promise.all([getCourts(), getPlayers()])
      .then(([courtData, playerData]) => {
        if (ignore) {
          return
        }

        setCourts(courtData)
        setPlayers(playerData)
        setSelectedPlayer(null)
        setSelectedSlot(null)
        setCourtSlots({})
        setCourtGames({})
        setMoveMenuCourtId(null)
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
  }, [])

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
      const currentSlots = prevSlotsByCourt[courtId] ?? Array(SLOT_COUNT).fill(null)

      if (currentSlots[slotIndex]) {
        return prevSlotsByCourt
      }

      const nextSlotsByCourt = { ...prevSlotsByCourt }

      if (selectedSlot) {
        const sourceSlots =
          prevSlotsByCourt[selectedSlot.courtId] ?? Array(SLOT_COUNT).fill(null)
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
      setSelectedPlayer(null)
      setSelectedSlot(null)
      setMoveMenuCourtId(null)
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
      const sourceSlots = prevSlotsByCourt[fromCourtId] ?? Array(SLOT_COUNT).fill(null)
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
        await moveCurrentGame(fromCourtId, toCourtId)
        moveCourtSlots(fromCourtId, toCourtId)
        moveCourtGameState(fromCourtId, toCourtId)
        setMoveMenuCourtId(null)
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setActionCourtId(null)
      }

      return
    }

    moveCourtSlots(fromCourtId, toCourtId)
    setMoveMenuCourtId(null)
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

    setSelectedPlayer(null)
    setSelectedSlot(null)
    setMoveMenuCourtId(null)
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

  return (
    <main className="app-shell">
      <section className="app-header">
        <div>
          <p className="eyebrow">CourtMate</p>
          <h1>코트 관리</h1>
        </div>
        <button className="icon-button" type="button" onClick={() => loadPageData()} title="새로고침">
          <IconRefresh size={20} />
        </button>
      </section>

      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      <section className="layout-grid">
        <CourtBoard
          courts={courts}
          courtSlots={courtSlots}
          isLoading={isLoading}
          selectedPlayer={selectedPlayer}
          selectedSlot={selectedSlot}
          courtGames={courtGames}
          actionCourtId={actionCourtId}
          moveMenuCourtId={moveMenuCourtId}
          now={now}
          getElapsedSeconds={getElapsedSeconds}
          onSlotClick={handleSlotClick}
          onStartGame={handleStartGame}
          onEndGame={handleEndGame}
          onClearCourt={handleClearCourt}
          onToggleMoveMenu={handleToggleMoveMenu}
          onMoveCourt={handleMoveCourt}
        />
        <PlayerList
          players={availablePlayers}
          allPlayers={players}
          isLoading={isLoading}
          selectedPlayer={selectedPlayer}
          onSelectPlayer={handleSelectPlayer}
          getPlayerAttended={getPlayerAttended}
          isCreatingPlayer={isCreatingPlayer}
          onCreatePlayer={handleCreatePlayer}
          changingAttendancePlayerId={changingAttendancePlayerId}
          onChangePlayerAttendance={handleChangePlayerAttendance}
        />
      </section>

      <footer className="app-footer">
        <span>2026 CourtMate</span>
        <span>Developed by CourtMate Team</span>
        <span>Baekseok Univ JSP Project</span>
      </footer>
    </main>
  )
}

export default App
