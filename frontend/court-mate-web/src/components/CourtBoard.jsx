import { useState } from 'react'
import { IconPlus } from '@tabler/icons-react'
import CourtCreateForm from './courts/CourtCreateForm'
import CourtGrid from './courts/CourtGrid'
import { INITIAL_COURT_FORM } from '../utils/courtUtils'

function CourtBoard({
  courts,
  courtSlots,
  isLoading,
  selectedPlayer,
  selectedSlot,
  courtGames,
  actionCourtId,
  moveMenuCourtId,
  now,
  onSlotClick,
  onStartGame,
  onEndGame,
  onClearCourt,
  onToggleMoveMenu,
  onMoveCourt,
  isCreatingCourt,
  onCreateCourt,
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formValues, setFormValues] = useState(INITIAL_COURT_FORM)
  const activeCourts = courts.filter((court) => court.courtType === 'ACTIVE')
  const waitingCourts = courts.filter((court) => court.courtType === 'WAITING')

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const isCreated = await onCreateCourt(formValues)

    if (isCreated) {
      setFormValues(INITIAL_COURT_FORM)
      setIsCreateOpen(false)
    }
  }

  const getMoveTargetCourts = (fromCourt) => {
    const targetCourts = fromCourt.courtType === 'WAITING' ? courts : activeCourts

    return targetCourts.filter((court) => {
      const slots = courtSlots[court.id] ?? []
      const hasAssignedPlayers = slots.some(Boolean)
      const hasGame = Boolean(courtGames[court.id])

      return court.id !== fromCourt.id && !hasAssignedPlayers && !hasGame
    })
  }

  const selectedMoveCourt = courts.find((court) => court.id === moveMenuCourtId)
  const moveTargetCourtIds = new Set(
    selectedMoveCourt ? getMoveTargetCourts(selectedMoveCourt).map((court) => court.id) : [],
  )
  const isMoveModeActive = Boolean(selectedMoveCourt)

  return (
    <section className="court-board">
      <div className="section-heading court-heading">
        <h2>Courts</h2>
        <div className="court-heading-actions">
          <CourtCreateForm
            formValues={formValues}
            isOpen={isCreateOpen}
            isSubmitting={isCreatingCourt}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onUpdate={setFormValues}
          />

          <button
            className={`court-add-toggle ${isCreateOpen ? 'active' : ''}`}
            type="button"
            onClick={() => setIsCreateOpen((prevOpen) => !prevOpen)}
            aria-label="코트 추가 폼 열기"
            title="코트 추가"
          >
            <IconPlus size={19} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="empty-text">코트 정보를 불러오는 중입니다.</p>
      ) : (
        <>
          <CourtGrid
            courts={activeCourts}
            courtGames={courtGames}
            courtSlots={courtSlots}
            actionCourtId={actionCourtId}
            moveMenuCourtId={moveMenuCourtId}
            moveTargetCourtIds={moveTargetCourtIds}
            now={now}
            selectedPlayer={selectedPlayer}
            selectedSlot={selectedSlot}
            isMoveModeActive={isMoveModeActive}
            onClearCourt={onClearCourt}
            onEndGame={onEndGame}
            onMoveCourt={onMoveCourt}
            onSlotClick={onSlotClick}
            onStartGame={onStartGame}
            onToggleMoveMenu={onToggleMoveMenu}
          />

          <div className="court-divider" aria-hidden="true" />
          <CourtGrid
            className="waiting-courts"
            courts={waitingCourts}
            courtGames={courtGames}
            courtSlots={courtSlots}
            actionCourtId={actionCourtId}
            moveMenuCourtId={moveMenuCourtId}
            moveTargetCourtIds={moveTargetCourtIds}
            now={now}
            selectedPlayer={selectedPlayer}
            selectedSlot={selectedSlot}
            isMoveModeActive={isMoveModeActive}
            onClearCourt={onClearCourt}
            onEndGame={onEndGame}
            onMoveCourt={onMoveCourt}
            onSlotClick={onSlotClick}
            onStartGame={onStartGame}
            onToggleMoveMenu={onToggleMoveMenu}
          />
        </>
      )}
    </section>
  )
}

export default CourtBoard
