"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Youtube, Instagram, Send, ChevronUp, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useLanguage } from "../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl } from "@/lib/config"
import type { About } from "@/lib/types"
import { Skeleton } from "@/components/ui/loading-skeleton"

export function Footer() {
  const { language, t } = useLanguage()
  const [about, setAbout] = useState<About | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .getAbout()
      .then((data) => {
        if (data && data.length > 0) {
          setAbout(data[0])
        }
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const menuItems = [
    { labelUz: "Biz haqimizda", labelRu: "О нас", href: "/about" },
    { labelUz: "Sug'urta", labelRu: "Страхование", href: "/insurance" },
    { labelUz: "Xizmatlar", labelRu: "Услуги", href: "/services" },
    { labelUz: "Shifokorlar", labelRu: "Врачи", href: "/doctors" },
    { labelUz: "Blog", labelRu: "Блог", href: "/blog" },
  ]

  const detailItems = [
    { labelUz: "Karyera", labelRu: "Карьера", href: "/career" },
    { labelUz: "AMUH hayoti", labelRu: "Жизнь AMUH", href: "/news" },
    { labelUz: "Kontaktlar", labelRu: "Контакты", href: "/contact" },
  ]

  // Static defaults
  const defaults = {
    description:
      "SOG`LOM ONA VA BOLA KLINIKASI — Markaziy Osiyodagi zamonaviy jihozlangan xususiy ko'p tarmoqli klinika bo'lib, tashxis, davolash va murakkab yurak jarrohligi, ginekologiya, urologiya, qon-tomir, ortopediya va boshqa operatsiyalarni o'tkazish uchun mo'ljallangan.",
    description_ru:
      "SOG`LOM ONA VA BOLA KLINIKASI — современная многопрофильная университетская клиника в Центральной Азии, специализирующаяся на диагностике, лечении и проведении сложных операций.",
    manzil: "Toshkent shahri, Olmazor tumani, Kichik Xalqa Yo'li ko'chasi, 5A",
    manzil_ru: "г. Ташкент, Алмазарский район, ул. Кичик Халка Йули, 5А",
  }

  if (isLoading) {
    return (
      <footer className="mt-12">
        <div className="bg-[#0f2a4a] py-8 rounded-t-[30px] mx-2">
          <div className="max-w-7xl mx-auto px-6">
            <Skeleton className="h-32 w-full bg-white/10 rounded-2xl" />
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="mt-12">
      {/* Top blue section with rounded top corners */}
      <div className="bg-[#0f2a4a] text-white rounded-t-[30px] mx-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            {t("Bugunoq biz bilan bog'laning!", "Свяжитесь с нами сегодня!")}
          </h3>

          {/* Divider */}
          <div className="border-t border-white/20 mb-6"></div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Working hours - left side */}
            <div className="flex-shrink-0">
              <p className="font-semibold text-white mb-2">{t("Ish vaqti", "Время работы")}</p>
              <div className="text-sm text-white/90 space-y-0.5">
                <p>{t("Dushanba – Juma: 08:30 – 17:00", "Понедельник – Пятница: 08:30 – 17:00")}</p>
                <p>{t("Shanba: 09:00 – 14:00", "Суббота: 09:00 – 14:00")}</p>
                <p>{t("Yakshanba: Dam olish kuni", "Воскресенье: Выходной")}</p>
              </div>
            </div>

            {/* AKFA MEDLINE marquee - right side */}
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="overflow-hidden flex-1 max-w-[500px]">
                <div className="flex animate-marquee whitespace-nowrap">
                  {[...Array(8)].map((_, i) => (
                    <span key={i} className="mx-8 text-xl md:text-3xl font-bold tracking-wider">
                    SOG`LOM ONA VA BOLA KLINIKASI
                    </span>
                  ))}
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </div>

      {/* Main white section - full width */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Column 1: Logo & Description */}
            <div className="sm:col-span-2 lg:col-span-1 lg:pr-4">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-4">
                {about?.logo ? (
                  <Image
                    src={getImageUrl("about", about.logo) || "/placeholder.svg"}
                    alt={about?.full_name || "AKFA MEDLINE"}
                    width={150}
                    height={60}
                    className="h-12 w-auto object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="bg-[#c41e3a] text-white px-3 py-1.5 rounded-full text-xs font-bold">
                    SOG`LOM ONA va BOLA KLINIKASI
                    </div>
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-yellow-700 text-sm">✓</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description - static */}
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                {language === "ru" ? defaults.description_ru : defaults.description}
              </p>

              {/* Social links */}
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Send className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Menu */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">{t("Menyu", "Меню")}</h4>
              <ul className="space-y-3 text-sm">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-gray-600 hover:text-[#c41e3a] transition-colors">
                      {language === "ru" ? item.labelRu : item.labelUz}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Batafsil */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">{t("Batafsil", "Подробнее")}</h4>
              <ul className="space-y-3 text-sm">
                {detailItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-gray-600 hover:text-[#c41e3a] transition-colors">
                      {language === "ru" ? item.labelRu : item.labelUz}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Address - static */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">{t("Manzil", "Адрес")}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {language === "ru" ? defaults.manzil_ru : defaults.manzil}
              </p>
            </div>

            {/* Column 5: Contacts - from backend */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">{t("Kontaktlar", "Контакты")}</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>{about?.phone || "+998 71 203-30-03"}</p>
                <p>{about?.gmail || "info@akfamedline.uz"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom license section */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>2017-yil 23-maydagi 520218-sonli ro'yxatga olish guvohnomasi</p>
          <p>2018-yil 19-iyuldagi 00378-sonli litsenziya</p>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#1e5a8d] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2a6a9d] transition-all z-40 text-white hover:scale-110"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </footer>
  )
}
