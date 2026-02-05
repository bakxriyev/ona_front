"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { Facebook, Instagram, Send, Youtube, ChevronDown } from "lucide-react"
import { useLanguage } from "../../context/language-context"
import { api } from "@/lib/api"
import type { About } from "@/lib/types"

export default function ContactPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#5a7a9a] to-[#3d5a7a] py-16 relative">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {t("Biz bilan bog'lanish", "Связаться с нами")}
          </h1>
          <p className="text-white/80 max-w-2xl">
            {t(
              "Akfa Medline klinikasiga murojaat qilish yuqori sifatli tibbiy xizmatdan foydalanish demakdir.",
              "Обращение в клинику Akfa Medline означает получение высококачественных медицинских услуг.",
            )}
          </p>

          <button className="mt-6 flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
            {t("Pastga aylantiring", "Прокрутите вниз")} <ChevronDown className="w-4 h-4" />
          </button>

          {/* Social links */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3">
            {[Facebook, Instagram, Send, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t("Bog'lanish uchun ma'lumotlar", "Контактная информация")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("Formani to'ldiring yoki to'g'ridan-to'g'ri bog'laning:", "Заполните форму или свяжитесь напрямую:")}
          </p>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="text-[#1e4a8d] font-medium">E-mail:</span>
                <div className="mt-1">
                  <a href={`mailto:${about?.gmail}`} className="text-[#0d7377] hover:underline">
                    {about?.gmail || "info@akfamedline.uz"}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-[#1e4a8d] font-medium">{t("Telefon:", "Телефон:")}</span>
                <div className="mt-1">
                  <a href={`tel:${about?.phone}`} className="text-[#0d7377] hover:underline">
                    {about?.phone || "+998 71 203-30-03"}
                  </a>
                </div>
                {about?.phone2 && (
                  <div>
                    <a href={`tel:${about.phone2}`} className="text-[#0d7377] hover:underline">
                      {about.phone2}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <span className="text-[#1e4a8d] font-medium">{t("Manzil:", "Адрес:")}</span>
                <p className="mt-1 text-gray-600">
                  {language === "ru"
                    ? about?.manzil_ru || "г. Ташкент, Алмазарский район, ул. Кичик Халка Йули, 5А"
                    : about?.manzil || "Toshkent shahri, Olmazor tumani, Kichik Xalqa Yo'li ko'chasi, 5A"}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

     

      <Footer />
    </div>
  )
}