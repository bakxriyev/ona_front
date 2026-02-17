"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "../../context/language-context"
import { api } from "@/lib/api"
import { getImageUrl } from "@/lib/config"
import type { About, Service, Direction } from "@/lib/types"

const navItems = [
  { labelUz: "Bosh sahifa", labelRu: "Главная", href: "/", hasDropdown: false },
  { labelUz: "Klinika haqida", labelRu: "О клинике", href: "/about", hasDropdown: false },
  { labelUz: "Xizmatlar", labelRu: "Услуги", href: "/services", hasDropdown: true, dropdownType: "services" },
  { labelUz: "Bo'limlar", labelRu: "Отделения", href: "/departments", hasDropdown: true, dropdownType: "departments" },
  { labelUz: "Shifokorlar", labelRu: "Врачи", href: "/doctors", hasDropdown: false },
  { labelUz: "Blog", labelRu: "Блог", href: "/blog", hasDropdown: false },
  // { labelUz: "Kontaktlar", labelRu: "Контакты", href: "/contact", hasDropdown: false },
  // { labelUz: "Karyera", labelRu: "Карьера", href: "/career", hasDropdown: false },
]

const languages = [
  { code: "uz" as const, label: "UZ" },
  { code: "ru" as const, label: "RU" },
]

const aboutSubItems = [
  { labelUz: "Biz haqimizda", labelRu: "О нас", href: "/about" }
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { language, setLanguage, t } = useLanguage()
  const [about, setAbout] = useState<About | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [departments, setDepartments] = useState<Direction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getAbout(), api.getServices(), api.getDirections()])
      .then(([aboutData, servicesData, departmentsData]) => {
        if (aboutData && aboutData.length > 0) {
          setAbout(aboutData[0])
        }
        setServices(servicesData || [])
        setDepartments(departmentsData || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const renderDropdownContent = (dropdownType: string) => {
    switch (dropdownType) {
      case "services":
        return (
          <div className="grid grid-cols-2 gap-4 p-6 min-w-[500px]">
            <div className="space-y-2">
              <Link
                href="/services"
                className="block font-semibold text-[#1e4a8d] hover:text-[#d32f2f] transition-colors mb-3"
              >
                {t("Barcha xizmatlar", "Все услуги")}
              </Link>
              {services.slice(0, 5).map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="block text-gray-700 hover:text-[#d32f2f] transition-colors py-1"
                >
                  {language === "ru" ? service.title_ru || service.title : service.title}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              {services.slice(5, 10).map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="block text-gray-700 hover:text-[#d32f2f] transition-colors py-1"
                >
                  {language === "ru" ? service.title_ru || service.title : service.title}
                </Link>
              ))}
            </div>
            {about?.logo && (
              <div className="col-span-2 flex justify-end items-center pt-4 border-t mt-4">
                <Image
                  src={getImageUrl("about", about.logo) || "/placeholder.svg"}
                  alt="Logo"
                  width={250}
                  height={100}
                  className="h-12 w-auto object-contain"
                />
              </div>
            )}
          </div>
        )

      case "departments":
        return (
          <div className="grid grid-cols-2 gap-4 p-6 min-w-[500px]">
            <div className="space-y-2">
              <Link
                href="/departments"
                className="block font-semibold text-[#1e4a8d] hover:text-[#d32f2f] transition-colors mb-3"
              >
                {t("Barcha bo'limlar", "Все отделения")}
              </Link>
              {departments.slice(0, 5).map((dept) => (
                <Link
                  key={dept.id}
                  href={`/departments/${dept.id}`}
                  className="block text-gray-700 hover:text-[#d32f2f] transition-colors py-1"
                >
                  {language === "ru" ? dept.title_ru || dept.title : dept.title}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              {departments.slice(5, 10).map((dept) => (
                <Link
                  key={dept.id}
                  href={`/departments/${dept.id}`}
                  className="block text-gray-700 hover:text-[#d32f2f] transition-colors py-1"
                >
                  {language === "ru" ? dept.title_ru || dept.title : dept.title}
                </Link>
              ))}
            </div>
            {about?.logo && (
              <div className="col-span-2 flex justify-end items-center pt-4 border-t mt-4">
                <Image
                  src={getImageUrl("about", about.logo) || "/placeholder.svg"}
                  alt="Logo"
                  width={150}
                  height={60}
                  className="h-12 w-auto object-contain"
                />
              </div>
            )}
          </div>
        )

      case "about":
        return (
          <div className="p-6 min-w-[400px]">
            <div className="space-y-2">
              {aboutSubItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-gray-700 hover:text-[#d32f2f] transition-colors py-1"
                >
                  {language === "ru" ? item.labelRu : item.labelUz}
                </Link>
              ))}
            </div>
            {about?.logo && (
              <div className="flex justify-end items-center pt-4 border-t mt-4">
                <Image
                  src={getImageUrl("about", about.logo) || "/placeholder.svg"}
                  alt="Logo"
                  width={150}
                  height={60}
                  className="h-12 w-auto object-contain"
                />
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 sticky top-0 z-50 shadow-lg border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <Link href="/" className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-20 w-48 bg-slate-700 animate-pulse rounded" />
            ) : about?.logo ? (
              <Image
                src={getImageUrl("about", about.logo) || "/placeholder.svg"}
                alt={"Logo"}
                width={220}
                height={90}
                className="h-20 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <span className="text-3xl font-bold text-white">LOGO</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.dropdownType || null)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/90 hover:text-[#d32f2f] transition-colors",
                    activeDropdown === item.dropdownType && "text-[#d32f2f]",
                  )}
                >
                  {language === "ru" ? item.labelRu : item.labelUz}
                  {item.hasDropdown && (
                    <ChevronDown
                      size={14}
                      className={cn("transition-transform", activeDropdown === item.dropdownType && "rotate-180")}
                    />
                  )}
                </Link>

                {item.hasDropdown && activeDropdown === item.dropdownType && (
                  <div className="absolute top-full left-0 bg-white shadow-xl rounded-lg border animate-fade-in-up z-50">
                    <div className="absolute top-0 left-4 right-4 h-0.5 bg-[#d32f2f]" />
                    {renderDropdownContent(item.dropdownType!)}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side - CTA & Language */}
          <div className="hidden lg:flex items-center gap-4">
            
            <div className="flex items-center border border-slate-600 rounded-full overflow-hidden bg-slate-800/50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    "px-3 py-1 text-sm font-medium transition-colors",
                    language === lang.code ? "bg-[#d32f2f] text-white" : "text-white/80 hover:bg-slate-700",
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-slate-800 border-t border-slate-700 animate-fade-in-up">
          <nav className="flex flex-col py-4">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="px-4 py-3 text-white/90 hover:bg-slate-700 hover:text-[#d32f2f] flex items-center justify-between"
                  onClick={() => !item.hasDropdown && setIsMenuOpen(false)}
                >
                  {language === "ru" ? item.labelRu : item.labelUz}
                  {item.hasDropdown && <ChevronDown size={16} />}
                </Link>
                {item.hasDropdown && item.dropdownType === "services" && (
                  <div className="bg-slate-900 px-6 py-2">
                    {services.slice(0, 5).map((service) => (
                      <Link
                        key={service.id}
                        href={`/services/${service.id}`}
                        className="block py-2 text-sm text-white/70 hover:text-[#d32f2f]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {language === "ru" ? service.title_ru || service.title : service.title}
                      </Link>
                    ))}
                  </div>
                )}
                {item.hasDropdown && item.dropdownType === "departments" && (
                  <div className="bg-slate-900 px-6 py-2">
                    {departments.slice(0, 5).map((dept) => (
                      <Link
                        key={dept.id}
                        href={`/departments/${dept.id}`}
                        className="block py-2 text-sm text-white/70 hover:text-[#d32f2f]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {language === "ru" ? dept.title_ru || dept.title : dept.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="px-4 py-3 border-t border-slate-700 mt-2 flex items-center justify-between">
              <Link
                href="/results"
                className="bg-gradient-to-r from-[#d32f2f] to-[#f44336] text-white px-4 py-2 rounded-full text-center font-medium"
              >
                {t("Tahlil javoblari", "Результаты анализов")}
              </Link>
              <div className="flex items-center border border-slate-600 rounded-full overflow-hidden bg-slate-800/50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      "px-3 py-1 text-sm font-medium transition-colors",
                      language === lang.code ? "bg-[#d32f2f] text-white" : "text-white/80 hover:bg-slate-700",
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
