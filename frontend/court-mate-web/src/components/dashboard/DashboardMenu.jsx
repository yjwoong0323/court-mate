import { IconSettings, IconUser, IconUsersGroup } from '@tabler/icons-react'

function DashboardMenu({ isOpen, onToggle }) {
  return (
    <>
      <button
        className={`fixed top-6 left-4 z-30 flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-xl border border-cm-blue/15 bg-white shadow-panel transition sm:left-6 ${isOpen ? 'translate-x-[220px] border-cm-blue' : 'hover:-translate-y-0.5 hover:border-cm-blue'}`}
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={isOpen}
      >
        <span className={`block h-0.5 w-[18px] rounded-full bg-cm-ink transition ${isOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
        <span className={`block h-0.5 w-[18px] rounded-full bg-cm-ink transition ${isOpen ? 'scale-x-0 opacity-0' : ''}`} />
        <span className={`block h-0.5 w-[18px] rounded-full bg-cm-ink transition ${isOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-20 w-[264px] border-r border-cm-blue/10 bg-white p-4 pt-24 shadow-[18px_0_48px_rgb(23_35_60/0.12)] transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Dashboard menu"
      >
        <div className="absolute top-7 left-6">
          <strong className="font-display text-xl font-bold">CourtMate</strong>
        </div>
        <nav className="flex h-full flex-col gap-2">
          <button className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-left text-cm-muted transition hover:bg-cm-blue/5 hover:text-cm-blue" type="button">
            <IconUser size={17} />
            Profile
          </button>
          <button className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-left text-cm-muted transition hover:bg-cm-blue/5 hover:text-cm-blue" type="button">
            <IconUsersGroup size={17} />
            Team
          </button>
          <button className="mt-auto flex min-h-11 items-center gap-3 border-t border-cm-ink/10 px-3 pt-4 text-left text-cm-muted transition hover:text-cm-blue" type="button">
            <IconSettings size={17} />
            Setting
          </button>
        </nav>
      </aside>
    </>
  )
}

export default DashboardMenu
