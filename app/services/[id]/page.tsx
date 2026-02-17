"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, X } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl, getVideoUrl } from "@/lib/config"
import type { Service } from "@/lib/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface AppointmentFormData {
  full_name: string
  phone_number: string
  department: string
  message: string
  appointment_date: string
  appointment_time: string
}

interface TimeSlot {
  id: number
  time: string
  available: boolean
}

const timeSlots: TimeSlot[] = [
  { id: 1, time: "09:00", available: true },
  { id: 2, time: "09:30", available: true },
  { id: 3, time: "10:00", available: true },
  { id: 4, time: "10:30", available: true },
  { id: 5, time: "11:00", available: true },
  { id: 6, time: "11:30", available: true },
  { id: 7, time: "12:00", available: true },
  { id: 8, time: "12:30", available: true },
  { id: 9, time: "14:00", available: true },
  { id: 10, time: "14:30", available: true },
  { id: 11, time: "15:00", available: true },
  { id: 12, time: "15:30", available: true },
  { id: 13, time: "16:00", available: true },
  { id: 14, time: "16:30", available: true },
  { id: 15, time: "17:00", available: true },
]

const modalContent = {
  uz: {
    title: "Qabulga yozilish",
    fullName: "F.I.SH",
    phone: "Telefon raqam",
    department: "Bo'lim",
    message: "Qo'shimcha ma'lumot",
    date: "Sana",
    time: "Vaqt",
    submit: "Yuborish",
    cancel: "Bekor qilish",
    success: "Muvaffaqiyatli yuborildi!",
    error: "Xatolik yuz berdi, qayta urinib ko'ring.",
    loading: "Yuborilmoqda...",
    placeholder: {
      fullName: "Ism familiyangiz",
      phone: "+998 90 123 45 67",
      department: "Bo'limni tanlang",
      message: "Simptomlar yoki qo'shimcha ma'lumot",
    },
  },
  ru: {
    title: "Запись на прием",
    fullName: "Ф.И.О",
    phone: "Номер телефона",
    department: "Отделение",
    message: "Дополнительная информация",
    date: "Дата",
    time: "Время",
    submit: "Отправить",
    cancel: "Отмена",
    success: "Успешно отправлено!",
    error: "Произошла ошибка, попробуйте снова.",
    loading: "Отправляется...",
    placeholder: {
      fullName: "Ваше имя и фамилия",
      phone: "+998 90 123 45 67",
      department: "Выберите отделение",
      message: "Симптомы или дополнительная информация",
    },
  },
}

