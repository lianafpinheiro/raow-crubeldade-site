const STEPS = ['queued', 'analyzing', 'generating', 'completed'] as const

const MESSAGES: Record<string, string> = {
  queued: 'Preparing generation pipeline…',
  analyzing: 'Analyzing image palette and composition…',
  generating: 'Generating A1, A2, A3 variants via DALL·E 3…',
  completed: 'Generation complete.',
  failed: 'Generation failed.',
}

export default function JobProgress({ status }: { status: string }) {
  const currentStep = STEPS.indexOf(status as (typeof STEPS)[number])
  const isActive = status !== 'completed' && status !== 'failed'

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        {isActive && (
          <span className="inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        )}
        <p className="text-stone-300 text-sm">{MESSAGES[status] ?? status}</p>
      </div>

      <div className="flex gap-1.5">
        {STEPS.map((step, i) => (
          <div
            key={step}
            className={[
              'h-0.5 w-14 rounded-full transition-all duration-500',
              i <= currentStep ? 'bg-amber-400' : 'bg-stone-800',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}
