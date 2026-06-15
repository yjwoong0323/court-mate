function CourtSlot({
  courtId,
  courtName,
  index,
  player,
  selectedPlayer,
  selectedSlot,
  canMoveAssignedPlayer,
  onSlotClick,
}) {
  const isEmpty = !player
  const isSelectedSlot = selectedSlot?.courtId === courtId && selectedSlot?.slotIndex === index
  const canClickSlot = canMoveAssignedPlayer && (isEmpty ? Boolean(selectedPlayer) : true)
  const className = [
    'court-slot',
    isEmpty ? 'empty' : 'assigned',
    isEmpty && selectedPlayer && canMoveAssignedPlayer ? 'ready' : '',
    !isEmpty && canMoveAssignedPlayer ? 'movable' : '',
    isSelectedSlot ? 'selected' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={className}
      type="button"
      onClick={() => onSlotClick(courtId, index)}
      disabled={!canClickSlot}
      aria-label={`${courtName} 코트 ${index + 1}번 자리`}
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
}

export default CourtSlot
