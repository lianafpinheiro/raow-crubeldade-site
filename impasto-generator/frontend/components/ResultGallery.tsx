import type { Job } from '@/lib/api'
import { getZipUrl } from '@/lib/api'
import VariantCard from './VariantCard'

const VARIANTS = ['A1', 'A2', 'A3'] as const

interface Props {
  job: Job
  apiUrl: string
}

export default function ResultGallery({ job, apiUrl }: Props) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-stone-600 font-mono text-xs uppercase tracking-widest">
          Generated Variants
        </p>
        <a
          href={getZipUrl(job.id, apiUrl)}
          className="bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold px-5 py-2.5 rounded transition-colors"
        >
          ↓ Download ZIP
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {VARIANTS.map(
          (v) =>
            job.variants[v] && (
              <VariantCard key={v} variant={v} result={job.variants[v]!} apiUrl={apiUrl} />
            ),
        )}
      </div>
    </div>
  )
}
