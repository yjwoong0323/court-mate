import CourtCard from './CourtCard'

function CourtBoard({
  courts,
  courtSlots,
  isLoading,
  selectedPlayer,
  selectedSlot,
  courtGames,
  actionCourtId,
  moveMenuCourtId,
  now,
  getElapsedSeconds,
  onSlotClick,
  onStartGame,
  onEndGame,
  onClearCourt,
  onToggleMoveMenu,
  onMoveCourt,
}) {
  const activeCourts = courts.filter((court) => court.courtType === 'ACTIVE')
  const waitingCourts = courts.filter((court) => court.courtType === 'WAITING')

  const getMoveTargetCourts = (fromCourt) => {
    const targetCourts = fromCourt.courtType === 'WAITING' ? courts : activeCourts

    return targetCourts.filter((court) => {
      const slots = courtSlots[court.id] ?? []
      const hasAssignedPlayers = slots.some(Boolean)
      const hasGame = Boolean(courtGames[court.id])

      return court.id !== fromCourt.id && !hasAssignedPlayers && !hasGame
    })
  }

  return (
    <section className="court-board">
      <div className="section-heading">
        <h2>Courts</h2>
      </div>

      {isLoading ? (
        <p className="empty-text">코트 정보를 불러오는 중입니다.</p>
      ) : (
        <>
          <div className="court-grid active-courts">
            {activeCourts.map((court) => (
              <CourtCard
                court={court}
                key={court.id}
                slots={courtSlots[court.id]}
                selectedPlayer={selectedPlayer}
                selectedSlot={selectedSlot}
                gameState={courtGames[court.id]}
                isActionLoading={actionCourtId === court.id}
                isMoveMenuOpen={moveMenuCourtId === court.id}
                moveTargetCourts={getMoveTargetCourts(court)}
                now={now}
                getElapsedSeconds={getElapsedSeconds}
                onSlotClick={onSlotClick}
                onStartGame={onStartGame}
                onEndGame={onEndGame}
                onClearCourt={onClearCourt}
                onToggleMoveMenu={onToggleMoveMenu}
                onMoveCourt={onMoveCourt}
              />
            ))}
          </div>

          <div className="section-heading waiting-heading" />
          <div className="court-grid waiting-courts">
            {waitingCourts.map((court) => (
              <CourtCard
                court={court}
                key={court.id}
                slots={courtSlots[court.id]}
                selectedPlayer={selectedPlayer}
                selectedSlot={selectedSlot}
                gameState={courtGames[court.id]}
                isActionLoading={actionCourtId === court.id}
                isMoveMenuOpen={moveMenuCourtId === court.id}
                moveTargetCourts={getMoveTargetCourts(court)}
                now={now}
                getElapsedSeconds={getElapsedSeconds}
                onSlotClick={onSlotClick}
                onStartGame={onStartGame}
                onEndGame={onEndGame}
                onClearCourt={onClearCourt}
                onToggleMoveMenu={onToggleMoveMenu}
                onMoveCourt={onMoveCourt}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default CourtBoard
