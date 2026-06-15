import {
  IconArrowLeft,
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
  IconTrash,
} from '@tabler/icons-react'
import { SLOT_COUNT } from '../../utils/courtUtils'

function CourtActions({
  courtId,
  assignedPlayerCount,
  canMoveCourt,
  canStartGame,
  elapsedText,
  isActionLoading,
  isFinished,
  isPlaying,
  isWaitingCourt,
  onClearCourt,
  onEndGame,
  onStartGame,
  onToggleMoveMenu,
}) {
  return (
    <div className={`court-controls ${isWaitingCourt ? 'waiting-move' : ''}`}>
      {!isWaitingCourt && <div className="court-timer">{elapsedText}</div>}

      <div className="court-actions">
        {!isWaitingCourt && !isPlaying && !isFinished && (
          <button
            className="court-action start"
            type="button"
            onClick={() => onStartGame(courtId)}
            disabled={!canStartGame}
            title={assignedPlayerCount === SLOT_COUNT ? '게임 시작' : '선수 4명을 먼저 배치하세요'}
          >
            <IconPlayerPlayFilled size={17} />
            시 작
          </button>
        )}

        {isPlaying && (
          <button
            className="court-action end"
            type="button"
            onClick={() => onEndGame(courtId)}
            disabled={isActionLoading}
            title="게임 종료"
          >
            <IconPlayerStopFilled size={17} />
            종 료
          </button>
        )}

        {canMoveCourt && (
          <button
            className="court-action move"
            type="button"
            onClick={() => onToggleMoveMenu(courtId)}
            disabled={isActionLoading}
            title="코트 이동"
          >
            <IconArrowLeft size={17} />
            코트 이동
          </button>
        )}

        {isFinished && (
          <button
            className="court-action clear"
            type="button"
            onClick={() => onClearCourt(courtId)}
            title="코트 비우기"
          >
            <IconTrash size={17} />
            비우기
          </button>
        )}
      </div>
    </div>
  )
}

export default CourtActions
