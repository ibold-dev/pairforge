'use client';

import { useMemo, useState } from 'react';

const policies = {
  Catalyst: {
    duration: '24 hours',
    fee: '2.50% → 1.00%',
    objective: '10 USDC',
    note: 'Designed for a concentrated launch window.',
  },
  Conviction: {
    duration: '7 days',
    fee: '1.50% → 0.75%',
    objective: '25 USDC',
    note: 'Designed for longer discovery and participation.',
  },
  'Pair Thesis': {
    duration: '72 hours',
    fee: '2.00% → 1.00%',
    objective: '15 USDC',
    note: 'Records the pairing thesis; it does not use an oracle to reprice the curve.',
  },
};

type PolicyName = keyof typeof policies;

export function PolicyStudio() {
  const [selected, setSelected] = useState<PolicyName>('Catalyst');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const policy = policies[selected];
  const valid = name.trim().length > 0 && /^[A-Z0-9]{2,10}$/.test(symbol);
  const digest = useMemo(() => `${selected.toLowerCase().replace(' ', '-')}-v1`, [selected]);

  return (
    <section id="studio" className="studio">
      <div>
        <p className="eyebrow">POLICY STUDIO</p>
        <h2>Every economic choice, before a wallet is involved.</h2>
        <p className="lede">
          Estimates are planning aids. Your final manifest will be reviewed before any devnet
          transaction is composed.
        </p>
      </div>
      <div className="panel">
        <fieldset>
          <legend>Choose a policy</legend>
          <div className="policy-options">
            {(Object.keys(policies) as PolicyName[]).map((item) => (
              <button
                className={item === selected ? 'selected' : ''}
                key={item}
                onClick={() => setSelected(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>
        <label>
          Token name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Example token"
          />
        </label>
        <label>
          Token symbol
          <input
            value={symbol}
            onChange={(event) => setSymbol(event.target.value.toUpperCase())}
            placeholder="EXM"
            maxLength={10}
          />
        </label>
        <dl>
          <div>
            <dt>Quote asset</dt>
            <dd>Devnet USDC</dd>
          </div>
          <div>
            <dt>Curve duration</dt>
            <dd>{policy.duration}</dd>
          </div>
          <div>
            <dt>DBC fee schedule</dt>
            <dd>{policy.fee}</dd>
          </div>
          <div>
            <dt>Graduation objective</dt>
            <dd>{policy.objective}</dd>
          </div>
          <div>
            <dt>DAMM v2 liquidity</dt>
            <dd>45 / 5 / 45 / 5</dd>
          </div>
        </dl>
        <p className="notice">{policy.note}</p>
        <div className="manifest">
          <span>Manifest preview</span>
          <code>{digest}</code>
          <strong>
            {valid ? 'Ready for simulation' : 'Enter a token name and 2–10 character symbol'}
          </strong>
        </div>
      </div>
    </section>
  );
}
