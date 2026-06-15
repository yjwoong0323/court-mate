import CourtBoard from '../components/CourtBoard'
import DashboardFooter from '../components/dashboard/DashboardFooter'
import DashboardMenu from '../components/dashboard/DashboardMenu'
import PlayerList from '../components/PlayerList'
import { useDashboardData } from '../hooks/useDashboardData'

function DashboardPage() {
  const dashboard = useDashboardData()

  return (
    <>
      <DashboardMenu
        isOpen={dashboard.isDashboardMenuOpen}
        onToggle={() => dashboard.setIsDashboardMenuOpen((isOpen) => !isOpen)}
      />

      <main className="app-shell">
        <section className="app-header">
          <div>
            <p className="eyebrow">CourtMate</p>
            <h1>코트 관리</h1>
          </div>
        </section>

        {dashboard.errorMessage && (
          <div className="error-banner">{dashboard.errorMessage}</div>
        )}

        <section className="layout-grid">
          <CourtBoard
            courts={dashboard.courts}
            courtSlots={dashboard.courtSlots}
            isLoading={dashboard.isLoading}
            selectedPlayer={dashboard.selectedPlayer}
            selectedSlot={dashboard.selectedSlot}
            courtGames={dashboard.courtGames}
            actionCourtId={dashboard.actionCourtId}
            moveMenuCourtId={dashboard.moveMenuCourtId}
            now={dashboard.now}
            onSlotClick={dashboard.handleSlotClick}
            onStartGame={dashboard.handleStartGame}
            onEndGame={dashboard.handleEndGame}
            onClearCourt={dashboard.handleClearCourt}
            onToggleMoveMenu={dashboard.handleToggleMoveMenu}
            onMoveCourt={dashboard.handleMoveCourt}
            isCreatingCourt={dashboard.isCreatingCourt}
            onCreateCourt={dashboard.handleCreateCourt}
          />
          <PlayerList
            players={dashboard.availablePlayers}
            allPlayers={dashboard.players}
            isLoading={dashboard.isLoading}
            selectedPlayer={dashboard.selectedPlayer}
            onSelectPlayer={dashboard.handleSelectPlayer}
            isCreatingPlayer={dashboard.isCreatingPlayer}
            onCreatePlayer={dashboard.handleCreatePlayer}
            changingAttendancePlayerId={dashboard.changingAttendancePlayerId}
            onChangePlayerAttendance={dashboard.handleChangePlayerAttendance}
            deletingPlayerId={dashboard.deletingPlayerId}
            onDeletePlayer={dashboard.handleDeletePlayer}
          />
        </section>

        <DashboardFooter />
      </main>
    </>
  )
}

export default DashboardPage
