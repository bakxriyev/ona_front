"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl, getVideoUrl } from "@/lib/config"
import type { NewsItem } from "@/lib/types"

function ImageWithLoading({
  src,
  alt,
  className = "",
}: {
  src: string
  alt: string
  className?: string
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  if (hasError) return null

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#1e4a8d] rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
    </div>
  )
}

export default function NewsDetailPage() {
  const { language, t } = useLanguage()
  const params = useParams()
  const [news, setNews] = useState<NewsItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([])

  useEffect(() => {
    if (params.id) {
      Promise.all([api.getNewsItem(Number(params.id)), api.getNews()])
        .then(([newsData, allNews]) => {
          setNews(newsData)
          // Get 3 related news excluding current
          setRelatedNews(allNews.filter((n) => n.id !== Number(params.id)).slice(0, 3))
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    }
  }, [params.id])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const months =
      language === "ru"
        ? [
            "января",
            "февраля",
            "марта",
            "апреля",
            "мая",
            "июня",
            "июля",
            "августа",
            "сентября",
            "октября",
            "ноября",
            "декабря",
          ]
        : [
            "yanvar",
            "fevral",
            "mart",
            "aprel",
            "may",
            "iyun",
            "iyul",
            "avgust",
            "sentyabr",
            "oktyabr",
            "noyabr",
            "dekabr",
          ]

    try {
      const date = new Date(dateStr)
      const day = date.getDate()
      const month = months[date.getMonth()]
      const year = date.getFullYear()
      return `${day} ${month} ${year}`
    } catch {
      return dateStr
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-6 w-40 mb-8" />
          <Skeleton className="h-[400px] w-full rounded-3xl mb-8" />
          <Skeleton className="h-8 w-32 rounded-full mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-3/4 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("Yangilik topilmadi", "Новость не найдена")}</h1>
            <p className="text-gray-500 mb-8">
              {t("So'ralgan yangilik mavjud emas", "Запрашиваемая новость не существует")}
            </p>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 bg-[#d32f2f] text-white px-6 py-3 rounded-full hover:bg-[#b71c1c] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {t("Yangiliklariga qaytish", "Вернуться к новостям")}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const title = language === "ru" && news.title_ru ? news.title_ru : news.title
  const description = language === "ru" && news.description_ru ? news.description_ru : news.description
  const content = language === "ru" && news.matn_ru ? news.matn_ru : news.matn
  const photoUrl = getImageUrl("news", news.photo)
  const videoUrl = news.video ? getVideoUrl("news", news.video) : null

  const galleryImages = news.gallery || []

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-[#1e4a8d] hover:text-[#d32f2f] mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          {t("Barcha yangiliklar", "Все новости")}
        </Link>

        {photoUrl && (
          <div className="mb-8">
            <ImageWithLoading
              src={photoUrl || "/placeholder.svg"}
              alt={title}
              className="w-full h-[250px] md:h-[350px] rounded-3xl shadow-lg"
            />
          </div>
        )}

        <div className="mb-6">
          <span className="inline-block px-4 py-2 border-2 border-[#00897b] text-[#00897b] rounded-full text-sm font-medium">
            {formatDate(news.date)}
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{title}</h1>

        {description && <p className="text-lg text-gray-600 mb-8 leading-relaxed">{description}</p>}

        {videoUrl && (
          <div className="mb-8">
            <video
              src={videoUrl}
              controls
              className="w-full max-h-[350px] rounded-2xl shadow-lg object-contain bg-black"
              poster={photoUrl || undefined}
            >
              {t("Brauzeringiz video ni qo'llab-quvvatlamaydi", "Ваш браузер не поддерживает видео")}
            </video>
          </div>
        )}

        {content && (
          <div className="prose prose-lg max-w-none mb-8">
            <div
              className="text-gray-700 leading-relaxed [&_strong]:text-gray-900 [&_strong]:font-bold [&_em]:italic [&_a]:text-[#1e4a8d] [&_a]:underline [&_a:hover]:text-[#d32f2f]"
              dangerouslySetInnerHTML={{
                __html: content.replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        )}

        {galleryImages.length > 0 && (
          <div className="space-y-6 mb-8">
            {galleryImages.map((img: string, index: number) => (
              <ImageWithLoading
                key={index}
                src={getImageUrl("news", img) || ""}
                alt={`${title} - ${index + 1}`}
                className="w-full max-h-[350px] rounded-2xl shadow-lg object-cover"
              />
            ))}
          </div>
        )}

        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-gray-500">{formatDate(news.date)}</span>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm">{t("Ulashish:", "Поделиться:")}</span>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0088cc] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1877f2] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {relatedNews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#00897b] mb-8">{t("Boshqa yangiliklar", "Другие новости")}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="p-3">
                    <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                      {item.photo ? (
                        <img
                          src={getImageUrl("news", item.photo) || ""}
                          alt={language === "ru" && item.title_ru ? item.title_ru : item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <span className="inline-block px-3 py-1 border border-[#00897b] text-[#00897b] rounded-full text-xs mb-3">
                      {formatDate(item.date)}
                    </span>
                    <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-[#d32f2f] transition-colors">
                      {language === "ru" && item.title_ru ? item.title_ru : item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
