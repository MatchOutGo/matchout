'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function SortSelect() {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('Sorting')

  const currentSort = searchParams.get('sort') || 'default'

  // Закрываем при клике вне компонента
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const options = [
    { value: 'default', label: t('default') },
    { value: 'date_asc', label: t('date_asc') },
    { value: 'date_desc', label: t('date_desc') },
    { value: 'price_no_meals_asc', label: t('price_no_meals_asc') },
    { value: 'price_no_meals_desc', label: t('price_no_meals_desc') },
    { value: 'price_with_meals_asc', label: t('price_with_meals_asc') },
    { value: 'price_with_meals_desc', label: t('price_with_meals_desc') },
  ]

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'default') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  const selectedLabel = options.find(o => o.value === currentSort)?.label || t('default')

  return (
    <div ref={wrapperRef} className="relative z-20">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
      >
        <ArrowUpDown className="w-4 h-4 text-[#0066cc]" />
        <span className="hidden sm:inline">{t('title')}:</span> {selectedLabel}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                ${currentSort === opt.value ? 'bg-blue-50 text-[#0066cc] font-semibold' : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <span className="pr-4">{opt.label}</span>
              {currentSort === opt.value && <Check className="w-4 h-4 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}