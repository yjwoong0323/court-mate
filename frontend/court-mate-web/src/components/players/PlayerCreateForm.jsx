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
      className={`flex origin-top flex-col gap-2.5 overflow-hidden border-b transition-all duration-200 ${isOpen ? 'mb-5 max-h-64 border-cm-blue/10 pb-5 opacity-100' : 'max-h-0 border-transparent opacity-0 pointer-events-none'}`}
      onSubmit={onSubmit}
      aria-hidden={!isOpen}
    >
      <input
        name="name"
        type="text"
        value={formValues.name}
        onChange={onChange}
        placeholder="이름"
        aria-label="선수 이름"
        className="min-h-11 w-full rounded-xl border border-cm-blue/15 bg-white px-3 text-sm text-cm-ink placeholder:text-cm-muted/60 focus:border-cm-blue"
        disabled={isSubmitting || !isOpen}
      />

      <div className="flex flex-wrap gap-1.5" aria-label="성별 선택">
        {SEX_OPTIONS.map((option) => (
          <button
            className={`min-h-9 rounded-xl border px-3 text-sm transition disabled:opacity-45 ${formValues.sex === option.value ? 'border-cm-blue bg-cm-blue/10 text-cm-blue' : 'border-cm-blue/10 bg-white text-cm-muted'}`}
            type="button"
            key={option.value}
            onClick={() => onOptionSelect('sex', option.value)}
            disabled={isSubmitting || !isOpen}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-1" aria-label="급수 선택">
        {LEVEL_OPTIONS.map((level) => (
          <button
            className={`min-h-9 min-w-0 rounded-xl border text-sm transition disabled:opacity-45 ${formValues.level === level ? 'border-cm-blue bg-cm-blue/10 text-cm-blue' : 'border-cm-blue/10 bg-white text-cm-muted'}`}
            type="button"
            key={level}
            onClick={() => onOptionSelect('level', level)}
            disabled={isSubmitting || !isOpen}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1">
        <button className="min-h-10 rounded-xl bg-cm-navy text-sm text-white transition hover:bg-cm-navy/90 disabled:cursor-not-allowed disabled:opacity-45" type="submit" disabled={isSubmitting || !isOpen}>
          {isSubmitting ? '추가 중...' : '추가'}
        </button>
      </div>
    </form>
  )
}

export default PlayerCreateForm
