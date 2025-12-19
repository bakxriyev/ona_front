"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DoctorCardSkeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl } from "@/lib/config"
import type { Doctor, Direction, DirectionDoctor } from "@/lib/types"

export default function DoctorsPage() {
  const { language, t } = useLanguage()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [directions, setDirections] = useState<Direction[]>([])
  const [directionDoctors, setDirectionDoctors] = useState<DirectionDoctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDirection, setSelectedDirection] = useState("all")

  useEffect(() => {
    Promise.all([
      api.getDoctors().catch(() => []),
      api.getDirections().catch(() => []),
      api.getDirectionDoctors().catch(() => []),
    ]).then(([doctorsData, directionsData, directionDoctorsData]) => {
      console.log("[v0] Doctors:", doctorsData)
      console.log("[v0] Directions:", directionsData)
      console.log("[v0] DirectionDoctors:", directionDoctorsData)
      setDoctors(doctorsData)
      setDirections(directionsData)
      setDirectionDoctors(directionDoctorsData)
      setIsLoading(false)
    })
  }, [])

  const getDoctorDirection = (doctorId: number): Direction | undefined => {
    const relation = directionDoctors.find((dd) => Number(dd.doctors_id) === doctorId)
    if (!relation) return undefined

    // If direction is embedded in the relation, use it
    if (relation.direction) return relation.direction as Direction

    // Otherwise find direction by direction_id
    return directions.find((d) => Number(d.id) === Number(relation.direction_id))
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.first_name} ${doctor.last_name}`.toLowerCase()
    const specialization = language === "ru" ? doctor.specialization_ru : doctor.specialization
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) || specialization?.toLowerCase().includes(searchQuery.toLowerCase())

    // If "all" is selected, just check search
    if (selectedDirection === "all") {
      return matchesSearch
    }

    // Filter by direction: find relation where doctors_id matches doctor.id
    // and direction_id matches selectedDirection
    const hasMatchingDirection = directionDoctors.some((dd) => {
      const doctorIdMatch = Number(dd.doctors_id) === Number(doctor.id)
      const directionIdMatch = Number(dd.direction_id) === Number(selectedDirection)
      console.log(
        `[v0] Checking doctor ${doctor.id}: dd.doctors_id=${dd.doctors_id}, dd.direction_id=${dd.direction_id}, selected=${selectedDirection}, match=${doctorIdMatch && directionIdMatch}`,
      )
      return doctorIdMatch && directionIdMatch
    })

    return matchesSearch && hasMatchingDirection
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-8">
        {/* Header */}
        <div className="bg-white py-8 mb-8">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">{t("SHIFOKORLAR", "ВРАЧИ")}</h1>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("Shifokor qidiring...", "Поиск врача...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e4a8d]"
                />
              </div>

              <select
                value={selectedDirection}
                onChange={(e) => {
                  console.log("[v0] Selected direction:", e.target.value)
                  setSelectedDirection(e.target.value)
                }}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e4a8d] bg-white"
              >
                <option value="all">{t("Barcha bo'limlar", "Все отделения")}</option>
                {directions.map((dir) => (
                  <option key={dir.id} value={String(dir.id)}>
                    {language === "ru" ? dir.title_ru : dir.title}
                  </option>
                ))}
              </select>

              <button className="bg-[#d32f2f] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#b71c1c] transition-colors">
                {t("Qidirish", "Поиск")}
              </button>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <DoctorCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredDoctors.map((doctor, index) => {
                const direction = getDoctorDirection(doctor.id)
                return (
                  <Link
                    key={doctor.id}
                    href={`/doctors/${doctor.id}`}
                    className="bg-white rounded-3xl p-8 border border-gray-100 text-center hover:shadow-2xl transition-all hover:-translate-y-2 animate-fade-in-up"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="relative mx-auto w-72 h-72 mb-6">
                      {/* Light blue circular background */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 overflow-hidden">
                        {/* Hexagon pattern overlay */}
                        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 300 300">
                          <defs>
                            <pattern
                              id={`hexPattern-${doctor.id}`}
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
                          <rect width="300" height="300" fill={`url(#hexPattern-${doctor.id})`} />
                        </svg>
                      </div>
                      {/* Doctor image */}
                      <div className="relative w-full h-full flex items-end justify-center overflow-hidden rounded-full">
                        <Image
                          src={
                            getImageUrl("doctor", doctor.photo) ||
                            "/placeholder.svg?height=280&width=280&query=doctor portrait" ||
                            "/placeholder.svg"
                          }
                          alt={`${doctor.first_name} ${doctor.last_name}`}
                          width={280}
                          height={280}
                          className="object-contain object-bottom max-h-full"
                        />
                      </div>
                    </div>

                    <h3 className="font-bold text-xl text-gray-900 mb-2">
                      {doctor.first_name} {doctor.last_name}
                    </h3>
                    <p className="text-base text-[#d32f2f] mb-2">
                      {language === "ru" ? doctor.specialization_ru : doctor.specialization}
                    </p>
                    {direction && (
                      <p className="text-sm text-gray-500">
                        {language === "ru" ? direction.title_ru : direction.title}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>
          )}

          {!isLoading && filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t("Shifokor topilmadi", "Врач не найден")}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
