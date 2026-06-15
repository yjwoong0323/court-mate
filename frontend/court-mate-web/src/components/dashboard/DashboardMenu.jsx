import { IconSettings, IconUser, IconUsersGroup } from '@tabler/icons-react'

function DashboardMenu({ isOpen, onToggle }) {
  return (
    <>
      <button
        className={`dashboard-menu-button ${isOpen ? 'open' : ''}`}
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={isOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <aside
        className={`dashboard-side-menu ${isOpen ? 'open' : ''}`}
        aria-label="Dashboard menu"
      >
        <div className="dashboard-side-menu-header">
          <strong>CourtMate</strong>
        </div>
        <nav className="dashboard-side-menu-list">
          <button type="button">
            <IconUser size={17} />
            Profile
          </button>
          <button type="button">
            <IconUsersGroup size={17} />
            Team
          </button>
          <button className="setting" type="button">
            <IconSettings size={17} />
            Setting
          </button>
        </nav>
      </aside>
    </>
  )
}

export default DashboardMenu
