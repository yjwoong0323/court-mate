import { useEffect, useState } from 'react'
import { IconRefresh } from '@tabler/icons-react'
import './App.css'
import { getCourts } from './api/courtApi'
import CourtBoard from './components/CourtBoard'

function App() {
  // useState는 화면에서 바뀔 수 있는 값을 저장한다.

  // courts: 서버에서 받아온 코트 목록
  const [courts, setCourts] = useState([])

  // isLoading: API 요청이 끝나기 전까지 로딩 문구를 보여주기 위한 값
  const [isLoading, setIsLoading] = useState(true)

  // errorMessage: API 요청 실패 시 화면에 보여줄 에러 문구
  const [errorMessage, setErrorMessage] = useState('')

  const loadCourts = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }

    setErrorMessage('')

    try {
      const courtData = await getCourts()
      setCourts(courtData)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect는 화면이 처음 그려진 뒤 API 데이터를 한 번 불러올 때 사용한다.
  useEffect(() => {
    let ignore = false

    getCourts()
      .then((courtData) => {
        if (ignore) {
          return
        }

        setCourts(courtData)
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(error.message)
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <main className="app-shell">
      <section className="app-header">
        <div>
          <p className="eyebrow">CourtMate</p>
          <h1>코트 관리</h1>
        </div>
        <button className="icon-button" type="button" onClick={loadCourts} title="새로고침">
          <IconRefresh size={20} />
        </button>
      </section>

      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      <section className="layout-grid">
        <CourtBoard courts={courts} isLoading={isLoading} />
      </section>
    </main>
  )
}

export default App
