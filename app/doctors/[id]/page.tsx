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
import type { Doctor, Direction, DirectionDoctor } from "@/lib/types"

export default function DoctorDetailPage() {
  const { language, t } = useLanguage()
  const params = useParams()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [doctorDirection, setDoctorDirection] = useState<Direction | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      Promise.all([api.getDoctor(Number(params.id)), api.getDirectionDoctors().catch(() => [])])
        .then(([doctorData, directionDoctorsData]) => {
          setDoctor(doctorData)

          const relation = directionDoctorsData.find(
            (dd: DirectionDoctor) => String(dd.doctors_id) === String(params.id),
          )
          if (relation?.direction) {
            setDoctorDirection(relation.direction as Direction)
          }

          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    }
  }, [params.id])

  const scrollToContent = () => {
    document.getElementById("doctor-content")?.scrollIntoView({ behavior: "smooth" })
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

  if (!doctor) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("Shifokor topilmadi", "Врач не найден")}</h1>
          <Link href="/doctors" className="text-[#d32f2f] hover:underline">
            {t("Shifokorlarga qaytish", "Вернуться к врачам")}
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const videoUrl = getVideoUrl("doctor", doctor.video)

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <section className="bg-gradient-to-r from-[#5a7a9a] to-[#3d5a7a] pt-12 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light italic text-white mb-6">
              {t("Bizning shifokorlarimiz", "Наши врачи")}
            </h1>
            <p className="text-white/80 max-w-2xl text-lg leading-relaxed">
              {t(
                "Akfa Medline shifokorlari har bir bemorga ishonchli va g'amxo'rlik qiluvchi yuqori malakali mutaxassislardir.",
                "Врачи Akfa Medline - высококвалифицированные специалисты, заботящиеся о каждом пациенте.",
              )}
            </p>
          </div>
        </section>

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

        {/* Doctor content section */}
        <section id="doctor-content" className="bg-white rounded-t-[40px] -mt-4 relative z-10 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              <div className="relative flex-shrink-0 mx-auto lg:mx-0">
                {/* Light blue circular background - larger size */}
                <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden bg-gradient-to-br from-sky-100 via-sky-50 to-cyan-100">
                  {/* Hexagon pattern overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 500 500">
                    <defs>
                      <pattern id="hexPatternDoc" width="40" height="35" patternUnits="userSpaceOnUse">
                        <path
                          d="M20 0L40 11.55V34.64L20 46.19L0 34.64V11.55Z"
                          fill="none"
                          stroke="#0ea5e9"
                          strokeWidth="0.8"
                          opacity="0.6"
                        />
                      </pattern>
                    </defs>
                    <rect width="500" height="500" fill="url(#hexPatternDoc)" />
                  </svg>

                  {/* Doctor photo container - positioned to show from top */}
                  <div className="absolute inset-0 flex items-end justify-center">
                    <div className="relative w-[85%] h-[95%]">
                      <Image
                        src={
                          getImageUrl("doctor", doctor.photo) ||
                          "/placeholder.svg?height=500&width=400&query=doctor portrait professional" ||
                          "/placeholder.svg"
                        }
                        alt={`${doctor.first_name} ${doctor.last_name}`}
                        fill
                        className="object-contain object-bottom"
                        priority
                      />
                    </div>
                  </div>

                  {/* Gradient overlay at bottom - fades image into circle background */}
                  <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-sky-100 to-transparent"></div>
                </div>
              </div>

              <div className="flex-1 lg:pt-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {doctor.first_name} {doctor.last_name}
                </h2>
                <p className="text-xl md:text-2xl text-[#1e88e5] mb-10 font-medium">
                  {language === "ru" ? doctor.specialization_ru : doctor.specialization}
                </p>

                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  {/* Ta'lim section */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("Ta'lim", "Образование")}</h3>
                    <ul className="space-y-2 text-gray-700 text-lg">
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-gray-800 mt-2.5 flex-shrink-0"></span>
                        <span>{language === "ru" ? doctor.education_ru : doctor.education}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Tajriba section */}
                  {(doctor.staji || doctor.staji_ru) && (
                    <div className="mb-8 pt-6 border-t border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("Tajriba", "Стаж")}</h3>
                      <p className="text-gray-700 text-lg">{language === "ru" ? doctor.staji_ru : doctor.staji}</p>
                    </div>
                  )}

                  {/* Bo'lim section */}
                  {doctorDirection && (
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("Bo'lim", "Отделение")}</h3>
                      <Link
                        href={`/departments/${doctorDirection.id}`}
                        className="inline-flex items-center gap-2 text-[#1e4a8d] font-semibold text-lg hover:text-[#d32f2f] transition-colors"
                      >
                        {language === "ru" ? doctorDirection.title_ru : doctorDirection.title}
                        <ChevronDown className="w-5 h-5 -rotate-90" />
                      </Link>
                    </div>
                  )}
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
      </main>

      <Footer />
    </div>
  )
}
