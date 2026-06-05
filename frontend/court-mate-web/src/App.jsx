import { useEffect, useState } from 'react'
import { IconRefresh } from '@tabler/icons-react'
import './App.css'
import { getCourts } from './api/courtApi'
import { getPlayers } from './api/playerApi'
import CourtBoard from './components/CourtBoard'
import PlayerList from './components/PlayerList'

function App() {
  const SLOT_COUNT = 4

  // useState는 화면에서 바뀔 수 있는 값을 저장한다.

  // courts: 서버에서 받아온 코트 목록
  const [courts, setCourts] = useState([])

  // players: 서버에서 받아온 선수 목록
  const [players, setPlayers] = useState([])

  // isLoading: API 요청이 끝나기 전까지 로딩 문구를 보여주기 위한 값
  const [isLoading, setIsLoading] = useState(true)

  // errorMessage: API 요청 실패 시 화면에 보여줄 에러 문구
  const [errorMessage, setErrorMessage] = useState('')

  // selectedPlayer: Player List 또는 코트 슬롯에서 클릭해서 현재 들고 있는 선수
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  // selectedSlot: 코트 슬롯에서 선수를 들었을 때, 원래 위치를 기억하기 위한 값
  const [selectedSlot, setSelectedSlot] = useState(null)

  // courtSlots: 코트별 빈 자리에 배치된 선수를 저장하는 임시 프론트 상태
  const [courtSlots, setCourtSlots] = useState({})

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
      // Promise.all은 여러 API 요청을 동시에 보낼 때 사용한다.
      const [courtData, playerData] = await Promise.all([getCourts(), getPlayers()])
      setCourts(courtData)
      setPlayers(playerData)
      setSelectedPlayer(null)
      setSelectedSlot(null)
      setCourtSlots({})
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect는 화면이 처음 그려진 뒤 API 데이터를 한 번 불러올 때 사용한다.
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

  const handleSelectPlayer = (player) => {
    setSelectedSlot(null)
    setSelectedPlayer((prevPlayer) => (prevPlayer?.id === player.id ? null : player))
  }

  const handleSlotClick = (courtId, slotIndex) => {
    const clickedPlayer = courtSlots[courtId]?.[slotIndex] ?? null

    if (clickedPlayer) {
      const isSameSlot =
        selectedSlot?.courtId === courtId && selectedSlot?.slotIndex === slotIndex

      setSelectedPlayer(isSameSlot ? null : clickedPlayer)
      setSelectedSlot(isSameSlot ? null : { courtId, slotIndex })
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
  }

  // 화면
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
          onSlotClick={handleSlotClick}
        />
        <PlayerList
          players={availablePlayers}
          isLoading={isLoading}
          selectedPlayer={selectedPlayer}
          onSelectPlayer={handleSelectPlayer}
        />
      </section>
    </main>
  )
}

export default App
