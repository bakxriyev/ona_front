"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Shield } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CardSkeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl } from "../../lib/config"
import type { Insurance } from "@/lib/types"

export default function InsurancePage() {
  const { language, t } = useLanguage()
  const [insurances, setInsurances] = useState<Insurance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .getInsurances()
      .then((data) => {
        setInsurances(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0d7377] to-[#0a5a5d] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("Sug'urta", "Страхование")}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {t(
              "Bizning klinikamiz turli sug'urta kompaniyalari bilan hamkorlik qiladi",
              "Наша клиника сотрудничает с различными страховыми компаниями",
            )}
          </p>
        </div>
      </div>

      {/* Insurance Cards */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : insurances.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insurances.map((insurance, index) => (
              <article
                key={insurance.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {insurance.photo && (
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={getImageUrl("insurance", insurance.photo) || "/placeholder.svg"}
                      alt={language === "ru" ? insurance.title_ru : insurance.title}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {language === "ru" ? insurance.title_ru : insurance.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {language === "ru" ? insurance.description_ru : insurance.description}
                  </p>
                  <Link
                    href={`/insurance/${insurance.id}`}
                    className="inline-flex items-center gap-2 bg-[#0d7377] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#0a5a5d] transition-colors"
                  >
                    {t("Batafsil", "Подробнее")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">
              {t("Sug'urta ma'lumotlari topilmadi", "Информация о страховании не найдена")}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-[#0d7377] to-[#0a5a5d] rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("Sug'urta bo'yicha savollaringiz bormi?", "Есть вопросы по страхованию?")}
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            {t(
              "Biz bilan bog'laning va mutaxassislarimiz barcha savollaringizga javob berishadi",
              "Свяжитесь с нами, и наши специалисты ответят на все ваши вопросы",
            )}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#0d7377] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            {t("Bog'lanish", "Связаться")}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
