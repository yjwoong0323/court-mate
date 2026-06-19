import { IconCheck, IconPlus, IconTrash } from '@tabler/icons-react'

function PlayerItem({
  player,
  isDimmed,
  isSelected,
  isConfirmingDelete,
  isDeleting,
  isChangingAttendance,
  onSelectPlayer,
  onChangePlayerAttendance,
  onConfirmDelete,
  onRequestDelete,
  onCancelDelete,
}) {
  const itemClassName = [
    'flex min-h-14 w-full flex-wrap items-center gap-1.5 rounded-xl border bg-white p-2 transition',
    isDimmed ? 'opacity-45 hover:opacity-75' : '',
    isSelected ? '-translate-y-0.5 border-cm-blue bg-cm-sky/35 shadow-[0_8px_18px_rgb(59_130_196/0.16)]' : 'border-cm-blue/10 hover:border-cm-blue/50',
    isConfirmingDelete ? 'border-cm-danger/30 bg-cm-danger/[0.03] opacity-100' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li>
      <div className={itemClassName}>
        <button
          className="flex min-h-10 min-w-0 flex-1 items-center justify-start gap-2 bg-transparent p-1 text-left disabled:cursor-default"
          type="button"
          onClick={() => onSelectPlayer(player)}
          aria-pressed={isSelected}
          disabled={isConfirmingDelete || isDeleting}
        >
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${player.sex === 'M' ? 'bg-cm-blue/12 text-cm-blue' : 'bg-cm-danger/10 text-cm-danger'}`}>
            {player.level}
          </span>
          <strong className="truncate text-[15px] font-normal">{player.name}</strong>
        </button>

        {isConfirmingDelete ? (
          <div className="grid w-full grid-cols-2 gap-1.5">
            <button
              className="min-h-9 rounded-xl bg-cm-danger px-2.5 text-xs text-white disabled:opacity-45"
              type="button"
              onClick={() => onConfirmDelete(player.id)}
              disabled={isDeleting}
            >
              삭제
            </button>
            <button
              className="min-h-9 rounded-xl border border-cm-blue/15 bg-white px-2.5 text-xs text-cm-muted disabled:opacity-45"
              type="button"
              onClick={onCancelDelete}
              disabled={isDeleting}
            >
              취소
            </button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              className={`flex h-9 w-9 items-center justify-center rounded-xl border bg-white transition hover:-translate-y-0.5 disabled:opacity-40 ${isDimmed ? 'border-cm-success/20 text-cm-success' : 'border-cm-blue/15 text-cm-blue'}`}
              type="button"
              onClick={() => onChangePlayerAttendance(player.id)}
              disabled={isChangingAttendance}
              aria-label={isDimmed ? `${player.name} 참석 처리` : `${player.name} 미참석 처리`}
              title={isDimmed ? '참석 처리' : '미참석 처리'}
            >
              {isDimmed ? <IconPlus size={17} /> : <IconCheck size={17} />}
            </button>
            <button
              className={`flex h-9 items-center justify-center overflow-hidden rounded-xl border border-cm-danger/20 bg-white text-cm-danger transition-all ${isSelected ? 'w-9 opacity-100' : 'pointer-events-none w-0 border-0 opacity-0'}`}
              type="button"
              onClick={() => onRequestDelete(player.id)}
              aria-label={`${player.name} 삭제`}
              title="선수 삭제"
              disabled={!isSelected}
            >
              <IconTrash size={16} />
            </button>
          </div>
        )}
      </div>
    </li>
  )
}

export default PlayerItem
