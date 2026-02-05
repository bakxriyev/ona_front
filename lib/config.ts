export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 

export const config = {
  apiUrl: API_BASE_URL,
  uploadsUrl: `${API_BASE_URL}/uploads`,
}

// Helper to get full image URL
export function getImageUrl(model: string, filename: string | null | undefined): string {
  if (!filename) return "/medical-team-collaboration.png"
  if (filename.startsWith("http")) return filename
  return `${config.uploadsUrl}/${model}/${filename}`
}

// Helper to get video URL
export function getVideoUrl(model: string, filename: string | null | undefined): string | null {
  if (!filename) return null
  if (filename.startsWith("http")) return filename
  return `${config.uploadsUrl}/${model}/${filename}`
}
