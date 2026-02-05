"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl } from "../../lib/config"
import type { About, Stat, Feature } from "@/lib/types"

export default function AboutPage() {
  const { language, t } = useLanguage()
  const [about, setAbout] = useState<About | null>(null)
  const [stats, setStats] = useState<Stat[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.getAbout().catch(() => []),
      api.getStats().catch(() => []),
      api.getFeatures().catch(() => []),
    ]).then(([aboutData, statsData, featuresData]) => {
      if (aboutData && aboutData.length > 0) {
        setAbout(aboutData[0])
      }
      setStats(statsData)
      setFeatures(featuresData)
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="relative h-[400px] bg-gradient-to-r from-[#1e4a8d] to-[#0f2a4a]">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-full"
              style={{ top: `${20 + i * 15}%` }}
            />
          ))}
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            {language === "ru"
              ? about?.title_ru || t("О клинике", "О клинике")
              : about?.title || t("Klinika haqida", "Klinika haqida")}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {t(
              "Markaziy Osiyodagi eng yirik ko'p tarmoqli universitet klinikasi",
              "Крупнейшая многопрофильная университетская клиника в Центральной Азии",
            )}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* About Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-fade-in-up">
            {isLoading ? (
              <Skeleton className="h-80 w-full rounded-2xl" />
            ) : (
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={
                    about?.logo
                      ? getImageUrl("about", about.logo)
                      : "/placeholder.svg?height=400&width=600&query=modern hospital building"
                  }
                  alt="Akfa Medline University Hospital"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl font-bold text-[#1e4a8d] mb-6">{t("Bizning tarix", "Наша история")}</h2>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>{language === "ru" ? about?.description_ru : about?.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats from backend */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className="bg-white rounded-2xl p-8 text-center shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="text-4xl font-bold text-[#d32f2f] mb-2">{stat.value}</div>
                <div className="text-gray-600">{language === "ru" ? stat.label_ru : stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Features from backend */}
        {features.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-[#1e4a8d] mb-8 text-center">{t("Nima uchun biz?", "Почему мы?")}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  {feature.icon && (
                    <div className="w-14 h-14 rounded-full bg-[#0d7377]/10 flex items-center justify-center mb-4">
                      <Image
                        src={getImageUrl("features", feature.icon) || "/placeholder.svg"}
                        alt=""
                        width={28}
                        height={28}
                        className="w-7 h-7"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {language === "ru" ? feature.title_ru : feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {language === "ru" ? feature.description_ru : feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mission */}
        {about?.mission && (
          <div className="bg-gradient-to-r from-[#1e4a8d] to-[#0f2a4a] rounded-2xl p-8 md:p-12 text-white animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-6">{t("Bizning missiyamiz", "Наша миссия")}</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              {language === "ru" ? about.mission_ru : about.mission}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
