"use client"

import Image from "next/image"
import { Globe, Users, Cpu,DockIcon,HelpCircle } from "lucide-react"
import { DoctorCardSkeleton, Skeleton } from "../../components/ui/loading-skeleton"
import { About } from "@/lib/types"
import { Feature } from "next/dist/build/webpack/plugins/telemetry-plugin/telemetry-plugin"

interface AboutSectionProps {
  isLoading?: boolean
   about: About | null
  features: Feature[]
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
          <p className="text-gray-600 mb-8 leading-relaxed">
       Sog'lom Ona va Bola klinikasi
Shifoxonamiz 2022 yil oktabr oyida o'z faoliyatini boshla-
gan. Klinikamiz Toshkent shahar Bektemir tumani, Obod
ko'chasi 123-uyda joylashgan. Klinikamizda quyidagi
bo'limlar mavjud: Pediatriya, Nevrologiya, Endokrinolo-
giya, Ginekologiya, Umumiy terapiya, Otorinolaringolo-
giya. Klinika 25 o'rinli joy bilan ta'minlangan.
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl animate-fade-in-up"
                style={{ animationDelay: `${0.3 + 0.1 * index}s` }}
              >
                <div className="w-10 h-10 rounded-full bg-[#f4c430]/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-[#1e4a8d]" />
                </div>
                <span className="text-sm font-medium text-[#1e4a8d]">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
