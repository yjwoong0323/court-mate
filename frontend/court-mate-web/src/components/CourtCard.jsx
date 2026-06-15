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
  const cardClassName = [
    'court-card',
    isWaitingCourt ? 'waiting' : '',
    isPlaying ? 'playing' : '',
    isMoveModeActive ? 'move-mode' : '',
    isMoveSource ? 'move-source' : '',
    isMoveTarget ? 'move-target' : '',
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
      <div className="court-card-header">
        <h3>{court.name}</h3>
        <div className="court-card-header-actions">
          {isWaitingCourt && canMoveCourt && (
            <button
              className="court-action move waiting-header-move"
              type="button"
              onClick={() => onToggleMoveMenu(court.id)}
              disabled={isActionLoading}
              title="코트 이동"
            >
              <IconArrowLeft size={17} />
              코트 이동
            </button>
          )}
          <span className={`court-status-badge ${isPlaying ? 'on' : ''}`}>
            {isPlaying && <i aria-hidden="true" />}
            {isWaitingCourt ? 'Waiting' : isPlaying ? 'ON' : 'Live'}
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

      <div className="court-slots">
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
