"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Facebook, Instagram, Send, Youtube } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl, getVideoUrl } from "@/lib/config"
import type { Service } from "@/lib/types"

export default function ServiceDetailPage() {
  const { language, t } = useLanguage()
  const params = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      api
        .getService(Number(params.id))
        .then((serviceData) => {
          setService(serviceData)
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    }
  }, [params.id])

  const scrollToContent = () => {
    document.getElementById("service-content")?.scrollIntoView({ behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <div className="bg-gray-100 py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <Skeleton className="h-16 w-2/3 mb-4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row gap-12">
              <Skeleton className="w-[500px] h-[600px] rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-40 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("Xizmat topilmadi", "Услуга не найдена")}</h1>
          <Link href="/services" className="text-[#d32f2f] hover:underline">
            {t("Xizmatlarga qaytish", "Вернуться к услугам")}
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const videoUrl = getVideoUrl("services", service.video)

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#5a7a9a] to-[#3d5a7a] pt-12 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light italic text-white mb-6">
              {t("Bizning xizmatlarimiz", "Наши услуги")}
            </h1>
            <p className="text-white/80 max-w-2xl text-lg leading-relaxed">
              {t(
                "Akfa Medline yuqori sifatli va zamonaviy tibbiy xizmatlar ko'rsatadi.",
                "Akfa Medline предоставляет высококачественные и современные медицинские услуги.",
              )}
            </p>
          </div>
        </section>

        {/* Navigation bar with social icons */}
        <section className="bg-white py-6 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={scrollToContent}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              {t("Pastga aylantiring", "Прокрутите вниз")}
              <ChevronDown className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Service content section */}
        <section id="service-content" className="bg-white rounded-t-[40px] -mt-4 relative z-10 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              {/* Service Image - circular design like doctor page */}
              <div className="relative flex-shrink-0 mx-auto lg:mx-0">
                {/* Circular background with gradient */}
                <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden bg-gradient-to-br from-red-50 via-pink-50 to-rose-100">
                  {/* Hexagon pattern overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 500 500">
                    <defs>
                      <pattern id="hexPatternService" width="40" height="35" patternUnits="userSpaceOnUse">
                        <path
                          d="M20 0L40 11.55V34.64L20 46.19L0 34.64V11.55Z"
                          fill="none"
                          stroke="#d32f2f"
                          strokeWidth="0.8"
                          opacity="0.6"
                        />
                      </pattern>
                    </defs>
                    <rect width="500" height="500" fill="url(#hexPatternService)" />
                  </svg>

                  {/* Service image */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="relative w-full h-full">
                      <Image
                        src={
                          getImageUrl("services", service.photo) ||
                          "/placeholder.svg?height=500&width=500&query=medical service" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={language === "ru" ? service.title_ru : service.title}
                        fill
                        className="object-cover rounded-full"
                        priority
                      />
                    </div>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-100/50 to-transparent"></div>
                </div>
              </div>

              {/* Service Information */}
              <div className="flex-1 lg:pt-16">
                {/* Full Name */}
                {service.full_name && (
                  <p className="text-lg text-gray-500 mb-2 font-medium">
                    {language === "ru" ? service.full_name_ru : service.full_name}
                  </p>
                )}

                {/* Title */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {language === "ru" ? service.title_ru : service.title}
                </h2>

                {/* Description */}
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  {language === "ru" ? service.description_ru : service.description}
                </p>

                {/* About Section */}
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("Xizmat haqida", "Об услуге")}</h3>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="whitespace-pre-line">{language === "ru" ? service.about_ru : service.about}</p>
                  </div>
                </div>

                {/* Video */}
                {videoUrl && (
                  <div className="mt-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-5">{t("Video", "Видео")}</h3>
                    <video src={videoUrl} controls className="w-full rounded-3xl max-h-[400px]" />
                  </div>
                )}

                {/* CTA Button */}
                <div className="mt-10">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-[#d32f2f] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#b71c1c] transition-colors text-lg shadow-lg hover:shadow-xl"
                  >
                    {t("Qabulga yozilish", "Записаться на прием")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional CTA Section */}
        <section className="bg-gradient-to-r from-[#1e4a8d] to-[#0f2a4a] py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("Savollaringiz bormi?", "Есть вопросы?")}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              {t(
                "Bizning mutaxassislarimiz sizga barcha savollaringizga javob berishga tayyor",
                "Наши специалисты готовы ответить на все ваши вопросы",
              )}
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-[#1e4a8d] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              {t("Bog'lanish", "Связаться")}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
