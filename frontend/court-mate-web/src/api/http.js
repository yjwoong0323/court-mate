const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

async function handleResponse(response) {
  // DELETE처럼 응답 본문이 없는 API는 204 상태를 돌려줄 수 있다.
  if (response.ok) {
    return response.status === 204 ? null : response.json()
  }

  const message = await response.text()
  throw new Error(message || `API 요청에 실패했습니다. (${response.status})`)
}

export async function apiRequest(path, options = {}) {
  // fetch는 브라우저에 기본으로 들어있는 API 호출 함수다.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  return handleResponse(response)
}
