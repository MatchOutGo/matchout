'use client'

import { useState } from 'react'
import { SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import CustomSelect from './CustomSelect'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'

type SearchParams = {
  activity?: string;
  countries?: string;
  cities?: string;
  dateStart?: string;
  dateEnd?: string;
  transport?: string;
  priceType?: string;
  sort?: string;
}

type DictItem = { value: string; label_pl: string }

export default function FilterSidebar({ 
  params, activities, countries, cities, hasActiveFilters
}: { 
  params: SearchParams, 
  activities: DictItem[], 
  countries: DictItem[],
  cities: DictItem[],
  hasActiveFilters: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('Filters')
  
  const router = useRouter()
  const pathname = usePathname()

  const selectedCountries = params.countries ? params.countries.split(',') : []
  const selectedCities = params.cities ? params.cities.split(',') : []

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(window.location.search)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    router.push(`${pathname}?${newParams.toString()}`)
  }

  const toggleArrayFilter = (key: 'countries' | 'cities', value: string) => {
    let arr = key === 'countries' ? [...selectedCountries] : [...selectedCities]
    if (arr.includes(value)) {
      arr = arr.filter(item => item !== value)
    } else {
      arr.push(value)
    }
    updateFilter(key, arr.join(','))
  }

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
          <div className="space-y-6">
            
            {hasActiveFilters && (
              <div className="flex justify-end pb-2 border-b border-gray-100">
                <Link href="/listings" className="text-xs font-medium text-gray-500 hover:text-[#0066cc] flex items-center gap-1 transition-colors">
                  <RotateCcw className="w-3 h-3" />
                  Pokaż wszystkie
                </Link>
              </div>
            )}

            {/* БЛОК AKTYWNOŚĆ СПРЯТАН */}
            {/* 
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('activity')}</label>
              <CustomSelect 
                name="activity" 
                options={activityOptions} 
                defaultValue={params.activity} 
                onChange={(val) => updateFilter('activity', val)}
              />
            </div>
            */}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kiedy</label>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-gray-400 mb-1 block">Mogę wyjechać od</span>
                  <input type="date" name="dateStart" defaultValue={params.dateStart} onChange={(e) => updateFilter('dateStart', e.target.value)} className="w-full bg-[#f5f5f7] border-none rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0066cc]/50" />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 mb-1 block">Muszę wrócić do</span>
                  <input type="date" name="dateEnd" defaultValue={params.dateEnd} onChange={(e) => updateFilter('dateEnd', e.target.value)} className="w-full bg-[#f5f5f7] border-none rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0066cc]/50" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kraj</label>
              <div className="flex flex-wrap gap-1.5">
                {countries.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => toggleArrayFilter('countries', c.label_pl)}
                    className={`px-2.5 py-1.5 rounded-lg text-[13px] border transition-colors ${selectedCountries.includes(c.label_pl) ? 'bg-[#0066cc] text-white border-[#0066cc]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'}`}
                  >
                    {c.label_pl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Miejscowość</label>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                {cities.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => toggleArrayFilter('cities', c.label_pl)}
                    className={`px-2.5 py-1.5 rounded-lg text-[13px] border transition-colors ${selectedCities.includes(c.label_pl) ? 'bg-[#0066cc] text-white border-[#0066cc]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'}`}
                  >
                    {c.label_pl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preferowany transport</label>
              <div className="space-y-2">
                {[
                  { val: 'osobowy', label: 'Osobowy' },
                  { val: 'bus', label: 'Bus' },
                  { val: '', label: 'Bez znaczenia' }
                ].map(opt => (
                  <label key={opt.val} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="transport" 
                      checked={params.transport === opt.val || (!params.transport && opt.val === '')} 
                      onChange={() => updateFilter('transport', opt.val)} 
                      className="text-[#0066cc] focus:ring-[#0066cc]" 
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cena</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={params.priceType === 'shared'} 
                    onChange={(e) => updateFilter('priceType', e.target.checked ? 'shared' : '')} 
                    className="rounded text-[#0066cc] focus:ring-[#0066cc]" 
                  />
                  Koszty dzielone
                </label>
                <select 
                  onChange={(e) => updateFilter('sort', e.target.value)} 
                  value={params.sort || ''} 
                  className="w-full bg-[#f5f5f7] border-none rounded-xl p-2.5 mt-2 outline-none focus:ring-2 focus:ring-[#0066cc]/50 text-sm"
                >
                  <option value="">Sortowanie: Domyślne</option>
                  <option value="asc">Od najniższej</option>
                  <option value="desc">Od najwyższej</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>
    </aside>
  )
}