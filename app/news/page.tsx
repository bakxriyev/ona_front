"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CardSkeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl } from "../../lib/config"
import type { NewsItem } from "@/lib/types"

export default function NewsPage() {
  const { language, t } = useLanguage()
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .getNews()
      .then((data) => {
        setNews(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e4a8d] to-[#0f2a4a] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("Yangiliklar", "Новости")}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {t(
              "Klinikamiz faoliyati va tibbiyot sohasidagi so'nggi yangiliklar",
              "Последние новости о деятельности клиники и в области медицины",
            )}
          </p>
        </div>
      </div>

      {/* News Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={getImageUrl("news", item.photo) || "/placeholder.svg"}
                    alt={language === "ru" ? item.title_ru : item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-[#0d7377]/10 text-[#0d7377] rounded-full text-sm">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {language === "ru" ? item.title_ru : item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {language === "ru" ? item.description_ru : item.description}
                  </p>
                  <Link
                    href={`/news/${item.id}`}
                    className="inline-flex items-center gap-2 bg-[#d32f2f] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#b71c1c] transition-colors"
                  >
                    {t("Batafsil", "Подробнее")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
