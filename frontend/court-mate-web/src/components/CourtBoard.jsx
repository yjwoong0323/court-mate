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
    <section className="min-h-[640px] rounded-2xl border border-cm-blue/10 bg-white p-4 shadow-panel sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-xs font-bold tracking-[0.12em] text-cm-blue uppercase">Live board</p>
          <h2 className="font-display text-2xl font-bold">Courts</h2>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <CourtCreateForm
            formValues={formValues}
            isOpen={isCreateOpen}
            isSubmitting={isCreatingCourt}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onUpdate={setFormValues}
          />

          <button
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-white text-cm-ink transition hover:border-cm-blue hover:text-cm-blue ${isCreateOpen ? 'rotate-45 border-cm-blue bg-cm-blue/5 text-cm-blue' : 'border-cm-blue/15'}`}
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
        <p className="py-8 text-center text-sm text-cm-muted">코트 정보를 불러오는 중입니다.</p>
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

          <div className="my-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-cm-blue/15" />
            <span className="font-display text-xs tracking-[0.16em] text-cm-muted uppercase">Waiting Zone</span>
            <span className="h-px flex-1 bg-cm-blue/15" />
          </div>
          <CourtGrid
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
