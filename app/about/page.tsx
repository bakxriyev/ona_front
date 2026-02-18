"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl } from "../../lib/config"
import type { About, Stat, Feature } from "@/lib/types"
import { Heart, Stethoscope, Activity, Cross, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const backgroundIcons = [Heart, Stethoscope, Activity, Cross, Heart, Stethoscope, Activity, Cross]

export default function AboutPage() {
  const { language, t } = useLanguage()
  const [about, setAbout] = useState<About | null>(null)
  const [stats, setStats] = useState<Stat[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const detailedAboutUz = `Shifoxonamiz 2022-yil oktyabr oyida o‘z ish faoliyatini boshlagan. Shifoxonamiz Toshkent shahar Bektemir tumani, Obod ko‘chasi 123-uyda joylashgan bo‘lib, klinikamizda pediatriya, nevrologiya, endokrinologiya, ginekologiya, umumiy terapiya hamda otorinolaringologiya bo‘limlari tashkil qilingan va 25 o‘rin joy bilan ta’minlangan.

Palatalarimizda barcha sharoitlar mavjud bo‘lib, lyuks toifasiga kiradi. “Sog‘lom ona va bola” klinikasi 2022-yildan buyon ona va bola hamda nuroniylarimiz salomatligini muhofaza qilish, erta tashxis va sifatli davolash ishlarini amalga oshirib kelmoqda.

Klinikamiz zamonaviy tibbiy jihozlar bilan ta’minlangan bo‘lib, yuqori malakali shifokorlar tomonidan bemorlarga sifatli tibbiy xizmat ko‘rsatiladi. Klinika ish vaqti 24/7 rejimda bo‘lib, klinikamizda laboratoriya, fizioterapiya, ambulator davolash, statsionar davolash hamda tez tibbiy yordam xizmati (1299) faoliyat yuritadi. Bilimli, malakali, mehribon va mehnatsevar xodimlar bemorlarga xizmat ko‘rsatadi.

2024-yildan buyon Qozog‘iston va Tojikiston davlatlaridan bemorlar oqimi sezilarli darajada oshib bormoqda. Biz kelgusida chet el fuqarolari uchun yanada ko‘proq qulayliklar yaratib, ularni xursand qilish niyatidamiz.

Shu kungacha “Sog‘lom ona va bola” klinikasida jami 2 500 nafar statsionar va 25 000 nafardan ortiq ambulator bemorlarga tibbiy xizmat ko‘rsatilgan.

Joriy yilgi ish rejamizda oliy toifali jarroh shifokorlar tomonidan eng zamonaviy, Yevropa standartlariga javob beradigan tibbiy jihozlar bilan ta’minlangan jarrohlik bo‘limini ishga tushirish rejalashtirilgan.

Kelajakda 300 o‘ringa mo‘ljallangan tug‘ruq kompleksi 2026-yilda ochilishi rejalashtirilgan bo‘lib, ushbu yo‘nalishda qurilish ishlari jadal sur’atlarda olib borilmoqda`

  const detailedAboutRu = `Наша больница начала свою деятельность в октябре 2022 года. Клиника расположена по адресу: город Ташкент, Бектемирский район, улица Обод, дом 123. В клинике организованы отделения педиатрии, неврологии, эндокринологии, гинекологии, общей терапии и оториноларингологии, а также имеется 25 койко-мест.

Палаты оснащены всеми необходимыми удобствами и относятся к категории «люкс». Клиника «Соглом она ва бола» с 2022 года успешно осуществляет деятельность по охране здоровья матерей, детей и пожилых людей, ранней диагностике и качественному лечению.

Клиника оснащена современным медицинским оборудованием, а высококвалифицированные врачи оказывают пациентам качественные медицинские услуги. Учреждение работает в режиме 24/7. В клинике функционируют лаборатория, физиотерапевтическое отделение, амбулаторное и стационарное лечение, а также служба скорой медицинской помощи (1299). Пациентов обслуживают грамотные, опытные, заботливые и трудолюбивые сотрудники.

С 2024 года значительно увеличился поток пациентов из Казахстана и Таджикистана. В будущем мы планируем создать ещё более комфортные условия для иностранных граждан.

На сегодняшний день в клинике «Соглом она ва бола» оказана медицинская помощь 2 500 стационарным и более 25 000 амбулаторным пациентам.

В текущем году планируется запуск хирургического отделения, оснащённого самым современным медицинским оборудованием, соответствующим европейским стандартам, где операции будут проводить хирурги высшей категории.

В перспективе запланировано открытие родильного комплекса на 300 коек в 2026 году, в настоящее время строительные работы ведутся ускоренными темпами`

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
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

      {/* Hero - Improved with better typography and subtle glow */}
      <div className="relative h-[450px] bg-gradient-to-br from-[#0e3166] via-[#0e225c] to-[#06224b] overflow-hidden shadow-2xl">
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
            {language === "ru" ? "О клинике" : "Klinika haqida"}
          </h1>
          <p
            className="text-white/90 text-xl max-w-3xl animate-fade-in-up drop-shadow-lg font-light"
            style={{ animationDelay: "0.3s" }}
          >
            {language === "ru" ? "Мы заботимся о вашем здоровье с душой и профессионализмом" : "Sizning salomatligingiz biz uchun muhim - professionallik va mehribonlik bilan xizmat qilamiz"}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="animate-fade-in-left">
            {isLoading ? (
              <Skeleton className="h-96 w-full rounded-3xl" />
            ) : (
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl group">
                <Image
                  src='/photo2.jpg'
                  alt="Sog'lom Ona va Bola"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
          </div>

          <div className="animate-fade-in-right" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#1e4a8d] via-[#0d7377] to-[#d32f2f] bg-clip-text text-transparent mb-6">
              {t("Biz haqimizda", "О нас")}
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
              </div>
            ) : (
              <div className="text-gray-700 leading-relaxed space-y-5 text-lg">
                {(language === "ru" ? detailedAboutRu : detailedAboutUz).split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-base font-medium">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats - Enhanced with gradients and hover effects */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className="bg-white rounded-3xl p-10 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-3 animate-fade-in-up border border-gray-200/50"
                style={{ animationDelay: `${0.15 * index}s` }}
              >
                <div className="text-5xl font-extrabold bg-gradient-to-r from-[#d32f2f] to-[#b71c1c] bg-clip-text text-transparent mb-3">
                  {stat.value}
                </div>
                <div className="text-gray-700 font-semibold text-lg">{language === "ru" ? stat.label_ru : stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Features - Improved card design with icons and shadows */}
        {features.length > 0 && (
          <div className="mb-24">
            <h2 className="text-4xl font-extrabold text-[#1e4a8d] mb-10 text-center">{t("Nima uchun biz?", "Почему мы?")}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 animate-fade-in-up border border-gray-200/50"
                  style={{ animationDelay: `${0.15 * index}s` }}
                >
                  {feature.icon && (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0d7377] to-[#1e4a8d] flex items-center justify-center mb-5 shadow-md">
                      <Image
                        src={getImageUrl("features", feature.icon) || "/placeholder.svg"}
                        alt=""
                        width={32}
                        height={32}
                        className="w-8 h-8 brightness-0 invert"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {language === "ru" ? feature.title_ru : feature.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {language === "ru" ? feature.description_ru : feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mission - Enhanced with more overlays and typography */}
        {about?.mission && (
          <div className="bg-gradient-to-br from-[#1e4a8d] via-[#0d7377] to-[#1e4a8d] rounded-3xl p-10 md:p-16 text-white animate-fade-in-up shadow-2xl relative overflow-hidden mb-24">
            <div className="absolute inset-0 opacity-15">
              <Heart className="absolute top-6 right-6 w-40 h-40 animate-pulse" />
              <Stethoscope className="absolute bottom-6 left-6 w-32 h-32 animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
            <h2 className="text-4xl font-extrabold mb-8 relative z-10">{t("Bizning missiyamiz", "Наша миссия")}</h2>
            <p className="text-white/90 text-xl leading-relaxed relative z-10 font-light">
              {language === "ru" ? about.mission_ru : about.mission}
            </p>
          </div>
        )}

        {/* New Section: Certificates - Added at the bottom with images and download buttons */}
        <div className="mb-24">
          <h2 className="text-4xl font-extrabold text-[#1e4a8d] mb-10 text-center">{t("Klinika sertifikatlari", "Сертификаты клиники")}</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Certificate 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 animate-fade-in-up border border-gray-200/50">
              <div className="relative h-80 mb-6 rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="/s2.png"
                  alt="Klinika sertifikati 1"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {language === "ru" ? "Сертификат качества 1" : "Sifat sertifikati 1"}
                </h3>
                <a href="/ser2.pdf" download="certificate1.pdf">
                  <Button variant="default" className="bg-[#1e4a8d] hover:bg-[#0d7377] text-white flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    {t("Yuklab olish", "Скачать PDF")}
                  </Button>
                </a>
              </div>
            </div>

            {/* Certificate 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 animate-fade-in-up border border-gray-200/50" style={{ animationDelay: "0.2s" }}>
              <div className="relative h-80 mb-6 rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="/s.png"
                  alt="Klinika sertifikati 2"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {language === "ru" ? "Сертификат аккредитации 2" : "Akreditatsiya sertifikati 2"}
                </h3>
                <a href="/se1.pdf" download="certificate2.pdf">
                  <Button variant="default" className="bg-[#1e4a8d] hover:bg-[#0d7377] text-white flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    {t("Yuklab olish", "Скачать PDF")}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Custom animations - Enhanced for smoother effects */}
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
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-left { animation: fade-in-left 1s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 1s ease-out; }
      `}</style>
    </div>
  )
}