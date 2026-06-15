import CourtCard from '../CourtCard'

function CourtGrid({
  className = 'active-courts',
  courts,
  courtGames,
  courtSlots,
  actionCourtId,
  moveMenuCourtId,
  moveTargetCourtIds,
  now,
  selectedPlayer,
  selectedSlot,
  isMoveModeActive,
  onClearCourt,
  onEndGame,
  onMoveCourt,
  onSlotClick,
  onStartGame,
  onToggleMoveMenu,
}) {
  return (
    <div className={`court-grid ${className}`}>
      {courts.map((court) => (
        <CourtCard
          court={court}
          key={court.id}
          slots={courtSlots[court.id]}
          selectedPlayer={selectedPlayer}
          selectedSlot={selectedSlot}
          gameState={courtGames[court.id]}
          isActionLoading={actionCourtId === court.id}
          isMoveModeActive={isMoveModeActive}
          isMoveSource={moveMenuCourtId === court.id}
          isMoveTarget={moveTargetCourtIds.has(court.id)}
          moveSourceCourtId={moveMenuCourtId}
          now={now}
          onSlotClick={onSlotClick}
          onStartGame={onStartGame}
          onEndGame={onEndGame}
          onClearCourt={onClearCourt}
          onToggleMoveMenu={onToggleMoveMenu}
          onMoveCourt={onMoveCourt}
        />
      ))}
    </div>
  )
}

export default CourtGrid
