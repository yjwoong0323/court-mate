import { LEVEL_FILTERS, SEX_FILTERS } from '../../utils/playerUtils'

function PlayerFilterPanel({
  levelFilter,
  sexFilter,
  onLevelFilterChange,
  onSexFilterChange,
}) {
  return (
    <div className="mb-5 flex flex-col gap-2 rounded-xl border border-cm-blue/10 bg-cm-blue/[0.025] p-3">
      <div className="flex flex-wrap gap-1.5" aria-label="성별 필터">
        {SEX_FILTERS.map((filter) => (
          <button
            className={`min-h-9 rounded-xl border px-3 text-sm transition ${sexFilter === filter.value ? 'border-cm-blue bg-cm-blue/10 text-cm-blue' : 'border-cm-blue/10 bg-white text-cm-muted hover:border-cm-blue'}`}
            type="button"
            key={filter.value}
            onClick={() => onSexFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" aria-label="급수 필터">
        {LEVEL_FILTERS.map((level) => (
          <button
            className={`min-h-9 min-w-0 rounded-xl border text-sm transition ${levelFilter === level ? 'border-cm-blue bg-cm-blue/10 text-cm-blue' : 'border-cm-blue/10 bg-white text-cm-muted hover:border-cm-blue'}`}
            type="button"
            key={level}
            onClick={() => onLevelFilterChange(level)}
          >
            {level === 'ALL' ? 'All' : level}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PlayerFilterPanel
