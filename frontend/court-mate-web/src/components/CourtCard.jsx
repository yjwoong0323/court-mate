import {
  IconArrowRight,
  IconPlayerPlay,
  IconPlayerStop,
  IconTrash,
} from '@tabler/icons-react'

function formatElapsedTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function CourtCard({
  court,
  slots = [],
  selectedPlayer,
  selectedSlot,
  gameState,
  isActionLoading,
  isMoveMenuOpen,
  moveTargetCourts,
  now,
  getElapsedSeconds,
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
  const slotItems = Array.from({ length: 4 }, (_, index) => slots[index] ?? null)
  const assignedPlayers = slotItems.filter(Boolean)
  const canStartGame = !isWaitingCourt && assignedPlayers.length === 4 && !isActionLoading
  const canMoveCourt = assignedPlayers.length > 0 && !isFinished && !isActionLoading
  const elapsedSeconds = getElapsedSeconds(gameState, now)

  return (
    <article className={`court-card ${isWaitingCourt ? 'waiting' : ''} ${isPlaying ? 'playing' : ''}`}>
      <div className="court-card-header">
        <h3>{court.name}</h3>
        <span>{isWaitingCourt ? 'Waiting' : isPlaying ? 'Playing' : 'Live'}</span>
      </div>

      {(!isWaitingCourt || canMoveCourt) && (
        <>
          <div className={`court-controls ${isWaitingCourt ? 'waiting-move' : ''}`}>
            {!isWaitingCourt && (
              <div className="court-timer">
                {gameState ? formatElapsedTime(elapsedSeconds) : 'Start The Game!'}
              </div>
            )}

            <div className="court-actions">
              {!isWaitingCourt && !gameState && (
                <button
                  className="court-action start"
                  type="button"
                  onClick={() => onStartGame(court.id)}
                  disabled={!canStartGame}
                  title={assignedPlayers.length === 4 ? '게임 시작' : '선수 4명을 먼저 배치하세요'}
                >
                  <IconPlayerPlay size={17} />
                  시작
                </button>
              )}

              {isPlaying && (
                <button
                  className="court-action end"
                  type="button"
                  onClick={() => onEndGame(court.id)}
                  disabled={isActionLoading}
                  title="게임 종료"
                >
                  <IconPlayerStop size={17} />
                  종료
                </button>
              )}

              {canMoveCourt && (
                <button
                  className="court-action move"
                  type="button"
                  onClick={() => onToggleMoveMenu(court.id)}
                  disabled={isActionLoading}
                  title="코트 이동"
                >
                  <IconArrowRight size={17} />
                  이동
                </button>
              )}

              {isFinished && (
                <button
                  className="court-action clear"
                  type="button"
                  onClick={() => onClearCourt(court.id)}
                  title="코트 비우기"
                >
                  <IconTrash size={17} />
                  비우기
                </button>
              )}
            </div>
          </div>

          {isMoveMenuOpen && (
            <div className="court-move-panel">
              {moveTargetCourts.length > 0 ? (
                moveTargetCourts.map((targetCourt) => (
                  <button
                    className="move-target-button"
                    type="button"
                    key={targetCourt.id}
                    onClick={() => onMoveCourt(court.id, targetCourt.id)}
                  >
                    {targetCourt.name}
                  </button>
                ))
              ) : (
                <p className="empty-text small">이동 가능한 빈 코트가 없습니다.</p>
              )}
            </div>
          )}
        </>
      )}

      <div className="court-slots">
        {slotItems.map((player, index) => {
          const isEmpty = !player
          const isSelectedSlot =
            selectedSlot?.courtId === court.id && selectedSlot?.slotIndex === index
          const canClickSlot = canMoveAssignedPlayer && (isEmpty ? Boolean(selectedPlayer) : true)

          return (
            <button
              className={`court-slot ${isEmpty ? 'empty' : 'assigned'} ${isEmpty && selectedPlayer && canMoveAssignedPlayer ? 'ready' : ''
                } ${!isEmpty && canMoveAssignedPlayer ? 'movable' : ''} ${isSelectedSlot ? 'selected' : ''
                }`}
              type="button"
              key={`${court.id}-${index}`}
              onClick={() => onSlotClick(court.id, index)}
              disabled={!canClickSlot}
              aria-label={`${court.name} 코트 ${index + 1}번 자리`}
              aria-pressed={isSelectedSlot}
            >
              {player ? (
                <>
                  <span className={`level-badge ${player.sex === 'M' ? 'male' : 'female'}`}>
                    {player.level}
                  </span>
                  <strong>{player.name}</strong>
                </>
              ) : (
                '빈 자리'
              )}
            </button>
          )
        })}
      </div>
    </article>
  )
}

export default CourtCard
