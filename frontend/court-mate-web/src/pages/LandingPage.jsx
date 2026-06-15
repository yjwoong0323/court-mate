import heroImage from '../assets/courtmate-hero.png'

function LandingPage({ onAdminLogin }) {
  return (
    <main className="home-shell">
      <section className="home-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="home-hero-overlay" />
        <header className="home-nav" aria-label="CourtMate">
          <strong>CourtMate</strong>
        </header>

        <div className="home-content">
          <h1>CourtMate</h1>
          <p className="home-subtitle">Make your team Comfortable</p>

          <div className="home-actions" aria-label="Login options">
            <button className="home-login-button primary" type="button" onClick={onAdminLogin}>
              Login As Admin
            </button>
            <button className="home-login-button secondary" type="button">
              Login As Player
            </button>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <span>2026 CourtMate</span>
        <span>Badminton Court Management Service</span>
        <span>Baekseok Univ JSP Project</span>
      </footer>
    </main>
  )
}

export default LandingPage