// Reusable Appointment Modal Component
function AppointmentModal({
  isOpen,
  onClose,
  language,
}: {
  isOpen: boolean
  onClose: () => void
  language: "uz" | "ru"
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [departments, setDepartments] = useState<string[]>([])
  const [loadingDepartments, setLoadingDepartments] = useState(false)
  const [formData, setFormData] = useState<AppointmentFormData>({
    full_name: "",
    phone_number: "",
    department: "",
    message: "",
    appointment_date: "",
    appointment_time: "",
  })

  useEffect(() => {
    if (isOpen) {
      fetchDepartments()
    }
  }, [isOpen])

  const fetchDepartments = async () => {
    setLoadingDepartments(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${apiUrl}/direction`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          const names = data.map((dept) => dept.name || dept.title || dept)
          setDepartments(names)
        }
      }
    } catch (error) {
      console.error("Error fetching departments:", error)
    } finally {
      setLoadingDepartments(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTimeSlotClick = (time: string) => {
    setFormData((prev) => ({ ...prev, appointment_time: time }))
  }

  const getTodayDate = () => new Date().toISOString().split("T")[0]
  const getMaxDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().split("T")[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone_number: formData.phone_number.replace(/\D/g, ""),
          doctor_name: "",
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          full_name: "",
          phone_number: "",
          department: "",
          message: "",
          appointment_date: "",
          appointment_time: "",
        })
        setTimeout(() => {
          onClose()
          setSubmitStatus("idle")
        }, 2000)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setSubmitStatus("idle")
      setFormData({
        full_name: "",
        phone_number: "",
        department: "",
        message: "",
        appointment_date: "",
        appointment_time: "",
      })
    }
  }

  if (!isOpen) return null

  const content = modalContent[language]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-fade-in-scale overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">{content.title}</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{content.fullName}</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder={content.placeholder.fullName}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1e4a8d] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{content.phone}</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder={content.placeholder.phone}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1e4a8d] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{content.department}</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={loadingDepartments}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1e4a8d] focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingDepartments ? "Yuklanmoqda..." : content.placeholder.department}
                </option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{content.date}</label>
              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleInputChange}
                min={getTodayDate()}
                max={getMaxDate()}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1e4a8d] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Time Slots */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">{content.time}</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleTimeSlotClick(slot.time)}
                  disabled={!slot.available}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    formData.appointment_time === slot.time
                      ? "bg-[#1e4a8d] text-white ring-2 ring-[#1e4a8d] ring-offset-2"
                      : slot.available
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{content.message}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={content.placeholder.message}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1e4a8d] focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          {/* Status */}
          {submitStatus === "success" && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-center">
              ✅ {content.success}
            </div>
          )}
          {submitStatus === "error" && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-center">
              ❌ {content.error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-[#1e4a8d] to-[#0d7377] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? content.loading : content.submit}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              {content.cancel}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ServiceDetailPage() {
  const { language, t } = useLanguage()
  const params = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Two separate modal open states: CTA bottom + contact section
  const [isCtaModalOpen, setIsCtaModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  useEffect(() => {
    if (params.id) {
      api
        .getService(Number(params.id))
        .then((serviceData) => {
          setService(serviceData)
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    }
  }, [params.id])

  const scrollToContent = () => {
    document.getElementById("service-content")?.scrollIntoView({ behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <div className="bg-gray-100 py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <Skeleton className="h-16 w-2/3 mb-4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row gap-12">
              <Skeleton className="w-full h-96 rounded-3xl" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-40 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("Xizmat topilmadi", "Услуга не найдена")}
          </h1>
          <Link href="/services" className="text-[#d32f2f] hover:underline">
            {t("Xizmatlarga qaytish", "Вернуться к услугам")}
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const videoUrl = service.video ? getVideoUrl("services", service.video) : null

  return (
    <div className="min-h-screen">
      <Header />

      {/* Appointment Modals */}
      <AppointmentModal
        isOpen={isCtaModalOpen}
        onClose={() => setIsCtaModalOpen(false)}
        language={language}
      />
      <AppointmentModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        language={language}
      />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-[#5a7a9a] to-[#3d5a7a] pt-12 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light italic text-white mb-6">
              {t("Bizning xizmatlarimiz", "Наши услуги")}
            </h1>
          </div>
        </section>

        {/* Nav bar */}
        <section className="bg-white py-6 px-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={scrollToContent}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              {t("Pastga aylantiring", "Прокрутите вниз")}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Service content */}
        <section id="service-content" className="bg-white rounded-t-[40px] -mt-4 relative z-10 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              {/* Image */}
              <div className="relative flex-shrink-0 w-full lg:w-[500px] h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl group mx-auto lg:mx-0">
                <Image
                  src={
                    getImageUrl("services", service.photo) ||
                    "/placeholder.svg?height=600&width=500&query=medical service"
                  }
                  alt={language === "ru" ? service.title_ru : service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Info */}
              <div className="flex-1 p-6 md:p-8 lg:p-10 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                {service.full_name && (
                  <p className="text-lg text-gray-500 mb-2 font-medium">
                    {language === "ru" ? service.full_name_ru : service.full_name}
                  </p>
                )}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {language === "ru" ? service.title_ru : service.title}
                </h2>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {language === "ru" ? service.description_ru : service.description}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("Xizmat haqida", "Об услуге")}
                </h3>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
                  <p className="whitespace-pre-line">
                    {language === "ru" ? service.about_ru : service.about}
                  </p>
                </div>

                {videoUrl && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("Video", "Видео")}</h3>
                    <video src={videoUrl} controls className="w-full rounded-3xl max-h-[400px] shadow-lg" />
                  </div>
                )}
              </div>
            </div>

            {/* Details Accordion */}
            {service.details && service.details.length > 0 && (
              <div className="mt-16">
                <h3 className="text-3xl font-extrabold text-gray-900 mb-8 text-center lg:text-left">
                  {t("Batafsil ma'lumotlar", "Подробности")}
                </h3>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {service.details.map((detail: any, index: any) => {
                    const detailVideoUrl = detail.video ? getVideoUrl("services", detail.video) : null
                    return (
                      <AccordionItem
                        key={detail.id}
                        value={`item-${index}`}
                        className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
                      >
                        <AccordionTrigger className="text-left text-2xl font-bold text-gray-800 hover:text-[#d32f2f] transition-colors py-6 px-6 hover:bg-gray-50">
                          {language === "ru" ? detail.title_ru : detail.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-lg leading-relaxed py-6 px-6 bg-gray-50">
                          <p className="mb-4">{language === "ru" ? detail.about_ru : detail.about}</p>
                          <p className="font-medium text-[#d32f2f] mb-4 text-xl">
                            {t("Narx", "Цена")}: {language === "ru" ? detail.price_ru : detail.price}
                          </p>
                          {detail.photo && (
                            <div className="relative h-80 rounded-2xl overflow-hidden mb-6 shadow-md">
                              <Image
                                src={getImageUrl("services", detail.photo) || "/placeholder.svg"}
                                alt={language === "ru" ? detail.title_ru : detail.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          {detailVideoUrl && (
                            <video src={detailVideoUrl} controls className="w-full rounded-2xl mb-6 shadow-lg" />
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </div>
            )}

            {/* CTA Button */}
            <div className="mt-16 text-center">
              <button
                onClick={() => setIsCtaModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-[#d32f2f] text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-[#b71c1c] transition-colors shadow-lg hover:shadow-xl"
              >
                {t("Qabulga yozilish", "Записаться на прием")}
              </button>
            </div>
          </div>
        </section>

        {/* Contact / Savollaringiz bormi section */}
        <section className="bg-gradient-to-r from-[#1e4a8d] to-[#0f2a4a] py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("Savollaringiz bormi?", "Есть вопросы?")}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              {t(
                "Bizning mutaxassislarimiz sizga barcha savollaringizga javob berishga tayyor",
                "Наши специалисты готовы ответить на все ваши вопросы"
              )}
            </p>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="inline-block bg-white text-[#1e4a8d] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg"
            >
              {t("Bog'lanish", "Связаться")}
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}