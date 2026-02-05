"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Newspaper } from "lucide-react"
import { CardSkeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"
import { getImageUrl } from "@/lib/config"
import type { NewsItem } from "@/lib/types"

interface NewsSectionProps {
  news: NewsItem[]
  isLoading?: boolean
}

export function NewsSection({ news, isLoading }: NewsSectionProps) {
  const { language, t } = useLanguage()

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-[#0d7377] mb-10 text-center md:text-left">
        {t("Yangiliklar va voqealar", "Новости и события")}
      </h2>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">{t("Yangiliklar topilmadi", "Новости не найдены")}</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.slice(0, 3).map((item, index) => (
              <article
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="p-4 pb-0">
                  <div className="relative h-52 overflow-hidden rounded-2xl">
                    <Image
                      src={getImageUrl("news", item.photo) || "/placeholder.svg"}
                      alt={language === "ru" ? item.title_ru || item.title : item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="p-5 pt-4">
                  <div className="flex items-center mb-4">
                    <span className="inline-block px-4 py-1.5 border-2 border-[#00a859] text-[#00a859] rounded-full text-sm font-medium">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-3 leading-snug">
                    {language === "ru" ? item.title_ru || item.title : item.title}
                  </h3>

                  <p className="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed">
                    {language === "ru" ? item.description_ru || item.description : item.description}
                  </p>

                  <Link
                    href={`/news/${item.id}`}
                    className="inline-flex items-center gap-2 bg-[#c41e3a] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#a01830] transition-colors"
                  >
                    {t("Batafsil", "Подробнее")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-start">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 bg-[#c41e3a] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#a01830] transition-colors text-base"
            >
              {t("Barcha yangiliklar", "Все новости")}
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
