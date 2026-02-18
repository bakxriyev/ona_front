"use client"

import Link from "next/link"
import {
  Plus,
  Globe,
  Shield,
  Layers,
  Users,
  Briefcase,
  Activity,
  Heart,
  Stethoscope,
  Syringe,
  Ambulance,
  Hospital,
  Phone,
  MessageCircle,
  Instagram,
  X,
} from "lucide-react"
import { HeroSkeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"
import { useEffect, useState } from "react"
import Image from "next/image"
import { About, QuickAction, Slider } from "@/lib/types"

interface HeroSectionProps {
  isLoading?: boolean
  about?: About | null
  quickActions?: QuickAction[]
  slider?: Slider | null
}

interface AppointmentFormData {
  full_name: string
  phone_number: string
  department: string
  message: string
  appointment_date: string
  appointment_time: string
}

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  onAppointmentOpen: () => void
  language: 'uz' | 'ru'
}

interface TimeSlot {
  id: number
  time: string
  available: boolean
}

const quickActions = [
  { icon: Plus, label: "Qabulga yozilish", label_ru: "Записаться на прием", href: "/appointment" },
  { icon: Globe, label: "Biz haqimizda", label_ru: "О нас", href: "/about" },
  { icon: Shield, label: "Yangiliklar", label_ru: "Новости", href: "/news" },
  { icon: Layers, label: "Bo'limlar", label_ru: "Отделения", href: "/departments" },
  { icon: Users, label: "Shifokorlar", label_ru: "Врачи", href: "/doctors" }
]

const heroContent = {
  uz: {
    title: "Sizga bo'lgan g'amxo'rligimiz —",
    titleSecond: "bizning kasbimiz.",
    subtitle: "Ona va bola salomatligi — kelajak kafolati",
    buttonPatients: "Biz bilan bog'lanish",
    buttonDoctors: "Shifokorlarimiz haqida",
    appointmentModal: {
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
        date: "Sana tanlang",
        time: "Vaqt tanlang",
      }
    },
    contactModal: {
      title: "Biz bilan bog'lanish",
      phone: "Telefon orqali",
      telegram: "Telegram orqali",
      instagram: "Instagram orqali",
      appointment: "Qabulga yozilish",
      close: "Yopish"
    }
  },
  ru: {
    title: "Забота о вас —",
    titleSecond: "наша профессия.",
    subtitle: "Здоровье матери и ребёнка — гарантия будущего",
    buttonPatients: "Связаться с нами",
    buttonDoctors: "О наших врачах",
    appointmentModal: {
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
        date: "Выберите дата",
        time: "Выберите время",
      }
    },
    contactModal: {
      title: "Связаться с нами",
      phone: "По телефону",
      telegram: "Через Telegram",
      instagram: "Через Instagram",
      appointment: "Запись на прием",
      close: "Закрыть"
    }
  },
}

// Static image data - optimized for fast loading
const clinicImages = [
  { id: 1, src: "/photo1.jpg", title: "Jarrohlik", alt: "Jarrohlik bo'limi" },
  { id: 2, src: "/photo2.jpg", title: "Konsultatsiya", alt: "Konsultatsiya xonasi" },

]

// Hospital ikonlari
const medicalIcons = [Activity, Heart, Stethoscope, Syringe, Ambulance, Hospital]

// Time slots for the day
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

// Contact Modal Component
const ContactModal = ({ isOpen, onClose, onAppointmentOpen, language }: ContactModalProps) => {
  const content = heroContent[language].contactModal
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-fade-in-scale overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{content.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Phone */}
          <a
            href="tel:+998901234567"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{content.phone}</h3>
             <p>{"95-818-84-42 "}</p>
                <p>{"95-818-84-43"}</p>
                <p>{"90-820-67-87"}</p>
            </div>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/ona_bolalar1/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:bg-cyan-50 hover:border-cyan-300 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
              <MessageCircle className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{content.telegram}</h3>
              <p className="text-sm text-gray-600">Telegram kanalimiz</p>
            </div>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/ona_bola_clinic/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:bg-pink-50 hover:border-pink-300 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center group-hover:from-pink-600 group-hover:to-purple-700 transition-colors">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{content.instagram}</h3>
              <p className="text-sm text-gray-600">ona_bola_clinic</p>
            </div>
          </a>

          {/* Appointment Button */}
          <button
            onClick={() => {
              onClose()
              onAppointmentOpen()
            }}
            className="w-full bg-gradient-to-r from-red-700 to-red-800 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-[1.02] mt-4"
          >
            {content.appointment}
          </button>
        </div>
      </div>
    </div>
  )
}

