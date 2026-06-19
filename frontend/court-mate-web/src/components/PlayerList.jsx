import { useState } from 'react'
import { IconPlus } from '@tabler/icons-react'
import PlayerCreateForm from './players/PlayerCreateForm'
import PlayerFilterPanel from './players/PlayerFilterPanel'
import PlayerSection from './players/PlayerSection'
import {
  filterPlayersByOptions,
  getPlayerAttended,
  INITIAL_PLAYER_FORM,
  sortPlayersByLevelAndName,
} from '../utils/playerUtils'

function PlayerList({
  players,
  allPlayers = players,
  isLoading,
  selectedPlayer,
  onSelectPlayer,
  isCreatingPlayer,
  onCreatePlayer,
  changingAttendancePlayerId,
  onChangePlayerAttendance,
  deletingPlayerId,
  onDeletePlayer,
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formValues, setFormValues] = useState(INITIAL_PLAYER_FORM)
  const [sexFilter, setSexFilter] = useState('ALL')
  const [levelFilter, setLevelFilter] = useState('ALL')
  const [pendingDeletePlayerId, setPendingDeletePlayerId] = useState(null)

  const filteredPlayers = filterPlayersByOptions(players, sexFilter, levelFilter)
  const filteredAllPlayers = filterPlayersByOptions(allPlayers, sexFilter, levelFilter)
  const sortedPlayers = sortPlayersByLevelAndName(filteredPlayers)
  const attendedPlayers = sortedPlayers.filter((player) => getPlayerAttended(player))
  const notAttendedPlayers = sortedPlayers.filter((player) => !getPlayerAttended(player))
  const attendedPlayerCount = filteredAllPlayers.filter((player) => getPlayerAttended(player)).length
  const notAttendedPlayerCount = filteredAllPlayers.filter((player) => !getPlayerAttended(player)).length

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const handleFormOptionSelect = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const isCreated = await onCreatePlayer(formValues)

    if (isCreated) {
      setFormValues(INITIAL_PLAYER_FORM)
      setIsCreateOpen(false)
    }
  }

  const handleConfirmDelete = async (playerId) => {
    const isDeleted = await onDeletePlayer(playerId)

    if (isDeleted) {
      setPendingDeletePlayerId(null)
    }
  }

  return (
    <aside className="min-h-[320px] rounded-2xl border border-cm-blue/10 bg-white p-4 shadow-panel xl:sticky xl:top-6 xl:max-h-[calc(100vh-48px)] xl:overflow-y-auto">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-xs font-bold tracking-[0.12em] text-cm-blue uppercase">Roster</p>
          <h2 className="font-display text-2xl font-bold">Players</h2>
        </div>
        <button
          className={`flex h-11 w-11 items-center justify-center rounded-xl border bg-white text-cm-ink transition hover:border-cm-blue hover:text-cm-blue ${isCreateOpen ? 'rotate-45 border-cm-blue bg-cm-blue/5 text-cm-blue' : 'border-cm-blue/15'}`}
          type="button"
          onClick={() => setIsCreateOpen((prevOpen) => !prevOpen)}
          aria-label="플레이어 추가 폼 열기"
          title="플레이어 추가"
        >
          <IconPlus size={19} />
        </button>
      </div>

      <PlayerCreateForm
        formValues={formValues}
        isOpen={isCreateOpen}
        isSubmitting={isCreatingPlayer}
        onChange={handleFormChange}
        onOptionSelect={handleFormOptionSelect}
        onSubmit={handleSubmit}
      />

      {!isLoading && allPlayers.length > 0 && (
        <PlayerFilterPanel
          levelFilter={levelFilter}
          sexFilter={sexFilter}
          onLevelFilterChange={setLevelFilter}
          onSexFilterChange={setSexFilter}
        />
      )}

      {isLoading ? (
        <p className="py-6 text-center text-sm text-cm-muted">선수 정보를 불러오는 중입니다.</p>
      ) : allPlayers.length === 0 ? (
        <p className="py-6 text-center text-sm text-cm-muted">등록된 선수가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-6">
          <PlayerSection
            title="참석자"
            count={attendedPlayerCount}
            players={attendedPlayers}
            selectedPlayer={selectedPlayer}
            pendingDeletePlayerId={pendingDeletePlayerId}
            deletingPlayerId={deletingPlayerId}
            changingAttendancePlayerId={changingAttendancePlayerId}
            onSelectPlayer={onSelectPlayer}
            onChangePlayerAttendance={onChangePlayerAttendance}
            onConfirmDelete={handleConfirmDelete}
            onRequestDelete={setPendingDeletePlayerId}
            onCancelDelete={() => setPendingDeletePlayerId(null)}
          />

          <PlayerSection
            title="미 참석자"
            count={notAttendedPlayerCount}
            players={notAttendedPlayers}
            isDimmed
            isCollapsible
            defaultExpanded={false}
            selectedPlayer={selectedPlayer}
            pendingDeletePlayerId={pendingDeletePlayerId}
            deletingPlayerId={deletingPlayerId}
            changingAttendancePlayerId={changingAttendancePlayerId}
            onSelectPlayer={onSelectPlayer}
            onChangePlayerAttendance={onChangePlayerAttendance}
            onConfirmDelete={handleConfirmDelete}
            onRequestDelete={setPendingDeletePlayerId}
            onCancelDelete={() => setPendingDeletePlayerId(null)}
          />
        </div>
      )}
    </aside>
  )
}

export default PlayerList
