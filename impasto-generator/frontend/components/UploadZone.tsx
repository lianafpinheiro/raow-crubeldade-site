'use client'

import { useCallback, useState } from 'react'

interface Props {
  onUpload: (file: File) => void
  disabled?: boolean
}

export default function UploadZone({ onUpload, disabled }: Props) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      onUpload(file)
    },
    [onUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [disabled, handleFile],
  )

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      className={[
        'relative border-2 border-dashed rounded-xl p-20 text-center transition-all',
        isDragging
          ? 'border-amber-400 bg-amber-400/5'
          : 'border-stone-800 hover:border-stone-600',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="pointer-events-none space-y-3">
        <div className="text-3xl text-stone-600">↑</div>
        <p className="text-stone-300 text-base">Drop your reference image here</p>
        <p className="text-stone-600 text-sm">PNG · JPG · WebP · max 10 MB</p>
      </div>
    </div>
  )
}
