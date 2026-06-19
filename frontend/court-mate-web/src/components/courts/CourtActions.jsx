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
  const moveButtonOpacity = !canMoveCourt
    ? 'opacity-0'
    : isActionLoading
      ? 'opacity-40'
      : 'opacity-100'

  return (
    <div className={`mb-3 grid items-center gap-2.5 ${isWaitingCourt ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-[minmax(96px,1fr)_auto]'}`}>
      {!isWaitingCourt && <div className={`flex min-h-10 items-center justify-center rounded-xl border px-3 font-display text-sm font-bold transition-colors duration-200 ease-out ${isPlaying ? 'border-cm-navy bg-cm-navy text-white' : 'border-cm-blue/10 bg-cm-sky/30 text-cm-muted'}`}>{elapsedText}</div>}

      <div className="flex flex-wrap items-center justify-end gap-2">
        {!isWaitingCourt && !isPlaying && !isFinished && (
          <button
            className="flex min-h-10 animate-[cm-fade-up_0.2s_ease-out] items-center justify-center gap-1.5 rounded-xl bg-cm-navy px-3 text-sm text-white transition hover:-translate-y-0.5 hover:bg-cm-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
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
            className="flex min-h-10 animate-[cm-fade-up_0.2s_ease-out] items-center justify-center gap-1.5 rounded-xl bg-cm-danger px-3 text-sm text-white transition hover:-translate-y-0.5 disabled:opacity-40"
            type="button"
            onClick={() => onEndGame(courtId)}
            disabled={isActionLoading}
            title="게임 종료"
          >
            <IconPlayerStopFilled size={17} />
            종 료
          </button>
        )}

        <button
          className={`flex min-h-10 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-xl border bg-white text-sm text-cm-ink transition-[max-width,margin,opacity,transform,padding,border-color,color,background-color] duration-200 ease-out hover:border-cm-blue hover:text-cm-blue disabled:cursor-not-allowed ${moveButtonOpacity} ${canMoveCourt ? 'ml-0 max-w-32 translate-x-0 border-cm-blue/15 px-3' : 'pointer-events-none -ml-2 max-w-0 -translate-x-2 border-transparent px-0'}`}
          type="button"
          onClick={() => onToggleMoveMenu(courtId)}
          disabled={isActionLoading || !canMoveCourt}
          aria-hidden={!canMoveCourt}
          tabIndex={canMoveCourt ? 0 : -1}
          title={canMoveCourt ? '코트 이동' : undefined}
        >
          <IconArrowLeft className="shrink-0" size={17} />
          코트 이동
        </button>

        {isFinished && (
          <button
            className="flex min-h-10 animate-[cm-fade-up_0.2s_ease-out] items-center justify-center gap-1.5 rounded-xl border border-cm-danger/20 bg-white px-3 text-sm text-cm-danger transition hover:bg-cm-danger/5"
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
