import { apiRequest } from './http'

export function getPlayingGames() {
  return apiRequest('/api/games/playing')
}

export function startGame(courtId, playerIds) {
  return apiRequest(`/api/courts/${courtId}/games/start`, {
    method: 'POST',
    body: JSON.stringify({ playerIds }),
  })
}

export function endGame(courtId) {
  return apiRequest(`/api/courts/${courtId}/games/current/end`, {
    method: 'PATCH',
  })
}

export function moveCurrentGame(fromCourtId, toCourtId) {
  return apiRequest(`/api/courts/${fromCourtId}/games/current/move/${toCourtId}`, {
    method: 'PATCH',
  })
}
