"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton rounded-lg", className)} />
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

export function DoctorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
      <div className="mx-auto w-48 h-48 rounded-full overflow-hidden mb-4 bg-sky-100">
        <Skeleton className="w-full h-full rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[500px] bg-gradient-to-r from-[#1e4a8d] to-[#0f2a4a] animate-pulse-slow">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <Skeleton className="h-12 w-3/4 max-w-2xl mb-4 bg-white/20" />
        <Skeleton className="h-6 w-1/2 max-w-xl mb-8 bg-white/20" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-40 bg-white/20 rounded-full" />
          <Skeleton className="h-12 w-40 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function PageLoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#d32f2f]/20 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-[#d32f2f] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  )
}
