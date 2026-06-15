import { apiRequest } from './http'

export function getCourts() {
  return apiRequest('/api/courts')
}

export function createCourt(court) {
  return apiRequest('/api/courts', {
    method: 'POST',
    body: JSON.stringify(court),
  })
}
