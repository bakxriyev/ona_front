"use client"

import Image from "next/image"
import { Globe, Users, Cpu,DockIcon,HelpCircle } from "lucide-react"
import { DoctorCardSkeleton, Skeleton } from "../../components/ui/loading-skeleton"
import { About } from "@/lib/types"
import { Feature } from "next/dist/build/webpack/plugins/telemetry-plugin/telemetry-plugin"

interface AboutSectionProps {
  isLoading?: boolean
   about?: About | null
}

const features = [
  { icon: Globe, title: "LABORATORIYA" },
  { icon: Users, title: "FIZIOTERAPIYA" },
  { icon: Cpu, title: "AMBULATOR VA STATSIONARDAVOLASH" },
  { icon:DockIcon, title: "TEZ TIBBIY YORDAM (1299)"},
  { icon:HelpCircle, title: "MASLAHAT BERISH XIZMATI" },
]

export function AboutSection({ isLoading }: AboutSectionProps) {

  if (isLoading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <Skeleton className="w-full lg:w-1/2 h-80 rounded-2xl" />
          <div className="w-full lg:w-1/2 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-40" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Image */}
        <div className="w-full lg:w-1/2 animate-fade-in-up">
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/about.jpg"
              alt="Akfa Medline University Hospital"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-1/2 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-3xl font-bold text-[#d32f2f] mb-4">Klinika haqida</h2>
          <h2 className="text-3xl font-bold text-[#d32f2f] mb-4">О клинике</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
      Shifoxonamiz 2022-yil oktyabr oyida o‘z ish faoliyatini boshlagan. Shifoxonamiz Toshkent shahar Bektemir tumani, Obod ko‘chasi 123-uyda joylashgan bo‘lib, klinikamizda pediatriya, nevrologiya, endokrinologiya, ginekologiya, umumiy terapiya hamda otorinolaringologiya bo‘limlari tashkil qilingan va 25 o‘rin joy bilan ta’minlangan. Palatalarimizda barcha sharoitlar mavjud bo‘lib, lyuks toifasiga kiradi. “Sog‘lom ona va bola” klinikasi 2022-yildan buyon ona va bola hamda nuroniylarimiz salomatligini muhofaza qilish, erta tashxis va sifatli davolash ishlarini amalga oshirib kelmoqda.   </p>

        </div>
      </div>
    </section>
  )
}
