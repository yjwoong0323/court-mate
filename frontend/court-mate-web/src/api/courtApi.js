import { apiRequest } from './http'

export function getCourts() {
  return apiRequest('/api/courts')
}
