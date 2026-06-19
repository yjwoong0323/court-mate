import { useEffect, useState } from 'react'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'

function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const handleAdminLogin = () => {
    window.location.hash = 'dashboard'
    setRoute('#dashboard')
  }

  if (route === '#dashboard') {
    return <DashboardPage />
  }

  return <LandingPage onAdminLogin={handleAdminLogin} />
}

export default App
