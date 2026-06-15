export const INITIAL_PLAYER_FORM = {
  name: '',
  sex: 'M',
  level: 'A',
}

export const SEX_FILTERS = [
  { label: 'All', value: 'ALL' },
  { label: 'M', value: 'M' },
  { label: 'W', value: 'W' },
]

export const SEX_OPTIONS = [
  { label: '남', value: 'M' },
  { label: '여', value: 'W' },
]

export const LEVEL_OPTIONS = ['S', 'A', 'B', 'C', 'D', 'E']

export const LEVEL_FILTERS = ['ALL', 'S', 'A', 'B', 'C', 'D', 'E']

const LEVEL_ORDER = {
  S: 0,
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
}

export function getPlayerAttended(player) {
  return player.attended ?? player.isAttended ?? false
}

export function filterPlayersByOptions(players, sexFilter, levelFilter) {
  return players.filter((player) => {
    const isSexMatched = sexFilter === 'ALL' || player.sex === sexFilter
    const isLevelMatched = levelFilter === 'ALL' || player.level === levelFilter

    return isSexMatched && isLevelMatched
  })
}

export function sortPlayersByLevelAndName(players) {
  return [...players].sort((a, b) => {
    const levelDiff = LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]

    if (levelDiff !== 0) {
      return levelDiff
    }

    return a.name.localeCompare(b.name, 'ko')
  })
}
