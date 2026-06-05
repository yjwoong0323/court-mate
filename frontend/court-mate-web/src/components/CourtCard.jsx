function CourtCard({ court, slots = [], selectedPlayer, selectedSlot, onSlotClick }) {
  // courtType 값에 따라 일반 코트와 대기 코트의 표시를 조금 다르게 만든다.
  const isWaitingCourt = court.courtType === 'WAITING'
  const canMoveAssignedPlayer = court.currentGame?.status !== 'PLAYING'
  const slotItems = Array.from({ length: 4 }, (_, index) => slots[index] ?? null)

  return (
    <article className={`court-card ${isWaitingCourt ? 'waiting' : ''}`}>
      <div className="court-card-header">
        <h3>{court.name}</h3>
        <span>{isWaitingCourt ? 'Waiting' : 'Live'}</span>
      </div>
      <div className="court-slots">
        {slotItems.map((player, index) => {
          const isEmpty = !player
          const isSelectedSlot =
            selectedSlot?.courtId === court.id && selectedSlot?.slotIndex === index
          const canClickSlot = canMoveAssignedPlayer && (isEmpty ? Boolean(selectedPlayer) : true)

          return (
            <button
              className={`court-slot ${isEmpty ? 'empty' : 'assigned'} ${
                isEmpty && selectedPlayer && canMoveAssignedPlayer ? 'ready' : ''
              } ${!isEmpty && canMoveAssignedPlayer ? 'movable' : ''} ${
                isSelectedSlot ? 'selected' : ''
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
