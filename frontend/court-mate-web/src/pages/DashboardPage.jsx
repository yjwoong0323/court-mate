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

      <main className="min-h-screen bg-cm-cream px-3 py-6 text-cm-ink sm:px-4 lg:py-8">
        <section className="mx-auto mb-6 flex max-w-[1720px] items-end justify-between pl-14 sm:pl-16">
          <div>
            <p className="font-display text-sm font-bold tracking-[0.14em] text-cm-blue uppercase">CourtMate</p>
            <h1 className="mt-1 text-3xl leading-none sm:text-4xl">TEMPO</h1>
          </div>
          <p className="hidden text-sm text-cm-muted sm:block">선수를 선택한 뒤 빈 자리를 눌러 배치하세요.</p>
        </section>

        {dashboard.errorMessage && (
          <div className="mx-auto mb-4 max-w-[1720px] rounded-xl border border-cm-danger/25 bg-white px-4 py-3 text-sm text-cm-danger shadow-panel" role="alert">{dashboard.errorMessage}</div>
        )}

        <section className="mx-auto grid max-w-[1720px] grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_440px]">
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
