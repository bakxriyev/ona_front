"use client"

import Image from "next/image"
import { Skeleton } from "../../components/ui/loading-skeleton"
import { useLanguage } from "../../context/language-context"

export function AboutSection({ isLoading }: { isLoading?: boolean }) {
  const { t, isLoaded } = useLanguage()

  if (!isLoaded || isLoading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <Skeleton className="w-full h-80 rounded-2xl" />
      </section>
    )
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Image */}
        <div className="w-full lg:w-1/2">
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/about.jpg"
              alt="clinic"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-bold text-[#d32f2f] mb-4">
            {t("Klinika haqida", "О клинике")}
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {t(
              "Shifoxonamiz 2022-yil oktyabr oyida o‘z ish faoliyatini boshlagan. Shifoxonamiz Toshkent shahar Bektemir tumani, Obod ko‘chasi 123-uyda joylashgan bo‘lib, klinikamizda pediatriya, nevrologiya, endokrinologiya, ginekologiya, umumiy terapiya hamda otorinolaringologiya bo‘limlari tashkil qilingan va 25 o‘rin joy bilan ta’minlangan. Palatalarimizda barcha sharoitlar mavjud bo‘lib, lyuks toifasiga kiradi. “Sog‘lom ona va bola” klinikasi 2022-yildan buyon ona va bola hamda nuroniylarimiz salomatligini muhofaza qilish, erta tashxis va sifatli davolash ishlarini amalga oshirib kelmoqda.",
              "Наша клиника начала свою деятельность в октябре 2022 года. Клиника расположена в Бектемирском районе города Ташкента, по улице Обод, дом 123. В нашей клинике функционируют отделения педиатрии, неврологии, эндокринологии, гинекологии, общей терапии и оториноларингологии, всего 25 коек. Все палаты оснащены современными удобствами и относятся к категории люкс. Клиника «Здоровая мать и ребенок» с 2022 года обеспечивает охрану здоровья матерей, детей и пожилых людей, раннюю диагностику и качественное лечение."
            )}
          </p>
        </div>
      </div>
    </section>
  )
}