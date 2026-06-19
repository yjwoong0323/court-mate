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
    'flex min-h-14 items-center justify-center gap-2 rounded-xl border text-sm transition',
    isEmpty ? 'border-dashed border-cm-blue/20 bg-white/65 text-cm-muted' : 'border-solid border-cm-blue/10 bg-white text-cm-ink',
    isEmpty && selectedPlayer && canMoveAssignedPlayer ? 'cursor-pointer border-cm-blue bg-cm-sky text-cm-navy hover:-translate-y-0.5' : '',
    !isEmpty && canMoveAssignedPlayer ? 'cursor-pointer hover:border-cm-blue' : '',
    isSelectedSlot ? '-translate-y-1 border-cm-blue shadow-[0_8px_18px_rgb(59_130_196/0.18)]' : '',
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
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${player.sex === 'M' ? 'bg-cm-blue/12 text-cm-blue' : 'bg-cm-danger/10 text-cm-danger'}`}>
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
