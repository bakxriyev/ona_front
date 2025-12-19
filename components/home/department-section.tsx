"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building2 } from "lucide-react"
import { CardSkeleton } from "../../components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"
import { getImageUrl } from "../../lib/config"
import type { Direction } from "../../lib/types"

interface DepartmentsSectionProps {
  departments: Direction[]
  isLoading?: boolean
}

export function DepartmentsSection({ departments, isLoading }: DepartmentsSectionProps) {
  const { language, t } = useLanguage()

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-[#0d7377] mb-10 text-center md:text-left">
        {t("Bo'limlar", "Отделения")}
      </h2>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">{t("Bo'limlar topilmadi", "Отделения не найдены")}</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.slice(0, 6).map((dept, index) => (
              <Link
                key={dept.id}
                href={`/departments/${dept.id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="relative h-52 overflow-hidden rounded-t-3xl">
                  <Image
                    src={getImageUrl("direction", dept.photo) || "/placeholder.svg"}
                    alt={language === "ru" ? dept.title_ru || dept.title : dept.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  {/* Title on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-bold text-white text-xl leading-tight">
                      {language === "ru" ? dept.title_ru || dept.title : dept.title}
                    </h3>
                    <p className="text-white/80 text-sm mt-1 line-clamp-2">
                      {language === "ru" ? dept.description_ru || dept.description : dept.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-4">
                  <span className="inline-flex items-center gap-2 bg-[#c41e3a] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#a01830] transition-colors">
                    {t("Batafsil", "Подробнее")} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex justify-start">
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 bg-[#c41e3a] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#a01830] transition-colors text-base"
            >
              {t("Barcha bo'limlar", "Все отделения")}
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
