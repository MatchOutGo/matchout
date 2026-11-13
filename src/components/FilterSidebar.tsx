'use client'

import { useState } from 'react'
import { SlidersHorizontal, MapPin, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import CustomSelect from './CustomSelect'
import { useTranslations } from 'next-intl'

type SearchParams = {
  pickup?: string;
  city?: string;
  activity?: string;
  maxPrice?: string;
  dateStart?: string;
  dateEnd?: string;
  gender?: string;
  children?: string;
  prepayment?: string;
  bus?: string;
}

type ActivityOption = { value: string; label_pl: string }

export default function FilterSidebar({ 
  params, activities, hasActiveFilters, allPickupCities,
  showGender = true, showChildren = true, showBudget = true, showBusFilter = true // <-- Добавили пропс
}: { 
  params: SearchParams, 
  activities: ActivityOption[], 
  hasActiveFilters: boolean,
  allPickupCities: string[],
  showGender?: boolean,
  showChildren?: boolean,
  showBudget?: boolean,
  showBusFilter?: boolean, // <-- Типизируем
}) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('Filters')

  const activityOptions = [
    { value: '', label: t('all') },
    ...(activities?.map(a => ({ value: a.value, label: a.label_pl })) || [])
  ];

  const pickupOptions = [
    { value: '', label: t('all') },
    ...(allPickupCities.map(c => ({ value: c, label: c })))
  ]

  const genderOptions = [
    { value: '', label: t('all') },
    { value: 'any', label: 'Wszyscy' },
    { value: 'men', label: 'Tylko mężczyźni' },
    { value: 'women', label: 'Tylko kobiety' }
  ];

  const childrenOptions = [
    { value: '', label: t('all') },
    { value: 'yes', label: 'Można z dziećmi' },
    { value: 'no', label: 'Tylko dorośli' },
    { value: 'family', label: 'Wyjazd rodzinny' }
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-visible">
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-5 lg:cursor-default lg:pointer-events-none border-b border-gray-100 lg:border-none rounded-t-3xl"
        >
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <SlidersHorizontal className="w-5 h-5" /> {t('filters')}
          </div>
          <div className={`lg:hidden text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>

        <div className={`${isOpen ? 'block' : 'hidden'} lg:block p-5 space-y-6 rounded-b-3xl`}>
          <form method="GET" className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('activity')}</label>
              <CustomSelect name="activity" options={activityOptions} defaultValue={params.activity} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('when')}</label>
              <div className="space-y-2">
                <input type="date" name="dateStart" defaultValue={params.dateStart} className="w-full bg-[#f5f5f7] border-none rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0071e3]/50 outline-none text-gray-700" title="Data od" />
                <input type="date" name="dateEnd" defaultValue={params.dateEnd} className="w-full bg-[#f5f5f7] border-none rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0071e3]/50 outline-none text-gray-700" title="Data do" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('pickup')}</label>
              <CustomSelect name="pickup" options={pickupOptions} defaultValue={params.pickup} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('where')}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input name="city" defaultValue={params.city} placeholder="Miasto" className="w-full bg-[#f5f5f7] border-none rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0071e3]/50 outline-none" />
              </div>
            </div>

            {showBudget && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('budget')}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">zł</span>
                  <input name="maxPrice" type="number" defaultValue={params.maxPrice} placeholder="Max kwota" className="w-full bg-[#f5f5f7] border-none rounded-xl pl-8 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0071e3]/50 outline-none" />
                </div>
              </div>
            )}

            {showGender && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('who')}</label>
                <CustomSelect name="gender" options={genderOptions} defaultValue={params.gender} />
              </div>
            )}

            {showChildren && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('children')}</label>
                <CustomSelect name="children" options={childrenOptions} defaultValue={params.children} />
              </div>
            )}

            {/* УСЛОВНЫЙ РЕНДЕР ФИЛЬТРА БУСА */}
            {showBusFilter && (
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <input type="checkbox" name="bus" value="true" defaultChecked={params.bus === 'true'} className="w-4 h-4 text-[#0071e3] rounded focus:ring-[#0071e3] border-gray-300" />
                  <span className="text-sm font-medium text-gray-700">{t('bus')}</span>
                </label>
              </div>
            )}

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <input type="checkbox" name="prepayment" value="true" defaultChecked={params.prepayment === 'true'} className="w-4 h-4 text-[#0071e3] rounded focus:ring-[#0071e3] border-gray-300" />
                <span className="text-sm font-medium text-gray-700">{t('prepayment')}</span>
              </label>
            </div>

            <div className="pt-4 space-y-2 border-t border-gray-100">
              <button type="submit" className="w-full bg-[#0071e3] text-white px-4 py-3 rounded-xl font-medium hover:bg-[#0077ed] transition-colors shadow-sm">
                {t('apply')}
              </button>
              {hasActiveFilters && (
                <Link href="/" className="w-full block text-center py-2 text-sm text-gray-500 hover:text-gray-900 font-medium">
                  {t('clear')}
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </aside>
  )
}