import heroImage from '../assets/courtmate-hero.png'

function LandingPage({ onAdminLogin }) {
  return (
    <main className="min-h-screen bg-cm-navy text-white">
      <section
        className="relative flex min-h-[calc(100vh-72px)] flex-col justify-end overflow-hidden bg-cover bg-center px-5 py-12 sm:px-10 sm:py-16 lg:justify-center lg:px-[7vw]"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,59,99,0.94),rgba(23,59,99,0.62)_55%,rgba(23,59,99,0.3)),linear-gradient(0deg,rgba(23,59,99,0.76),transparent_55%)]" />
        <header className="absolute top-6 right-5 left-5 z-10 flex items-center justify-between sm:right-10 sm:left-10 lg:right-[7vw] lg:left-[7vw]" aria-label="CourtMate">
          <strong className="font-display text-xl font-bold tracking-tight">CourtMate</strong>
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white/80 backdrop-blur-sm">Badminton Court Manager</span>
        </header>

        <div className="relative z-10 w-full max-w-2xl pt-24">
          <p className="mb-4 text-sm tracking-[0.18em] text-cm-cream/90 uppercase">Play together, better</p>
          <h1 className="font-display text-6xl leading-[0.9] font-extrabold tracking-[-0.06em] sm:text-8xl lg:text-[7rem]">CourtMate</h1>
          <p className="mt-6 max-w-lg text-xl leading-snug text-white/85 sm:text-3xl">복잡한 코트 운영은 가볍게,<br />게임의 흐름은 한눈에.</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row" aria-label="Login options">
            <button className="min-h-12 rounded-xl bg-cm-navy px-6 text-base text-white transition hover:-translate-y-0.5 hover:bg-cm-navy/90 hover:shadow-lg focus-visible:outline-white" type="button" onClick={onAdminLogin}>
              Login As Admin
            </button>
            <button className="min-h-12 rounded-xl border border-white/50 bg-white/10 px-6 text-base text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20" type="button">
              Login As Player
            </button>
          </div>
        </div>
      </section>

      <footer className="flex min-h-[72px] flex-col items-center justify-center gap-1 px-6 py-4 text-center text-xs text-white/55 sm:flex-row sm:gap-3">
        <span>2026 CourtMate</span>
        <span className="hidden text-white/25 sm:inline">·</span>
        <span>Badminton Court Management Service · Baekseok Univ</span>
      </footer>
    </main>
  )
}

export default LandingPage