export function HeroSection({ isLoading }: HeroSectionProps) {
  const { language } = useLanguage()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
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

  // Auto-slide images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % clinicImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Fetch departments from API
  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    setLoadingDepartments(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL 
      if (!apiUrl) {
        console.error("API URL not configured")
        return
      }
      
      const response = await fetch(`${apiUrl}/direction`)
      
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          const departmentNames = data.map(dept => dept.name || dept.title || dept)
          setDepartments(departmentNames)
        }
      }
    } catch (error) {
      console.error("Error fetching departments:", error)
      // Fallback departments if API fails
      setDepartments([
        "Endokrinologiya",
        "Kardiologiya",
        "Nevrologiya",
        "Stomatologiya",
        "Pediatriya",
        "Travmatologiya",
        "Terapiya"
      ])
    } finally {
      setLoadingDepartments(false)
    }
  }

  const handleQuickActionClick = (href: string) => {
    if (href === "/appointment") {
      setIsAppointmentModalOpen(true)
    }
  }

  const handleContactClick = () => {
    setIsContactModalOpen(true)
  }

  const handleTimeSlotClick = (time: string) => {
    setFormData(prev => ({
      ...prev,
      appointment_time: time
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        throw new Error("API URL not configured")
      }
      
      // Submit appointment data to /users endpoint
      const appointmentResponse = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          phone_number: formData.phone_number.replace(/\D/g, ''),
          doctor_name: "", // Empty since doctor selection is removed
          photo: "" // Empty since photo is not required
        })
      })

      if (appointmentResponse.ok) {
        setSubmitStatus("success")
        // Reset form
        setFormData({
          full_name: "",
          phone_number: "",
          department: "",
          message: "",
          appointment_date: "",
          appointment_time: "",
        })
        // Close modal after 2 seconds
        setTimeout(() => {
          setIsAppointmentModalOpen(false)
          setSubmitStatus("idle")
        }, 2000)
      } else {
        const errorText = await appointmentResponse.text()
        console.error("API Error:", errorText)
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseAppointmentModal = () => {
    if (!isSubmitting) {
      setIsAppointmentModalOpen(false)
      setSubmitStatus("idle")
      // Reset form
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

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false)
  }

  const handleAppointmentFromContact = () => {
    handleCloseContactModal()
    setIsAppointmentModalOpen(true)
  }

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Get date 30 days from now for max date
  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }

  if (isLoading) {
    return <HeroSkeleton />
  }

  const content = heroContent[language]

  return (
    <section className="relative overflow-hidden">
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
        onAppointmentOpen={handleAppointmentFromContact}
        language={language}
      />

      {/* Appointment Modal */}
      {isAppointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-fade-in-scale overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">
                {content.appointmentModal.title}
              </h2>
              <button
                onClick={handleCloseAppointmentModal}
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
                    {content.appointmentModal.fullName}
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder={content.appointmentModal.placeholder.fullName}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {content.appointmentModal.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder={content.appointmentModal.placeholder.phone}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {content.appointmentModal.department}
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={loadingDepartments}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{loadingDepartments ? "Yuklanmoqda..." : content.appointmentModal.placeholder.department}</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {content.appointmentModal.date}
                  </label>
                  <input
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    max={getMaxDate()}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {content.appointmentModal.time}
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
                          ? "bg-red-700 text-white ring-2 ring-red-700 ring-offset-2"
                          : slot.available
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:border-gray-300"
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
                  {content.appointmentModal.message}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={content.appointmentModal.placeholder.message}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              {/* Status Message */}
              {submitStatus === "success" && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-center animate-fade-in">
                  ✅ {content.appointmentModal.success}
                </div>
              )}
              
              {submitStatus === "error" && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-center animate-fade-in">
                  ❌ {content.appointmentModal.error}
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-red-700 to-red-800 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? content.appointmentModal.loading : content.appointmentModal.submit}
                </button>
                <button
                  type="button"
                  onClick={handleCloseAppointmentModal}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  {content.appointmentModal.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative min-h-[800px] bg-gradient-to-br from-white via-white to-gray-50">
        {/* Background Medical Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {medicalIcons.map((Icon, i) => (
            <div
              key={i}
              className="absolute opacity-10 animate-float"
              style={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 90}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`,
              }}
            >
              <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-full">
                <Icon className="w-16 h-16 text-white" />
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-red-600/5" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-700 to-transparent" />

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent animate-fade-in-up">
                  {content.title}
                </span>
                <br />
                <span className="italic animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  {content.titleSecond}
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className="text-xl text-gray-600 leading-relaxed max-w-xl animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                {content.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                <button
                  onClick={handleContactClick}
                  className="group relative bg-gradient-to-r from-red-700 to-red-800 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/50 transition-all hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10">{content.buttonPatients}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <Link
                  href="/doctors"
                  className="group relative bg-white text-red-700 px-8 py-4 rounded-full font-semibold border-2 border-red-700 hover:bg-red-50 transition-all hover:scale-105"
                >
                  {content.buttonDoctors}
                </Link>
              </div>

              
            </div>

            {/* Right Content - Image Slider */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <div className="relative h-[600px] flex items-center justify-center gap-4">
                {clinicImages.map((image, index) => {
                  const isActive = index === currentImageIndex
                  const isPrev = index === (currentImageIndex - 1 + clinicImages.length) % clinicImages.length
                  const isNext = index === (currentImageIndex + 1) % clinicImages.length

                  return (
                    <div
                      key={image.id}
                      className={`absolute transition-all duration-700 ease-out ${
                        isActive
                          ? "z-30 scale-100 opacity-100 translate-x-0"
                          : isPrev
                            ? "z-20 scale-90 opacity-50 -translate-x-32 blur-sm"
                            : isNext
                              ? "z-20 scale-90 opacity-50 translate-x-32 blur-sm"
                              : "z-10 scale-75 opacity-0"
                      }`}
                    >
                      <div className="relative w-[300px] h-[520px] rounded-3xl overflow-hidden shadow-2xl bg-white border-2 border-red-700/20">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={isActive} // Priority for active image only
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-bold">{image.title}</h3>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Image indicator dots */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {clinicImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? "w-8 bg-red-700" : "bg-red-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="relative -mt-20 z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => {
            if (action.href === "/appointment") {
              return (
                <button
                  key={action.href}
                  onClick={() => handleQuickActionClick(action.href)}
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 animate-fade-in-up overflow-hidden cursor-pointer"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-600/10 to-red-700/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <action.icon className="w-6 h-6 text-red-700" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-center block">
                      {language === "ru" ? action.label_ru : action.label}
                    </span>
                  </div>
                </button>
              )
            }

            return (
              <Link
                key={action.href}
                href={action.href}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-600/10 to-red-700/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <action.icon className="w-6 h-6 text-red-700" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center block">
                    {language === "ru" ? action.label_ru : action.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  )
}