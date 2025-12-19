export interface Doctor {
  id: number
  first_name: string
  last_name: string
  age: number
  staji: string
  staji_ru: string
  education: string
  education_ru: string
  specialization: string
  specialization_ru: string
  photo: string | null
  video: string | null
  created_at?: string
}

export interface Direction {
  id: number
  title: string
  title_ru: string
  description: string
  description_ru: string
  photo: string | null
  video: string | null
  created_at?: string
}

export interface NewsItem {
  id: number
  title: string
  title_ru: string
  description: string
  description_ru: string
  matn: string
  matn_ru: string
  photo: string | null
  video: string | null
  gallery: string[]
  date: string
  created_at?: string
}

export interface BlogPost {
  id: number
  title: string
  title_ru: string
  description: string
  description_ru: string
  maqola: string
  maqola_ru: string
  photo: string | null
  video: string | null
  direction_id?: number
  created_at?: string
}

export interface Insurance {
  id: number
  full_name: string
  title: string
  title_ru: string
  description: string
  description_ru: string
  about_insurance: string
  about_insurance_ru: string
  photo: string | null
  video: string | null
  created_at?: string
}

export interface Career {
  id: number
  title: string
  title_ru: string
  description: string
  description_ru: string
  vacancy: string
  vacancy_ru: string
  photo: string | null
  video: string | null
  created_at?: string
}

export interface Service {
  id: number
  full_name: string
  full_name_ru: string
  title: string
  title_ru: string
  description: string
  description_ru: string
  about: string
  about_ru: string
  photo: string | null
  video: string | null
  created_at?: string
}

export interface About {
  id: number
  full_name: string
  title: string
  title_ru: string
  description: string
  description_ru: string
  mission: string
  mission_ru: string
  gmail: string
  manzil: string
  manzil_ru: string
  logo: string | null
  phone: string
  phone2: string
  working_hours: string
  working_hours_ru: string
  working_hours_saturday: string
  working_hours_saturday_ru: string
  working_hours_sunday: string
  working_hours_sunday_ru: string
  facebook: string
  instagram: string
  telegram: string
  youtube: string
  created_at?: string
}

export interface Resume {
  id: number
  full_name: string
  birth_date: string
  phone: string
  email: string
  salary: string
  position: string
  skills: string
  file: string | null
  created_at?: string
}

export interface DirectionDoctor {
  id: number
  doctors_id: number
  direction_id: number
  doctor?: Doctor
  direction?: Direction
}

export interface FAQ {
  id: number
  question: string
  question_ru: string
  answer: string
  answer_ru: string
  created_at?: string
}

export interface Stat {
  id: number
  value: string
  label: string
  label_ru: string
  created_at?: string
}

export interface Feature {
  id: number
  title: string
  title_ru: string
  description: string
  description_ru: string
  icon: string | null
  created_at?: string
}

export interface QuickAction {
  id: number
  title: string
  title_ru: string
  icon: string | null
  link: string
  created_at?: string
}

export interface Slider {
  id: number
  title: string
  title_ru: string
  description: string
  description_ru: string
  photo: string | null
  button_text: string
  button_text_ru: string
  button_link: string
  created_at?: string
}

export type Language = "uz" | "ru"
