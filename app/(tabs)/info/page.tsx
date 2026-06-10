import { PageHeader } from '@/components/layout/PageHeader'

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-4 space-y-2 text-sm text-gray-700">{children}</div>
    </div>
  )
}

function InfoRow({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="flex items-start justify-between gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <div className="flex items-center gap-2 text-right">
        <span className="font-medium text-gray-900">{value}</span>
        {badge && (
          <span className="text-xs bg-azure-100 text-azure-700 px-1.5 py-0.5 rounded-full flex-shrink-0">{badge}</span>
        )}
      </div>
    </div>
  )
}

export default function InfoPage() {
  return (
    <div>
      <PageHeader title="ℹ️ Infos pratiques" subtitle="Tout ce qu'il faut savoir" />

      <div className="p-4 space-y-4">

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
              <div key={e.num} className="flex items-center justify-between bg-red-50 rounded-xl px-3 py-2 border border-red-100">
                <span className="text-xs text-gray-600">{e.label}</span>
                <span className="font-bold text-red-600 text-xl">{e.num}</span>
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
          <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
            <p className="text-xs text-yellow-800 font-medium">⚠️ Éviter 12h–16h (heures les plus chaudes)</p>
            <p className="text-xs text-yellow-700 mt-1">Crème solaire indice 50+ obligatoire pour bébé</p>
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
