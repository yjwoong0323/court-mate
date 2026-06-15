export const SLOT_COUNT = 4

export const INITIAL_COURT_FORM = {
  name: '',
  courtType: 'ACTIVE',
}

export const COURT_TYPE_OPTIONS = [
  { label: '운용 코트', value: 'ACTIVE' },
  { label: '대기 코트', value: 'WAITING' },
]

export function createEmptySlots() {
  return Array(SLOT_COUNT).fill(null)
}

export function getElapsedSeconds(gameState, now) {
  if (!gameState?.startedAt) {
    return 0
  }

  if (gameState.status === 'FINISHED') {
    return gameState.elapsedSeconds ?? 0
  }

  return Math.max(0, Math.floor((now - gameState.startedAt) / 1000))
}

export function formatElapsedTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
