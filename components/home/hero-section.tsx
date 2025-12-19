"use client"

import Link from "next/link"
import {
  Plus,
  Globe,
  Shield,
  Layers,
  Users,
  Briefcase,
  Activity,
  Heart,
  Stethoscope,
  Syringe,
  Ambulance,
  Hospital,
} from "lucide-react"
import { HeroSkeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"
import { useEffect, useState } from "react"

interface HeroSectionProps {
  isLoading?: boolean
}

const quickActions = [
  { icon: Plus, label: "Qabulga yozilish", label_ru: "Записаться на прием", href: "/appointment" },
  { icon: Globe, label: "Chet elliklar uchun", label_ru: "Для иностранцев", href: "/international" },
  { icon: Shield, label: "Sug'urta", label_ru: "Страховка", href: "/insurance" },
  { icon: Layers, label: "Bo'limlar", label_ru: "Отделения", href: "/departments" },
  { icon: Users, label: "Shifokorlar", label_ru: "Врачи", href: "/doctors" },
  { icon: Briefcase, label: "Bo'sh ish o'rinlari", label_ru: "Вакансии", href: "/career" },
]

const heroContent = {
  uz: {
    title: "Sizga bo'lgan g'amxo'rligimiz —",
    titleSecond: "bizning kasbimiz.",
    subtitle: "Markaziy Osiyodagi eng yirik ko'p tarmoqli universitet klinikasi.",
    buttonPatients: "Biz bilan bog'lanish",
    buttonDoctors: "Shifokorlarimiz haqida",
  },
  ru: {
    title: "Забота о вас —",
    titleSecond: "наша профессия.",
    subtitle: "Крупнейшая многопрофильная университетская клиника в Центральной Азии.",
    buttonPatients: "Связаться с нами",
    buttonDoctors: "О наших врачах",
  },
}

// Hospital ikonlari
const medicalIcons = [Activity, Heart, Stethoscope, Syringe, Ambulance, Hospital]

// Video reel data
const videoReels = [
  { id: 1, thumbnail: "/photo1.jpg", title: "Jarrohlik" },
  { id: 2, thumbnail: "/photo2.jpg", title: "Konsultatsiya" },
  { id: 3, thumbnail: "/photo3.MOV", title: "Laboratoriya" },
  { id: 4, thumbnail: "/photo4.jpg", title: "Asboblar" },
]

export function HeroSection({ isLoading }: HeroSectionProps) {
  const { language } = useLanguage()
  const [currentReelIndex, setCurrentReelIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReelIndex((prev) => (prev + 1) % videoReels.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return <HeroSkeleton />
  }

  const content = heroContent[language]

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[800px] bg-gradient-to-br from-white via-white to-gray-50">
        <div className="absolute inset-0 overflow-hidden">
          {medicalIcons.map((Icon, i) => (
            <div
              key={i}
              className="absolute opacity-10 animate-float"
              style={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 90}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`,
              }}
            >
              <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-full">
                <Icon className="w-16 h-16 text-white" />
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-red-600/5" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-700 to-transparent" />

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge */}
             

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent animate-fade-in-up">
                  {content.title}
                </span>
                <br />
                <span className="italic animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  {content.titleSecond}
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className="text-xl text-gray-600 leading-relaxed max-w-xl animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                {content.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                <Link
                  href="https://t.me/SoglomOnaVaBolaKlinikasiBot"
                  className="group relative bg-gradient-to-r from-red-700 to-red-800 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/50 transition-all hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10">{content.buttonPatients}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href="/doctors"
                  className="group relative bg-white text-red-700 px-8 py-4 rounded-full font-semibold border-2 border-red-700 hover:bg-red-50 transition-all hover:scale-105"
                >
                  {content.buttonDoctors}
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent">
                    15+
                  </div>
                  <div className="text-sm text-gray-600">{language === "ru" ? "Лет опыта" : "Yillik tajriba"}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent">
                    200+
                  </div>
                  <div className="text-sm text-gray-600">{language === "ru" ? "Специалистов" : "Mutaxassis"}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent">
                    50K+
                  </div>
                  <div className="text-sm text-gray-600">{language === "ru" ? "Пациентов" : "Bemor"}</div>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <div className="relative h-[600px] flex items-center justify-center gap-4">
                {videoReels.map((reel, index) => {
                  const isActive = index === currentReelIndex
                  const isPrev = index === (currentReelIndex - 1 + videoReels.length) % videoReels.length
                  const isNext = index === (currentReelIndex + 1) % videoReels.length

                  return (
                    <div
                      key={reel.id}
                      className={`absolute transition-all duration-700 ease-out ${
                        isActive
                          ? "z-30 scale-100 opacity-100 translate-x-0"
                          : isPrev
                            ? "z-20 scale-90 opacity-50 -translate-x-32 blur-sm"
                            : isNext
                              ? "z-20 scale-90 opacity-50 translate-x-32 blur-sm"
                              : "z-10 scale-75 opacity-0"
                      }`}
                    >
                      <div className="relative w-[300px] h-[520px] rounded-3xl overflow-hidden shadow-2xl bg-white border-2 border-red-700/20">
                        <img
                          src={reel.thumbnail || "/placeholder.svg"}
                          alt={reel.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-bold">{reel.title}</h3>
                        </div>
                        {isActive && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-16 h-16 bg-red-700/30 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse-slow">
                              <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[12px] border-y-transparent ml-1" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Reel indicator dots */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {videoReels.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReelIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentReelIndex ? "w-8 bg-red-700" : "bg-red-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative -mt-20 z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={action.href}
              href={action.href}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-600/10 to-red-700/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <action.icon className="w-6 h-6 text-red-700" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center block">
                  {language === "ru" ? action.label_ru : action.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
