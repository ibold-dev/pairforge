const presets = [
  ['Catalyst', 'A timed launch for attention-driven releases.', '24h'],
  ['Conviction', 'A longer runway for gradual participation.', '7d'],
  ['Pair Thesis', 'A reference-aware policy for approved paired assets.', '72h'],
];

export default function HomePage() {
  return (
    <main>
      <nav>
        <b>PAIRFORGE</b>
        <a href="/markets">Market lifecycle</a>
      </nav>
      <section className="hero">
        <p className="eyebrow">PAIR-NATIVE LAUNCHES</p>
        <h1>
          Make the pair
          <br />
          the product.
        </h1>
        <p className="lede">
          Compose a transparent launch policy that moves from price discovery into durable Meteora
          liquidity.
        </p>
        <button>Start a launch draft</button>
      </section>
      <section className="rail">
        <p className="eyebrow">STARTING POLICIES</p>
        <div className="cards">
          {presets.map(([name, description, duration]) => (
            <article key={name}>
              <span>{duration}</span>
              <h2>{name}</h2>
              <p>{description}</p>
              <a href="#studio">Review policy →</a>
            </article>
          ))}
        </div>
      </section>
      <PolicyStudio />
    </main>
  );
}
import { PolicyStudio } from './policy-studio';
