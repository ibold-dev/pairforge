const launches = [
  { name: 'Northstar / USDC', state: 'Discovery', progress: '42%', policy: 'Catalyst' },
  { name: 'Signal / USDC', state: 'Graduated', progress: '100%', policy: 'Conviction' },
];

export default function MarketsPage() {
  return (
    <main>
      <nav>
        <b>PAIRFORGE</b>
        <a href="/">Policy studio</a>
      </nav>
      <section className="market-head">
        <p className="eyebrow">READ-ONLY MARKET VIEW</p>
        <h1>Launch lifecycle</h1>
        <p className="lede">
          Fixture data for product review. On-chain accounts become the source of truth when network
          reads are enabled.
        </p>
      </section>
      <section className="market-list">
        {launches.map((launch) => (
          <article key={launch.name}>
            <span>{launch.policy}</span>
            <h2>{launch.name}</h2>
            <p>
              {launch.state} · {launch.progress} curve progress
            </p>
            <div className="progress">
              <i style={{ width: launch.progress }} />
            </div>
            <small>
              {launch.state === 'Graduated'
                ? 'Trading continues in DAMM v2.'
                : 'Trading is occurring on the DBC virtual pool.'}
            </small>
          </article>
        ))}
      </section>
    </main>
  );
}
