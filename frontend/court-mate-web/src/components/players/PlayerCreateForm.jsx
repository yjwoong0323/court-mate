import { LEVEL_OPTIONS, SEX_OPTIONS } from '../../utils/playerUtils'

function PlayerCreateForm({
  formValues,
  isOpen,
  isSubmitting,
  onChange,
  onOptionSelect,
  onSubmit,
}) {
  return (
    <form
      className={`player-create-form ${isOpen ? 'open' : ''}`}
      onSubmit={onSubmit}
      aria-hidden={!isOpen}
    >
      <input
        name="name"
        type="text"
        value={formValues.name}
        onChange={onChange}
        placeholder="이름"
        disabled={isSubmitting || !isOpen}
      />

      <div className="player-create-option-group" aria-label="성별 선택">
        {SEX_OPTIONS.map((option) => (
          <button
            className={`filter-chip ${formValues.sex === option.value ? 'active' : ''}`}
            type="button"
            key={option.value}
            onClick={() => onOptionSelect('sex', option.value)}
            disabled={isSubmitting || !isOpen}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="player-create-option-group level-options" aria-label="급수 선택">
        {LEVEL_OPTIONS.map((level) => (
          <button
            className={`filter-chip ${formValues.level === level ? 'active' : ''}`}
            type="button"
            key={level}
            onClick={() => onOptionSelect('level', level)}
            disabled={isSubmitting || !isOpen}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="player-create-actions">
        <button className="player-create-submit" type="submit" disabled={isSubmitting || !isOpen}>
          추가
        </button>
      </div>
    </form>
  )
}

export default PlayerCreateForm
