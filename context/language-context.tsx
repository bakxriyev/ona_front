"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Language } from "@/lib/types"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (uz: string, ru?: string) => string
  isLoaded: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("uz")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("akfa_language") as Language
    if (saved && (saved === "uz" || saved === "ru")) {
      setLanguage(saved)
    }
    setIsLoaded(true)
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("akfa_language", lang)
  }

  const t = (uz: string, ru?: string) => {
    if (language === "ru" && ru) {
      return ru
    }
    return uz
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      language: "uz" as Language,
      setLanguage: () => {},
      t: (uz: string) => uz,
      isLoaded: false,
    }
  }
  return context
}
