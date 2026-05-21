function CourtCard({ court }) {
  // courtType 값에 따라 일반 코트와 대기 코트의 표시를 조금 다르게 만든다.
  const isWaitingCourt = court.courtType === 'WAITING'

  return (
    <article className={`court-card ${isWaitingCourt ? 'waiting' : ''}`}>
      <div className="court-card-header">
        <h3>{court.name}</h3>
        <span>{isWaitingCourt ? 'Waiting' : 'Live'}</span>
      </div>
      <div className="court-slots">
        <span>빈 자리</span>
        <span>빈 자리</span>
        <span>빈 자리</span>
        <span>빈 자리</span>
      </div>
    </article>
  )
}

export default CourtCard
