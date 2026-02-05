import { config } from "./config"
import type {
  Doctor,
  Direction,
  NewsItem,
  BlogPost,
  Insurance,
  Career,
  Service,
  About,
  Resume,
  DirectionDoctor,
  FAQ,
  Stat,
  Feature,
  QuickAction,
  Slider,
} from "./types"

// Generic fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${config.apiUrl}${endpoint}`

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    })

   
    return res.json()
  } catch (error) {
    console.error(`[API Error] Failed to fetch ${url}:`, error)
    throw error
  }
}

// Generic POST wrapper
async function postAPI<T>(endpoint: string, data: FormData | object): Promise<T> {
  const url = `${config.apiUrl}${endpoint}`
  const isFormData = data instanceof FormData

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: isFormData
        ? {}
        : {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
      body: isFormData ? data : JSON.stringify(data),
    })

    if (!res.ok) {
      console.error(`[API Error] POST ${res.status} - ${url}`)
      throw new Error(`API error: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error(`[API Error] Failed to POST ${url}:`, error)
    throw error
  }
}

// ============================================================
// CENTRALIZED API - Barcha backenddan keladigan ma'lumotlar
// ============================================================
export const api = {
  // ========== DOCTORS (Shifokorlar) ==========
  getDoctors: () => fetchAPI<Doctor[]>("/doctor"),
  getDoctor: (id: number) => fetchAPI<Doctor>(`/doctor/${id}`),

  // ========== DIRECTIONS (Bo'limlar) ==========
  getDirections: () => fetchAPI<Direction[]>("/direction"),
  getDirection: (id: number) => fetchAPI<Direction>(`/direction/${id}`),

  // ========== DIRECTION-DOCTORS (Bo'lim-Shifokor aloqasi) ==========
  getDirectionDoctors: () => fetchAPI<DirectionDoctor[]>("/direction-doctors"),

  // ========== NEWS (Yangiliklar) ==========
  getNews: () => fetchAPI<NewsItem[]>("/news"),
  getNewsItem: (id: number) => fetchAPI<NewsItem>(`/news/${id}`),

  // ========== BLOG (Maqolalar) ==========
  getBlogPosts: () => fetchAPI<BlogPost[]>("/blog"),
  getBlogPost: (id: number) => fetchAPI<BlogPost>(`/blog/${id}`),

  // ========== INSURANCE (Sug'urta) ==========
  getInsurances: () => fetchAPI<Insurance[]>("/insurance"),
  getInsurance: (id: number) => fetchAPI<Insurance>(`/insurance/${id}`),

  // ========== CAREER (Karyera/Vakansiyalar) ==========
  getCareers: () => fetchAPI<Career[]>("/career"),
  getCareer: (id: number) => fetchAPI<Career>(`/career/${id}`),

  // ========== SERVICES (Xizmatlar) ==========
  getServices: () => fetchAPI<Service[]>("/services"),
  getService: (id: number) => fetchAPI<Service>(`/services/${id}`),

  // ========== ABOUT (Klinika haqida, sozlamalar) ==========
  getAbout: () => fetchAPI<About[]>("/about"),
  getAboutItem: (id: number) => fetchAPI<About>(`/about/${id}`),

  // ========== FAQ (Ko'p so'raladigan savollar) ==========

  // ========== STATS (Statistika) ==========
  getStats: () => fetchAPI<Stat[]>("/stats"),

  // ========== FEATURES (Xususiyatlar) ==========
  getFeatures: () => fetchAPI<Feature[]>("/features"),

  // ========== QUICK ACTIONS (Tezkor havolalar) ==========
  getQuickActions: () => fetchAPI<QuickAction[]>("/quick-actions"),

  // ========== SLIDER ==========
  getSliders: () => fetchAPI<Slider[]>("/slider"),
 

  // ========== RESUME (Rezyume yuborish) ==========
submitResume: (data: FormData) => postAPI<Resume>("/resume", data),

 post: <T = any>(endpoint: string, data: FormData | object) => postAPI<T>(endpoint, data),
}

export default api
