"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl, getVideoUrl } from "@/lib/config"
import type { Direction, Doctor, DirectionDoctor } from "@/lib/types"

export default function DepartmentDetailPage() {
  const { language, t } = useLanguage()
  const params = useParams()
  const [direction, setDirection] = useState<Direction | null>(null)
  const [departmentDoctors, setDepartmentDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      Promise.all([api.getDirection(Number(params.id)), api.getDirectionDoctors().catch(() => [])])
        .then(([directionData, directionDoctorsData]) => {
          setDirection(directionData)

          // Filter doctors that belong to this direction
          const doctorsInDepartment = directionDoctorsData
            .filter((dd: DirectionDoctor) => String(dd.direction_id) === String(params.id))
            .map((dd: DirectionDoctor) => dd.doctor)
            .filter(Boolean) as Doctor[]

          setDepartmentDoctors(doctorsInDepartment)
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-96 w-full rounded-2xl mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!direction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("Bo'lim topilmadi", "Отделение не найдено")}</h1>
          <Link href="/departments" className="text-[#d32f2f] hover:underline">
            {t("Bo'limlarga qaytish", "Вернуться к отделениям")}
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const videoUrl = getVideoUrl("direction", direction.video)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="relative h-[300px]">
        <Image
          src={
            getImageUrl("direction", direction.photo) ||
            "/placeholder.svg?height=300&width=1200&query=medical department"
          }
          alt={language === "ru" ? direction.title_ru : direction.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d7377]/90 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {t("Barcha bo'limlar", "Все отделения")}
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {language === "ru" ? direction.title_ru : direction.title}
            </h1>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Description */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-[#1e4a8d] mb-4">{t("Bo'lim haqida", "Об отделении")}</h2>
          <p className="text-gray-600 leading-relaxed">
            {language === "ru" ? direction.description_ru : direction.description}
          </p>
        </div>

        {/* Video */}
        {videoUrl && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-[#1e4a8d] mb-4">{t("Video", "Видео")}</h2>
            <video src={videoUrl} controls className="w-full rounded-xl max-h-[400px]" />
          </div>
        )}

        {departmentDoctors.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#1e4a8d] mb-6">{t("Bo'lim shifokorlari", "Врачи отделения")}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departmentDoctors.map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/doctors/${doctor.id}`}
                  className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  {/* Doctor image with background */}
                  <div className="relative mx-auto w-48 h-48 mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 overflow-hidden">
                      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 200">
                        <defs>
                          <pattern
                            id={`hexPatternDept-${doctor.id}`}
                            width="20"
                            height="17"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M10 0L20 5.77V17.32L10 23.09L0 17.32V5.77Z"
                              fill="none"
                              stroke="#0ea5e9"
                              strokeWidth="0.5"
                              opacity="0.6"
                            />
                          </pattern>
                        </defs>
                        <rect width="200" height="200" fill={`url(#hexPatternDept-${doctor.id})`} />
                      </svg>
                    </div>
                    <div className="relative w-full h-full flex items-end justify-center overflow-hidden rounded-full">
                      <Image
                        src={
                          getImageUrl("doctor", doctor.photo) || "/placeholder.svg?height=180&width=180&query=doctor"
                        }
                        alt={`${doctor.first_name} ${doctor.last_name}`}
                        width={180}
                        height={180}
                        className="object-contain object-bottom max-h-full"
                      />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {doctor.first_name} {doctor.last_name}
                  </h3>
                  <p className="text-sm text-[#d32f2f]">
                    {language === "ru" ? doctor.specialization_ru : doctor.specialization}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {/* <div className="bg-[#d32f2f] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {t("Ushbu bo'limga qabulga yozilish", "Записаться в это отделение")}
          </h2>
          <p className="text-white/90 mb-6">
            {t(
              "Bizning mutaxassislarimiz sizga professional tibbiy yordam ko'rsatishga tayyor",
              "Наши специалисты готовы оказать вам профессиональную медицинскую помощь",
            )}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#d32f2f] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            {t("Qabulga yozilish", "Записаться на прием")} <ArrowRight className="w-5 h-5" />
          </Link>
        </div> */}
      </main>

      <Footer />
    </div>
  )
}
