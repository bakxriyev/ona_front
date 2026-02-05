"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Upload, ChevronDown } from "lucide-react"
import { useLanguage } from "../../context/language-context"
import { api } from "@/lib/api"
import { API_BASE_URL, getImageUrl } from "../../lib/config"
import type { Career, About, FAQ } from "@/lib/types"
import { Skeleton } from "@/components/ui/loading-skeleton"

export default function CareerPage() {
  const { language, t } = useLanguage()
  const [careers, setCareers] = useState<Career[]>([])
  const [about, setAbout] = useState<About | null>(null)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCareer, setSelectedCareer] = useState("all")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const [formData, setFormData] = useState({
    full_name: "",
    birth_date: "",
    phone: "",
    email: "",
    salary: "",
    position: "",
    skills: "",
  })
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  useEffect(() => {
    Promise.all([api.getCareers().catch(() => []), api.getAbout().catch(() => []), api.getFAQs().catch(() => [])]).then(
      ([careersData, aboutData, faqsData]) => {
        setCareers(careersData)
        if (aboutData && aboutData.length > 0) {
          setAbout(aboutData[0])
        }
        setFaqs(faqsData)
        setIsLoading(false)
      },
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value)
      })
      if (resumeFile) {
        submitData.append("file", resumeFile)
      }

      const response = await fetch(`${API_BASE_URL}/resume`, {
        method: "POST",
        body: submitData,
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          full_name: "",
          birth_date: "",
          phone: "",
          email: "",
          salary: "",
          position: "",
          skills: "",
        })
        setResumeFile(null)
      } else {
        setSubmitStatus("error")
      }
    } catch {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("AKTIV VAKANTLIKLAR AKFA MEDLINE", "АКТИВНЫЕ ВАКАНСИИ AKFA MEDLINE")}
          </h1>
          <p className="text-gray-600">
            {t(
              "Quyidagi mavjud vakantliklar bilan tanishib chiqishingiz va rezyumeni yuborishingiz mumkin. Akfa Medline jamoasiga qo'shiling!",
              "Ознакомьтесь с доступными вакансиями и отправьте резюме. Присоединяйтесь к команде Akfa Medline!",
            )}
          </p>
        </div>

        <div className="mb-8">
          <div className="relative w-64">
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#1e4a8d]"
            >
              <option value="all">{t("Lavozimni tanlang...", "Выберите должность...")}</option>
              {careers.map((v) => (
                <option key={v.id} value={v.id.toString()}>
                  {language === "ru" ? v.title_ru : v.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="animate-fade-in-up">
            {isLoading ? (
              <Skeleton className="h-96 w-full rounded-2xl" />
            ) : (
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={
                    about?.logo
                      ? getImageUrl("about", about.logo)
                      : "/placeholder.svg?height=400&width=600&query=modern hospital building"
                  }
                  alt="Akfa Medline Hospital"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {t("ONLAYN REZYUME", "ОНЛАЙН РЕЗЮМЕ")}
            </h2>
            <p className="text-gray-600 text-center mb-6">
              {t(
                "Akfa Medline'da ish faoliyatini boshlash uchun rezyume formasini to'ldiring.",
                "Заполните форму резюме, чтобы начать работу в Akfa Medline.",
              )}
            </p>

            {submitStatus === "success" && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                {t("Rezyumengiz muvaffaqiyatli yuborildi!", "Ваше резюме успешно отправлено!")}
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {t("Xatolik yuz berdi. Qaytadan urinib ko'ring.", "Произошла ошибка. Попробуйте снова.")}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={t("To'liq ismingiz", "Полное имя")}
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e4a8d]"
                required
              />

              <input
                type="date"
                placeholder={t("Tug'ilgan sana", "Дата рождения")}
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e4a8d]"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder={t("Telefon", "Телефон")}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e4a8d]"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e4a8d]"
                  required
                />
              </div>

              <input
                type="text"
                placeholder={t("Oylik maosh", "Желаемая зарплата")}
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e4a8d]"
              />

              <input
                type="text"
                placeholder={t("Istalgan lavozim", "Желаемая должность")}
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e4a8d]"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <label className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-[#1e4a8d]" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-[#1e4a8d]">
                      {t("Yuklash uchun bosing", "Нажмите для загрузки")}
                    </span>{" "}
                    {t("yoki faylni sudrab olib keling", "или перетащите файл")}
                  </p>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                </label>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">{t("Yuklangan fayllar", "Загруженные файлы")}</p>
                  {resumeFile && <p className="text-sm text-[#1e4a8d] mt-2">{resumeFile.name}</p>}
                </div>
              </div>

              <textarea
                placeholder={t("Shaxsiy fazilatlar", "Личные качества")}
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e4a8d] resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1e4a8d] text-white py-3 rounded-lg font-medium hover:bg-[#153a6d] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? t("Yuborilmoqda...", "Отправка...") : t("Yuborish", "Отправить")}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section - from backend */}
        {faqs.length > 0 && (
          <div className="mt-16 bg-[#0f2a4a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white italic mb-6">
              {t("KO'P SO'RALADIGAN SAVOLLAR", "ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ")}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.id} className="bg-white/10 rounded-lg overflow-hidden group">
                  <summary className="px-6 py-4 cursor-pointer text-white font-medium flex items-center justify-between">
                    {language === "ru" ? faq.question_ru : faq.question}
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-4 text-white/70">{language === "ru" ? faq.answer_ru : faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
