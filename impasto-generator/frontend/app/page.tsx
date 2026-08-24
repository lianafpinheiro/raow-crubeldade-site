'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import JobProgress from '@/components/JobProgress'
import ResultGallery from '@/components/ResultGallery'
import UploadZone from '@/components/UploadZone'
import { getJobStatus, Job, uploadImage } from '@/lib/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type Stage = 'idle' | 'uploaded' | 'generating' | 'completed' | 'failed'

export default function Home() {
  const [stage, setStage] = useState<Stage>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleFileSelect = useCallback((file: File) => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    setSelectedFile(file)
    setStage('uploaded')
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!selectedFile) return
    setStage('generating')
    setError(null)
    try {
      const result = await uploadImage(selectedFile, API_URL)
      setJobId(result.job_id)
    } catch {
      setError('Upload failed. Make sure the backend is running on port 8000.')
      setStage('failed')
    }
  }, [selectedFile])

  useEffect(() => {
    if (!jobId || stage === 'completed' || stage === 'failed') return

    const poll = async () => {
      try {
        const j = await getJobStatus(jobId, API_URL)
        setJob(j)
        if (j.status === 'completed') {
          setStage('completed')
          if (pollRef.current) clearInterval(pollRef.current)
        } else if (j.status === 'failed') {
          setError(j.error || 'Generation failed.')
          setStage('failed')
          if (pollRef.current) clearInterval(pollRef.current)
        }
      } catch {}
    }

    poll()
    pollRef.current = setInterval(poll, 2000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [jobId])

  const reset = () => {
    if (pollRef.current) clearInterval(pollRef.current)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setStage('idle')
    setSelectedFile(null)
    setPreviewUrl(null)
    setJobId(null)
    setJob(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-14">
        {/* Header */}
        <header className="text-center space-y-3">
          <p className="text-amber-400 font-mono text-xs tracking-[0.3em] uppercase">
            Material Generator
          </p>
          <h1 className="text-5xl font-thin text-stone-100 tracking-[0.2em] uppercase">
            Impasto OS
          </h1>
          <p className="text-stone-500 text-sm max-w-sm mx-auto leading-relaxed">
            Upload a reference image. Generate A1, A2, and A3 impasto texture systems automatically.
          </p>
        </header>

        {/* Idle: upload zone */}
        {stage === 'idle' && <UploadZone onUpload={handleFileSelect} />}

        {/* Uploaded: preview + generate */}
        {stage === 'uploaded' && previewUrl && (
          <div className="flex flex-col items-center gap-8">
            <div className="space-y-2 text-center">
              <p className="text-stone-600 font-mono text-xs uppercase tracking-widest">Reference</p>
              <img
                src={previewUrl}
                alt="Reference"
                className="w-52 h-52 object-cover rounded-xl ring-1 ring-stone-800 mx-auto"
              />
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={handleGenerate}
                className="bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold px-10 py-3 rounded-lg transition-colors tracking-wide"
              >
                Generate Variants
              </button>
              <button
                onClick={reset}
                className="text-stone-600 hover:text-stone-400 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Generating: progress */}
        {stage === 'generating' && previewUrl && (
          <div className="flex flex-col items-center gap-10">
            <img
              src={previewUrl}
              alt="Reference"
              className="w-36 h-36 object-cover rounded-xl ring-1 ring-stone-800 opacity-50"
            />
            <JobProgress status={job?.status ?? 'queued'} />
          </div>
        )}

        {/* Completed: gallery */}
        {stage === 'completed' && job && previewUrl && (
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <img
                src={previewUrl}
                alt="Reference"
                className="w-14 h-14 object-cover rounded ring-1 ring-stone-800 shrink-0"
              />
              <div className="h-px flex-1 bg-stone-900" />
              <p className="text-stone-700 font-mono text-xs shrink-0">3 variants</p>
            </div>
            <ResultGallery job={job} apiUrl={API_URL} />
          </div>
        )}

        {/* Failed */}
        {stage === 'failed' && (
          <div className="text-center space-y-5 py-16">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={reset}
              className="text-amber-400 hover:text-amber-300 text-sm underline underline-offset-4 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* New generation link */}
        {stage === 'completed' && (
          <div className="text-center">
            <button
              onClick={reset}
              className="text-stone-700 hover:text-stone-500 text-sm transition-colors"
            >
              ← Generate from new image
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
