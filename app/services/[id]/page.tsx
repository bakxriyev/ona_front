"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Facebook, Instagram, Send, Youtube, Calendar, Clock } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl, getVideoUrl } from "@/lib/config"
import type { Service } from "@/lib/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function ServiceDetailPage() {
  const { language, t } = useLanguage()
  const params = useParams()
  const [service, setService] = useState<Service | null>(null)
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

      await fetch("/users", {
  method: "POST",
  body: data,
})

      toast({
        title: t("Muvaffaqiyatli!", "Успешно!"),
        description: t("Qabulga yozilish muvaffaqiyatli amalga oshirildi.", "Запись на прием успешно отправлена."),
      })
      setIsModalOpen(false)
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("Xizmat topilmadi", "Услуга не найдена")}</h1>
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

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#5a7a9a] to-[#3d5a7a] pt-12 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light italic text-white mb-6">
              {t("Bizning xizmatlarimiz", "Наши услуги")}
            </h1>
            <p className="text-white/80 max-w-2xl text-lg leading-relaxed">
              {t(
                "Akfa Medline yuqori sifatli va zamonaviy tibbiy xizmatlar ko'rsatadi.",
                "Akfa Medline предоставляет высококачественные и современные медицинские услуги.",
              )}
            </p>
          </div>
        </section>

        {/* Navigation bar with social icons */}
        <section className="bg-white py-6 px-4 shadow-md">
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
                href="#"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Service content section */}
        <section id="service-content" className="bg-white rounded-t-[40px] -mt-4 relative z-10 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              {/* Service Image - Rectangular with rounded corners and gradient overlay */}
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

              {/* Service Information - Full padding applied to the entire info block */}
              <div className="flex-1 p-6 md:p-8 lg:p-10 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                {/* Full Name */}
                {service.full_name && (
                  <p className="text-lg text-gray-500 mb-2 font-medium">
                    {language === "ru" ? service.full_name_ru : service.full_name}
                  </p>
                )}

                {/* Title */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {language === "ru" ? service.title_ru : service.title}
                </h2>

                {/* Description */}
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {language === "ru" ? service.description_ru : service.description}
                </p>

                {/* About Section */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("Xizmat haqida", "Об услуге")}</h3>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
                  <p className="whitespace-pre-line">{language === "ru" ? service.about_ru : service.about}</p>
                </div>

                {/* Video - Only if not null */}
                {videoUrl && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("Video", "Видео")}</h3>
                    <video src={videoUrl} controls className="w-full rounded-3xl max-h-[400px] shadow-lg" />
                  </div>
                )}
              </div>
            </div>

            {/* Details Section - Placed below the main service info, with larger trigger fonts */}
            {service.details && service.details.length > 0 && (
              <div className="mt-16">
                <h3 className="text-3xl font-extrabold text-gray-900 mb-8 text-center lg:text-left">{t("Batafsil ma'lumotlar", "Подробности")}</h3>
                <Accordion type="single" collapsible className="w-full">
                  {service.details.map((detail, index) => {
                    const detailVideoUrl = detail.video ? getVideoUrl("services", detail.video) : null
                    return (
                      <AccordionItem key={detail.id} value={`item-${index}`} className="border-b border-gray-200">
                        <AccordionTrigger className="text-left text-2xl font-bold text-gray-800 hover:text-[#d32f2f] transition-colors py-6">
                          {language === "ru" ? detail.title_ru : detail.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-lg leading-relaxed py-6">
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

            {/* CTA Button - Placed below details */}
            <div className="mt-16 text-center">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="inline-flex items-center justify-center gap-2 bg-[#d32f2f] text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-[#b71c1c] transition-colors shadow-lg hover:shadow-xl"
                  >
                    {t("Qabulga yozilish", "Записаться на прием")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-white rounded-3xl p-8 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-extrabold text-[#1e4a8d] text-center mb-8">
                      {t("Qabulga yozilish", "Запись на прием")}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="full_name" className="text-gray-700 font-medium mb-2 block text-lg">
                          {t("F.I.O", "Ф.И.О")}
                        </Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          required
                          className="rounded-xl text-lg py-6"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone_number" className="text-gray-700 font-medium mb-2 block text-lg">
                          {t("Telefon raqam", "Телефонный номер")}
                        </Label>
                        <Input
                          id="phone_number"
                          name="phone_number"
                          type="tel"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          required
                          className="rounded-xl text-lg py-6"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="photo" className="text-gray-700 font-medium mb-2 block text-lg">
                        {t("Rasm (ixtiyoriy)", "Фото (опционально)")}
                      </Label>
                      <Input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="rounded-xl text-lg py-6"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="department" className="text-gray-700 font-medium mb-2 block text-lg">
                          {t("Bo'lim", "Отделение")}
                        </Label>
                        <Select onValueChange={(value) => handleSelectChange("department", value)}>
                          <SelectTrigger className="rounded-xl text-lg py-6">
                            <SelectValue placeholder={t("Tanlang", "Выберите")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Endokrinologiya">{t("Endokrinologiya", "Эндокринология")}</SelectItem>
                            <SelectItem value="Kardiologiya">{t("Kardiologiya", "Кардиология")}</SelectItem>
                            <SelectItem value="Nevrologiya">{t("Nevrologiya", "Неврология")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="doctor_name" className="text-gray-700 font-medium mb-2 block text-lg">
                          {t("Shifokor nomi", "Имя врача")}
                        </Label>
                        <Select onValueChange={(value) => handleSelectChange("doctor_name", value)}>
                          <SelectTrigger className="rounded-xl text-lg py-6">
                            <SelectValue placeholder={t("Tanlang", "Выберите")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dr. Karimov">{t("Dr. Karimov", "Др. Каримов")}</SelectItem>
                            <SelectItem value="Dr. Aliyeva">{t("Dr. Aliyeva", "Др. Алиева")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-gray-700 font-medium mb-2 block text-lg">
                        {t("Xabar", "Сообщение")}
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="rounded-xl text-lg py-4"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="appointment_date" className="text-gray-700 font-medium mb-2 block text-lg">
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
                            className="rounded-xl pl-12 text-lg py-6"
                            min={new Date().toISOString().split("T")[0]}
                          />
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="appointment_time" className="text-gray-700 font-medium mb-2 block text-lg">
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
                            className="rounded-xl pl-12 text-lg py-6"
                            step="1800"
                          />
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1e4a8d] hover:bg-[#0d7377] text-white rounded-xl py-8 text-xl font-bold"
                    >
                      {isSubmitting ? t("Jo'natilmoqda...", "Отправка...") : t("Yuborish", "Отправить")}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Additional CTA Section */}
        <section className="bg-gradient-to-r from-[#1e4a8d] to-[#0f2a4a] py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("Savollaringiz bormi?", "Есть вопросы?")}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              {t(
                "Bizning mutaxassislarimiz sizga barcha savollaringizga javob berishga tayyor",
                "Наши специалисты готовы ответить на все ваши вопросы",
              )}
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-[#1e4a8d] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg"
            >
              {t("Bog'lanish", "Связаться")}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}