"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl, getVideoUrl } from "../../../lib/config"
import type { BlogPost } from "@/lib/types"

export default function BlogDetailPage() {
  const { language, t } = useLanguage()
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      api
        .getBlogPost(Number(params.id))
        .then((data) => {
          setPost(data)
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-96 w-full rounded-2xl mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("Maqola topilmadi", "Статья не найдена")}</h1>
          <Link href="/blog" className="text-[#d32f2f] hover:underline">
            {t("Blogga qaytish", "Вернуться к блогу")}
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const videoUrl = getVideoUrl("blog", post.video)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#1e4a8d] hover:text-[#d32f2f] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t("Barcha maqolalar", "Все статьи")}
        </Link>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {language === "ru" ? post.title_ru : post.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8">{language === "ru" ? post.description_ru : post.description}</p>

        {/* Image */}
        {post.photo && (
          <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={getImageUrl("blog", post.photo) || "/placeholder.svg"}
              alt={language === "ru" ? post.title_ru : post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Video */}
        {videoUrl && (
          <div className="mb-8">
            <video src={videoUrl} controls className="w-full rounded-2xl" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: post.maqola.replace(/\n/g, "<br/>"),
            }}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
