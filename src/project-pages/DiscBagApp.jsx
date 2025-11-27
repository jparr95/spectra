import { useEffect, useMemo, useState } from 'react'

const slotFilters = [
  { id: 'all', label: 'All slots' },
  { id: 'distance', label: 'Distance drivers' },
  { id: 'control', label: 'Control drivers' },
  { id: 'mid', label: 'Midranges' },
  { id: 'putter', label: 'Putters' },
  { id: 'utility', label: 'Utility' },
]

const slotLabels = {
  distance: 'Distance Driver',
  control: 'Control Driver',
  mid: 'Midrange',
  putter: 'Putter',
  utility: 'Utility',
}

const discs = [
  {
    id: 'cloud-breaker',
    name: 'Cloud Breaker 3',
    manufacturer: 'Discmania',
    slot: 'distance',
    stability: 'Overstable',
    speed: 12,
    glide: 5,
    turn: -1,
    fade: 3,
    weight: '174g',
    plastic: 'S-Line',
    tier: 'Core',
    quickNote: 'Max distance into headwinds with confident finish.',
    shots: ['Full power hyzer', 'Long flex line', 'Push hyzer in wind'],
    confidence: 0.92,
  },
  {
    id: 'zen',
    name: 'Zen 2',
    manufacturer: 'Discmania',
    slot: 'distance',
    stability: 'Stable',
    speed: 11,
    glide: 6,
    turn: -2,
    fade: 2,
    weight: '173g',
    plastic: 'Meta',
    tier: 'Core',
    quickNote: 'Tailwind bomber that still fights back.',
    shots: ['Turnover distance', 'Flat laser', 'Late-finishing hyzer'],
    confidence: 0.88,
  },
  {
    id: 'pd',
    name: 'PD (Power Driver)',
    manufacturer: 'Discmania',
    slot: 'control',
    stability: 'Stable-OS',
    speed: 10,
    glide: 4,
    turn: 0,
    fade: 3,
    weight: '175g',
    plastic: 'C-Line',
    tier: 'Tournament',
    quickNote: 'Fairway feel with driver distance for shaped lines.',
    shots: ['Windy fairway', 'Forced flex', 'Skip shots'],
    confidence: 0.85,
  },
  {
    id: 'volt',
    name: 'Volt',
    manufacturer: 'MVP',
    slot: 'control',
    stability: 'Stable',
    speed: 8,
    glide: 5,
    turn: -0.5,
    fade: 2,
    weight: '170g',
    plastic: 'Neutron',
    tier: 'Core',
    quickNote: 'Straight fairway laser that holds angles.',
    shots: ['Low ceiling straight', 'Flip to flat', 'Touch forehands'],
    confidence: 0.9,
  },
  {
    id: 'hex',
    name: 'Hex',
    manufacturer: 'MVP',
    slot: 'mid',
    stability: 'Neutral',
    speed: 5,
    glide: 5,
    turn: -1,
    fade: 1,
    weight: '178g',
    plastic: 'Eclipse',
    tier: 'Core',
    quickNote: 'Point-and-shoot mid for woods golf.',
    shots: ['Straight tunnel', 'Late flip turnover', 'Soft forehand stand-ups'],
    confidence: 0.95,
  },
  {
    id: 'pyro',
    name: 'Pyro',
    manufacturer: 'Axiom',
    slot: 'mid',
    stability: 'Overstable',
    speed: 5,
    glide: 4,
    turn: 0,
    fade: 3,
    weight: '176g',
    plastic: 'Prism Proton',
    tier: 'Tournament',
    quickNote: 'Reliable mid that loves torque and wind.',
    shots: ['Forced flex mid', 'Wind-fighting approach', 'Skip forehands'],
    confidence: 0.81,
  },
  {
    id: 'pixel',
    name: 'Pixel',
    manufacturer: 'MVP',
    slot: 'putter',
    stability: 'Neutral',
    speed: 2,
    glide: 3,
    turn: 0,
    fade: 0.5,
    weight: '172g',
    plastic: 'Electron Soft',
    tier: 'Core',
    quickNote: 'Circle putting putter with straight push.',
    shots: ['Circle 1 putts', 'Floaty bids', 'Low ceiling runs'],
    confidence: 0.89,
  },
  {
    id: 'entropy',
    name: 'Entropy',
    manufacturer: 'MVP',
    slot: 'utility',
    stability: 'Overstable',
    speed: 4,
    glide: 3,
    turn: 0,
    fade: 3,
    weight: '173g',
    plastic: 'Neutron',
    tier: 'Core',
    quickNote: 'Approach disc that checks up on command.',
    shots: ['Spike forehand', 'Standstill hyzer', 'Skip approaches'],
    confidence: 0.87,
  },
]

