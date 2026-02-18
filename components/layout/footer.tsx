"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Send, ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"
import { useLanguage } from "../../context/language-context"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/loading-skeleton"
import type { About } from "@/lib/types"

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
    { labelUz: "Xizmatlar", labelRu: "Услуги", href: "/services" },
    { labelUz: "Shifokorlar", labelRu: "Врачи", href: "/doctors" },
    { labelUz: "Blog", labelRu: "Блог", href: "/blog" },
  ]

  const defaults = {
    manzil: "Toshkent shahar, Bektemir tumani, Obod ko'chasi, 123 uy",
    manzil_ru: "Ташкент, Бектемирский район, улица Обод, дом 123",
  }

  if (isLoading) {
    return (
      <footer className="mt-12">
        <div className="bg-gradient-to-r from-red-700 to-red-800 py-8 rounded-t-[30px] mx-2">
          <div className="max-w-7xl mx-auto px-6">
            <Skeleton className="h-32 w-full bg-white/10 rounded-2xl" />
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="mt-12">
      {/* Top red section — hero ranglari bilan */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 text-white rounded-t-[30px] mx-2 relative overflow-hidden">
        {/* Dekorativ fon elementi */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-transparent to-red-900/40 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            {t("Bugunoq biz bilan bog'laning!", "Свяжитесь с нами сегодня!")}
          </h3>

          {/* Divider */}
          <div className="border-t border-white/20 mb-6"></div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Working hours */}
            <div className="flex-shrink-0">
              <p className="font-semibold text-white mb-2">{t("Ish vaqti", "Время работы")}</p>
              <div className="text-sm text-white/90 space-y-0.5">
                <p>{t("Har kuni: 24/7", "Круглосуточно: 24/7")}</p>
              </div>
            </div>

            {/* Marquee */}
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="overflow-hidden flex-1 max-w-[500px]">
                <div className="flex animate-marquee whitespace-nowrap">
                  {[...Array(8)].map((_, i) => (
                    <span key={i} className="mx-8 text-xl md:text-3xl font-bold tracking-wider text-white/90">
                      SOG`LOM ONA VA BOLA KLINIKASI
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main white section */}
      <div className="bg-white border-t border-red-100">
        <div className="max-w-7xl mx-auto px-8 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Column 1: Logo & Description */}
            <div className="sm:col-span-2 lg:col-span-1 -mt-16 lg:pr-0"> {/* lg:pr-0 padding o‘ngni olib tashlaydi */}
              <div className="flex items-center gap-2 mb-6 justify-start">
                {about?.logo ? (
                  <Image
                    src="/logo_ona.png"
                    alt={about?.full_name || "SOG`LOM ONA VA BOLA KLINIKASI"}
                    width={700}
                    height={400}
                    className="h-50 w-auto object-contain ml-0" // logoni chapga suradi
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-red-700 to-red-800 text-white px-3 py-1.5 rounded-full text-xs font-bold ml-0">
                      SOG`LOM ONA VA BOLA KLINIKASI
                    </div>
                  </div>
                )}
              </div>

              <p className="text-sm -mt-20 text-gray-600 mb-2 leading-relaxed">
                SOG`LOM ONA VA BOLA KLINIKASI
              </p>

              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/ona_bola_clinic/"
                  className="text-gray-400 hover:text-red-700 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://t.me/ona_bolalar1"
                  className="text-gray-400 hover:text-red-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </a>
              </div>
            </div>


            {/* Column 2: Menu */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-8 after:h-0.5 after:bg-gradient-to-r after:from-red-700 after:to-red-800">
                {t("Menyu", "Меню")}
              </h4>
              <ul className="space-y-3 text-sm mt-3">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-red-700 transition-colors hover:pl-1 inline-block"
                    >
                      {language === "ru" ? item.labelRu : item.labelUz}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Address */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-8 after:h-0.5 after:bg-gradient-to-r after:from-red-700 after:to-red-800">
                {t("Manzil", "Адрес")}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                {language === "ru" ? defaults.manzil_ru : defaults.manzil}
              </p>
            </div>

            {/* Column 5: Contacts */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-8 after:h-0.5 after:bg-gradient-to-r after:from-red-700 after:to-red-800">
                {t("Kontaktlar", "Контакты")}
              </h4>
              <div className="text-sm text-gray-600 space-y-2 mt-3">
                <p className="hover:text-red-700 transition-colors cursor-pointer">95-818-84-42</p>
                <p className="hover:text-red-700 transition-colors cursor-pointer">95-818-84-43</p>
                <p className="hover:text-red-700 transition-colors cursor-pointer">90-820-67-87</p>
                <p>{about?.gmail || "info@onabolaclinic.uz"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-red-100 py-4">
          <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
            <p>© {new Date().getFullYear()} SOG`LOM ONA VA BOLA KLINIKASI. {t("Barcha huquqlar himoyalangan.", "Все права защищены.")}</p>
            <p className="text-red-700 font-medium">24/7</p>
          </div>
        </div>
      </div>

      {/* Scroll to top — hero tugma ranglari bilan */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-red-700 to-red-800 rounded-full flex items-center justify-center shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/50 transition-all z-40 text-white hover:scale-110"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </footer>
  )
}