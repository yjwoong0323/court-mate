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
      className={`grid overflow-hidden transition-all duration-200 ${isOpen ? 'max-w-[520px] grid-cols-[minmax(100px,1fr)_auto_auto] gap-2 opacity-100' : 'max-w-0 grid-cols-[0fr_0fr_0fr] gap-0 opacity-0 pointer-events-none'}`}
      onSubmit={onSubmit}
      aria-hidden={!isOpen}
    >
      <input
        name="name"
        type="text"
        value={formValues.name}
        onChange={onChange}
        placeholder="코트 이름"
        aria-label="코트 이름"
        className="min-h-11 min-w-0 rounded-xl border border-cm-blue/15 bg-white px-3 text-sm text-cm-ink placeholder:text-cm-muted/60 focus:border-cm-blue"
        disabled={isSubmitting || !isOpen}
      />

      <div className="flex gap-1" aria-label="코트 타입 선택">
        {COURT_TYPE_OPTIONS.map((option) => (
          <button
            className={`min-h-11 whitespace-nowrap rounded-xl border px-3 text-sm transition ${formValues.courtType === option.value ? 'border-cm-blue bg-cm-blue/10 text-cm-blue' : 'border-cm-blue/15 bg-white text-cm-muted hover:border-cm-blue'}`}
            type="button"
            key={option.value}
            onClick={() => handleCourtTypeSelect(option.value)}
            disabled={isSubmitting || !isOpen}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button className="min-h-11 rounded-xl bg-cm-navy px-4 text-sm text-white transition hover:bg-cm-navy/90 disabled:cursor-not-allowed disabled:opacity-45" type="submit" disabled={isSubmitting || !isOpen}>
        추가
      </button>
    </form>
  )
}

export default CourtCreateForm
