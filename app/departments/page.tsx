"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CardSkeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl } from "../../lib/config"
import type { Direction } from "@/lib/types"

export default function DepartmentsPage() {
  const { language, t } = useLanguage()
  const [directions, setDirections] = useState<Direction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .getDirections()
      .then((data) => {
        setDirections(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e4a8d] to-[#0f2a4a] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("Bo'limlar", "Отделения")}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {t(
              "Premium tibbiyot va ilg'or texnologiyalar — barchasi bir joyda.",
              "Премиальная медицина и передовые технологии — всё в одном месте.",
            )}
          </p>
        </div>
      </div>

      {/* Departments Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {directions.map((direction, index) => (
              <article
                key={direction.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={getImageUrl("direction", direction.photo) || "/placeholder.svg"}
                    alt={language === "ru" ? direction.title_ru : direction.title}
                    fill
                    className="object-cover"
                  />
                  {/* Gradient overlay with text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d7377]/90 via-[#0d7377]/50 to-transparent flex flex-col justify-end p-5">
                    <h3 className="text-white font-bold text-lg mb-1">
                      {language === "ru" ? direction.title_ru : direction.title}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {language === "ru" ? direction.description_ru : direction.description}
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <Link
                    href={`/departments/${direction.id}`}
                    className="inline-flex items-center gap-2 bg-[#d32f2f] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#b71c1c] transition-colors"
                  >
                    {t("Batafsil", "Подробнее")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
