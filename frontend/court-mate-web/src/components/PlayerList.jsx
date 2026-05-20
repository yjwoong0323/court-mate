function PlayerList({ players, isLoading }) {
  return (
    <aside className="player-panel">
      <div className="section-heading">
        <h2>Player List</h2>
      </div>

      {isLoading ? (
        <p className="empty-text">선수 정보를 불러오는 중입니다.</p>
      ) : players.length === 0 ? (
        <p className="empty-text">등록된 선수가 없습니다.</p>
      ) : (
        <ul className="player-list">
          {players.map((player) => (
            <li className="player-item" key={player.id}>
              <span className={`level-badge ${player.sex === 'M' ? 'male' : 'female'}`}>
                {player.level}
              </span>
              <strong>{player.name}</strong>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export default PlayerList
