"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Users } from "lucide-react"
import { CardSkeleton } from "../../components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"
import { getImageUrl } from "@/lib/config"
import type { Doctor } from "@/lib/types"

interface DoctorsSectionProps {
  doctors: Doctor[]
  isLoading?: boolean
}

export function DoctorsSection({ doctors, isLoading }: DoctorsSectionProps) {
  const { language, t } = useLanguage()

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-[#0d7377] mb-10 text-center md:text-left">
        {t("Shifokorlar", "Врачи")}
      </h2>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">{t("Shifokorlar topilmadi", "Врачи не найдены")}</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {doctors.slice(0, 3).map((doctor, index) => (
              <Link
                key={doctor.id}
                href={`/doctors/${doctor.id}`}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 animate-fade-in-up p-8 border border-gray-100 hover:-translate-y-2"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="relative mx-auto w-72 h-72 mb-6">
                  {/* Light blue circular background with hexagon pattern */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 300 300">
                      <defs>
                        <pattern
                          id={`hex-home-${doctor.id}`}
                          width="30"
                          height="26"
                          patternUnits="userSpaceOnUse"
                          patternTransform="scale(0.8)"
                        >
                          <path
                            d="M15 0L30 8.66V25.98L15 34.64L0 25.98V8.66Z"
                            fill="none"
                            stroke="#0ea5e9"
                            strokeWidth="0.5"
                            opacity="0.6"
                          />
                        </pattern>
                      </defs>
                      <rect width="300" height="300" fill={`url(#hex-home-${doctor.id})`} />
                    </svg>
                  </div>
                  {/* Doctor image - transparent background */}
                  <div className="relative w-full h-full rounded-full overflow-hidden flex items-end justify-center">
                    <Image
                      src={
                        getImageUrl("doctor", doctor.photo) ||
                        "/placeholder.svg?height=280&width=280&query=doctor portrait"
                      }
                      alt={`${doctor.first_name} ${doctor.last_name}`}
                      width={280}
                      height={280}
                      className="object-contain object-bottom max-h-full"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-bold text-gray-900 text-xl mb-2">
                    {doctor.first_name} {doctor.last_name}
                  </h3>
                  <p className="text-base text-[#d32f2f] mb-5">
                    {language === "ru" ? doctor.specialization_ru : doctor.specialization}
                  </p>
                  <span className="inline-flex items-center gap-2 bg-[#c41e3a] text-white px-8 py-3 rounded-full text-base font-semibold hover:bg-[#a01830] transition-colors">
                    {t("Batafsil", "Подробнее")} <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex justify-start">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 bg-[#c41e3a] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#a01830] transition-colors text-lg"
            >
              {t("Barcha shifokorlar", "Все врачи")}
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
