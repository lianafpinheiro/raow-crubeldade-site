export interface VariantMetadata {
  variation: string
  seed: number
  palette: string
  resolution: string
  crop: string
  lighting: string
  surface: string
}

export interface VariantResult {
  full: string
  crop: string
  metadata: VariantMetadata
  error?: string
}

export interface Job {
  id: string
  status: 'queued' | 'analyzing' | 'generating' | 'completed' | 'failed'
  input_path: string
  variants: {
    A1?: VariantResult
    A2?: VariantResult
    A3?: VariantResult
  }
  error?: string
  created_at: string
}

export async function uploadImage(
  file: File,
  apiUrl: string,
): Promise<{ job_id: string; status: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${apiUrl}/api/upload`, { method: 'POST', body: formData })
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`)
  return res.json()
}

export async function getJobStatus(jobId: string, apiUrl: string): Promise<Job> {
  const res = await fetch(`${apiUrl}/api/job/${jobId}`)
  if (!res.ok) throw new Error('Job not found')
  return res.json()
}

export function getZipUrl(jobId: string, apiUrl: string): string {
  return `${apiUrl}/api/job/${jobId}/download`
}
