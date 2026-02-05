"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart, Stethoscope, Activity, Cross, Calendar, Clock } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CardSkeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl } from "../../lib/config"
import type { Service } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const backgroundIcons = [Heart, Stethoscope, Activity, Cross, Heart, Stethoscope, Activity, Cross]

export default function ServicesPage() {
  const { language, t } = useLanguage()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    photo: null as File | null,
    department: "",
    doctor_name: "",
    message: "",
    appointment_date: "",
    appointment_time: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    api
      .getServices()
      .then((data) => {
        setServices(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, photo: file }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // FormData for file upload if photo exists
      const data = new FormData()
      data.append("full_name", formData.full_name)
      data.append("phone_number", formData.phone_number)
      if (formData.photo) {
        data.append("photo", formData.photo)
      }
      data.append("department", formData.department)
      data.append("doctor_name", formData.doctor_name)
      data.append("message", formData.message)
      data.append("appointment_date", formData.appointment_date)
      data.append("appointment_time", formData.appointment_time)

      // Assuming api.post handles FormData or adjust to JSON if no file
      await api.post("/users", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast({
        title: t("Muvaffaqiyatli!", "Успешно!"),
        description: t("Qabulga yozilish muvaffaqiyatli amalga oshirildi.", "Запись на прием успешно отправлена."),
        variant: "success",
      })
      setIsModalOpen(false)
      // Reset form
      setFormData({
        full_name: "",
        phone_number: "",
        photo: null,
        department: "",
        doctor_name: "",
        message: "",
        appointment_date: "",
        appointment_time: "",
      })
    } catch (error) {
      toast({
        title: t("Xatolik!", "Ошибка!"),
        description: t("Qabulga yozilishda xatolik yuz berdi.", "Произошла ошибка при записи на прием."),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Icons for subtle animation */}
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

      {/* Hero - Enhanced with glow, larger text, and pulse lines */}
      <div className="relative h-[450px] bg-gradient-to-br from-[#1e4a8d] via-[#0d7377] to-[#1e4a8d] overflow-hidden shadow-2xl">
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
            {t("Yuqori sifatli va zamonaviy tibbiy xizmatlar bilan salomatligingizni himoya qilamiz", "Высококачественные и современные медицинские услуги для вашего здоровья")}
          </p>
        </div>
      </div>

      {/* Services Grid - Improved layout with more columns on larger screens */}
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
                      src={getImageUrl("services", service.photo) || "/placeholder.svg?height=300&width=400&query=medical service"}
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

        {/* CTA Section - Enhanced with icons and hover effects */}
        <div className="mt-20 bg-gradient-to-br from-[#d32f2f] to-[#b71c1c] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-15">
            <Heart className="absolute top-6 right-6 w-40 h-40 animate-pulse" />
            <Stethoscope className="absolute bottom-6 left-6 w-32 h-32 animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 relative z-10">
            {t("Qabulga yozilish", "Записаться на прием")}
          </h2>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-10 font-light">
            {t(
              "Bizning mutaxassislarimiz sizga professional tibbiy yordam ko'rsatishga tayyor. Hoziroq yoziling va salomatligingizni himoya qiling!",
              "Наши специалисты готовы оказать вам профессиональную медицинскую помощь. Запишитесь прямо сейчас и защитите свое здоровье!",
            )}
          </p>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="inline-block bg-white text-[#d32f2f] px-10 py-8 rounded-full font-bold text-lg hover:bg-gray-100 hover:text-[#b71c1c] transition-all duration-300 relative z-10 shadow-md hover:shadow-lg"
              >
                {t("Qabulga yozilish", "Записаться на прием")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white rounded-3xl p-8 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-extrabold text-[#1e4a8d] text-center mb-6">
                  {t("Qabulga yozilish", "Запись на прием")}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="full_name" className="text-gray-700 font-medium mb-2 block">
                      {t("F.I.O", "Ф.И.О")}
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number" className="text-gray-700 font-medium mb-2 block">
                      {t("Telefon raqam", "Телефонный номер")}
                    </Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="photo" className="text-gray-700 font-medium mb-2 block">
                    {t("Rasm (ixtiyoriy)", "Фото (опционально)")}
                  </Label>
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="department" className="text-gray-700 font-medium mb-2 block">
                      {t("Bo'lim", "Отделение")}
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("department", value)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder={t("Tanlang", "Выберите")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Endokrinologiya">{t("Endokrinologiya", "Эндокринология")}</SelectItem>
                        <SelectItem value="Kardiologiya">{t("Kardiologiya", "Кардиология")}</SelectItem>
                        <SelectItem value="Nevrologiya">{t("Nevrologiya", "Неврология")}</SelectItem>
                        {/* Qo'shimcha bo'limlar qo'shish mumkin */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="doctor_name" className="text-gray-700 font-medium mb-2 block">
                      {t("Shifokor nomi", "Имя врача")}
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("doctor_name", value)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder={t("Tanlang", "Выберите")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. Karimov">{t("Dr. Karimov", "Др. Каримов")}</SelectItem>
                        <SelectItem value="Dr. Aliyeva">{t("Dr. Aliyeva", "Др. Алиева")}</SelectItem>
                        {/* Qo'shimcha shifokorlar qo'shish mumkin */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700 font-medium mb-2 block">
                    {t("Xabar", "Сообщение")}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="appointment_date" className="text-gray-700 font-medium mb-2 block">
                      {t("Sana", "Дата")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="appointment_date"
                        name="appointment_date"
                        type="date"
                        value={formData.appointment_date}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl pl-10"
                        min={new Date().toISOString().split("T")[0]} // Bugundan boshlab
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="appointment_time" className="text-gray-700 font-medium mb-2 block">
                      {t("Vaqt", "Время")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="appointment_time"
                        name="appointment_time"
                        type="time"
                        value={formData.appointment_time}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl pl-10"
                        step="1800" // 30 daqiqa interval
                      />
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1e4a8d] hover:bg-[#0d7377] text-white rounded-xl py-6 text-lg font-bold"
                >
                  {isSubmitting ? t("Jo'natilmoqda...", "Отправка...") : t("Yuborish", "Отправить")}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />

      {/* Custom animations - Smooth and professional */}
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
      `}</style>
    </div>
  )
}