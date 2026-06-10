import { WaveBackground } from '@/components/WaveBackground'

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-card overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(0,119,182,0.08)' }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(0,119,182,0.06)' }}>
        <span className="text-xl">{icon}</span>
        <h3 className="font-semibold" style={{ color: '#1A1A2E' }}>{title}</h3>
      </div>
      <div className="p-4 space-y-2 text-sm" style={{ color: 'rgba(26,26,46,0.7)' }}>{children}</div>
    </div>
  )
}

function InfoRow({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="flex items-start justify-between gap-2 py-1.5" style={{ borderBottom: '1px solid rgba(0,119,182,0.05)' }}>
      <span className="flex-shrink-0" style={{ color: 'rgba(26,26,46,0.5)' }}>{label}</span>
      <div className="flex items-center gap-2 text-right">
        <span className="font-semibold" style={{ color: '#1A1A2E' }}>{value}</span>
        {badge && (
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
            style={{ background: 'rgba(0,119,182,0.08)', color: '#0077B6' }}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}

export default function InfoPage() {
  return (
    <div>
      <header
        className="relative overflow-hidden px-4 py-4 sticky top-0 z-40"
        style={{ background: 'linear-gradient(135deg, #0077B6 0%, #0096C7 100%)' }}
      >
        <WaveBackground />
        <div className="relative">
          <h1 className="font-display text-2xl font-semibold text-white">ℹ️ Infos pratiques</h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Tout ce qu'il faut savoir</p>
        </div>
      </header>

      <div className="p-4 pb-6 space-y-4">

        <Section icon="🚂" title="Transport">
          <InfoRow label="Menton → Monaco" value="20 min" badge="~1.60€" />
          <InfoRow label="Menton → Nice" value="40 min" badge="~5€" />
          <InfoRow label="Menton → Ventimiglia" value="10 min" badge="~3€" />
          <InfoRow label="Bus 100 (côtier)" value="Nice ↔ Menton" badge="5.50€" />
          <p className="text-xs text-gray-400 pt-1">TER Marseille-Vintimille · Billet en machine ou appli SNCF</p>
        </Section>

        <Section icon="🏥" title="Urgences">
          <div className="grid grid-cols-2 gap-2 mb-2">
            {[
              { label: 'SAMU', num: '15' },
              { label: 'Pompiers', num: '18' },
              { label: 'Police', num: '17' },
              { label: 'Universel', num: '112' },
            ].map(e => (
              <div key={e.num} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'rgba(231,111,81,0.08)', border: '1px solid rgba(231,111,81,0.15)' }}>
                <span className="text-xs" style={{ color: 'rgba(26,26,46,0.6)' }}>{e.label}</span>
                <span className="font-bold text-xl" style={{ color: '#E76F51' }}>{e.num}</span>
              </div>
            ))}
          </div>
          <InfoRow label="Hôpital Menton" value="Urgences 24h/24" />
          <p className="text-xs text-gray-400">Rue Antoine Péglion, Menton</p>
        </Section>

        <Section icon="👶" title="Infos bébé">
          <p className="text-gray-600 font-medium mb-2">Plages recommandées :</p>
          <div className="space-y-1 mb-3">
            {[
              '🏖️ Plage des Sablettes — eaux très calmes',
              '🏝️ Plage de Garavan — peu profonde',
              '🐠 Plage des Fossettes — atmosphère zen',
            ].map(p => (
              <div key={p} className="text-sm text-gray-700">{p}</div>
            ))}
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(244,211,63,0.12)', border: '1px solid rgba(244,211,63,0.3)' }}>
            <p className="text-xs font-semibold" style={{ color: '#7a5c00' }}>⚠️ Éviter 12h–16h (heures les plus chaudes)</p>
            <p className="text-xs mt-1" style={{ color: '#7a5c00' }}>Crème solaire indice 50+ obligatoire pour bébé</p>
          </div>
        </Section>

        <Section icon="🌡️" title="Météo juillet">
          <InfoRow label="Température jour" value="28–32°C" />
          <InfoRow label="Température nuit" value="22–24°C" />
          <InfoRow label="Mer" value="24–26°C" />
          <InfoRow label="Ensoleillement" value="~10h/jour" />
          <p className="text-xs text-gray-400 pt-1">Menton est la ville la plus ensoleillée de France 🌞</p>
        </Section>

        <Section icon="📶" title="Pratique">
          <InfoRow label="WiFi logement" value="Voir app location" />
          <InfoRow label="Supermarché" value="Carrefour Market, Intermarché" />
          <InfoRow label="Ouverture dimanche" value="Matin (jusqu'à 13h)" />
          <InfoRow label="Pharmacies" value="Plusieurs en centre-ville" />
          <InfoRow label="Distributeurs" value="Centre-ville & gare" />
        </Section>

        <Section icon="💰" title="Budget indicatif">
          <InfoRow label="Train Monaco A/R" value="~3.20€/pers" />
          <InfoRow label="Train Nice A/R" value="~10€/pers" />
          <InfoRow label="Plage privée" value="30–50€/transat/j" />
          <InfoRow label="Musée Cocteau" value="~10€/pers" />
          <InfoRow label="Apéro terrasse" value="15–25€/pers" />
          <InfoRow label="Déjeuner resto" value="15–30€/pers" />
          <InfoRow label="Gelato Ventimiglia" value="2–3€" />
        </Section>

      </div>
    </div>
  )
}
