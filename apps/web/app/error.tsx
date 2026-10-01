'use client';

export default function ErrorPage({ reset }: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">UNAVAILABLE</p>
        <h1>We could not load this view.</h1>
        <p className="lede">
          Try again. If the problem persists, verify the selected network and return to the policy
          studio.
        </p>
        <button onClick={reset}>Try again</button>
      </section>
    </main>
  );
}
