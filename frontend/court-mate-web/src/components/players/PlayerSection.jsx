import PlayerItem from './PlayerItem'

function PlayerSection({
  title,
  count,
  players,
  isDimmed = false,
  selectedPlayer,
  pendingDeletePlayerId,
  deletingPlayerId,
  changingAttendancePlayerId,
  onSelectPlayer,
  onChangePlayerAttendance,
  onConfirmDelete,
  onRequestDelete,
  onCancelDelete,
}) {
  return (
    <section className="player-section">
      <div className="player-section-heading">
        <h3>{title}</h3>
        <span>{count}</span>
      </div>

      {players.length === 0 ? (
        <p className="empty-text small">해당 선수가 없습니다.</p>
      ) : (
        <ul className="player-list">
          {players.map((player) => (
            <PlayerItem
              player={player}
              key={player.id}
              isDimmed={isDimmed}
              isSelected={selectedPlayer?.id === player.id}
              isConfirmingDelete={pendingDeletePlayerId === player.id}
              isDeleting={deletingPlayerId === player.id}
              isChangingAttendance={changingAttendancePlayerId === player.id}
              onSelectPlayer={onSelectPlayer}
              onChangePlayerAttendance={onChangePlayerAttendance}
              onConfirmDelete={onConfirmDelete}
              onRequestDelete={onRequestDelete}
              onCancelDelete={onCancelDelete}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default PlayerSection