function buildFlightString(disc) {
  return `${disc.speed}/${disc.glide}/${disc.turn}/${disc.fade}`
}

export default function DiscBagApp() {
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(discs[0].id)

  const filteredDiscs = useMemo(() => {
    if (filter === 'all') return discs
    return discs.filter((disc) => disc.slot === filter)
  }, [filter])

  useEffect(() => {
    if (filteredDiscs.length === 0) return
    if (!filteredDiscs.some((disc) => disc.id === selectedId)) {
      setSelectedId(filteredDiscs[0].id)
    }
  }, [filteredDiscs, selectedId])

  const selectedDisc = useMemo(
    () => discs.find((disc) => disc.id === selectedId),
    [selectedId],
  )

  const summary = useMemo(() => {
    const totals = discs.reduce((acc, disc) => {
      acc[disc.slot] = (acc[disc.slot] ?? 0) + 1
      return acc
    }, {})

    return slotFilters
      .filter((slot) => slot.id !== 'all')
      .map((slot) => ({
        id: slot.id,
        label: slot.label.replace(/s$/, ''),
        value: totals[slot.id] ?? 0,
      }))
  }, [])

  return (
    <div className="disc-bag-app">
      <aside className="disc-bag-sidebar">
        <header className="disc-bag-sidebar-header">
          <p className="disc-bag-eyebrow">Bag slots</p>
          <h2>Every disc that earns a spot.</h2>
        </header>

        <div className="disc-bag-filter-row" role="toolbar" aria-label="Filter discs by slot">
          {slotFilters.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setFilter(slot.id)}
              className={filter === slot.id ? 'chip chip--active' : 'chip'}
            >
              {slot.label}
            </button>
          ))}
        </div>

        <ul className="disc-bag-list">
          {filteredDiscs.map((disc) => (
            <li key={disc.id}>
              <button
                type="button"
                className={
                  disc.id === selectedId ? 'disc-card disc-card--active' : 'disc-card'
                }
                onClick={() => setSelectedId(disc.id)}
                aria-pressed={disc.id === selectedId}
              >
                <div>
                  <p className="disc-card-title">{disc.name}</p>
                  <p className="disc-card-meta">
                    {slotLabels[disc.slot]} • {buildFlightString(disc)}
                  </p>
                </div>
                <p className="disc-card-note">{disc.quickNote}</p>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="disc-bag-main">
        <div className="disc-bag-summary" aria-label="Bag summary">
          {summary.map((item) => (
            <article key={item.id} className="disc-bag-summary-card">
              <p className="disc-bag-summary-label">{item.label}</p>
              <p className="disc-bag-summary-value">{item.value}</p>
            </article>
          ))}
        </div>

        {selectedDisc && (
          <article className="disc-bag-detail">
            <header>
              <p className="disc-bag-eyebrow">{selectedDisc.tier} slot</p>
              <h3>{selectedDisc.name}</h3>
              <p className="disc-bag-detail-meta">
                {selectedDisc.manufacturer} • {slotLabels[selectedDisc.slot]} •{' '}
                {selectedDisc.stability}
              </p>
            </header>

            <section className="disc-bag-flight">
              <div>
                <p className="disc-bag-eyebrow">Flight numbers</p>
                <p className="disc-bag-flight-value">{buildFlightString(selectedDisc)}</p>
              </div>
              <div>
                <p className="disc-bag-eyebrow">Spec</p>
                <p className="disc-bag-detail-meta">
                  {selectedDisc.weight} • {selectedDisc.plastic}
                </p>
              </div>
              <div className="disc-bag-confidence">
                <p className="disc-bag-eyebrow">Trust level</p>
                <div className="confidence-bar">
                  <span style={{ width: `${selectedDisc.confidence * 100}%` }} />
                </div>
              </div>
            </section>

            <section>
              <p className="disc-bag-eyebrow">Shot chart</p>
              <div className="disc-bag-shot-grid">
                {selectedDisc.shots.map((shot) => (
                  <span key={shot} className="shot-pill">
                    {shot}
                  </span>
                ))}
              </div>
            </section>

            <footer>
              <p className="disc-bag-detail-note">{selectedDisc.quickNote}</p>
            </footer>
          </article>
        )}
      </section>
    </div>
  )
}

