"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart, Stethoscope, Activity, Cross, X, Phone, MessageCircle, Instagram } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CardSkeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl } from "../../lib/config"
import type { Service } from "@/lib/types"

const backgroundIcons = [Heart, Stethoscope, Activity, Cross, Heart, Stethoscope, Activity, Cross]

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

export default function ServicesPage() {
  const { language, t } = useLanguage()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
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
    api
      .getServices()
      .then((data) => {
        setServices(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    setLoadingDepartments(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${apiUrl}/direction`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          const departmentNames = data.map((dept) => dept.name || dept.title || dept)
          setDepartments(departmentNames)
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
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split("T")[0]
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
          setIsModalOpen(false)
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

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false)
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

  const content = modalContent[language]

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        {backgroundIcons.map((Icon, i) => (
          <div
            key={i}
            className="absolute text-[#1e4a8d]"
            style={{
              left: `${(i * 15) % 100}%`,
              top: `${(i * 20) % 100}%`,
              animation: `float-bg ${10 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 1.2}s`,
            }}
          >
            <Icon className="w-24 h-24 md:w-32 md:h-32" />
          </div>
        ))}
      </div>

      <Header />

      {/* Appointment Modal - same as hero */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-fade-in-scale overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">{content.title}</h2>
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {content.fullName}
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700">
                    {content.phone}
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700">
                    {content.department}
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700">
                    {content.date}
                  </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {content.time}
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {content.message}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={content.placeholder.message}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1e4a8d] focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-center animate-fade-in">
                  ✅ {content.success}
                </div>
              )}
              {submitStatus === "error" && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-center animate-fade-in">
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
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  {content.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative h-[450px] bg-gradient-to-br from-[#0e3166] via-[#06164e] to-[#06224b]  overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-full animate-pulse-line"
              style={{
                top: `${15 + i * 15}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${2.5 + i * 0.5}s`,
              }}
            />
          ))}
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 animate-fade-in-up drop-shadow-2xl tracking-wide">
            {t("Xizmatlar", "Услуги")}
          </h1>
          <p
            className="text-white/90 text-xl max-w-3xl animate-fade-in-up drop-shadow-lg font-light"
            style={{ animationDelay: "0.3s" }}
          >
            {t(
              "Yuqori sifatli va zamonaviy tibbiy xizmatlar bilan salomatligingizni himoya qilamiz",
              "Высококачественные и современные медицинские услуги для вашего здоровья"
            )}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <main className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(12)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <article
                key={service.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up border border-gray-200/50"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {service.photo && (
                  <div className="relative h-56 overflow-hidden group">
                    <Image
                      src={
                        getImageUrl("services", service.photo) ||
                        "/placeholder.svg?height=300&width=400&query=medical service"
                      }
                      alt={language === "ru" ? service.title_ru : service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {language === "ru" ? service.title_ru : service.title}
                  </h3>
                  <p className="text-gray-600 text-base mb-5 line-clamp-4 leading-relaxed">
                    {language === "ru" ? service.description_ru : service.description}
                  </p>
                  <Link
                    href={`/services/${service.id}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d32f2f] to-[#b71c1c] text-white px-6 py-3 rounded-full text-sm font-medium hover:from-[#b71c1c] hover:to-[#d32f2f] transition-all duration-300"
                  >
                    {t("Batafsil", "Подробнее")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-br from-[#d32f2f] to-[#b71c1c] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <Heart className="absolute top-6 right-6 w-40 h-40 animate-pulse" />
            <Stethoscope
              className="absolute bottom-6 left-6 w-32 h-32 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 relative z-10">
            {t("Qabulga yozilish", "Записаться на прием")}
          </h2>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-10 font-light">
            {t(
              "Bizning mutaxassislarimiz sizga professional tibbiy yordam ko'rsatishga tayyor. Hoziroq yoziling va salomatligingizni himoya qiling!",
              "Наши специалисты готовы оказать вам профессиональную медицинскую помощь. Запишитесь прямо сейчас и защитите свое здоровье!"
            )}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-block bg-white text-[#d32f2f] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 hover:text-[#b71c1c] transition-all duration-300 relative z-10 shadow-md hover:shadow-lg"
          >
            {t("Qabulga yozilish", "Записаться на прием")}
          </button>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes float-bg {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
          33% { transform: translate(-40px, -50px) rotate(-15deg); opacity: 0.6; }
          66% { transform: translate(40px, -30px) rotate(15deg); opacity: 0.5; }
        }
        @keyframes pulse-line {
          0%, 100% { opacity: 0.3; transform: translateX(-100%); }
          50% { opacity: 0.6; transform: translateX(100%); }
        }
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-pulse-line {
          animation: pulse-line 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}