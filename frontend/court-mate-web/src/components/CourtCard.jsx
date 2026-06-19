import { IconArrowLeft } from '@tabler/icons-react'
import CourtActions from './courts/CourtActions'
import CourtSlot from './courts/CourtSlot'
import { formatElapsedTime, getElapsedSeconds, SLOT_COUNT } from '../utils/courtUtils'

function CourtCard({
  court,
  slots = [],
  selectedPlayer,
  selectedSlot,
  gameState,
  isActionLoading,
  isMoveModeActive,
  isMoveSource,
  isMoveTarget,
  moveSourceCourtId,
  now,
  onSlotClick,
  onStartGame,
  onEndGame,
  onClearCourt,
  onToggleMoveMenu,
  onMoveCourt,
}) {
  const isWaitingCourt = court.courtType === 'WAITING'
  const isPlaying = gameState?.status === 'PLAYING'
  const isFinished = gameState?.status === 'FINISHED'
  const canMoveAssignedPlayer = !isPlaying
  const slotItems = Array.from({ length: SLOT_COUNT }, (_, index) => slots[index] ?? null)
  const assignedPlayers = slotItems.filter(Boolean)
  const canStartGame =
    !isWaitingCourt && assignedPlayers.length === SLOT_COUNT && !isActionLoading
  const canMoveCourt = assignedPlayers.length > 0 && !isFinished && !isActionLoading
  const elapsedSeconds = getElapsedSeconds(gameState, now)
  const statusLabel = isWaitingCourt
    ? 'WAITING'
    : isPlaying
      ? 'PLAYING'
      : isFinished
        ? 'FINISHED'
        : 'READY'
  const cardClassName = [
    'min-h-[220px] rounded-2xl border bg-white p-4 text-cm-ink transition duration-200 ease-out sm:p-5',
    isWaitingCourt ? 'min-h-[160px] border-cm-ink/10 bg-cm-cream/20' : 'border-cm-blue/12',
    isPlaying ? 'border-cm-blue/20' : '',
    isMoveModeActive && !isMoveSource && !isMoveTarget ? 'opacity-45' : '',
    isMoveSource ? 'border-cm-blue ring-2 ring-cm-blue/20 shadow-[0_8px_24px_rgb(59_130_196/0.16)]' : '',
    isMoveTarget ? '-translate-y-1 cursor-pointer border-cm-blue bg-cm-sky/45 shadow-[0_12px_28px_rgb(59_130_196/0.18)] hover:-translate-y-2' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleCourtCardClickCapture = (event) => {
    if (!isMoveTarget || !moveSourceCourtId) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    onMoveCourt(moveSourceCourtId, court.id)
  }

  const handleCourtCardKeyDown = (event) => {
    if (!isMoveTarget || !moveSourceCourtId || (event.key !== 'Enter' && event.key !== ' ')) {
      return
    }

    event.preventDefault()
    onMoveCourt(moveSourceCourtId, court.id)
  }

  return (
    <article
      className={cardClassName}
      onClickCapture={handleCourtCardClickCapture}
      onKeyDown={handleCourtCardKeyDown}
      role={isMoveTarget ? 'button' : undefined}
      tabIndex={isMoveTarget ? 0 : undefined}
      title={isMoveTarget ? `${court.name}으로 이동` : undefined}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-3xl leading-none font-extrabold tracking-tight text-cm-ink">{court.name}</h3>
        <div className="flex items-center justify-end gap-2">
          {isWaitingCourt && canMoveCourt && (
            <button
              className="flex min-h-9 items-center gap-1.5 rounded-xl border border-cm-blue/15 bg-white px-3 text-sm text-cm-ink transition hover:border-cm-blue hover:text-cm-blue disabled:opacity-45"
              type="button"
              onClick={() => onToggleMoveMenu(court.id)}
              disabled={isActionLoading}
              title="코트 이동"
            >
              <IconArrowLeft size={17} />
              코트 이동
            </button>
          )}
          <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[11px] font-bold tracking-wide transition-colors duration-200 ease-out ${isPlaying ? 'bg-cm-navy text-white' : isFinished ? 'bg-cm-success/10 text-cm-success' : isWaitingCourt ? 'bg-cm-ink/5 text-cm-muted' : 'bg-cm-sky text-cm-navy'}`}>
            {isPlaying && <i className="h-1.5 w-1.5 animate-[cm-pulse_1.15s_ease-in-out_infinite] rounded-full bg-white shadow-[0_0_0_3px_rgb(255_255_255/0.24)]" aria-hidden="true" />}
            {statusLabel}
          </span>
        </div>
      </div>

      {!isWaitingCourt && (
        <CourtActions
          courtId={court.id}
          assignedPlayerCount={assignedPlayers.length}
          canMoveCourt={canMoveCourt}
          canStartGame={canStartGame}
          elapsedText={gameState ? formatElapsedTime(elapsedSeconds) : 'Before Game'}
          isActionLoading={isActionLoading}
          isFinished={isFinished}
          isPlaying={isPlaying}
          isWaitingCourt={isWaitingCourt}
          onClearCourt={onClearCourt}
          onEndGame={onEndGame}
          onStartGame={onStartGame}
          onToggleMoveMenu={onToggleMoveMenu}
        />
      )}

      <div className="grid grid-cols-2 gap-2.5">
        {slotItems.map((player, index) => (
          <CourtSlot
            courtId={court.id}
            courtName={court.name}
            index={index}
            key={`${court.id}-${index}`}
            player={player}
            selectedPlayer={selectedPlayer}
            selectedSlot={selectedSlot}
            canMoveAssignedPlayer={canMoveAssignedPlayer}
            onSlotClick={onSlotClick}
          />
        ))}
      </div>
    </article>
  )
}

export default CourtCard
