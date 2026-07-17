import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page-container">
      <section className="card">
        <h1>Castaminofen</h1>
        <p>Frontend foundation is ready. Explore the app using the links below.</p>
        <div className="grid grid-gap-12">
          <Link className="button button-primary" href="/login">
            Login
          </Link>
          <Link className="button button-secondary" href="/register">
            Register
          </Link>
          <Link className="button button-secondary" href="/podcasts">
            Podcasts
          </Link>
          <Link className="button button-secondary" href="/episodes/new">
            New Episode
          </Link>
        </div>
      </section>
    </main>
  );
}
