import CourtCard from './CourtCard'

function CourtBoard({ courts, courtSlots, isLoading, selectedPlayer, selectedSlot, onSlotClick }) {
  // props로 받은 courts 배열을 ACTIVE 코트와 WAITING 코트로 나눠서 화면에 따로 보여준다.
  const activeCourts = courts.filter((court) => court.courtType === 'ACTIVE')
  const waitingCourts = courts.filter((court) => court.courtType === 'WAITING')

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
                onSlotClick={onSlotClick}
              />
            ))}
          </div>

          <div className="section-heading waiting-heading">
            {/* <h2>대기 코트</h2> */}
          </div>
          <div className="court-grid waiting-courts">
            {waitingCourts.map((court) => (
              <CourtCard
                court={court}
                key={court.id}
                slots={courtSlots[court.id]}
                selectedPlayer={selectedPlayer}
                selectedSlot={selectedSlot}
                onSlotClick={onSlotClick}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default CourtBoard
