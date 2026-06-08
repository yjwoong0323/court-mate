import { useState } from 'react'
import { IconCheck, IconPlus, IconX } from '@tabler/icons-react'

const INITIAL_FORM = {
  name: '',
  sex: 'M',
  level: 'A',
}

const SEX_FILTERS = [
  { label: 'All', value: 'ALL' },
  { label: 'M', value: 'M' },
  { label: 'W', value: 'W' },
]

const LEVEL_FILTERS = ['ALL', 'S', 'A', 'B', 'C', 'D', 'E']

const LEVEL_ORDER = {
  S: 0,
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
}

function PlayerList({
  players,
  allPlayers = players,
  isLoading,
  selectedPlayer,
  onSelectPlayer,
  getPlayerAttended,
  isCreatingPlayer,
  onCreatePlayer,
  changingAttendancePlayerId,
  onChangePlayerAttendance,
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formValues, setFormValues] = useState(INITIAL_FORM)
  const [sexFilter, setSexFilter] = useState('ALL')
  const [levelFilter, setLevelFilter] = useState('ALL')

  const filteredPlayers = players.filter((player) => {
    const isSexMatched = sexFilter === 'ALL' || player.sex === sexFilter
    const isLevelMatched = levelFilter === 'ALL' || player.level === levelFilter

    return isSexMatched && isLevelMatched
  })
  const filteredAllPlayers = allPlayers.filter((player) => {
    const isSexMatched = sexFilter === 'ALL' || player.sex === sexFilter
    const isLevelMatched = levelFilter === 'ALL' || player.level === levelFilter

    return isSexMatched && isLevelMatched
  })
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    const levelDiff = LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]

    if (levelDiff !== 0) {
      return levelDiff
    }

    return a.name.localeCompare(b.name, 'ko')
  })
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

  const handleSubmit = async (event) => {
    event.preventDefault()

    const isCreated = await onCreatePlayer(formValues)

    if (isCreated) {
      setFormValues(INITIAL_FORM)
      setIsCreateOpen(false)
    }
  }

  const handleCloseForm = () => {
    setFormValues(INITIAL_FORM)
    setIsCreateOpen(false)
  }

  const renderPlayers = (sectionPlayers, isDimmed = false) => {
    if (sectionPlayers.length === 0) {
      return <p className="empty-text small">해당 선수가 없습니다.</p>
    }

    return (
      <ul className="player-list">
        {sectionPlayers.map((player) => (
          <li key={player.id}>
            <div
              className={`player-item ${isDimmed ? 'not-attended' : ''} ${selectedPlayer?.id === player.id ? 'selected' : ''
                }`}
            >
              <button
                className="player-select-button"
                type="button"
                onClick={() => onSelectPlayer(player)}
                aria-pressed={selectedPlayer?.id === player.id}
              >
                <span className={`level-badge ${player.sex === 'M' ? 'male' : 'female'}`}>
                  {player.level}
                </span>
                <strong>{player.name}</strong>
              </button>

              <button
                className={`attendance-toggle ${isDimmed ? 'join' : 'leave'}`}
                type="button"
                onClick={() => onChangePlayerAttendance(player.id)}
                disabled={changingAttendancePlayerId === player.id}
                aria-label={isDimmed ? `${player.name} 참석 처리` : `${player.name} 미참석 처리`}
                title={isDimmed ? '참석 처리' : '미참석 처리'}
              >
                {isDimmed ? <IconPlus size={17} /> : <IconCheck size={17} />}
              </button>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <aside className="player-panel">
      <div className="section-heading player-heading">
        <h2>Player List</h2>
        <button
          className={`player-add-toggle ${isCreateOpen ? 'active' : ''}`}
          type="button"
          onClick={() => setIsCreateOpen((prevOpen) => !prevOpen)}
          aria-label="플레이어 추가 폼 열기"
          title="플레이어 추가"
        >
          <IconPlus size={19} />
        </button>
      </div>

      {isCreateOpen && (
        <form className="player-create-form" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            value={formValues.name}
            onChange={handleFormChange}
            placeholder="이름"
            disabled={isCreatingPlayer}
          />

          <div className="player-create-row">
            <select name="sex" value={formValues.sex} onChange={handleFormChange} disabled={isCreatingPlayer}>
              <option value="M">남</option>
              <option value="W">여</option>
            </select>

            <select
              name="level"
              value={formValues.level}
              onChange={handleFormChange}
              disabled={isCreatingPlayer}
            >
              <option value="S">S</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </div>

          <div className="player-create-actions">
            <button className="player-create-submit" type="submit" disabled={isCreatingPlayer}>
              추가
            </button>
            <button className="player-create-cancel" type="button" onClick={handleCloseForm}>
              <IconX size={17} />
            </button>
          </div>
        </form>
      )}

      {!isLoading && allPlayers.length > 0 && (
        <div className="player-filter-panel">
          <div className="filter-group" aria-label="성별 필터">
            {SEX_FILTERS.map((filter) => (
              <button
                className={`filter-chip ${sexFilter === filter.value ? 'active' : ''}`}
                type="button"
                key={filter.value}
                onClick={() => setSexFilter(filter.value)}
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
                onClick={() => setLevelFilter(level)}
              >
                {level === 'ALL' ? 'All' : level}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="empty-text">선수 정보를 불러오는 중입니다.</p>
      ) : allPlayers.length === 0 ? (
        <p className="empty-text">등록된 선수가 없습니다.</p>
      ) : (
        <div className="player-sections">
          <section className="player-section">
            <div className="player-section-heading">
              <h3>현재 참석자</h3>
              <span>{attendedPlayerCount}</span>
            </div>
            {renderPlayers(attendedPlayers)}
          </section>

          <section className="player-section">
            <div className="player-section-heading">
              <h3>미 참석자</h3>
              <span>{notAttendedPlayerCount}</span>
            </div>
            {renderPlayers(notAttendedPlayers, true)}
          </section>
        </div>
      )}
    </aside>
  )
}

export default PlayerList
