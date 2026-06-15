import { apiRequest } from './http'

export function getPlayers() {
  return apiRequest('/api/players')
}

export function createPlayer(player) {
  return apiRequest('/api/players', {
    method: 'POST',
    body: JSON.stringify(player),
  })
}

export function changePlayerAttendance(playerId) {
  return apiRequest(`/api/players/${playerId}/changeIsAttended`, {
    method: 'PATCH',
  })
}

export function deletePlayer(playerId) {
  return apiRequest(`/api/players/${playerId}`, {
    method: 'DELETE',
  })
}
