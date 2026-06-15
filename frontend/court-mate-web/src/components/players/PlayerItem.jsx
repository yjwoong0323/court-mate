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
    'player-item',
    isDimmed ? 'not-attended' : '',
    isSelected ? 'selected' : '',
    isConfirmingDelete ? 'delete-pending' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li>
      <div className={itemClassName}>
        <button
          className="player-select-button"
          type="button"
          onClick={() => onSelectPlayer(player)}
          aria-pressed={isSelected}
          disabled={isConfirmingDelete || isDeleting}
        >
          <span className={`level-badge ${player.sex === 'M' ? 'male' : 'female'}`}>
            {player.level}
          </span>
          <strong>{player.name}</strong>
        </button>

        {isConfirmingDelete ? (
          <div className="player-delete-confirm">
            <button
              className="player-delete-confirm-button"
              type="button"
              onClick={() => onConfirmDelete(player.id)}
              disabled={isDeleting}
            >
              삭제
            </button>
            <button
              className="player-delete-cancel-button"
              type="button"
              onClick={onCancelDelete}
              disabled={isDeleting}
            >
              취소
            </button>
          </div>
        ) : (
          <div className="player-item-actions">
            <button
              className={`attendance-toggle ${isDimmed ? 'join' : 'leave'}`}
              type="button"
              onClick={() => onChangePlayerAttendance(player.id)}
              disabled={isChangingAttendance}
              aria-label={isDimmed ? `${player.name} 참석 처리` : `${player.name} 미참석 처리`}
              title={isDimmed ? '참석 처리' : '미참석 처리'}
            >
              {isDimmed ? <IconPlus size={17} /> : <IconCheck size={17} />}
            </button>
            <button
              className={`player-delete-toggle ${isSelected ? 'visible' : ''}`}
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
