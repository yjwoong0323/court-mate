import { apiRequest } from './http'

export function getPlayers() {
  return apiRequest('/api/players')
}
