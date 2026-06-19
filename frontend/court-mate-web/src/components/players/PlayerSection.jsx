import { useState } from 'react'
import { IconChevronDown } from '@tabler/icons-react'
import PlayerItem from './PlayerItem'

function PlayerSection({
  title,
  count,
  players,
  isDimmed = false,
  isCollapsible = false,
  defaultExpanded = true,
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
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const isContentVisible = !isCollapsible || isExpanded
  const contentId = `player-section-${title.replace(/\s/g, '-')}`

  return (
    <section>
      {isCollapsible ? (
        <button
          className="mb-2.5 flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-2 text-left transition hover:bg-cm-blue/5"
          type="button"
          onClick={() => setIsExpanded((prevExpanded) => !prevExpanded)}
          aria-expanded={isExpanded}
          aria-controls={contentId}
        >
          <span className="flex items-center gap-2">
            <IconChevronDown
              className={`text-cm-muted transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
              size={18}
            />
            <span className="text-sm text-cm-ink">{title}</span>
          </span>
          <span className="min-w-7 rounded-full bg-cm-blue/10 px-2 py-0.5 text-center font-display text-xs font-bold text-cm-blue">{count}</span>
        </button>
      ) : (
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <h3 className="text-sm text-cm-ink">{title}</h3>
          <span className="min-w-7 rounded-full bg-cm-blue/10 px-2 py-0.5 text-center font-display text-xs font-bold text-cm-blue">{count}</span>
        </div>
      )}

      <div
        id={contentId}
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${isContentVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        aria-hidden={!isContentVisible}
        inert={!isContentVisible}
      >
        <div className="min-h-0 overflow-hidden">
          {players.length === 0 ? (
            <p className="py-2 text-sm text-cm-muted">해당 선수가 없습니다.</p>
          ) : (
            <ul className="grid list-none grid-cols-2 gap-2.5 p-0">
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
        </div>
      </div>
    </section>
  )
}

export default PlayerSection
