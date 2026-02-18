"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Facebook, Instagram, Send, X, Phone } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl, getVideoUrl } from "@/lib/config"
import type { Doctor, Direction, DirectionDoctor } from "@/lib/types"

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
    phoneTitle: "Telefon orqali bog'laning",
    phoneDesc: "Qo'ng'iroq qiling va darhol yoziling",
    orText: "yoki forma orqali yoziling",
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
    phoneTitle: "Свяжитесь по телефону",
    phoneDesc: "Позвоните и запишитесь сразу",
    orText: "или запишитесь через форму",
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

// ✅ Klinika telefon raqamlarini shu yerda o'zgartiring
const CLINIC_PHONES = [
  { label: "+998 77 313 01 30", number: "+998 77 313 01 30" },
  { label: "+998 55 902 10 10", number: "+998 55 902 10 10" },
]

export default function DoctorDetailPage() {
  const { language, t } = useLanguage()
  const params = useParams()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [doctorDirection, setDoctorDirection] = useState<Direction | null>(null)
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
    if (params.id) {
      Promise.all([api.getDoctor(Number(params.id)), api.getDirectionDoctors().catch(() => [])])
        .then(([doctorData, directionDoctorsData]) => {
          setDoctor(doctorData)
          const relation = directionDoctorsData.find(
            (dd: DirectionDoctor) => String(dd.doctors_id) === String(params.id),
          )
          if (relation?.direction) {
            setDoctorDirection(relation.direction as Direction)
          }
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    }
  }, [params.id])

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
          doctor_name: doctor ? `${doctor.first_name} ${doctor.last_name}` : "",
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

  const scrollToContent = () => {
    document.getElementById("doctor-content")?.scrollIntoView({ behavior: "smooth" })
  }

  const content = modalContent[language]

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
              <Skeleton className="w-[500px] h-[600px] rounded-full" />
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

  if (!doctor) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("Shifokor topilmadi", "Врач не найден")}</h1>
          <Link href="/doctors" className="text-[#d32f2f] hover:underline">
            {t("Shifokorlarga qaytish", "Вернуться к врачам")}
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const videoUrl = getVideoUrl("doctor", doctor.video)

  return (
    <div className="min-h-screen">
      <Header />

      {/* ===== APPOINTMENT MODAL ===== */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
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

            {/* ===== PHONE BLOCK ===== */}
            <div className="mx-6 mt-6 bg-gradient-to-r from-[#1e4a8d]/10 to-[#0d7377]/10 border border-[#1e4a8d]/20 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#1e4a8d] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{content.phoneTitle}</p>
                  <p className="text-gray-500 text-sm">{content.phoneDesc}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {CLINIC_PHONES.map((ph) => (
                  <a
                    key={ph.number}
                    href={`tel:${ph.number}`}
                    className="flex items-center justify-center gap-2 flex-1 bg-[#1e4a8d] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#163a6f] transition-all text-sm shadow-md hover:shadow-lg active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    {ph.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 px-6 mt-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm font-medium whitespace-nowrap">{content.orText}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* ===== FORM ===== */}
            <form onSubmit={handleSubmit} className="p-6 pt-4">
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

              {/* Submit Buttons */}
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

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-[#5a7a9a] to-[#3d5a7a] pt-12 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light italic text-white mb-6">
              {t("Bizning shifokorlarimiz", "Наши врачи")}
            </h1>
            <p className="text-white/80 max-w-2xl text-lg leading-relaxed">
              {t(
                "Endokrinologiya klinikasi shifokorlari har bir bemorga ishonchli va g'amxo'rlik qiluvchi yuqori malakali mutaxassislardir.",
                "Врачи клиники Endokринология  - высококвалифицированные специалисты, заботящиеся о каждом пациенте.",
              )}
            </p>
          </div>
        </section>

        {/* Social bar */}
        <section className="bg-white py-6 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={scrollToContent}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              {t("Pastga aylantiring", "Прокрутите вниз")}
              <ChevronDown className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/share/1ACDrfwnCj/?mibextid=wwXIfr"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/endokrinolog_uz_?igsh=dWJpcXN1YjJwbGpj"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/endokrinologiya_kardialogiya"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Doctor content */}
        <section id="doctor-content" className="bg-white rounded-t-[40px] -mt-4 relative z-10 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              {/* Photo */}
              <div className="relative flex-shrink-0 mx-auto lg:mx-0">
                <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden bg-gradient-to-br from-sky-100 via-sky-50 to-cyan-100">
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 500 500">
                    <defs>
                      <pattern id="hexPatternDoc" width="40" height="35" patternUnits="userSpaceOnUse">
                        <path
                          d="M20 0L40 11.55V34.64L20 46.19L0 34.64V11.55Z"
                          fill="none"
                          stroke="#0ea5e9"
                          strokeWidth="0.8"
                          opacity="0.6"
                        />
                      </pattern>
                    </defs>
                    <rect width="500" height="500" fill="url(#hexPatternDoc)" />
                  </svg>
                  <div className="absolute inset-0 flex items-end justify-center">
                    <div className="relative w-[85%] h-[95%]">
                      <Image
                        src={
                          getImageUrl("doctor", doctor.photo) ||
                          "/placeholder.svg?height=500&width=400&query=doctor portrait professional" ||
                          "/placeholder.svg"
                        }
                        alt={`${doctor.first_name} ${doctor.last_name}`}
                        fill
                        className="object-contain object-bottom"
                        priority
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-sky-100 to-transparent"></div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 lg:pt-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {doctor.first_name} {doctor.last_name}
                </h2>
                <p className="text-xl md:text-2xl text-[#1e88e5] mb-10 font-medium">
                  {language === "ru" ? doctor.specialization_ru : doctor.specialization}
                </p>

                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  {/* Ta'lim */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("Ta'lim", "Образование")}</h3>
                    <ul className="space-y-2 text-gray-700 text-lg">
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-gray-800 mt-2.5 flex-shrink-0"></span>
                        <span>{language === "ru" ? doctor.education_ru : doctor.education}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Tajriba */}
                  {(doctor.staji || doctor.staji_ru) && (
                    <div className="mb-8 pt-6 border-t border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("Tajriba", "Стаж")}</h3>
                      <p className="text-gray-700 text-lg">{language === "ru" ? doctor.staji_ru : doctor.staji}</p>
                    </div>
                  )}

                  {/* Bo'lim */}
                  {doctorDirection && (
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("Bo'lim", "Отделение")}</h3>
                      <Link
                        href={`/departments/${doctorDirection.id}`}
                        className="inline-flex items-center gap-2 text-[#1e4a8d] font-semibold text-lg hover:text-[#d32f2f] transition-colors"
                      >
                        {language === "ru" ? doctorDirection.title_ru : doctorDirection.title}
                        <ChevronDown className="w-5 h-5 -rotate-90" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Video */}
                {videoUrl && (
                  <div className="mt-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-5">{t("Video", "Видео")}</h3>
                    <video src={videoUrl} controls className="w-full rounded-3xl max-h-[400px]" />
                  </div>
                )}

                {/* CTA Button — opens modal */}
                <div className="mt-10">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 bg-[#d32f2f] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#b71c1c] transition-colors text-lg shadow-lg hover:shadow-xl"
                  >
                    {t("Qabulga yozilish", "Записаться на прием")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.25s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}