import { LEVEL_FILTERS, SEX_FILTERS } from '../../utils/playerUtils'

function PlayerFilterPanel({
  levelFilter,
  sexFilter,
  onLevelFilterChange,
  onSexFilterChange,
}) {
  return (
    <div className="player-filter-panel">
      <div className="filter-group" aria-label="성별 필터">
        {SEX_FILTERS.map((filter) => (
          <button
            className={`filter-chip ${sexFilter === filter.value ? 'active' : ''}`}
            type="button"
            key={filter.value}
            onClick={() => onSexFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="filter-group level-filter" aria-label="급수 필터">
        {LEVEL_FILTERS.map((level) => (
          <button
            className={`filter-chip ${levelFilter === level ? 'active' : ''}`}
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
