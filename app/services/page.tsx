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
import type { Service } from "@/lib/types"

export default function ServicesPage() {
  const { language, t } = useLanguage()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .getServices()
      .then((data) => {
        setServices(data)
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("Xizmatlar", "Услуги")}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {t("Yuqori sifatli va zamonaviy tibbiy xizmatlar", "Высококачественные и современные медицинские услуги")}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <article
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                {service.photo && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getImageUrl("services", service.photo) || "/placeholder.svg"}
                      alt={language === "ru" ? service.title_ru : service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {language === "ru" ? service.title_ru : service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {language === "ru" ? service.description_ru : service.description}
                  </p>
                  <Link
                    href={`/services/${service.id}`}
                    className="inline-flex items-center gap-2 bg-[#d32f2f] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#b71c1c] transition-colors"
                  >
                    {t("Batafsil", "Подробнее")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-[#d32f2f] rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("Qabulga yozilish", "Записаться на прием")}
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            {t(
              "Bizning mutaxassislarimiz sizga professional tibbiy yordam ko'rsatishga tayyor",
              "Наши специалисты готовы оказать вам профессиональную медицинскую помощь",
            )}
          </p>
          <Link
            href="/appointment"
            className="inline-block bg-white text-[#d32f2f] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            {t("Qabulga yozilish", "Записаться на прием")}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
