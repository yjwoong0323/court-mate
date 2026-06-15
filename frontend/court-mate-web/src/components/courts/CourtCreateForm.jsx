import { COURT_TYPE_OPTIONS } from '../../utils/courtUtils'

function CourtCreateForm({
  formValues,
  isOpen,
  isSubmitting,
  onChange,
  onSubmit,
  onUpdate,
}) {
  const handleCourtTypeSelect = (courtType) => {
    onUpdate((prevValues) => ({
      ...prevValues,
      courtType,
    }))
  }

  return (
    <form
      className={`court-create-form ${isOpen ? 'open' : ''}`}
      onSubmit={onSubmit}
      aria-hidden={!isOpen}
    >
      <input
        name="name"
        type="text"
        value={formValues.name}
        onChange={onChange}
        placeholder="코트 이름"
        disabled={isSubmitting || !isOpen}
      />

      <div className="court-create-options" aria-label="코트 타입 선택">
        {COURT_TYPE_OPTIONS.map((option) => (
          <button
            className={`filter-chip ${formValues.courtType === option.value ? 'active' : ''}`}
            type="button"
            key={option.value}
            onClick={() => handleCourtTypeSelect(option.value)}
            disabled={isSubmitting || !isOpen}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button className="court-create-submit" type="submit" disabled={isSubmitting || !isOpen}>
        추가
      </button>
    </form>
  )
}

export default CourtCreateForm
