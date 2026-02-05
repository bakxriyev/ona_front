"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { NewsSection } from "@/components/home/news-section"
import { DoctorsSection } from "@/components/home/doctors-section"
import { DepartmentsSection } from "../components/home/department-section"
import { AboutSection } from "@/components/home/about-section"
import { api } from "@/lib/api"
import { config } from "@/lib/config"
import type { NewsItem, About, QuickAction, Slider, Feature, Doctor, Direction } from "@/lib/types"

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [departments, setDepartments] = useState<Direction[]>([])
  const [about, setAbout] = useState<About | null>(null)
  const [quickActions, setQuickActions] = useState<QuickAction[]>([])
  const [slider, setSlider] = useState<Slider | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] API URL:", config.apiUrl)

    Promise.all([
      api.getNews().catch((err) => {
        console.log("[v0] News fetch error:", err)
        return []
      }),
      api.getDoctors().catch(() => []),
      api.getDirections().catch(() => []),
      api.getAbout().catch(() => []),
      api.getQuickActions().catch(() => []),
      api.getSliders().catch(() => []),
      api.getFeatures().catch(() => []),
    ]).then(([newsData, doctorsData, departmentsData, aboutData, quickActionsData, slidersData, featuresData]) => {
      console.log("[v0] News data from backend:", newsData)
      setNews(newsData)
      setDoctors(doctorsData)
      setDepartments(departmentsData)
      if (aboutData && aboutData.length > 0) {
        setAbout(aboutData[0])
      }
      setQuickActions(quickActionsData)
      if (slidersData && slidersData.length > 0) {
        setSlider(slidersData[0])
      }
      setFeatures(featuresData)
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection isLoading={isLoading} about={about} quickActions={quickActions} slider={slider} />
        <NewsSection news={news} isLoading={isLoading} />
        <DoctorsSection doctors={doctors} isLoading={isLoading} />
        <DepartmentsSection departments={departments} isLoading={isLoading} />
        <AboutSection isLoading={isLoading} about={about} />
      </main>
      <Footer />
    </div>
  )
}
