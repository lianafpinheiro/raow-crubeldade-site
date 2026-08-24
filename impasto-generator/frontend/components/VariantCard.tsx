import type { VariantResult } from '@/lib/api'

const DESCRIPTIONS: Record<string, string> = {
  A1: 'Architectural Voids — geometric shadows, monochromatic relief',
  A2: 'Organic Relief — curvilinear forms, warm earth palette',
  A3: 'Graphic Contrast — high-contrast planes, metallic accents',
}

interface Props {
  variant: 'A1' | 'A2' | 'A3'
  result: VariantResult
  apiUrl: string
}

export default function VariantCard({ variant, result, apiUrl }: Props) {
  if (result.error) {
    return (
      <div className="border border-red-900/40 rounded-xl p-6 text-center space-y-2">
        <p className="text-amber-400 font-mono text-xs">{variant}</p>
        <p className="text-red-400 text-xs">{result.error}</p>
      </div>
    )
  }

  const fullUrl = `${apiUrl}/${result.full}`
  const cropUrl = `${apiUrl}/${result.crop}`

  return (
    <div className="space-y-3">
      <div>
        <span className="text-amber-400 font-mono text-xs font-bold">{variant}</span>
        <p className="text-stone-500 text-xs mt-0.5">{DESCRIPTIONS[variant]}</p>
      </div>

      {/* Full image */}
      <div className="relative group rounded-lg overflow-hidden bg-stone-900">
        <img src={fullUrl} alt={`${variant} full`} className="w-full aspect-square object-cover" />
        <a
          href={fullUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-2 right-2 bg-black/80 text-amber-400 text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ↗ Open full
        </a>
      </div>

      {/* Crop + metadata row */}
      <div className="flex gap-3">
        <div className="relative group w-20 h-20 shrink-0 rounded overflow-hidden bg-stone-900">
          <img src={cropUrl} alt={`${variant} crop`} className="w-full h-full object-cover" />
          <a
            href={cropUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/60 text-amber-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            1:1
          </a>
        </div>
        <dl className="text-xs space-y-1 pt-0.5">
          <div className="flex gap-2">
            <dt className="text-stone-600 w-14 shrink-0">seed</dt>
            <dd className="text-stone-400 font-mono">{result.metadata.seed}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-stone-600 w-14 shrink-0">res</dt>
            <dd className="text-stone-400 font-mono">{result.metadata.resolution}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-stone-600 w-14 shrink-0">crop</dt>
            <dd className="text-stone-400 font-mono">{result.metadata.crop}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-stone-600 w-14 shrink-0">surface</dt>
            <dd className="text-stone-400 font-mono">{result.metadata.surface}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
