'use client'

import { useState } from 'react'
import { SlidersHorizontal, ChevronDown, RotateCcw, MountainSnow, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

type SearchParams = {
  activity?: string; countries?: string; cities?: string; dateStart?: string; dateEnd?: string; transport?: string; priceType?: string; sort?: string; origin?: string;
}

type DictItem = { value: string; label_pl: string; parent_value?: string; is_resort?: boolean }

export default function FilterSidebar({ 
  params, countries, cities, hasActiveFilters
}: { 
  params: SearchParams, countries: DictItem[], cities: DictItem[], hasActiveFilters: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [originCountry, setOriginCountry] = useState('')
  
  const t = useTranslations('Filters')
  const router = useRouter()
  const pathname = usePathname()

  const selectedDestCountry = params.countries ? params.countries.split(',')[0] : ''
  const selectedDestCity = params.cities ? params.cities.split(',')[0] : ''

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(window.location.search)
    if (value) newParams.set(key, value)
    else newParams.delete(key)
    router.push(`${pathname}?${newParams.toString()}`)
  }

  const handleDestCountryChange = (val: string) => {
    const newParams = new URLSearchParams(window.location.search)
    if (val) newParams.set('countries', val)
    else newParams.delete('countries')
    newParams.delete('cities') 
    router.push(`${pathname}?${newParams.toString()}`)
  }

  const handleOriginCountryChange = (val: string) => {
    setOriginCountry(val)
    updateFilter('origin', '')
  }

  // В "Dokąd" показываем всё
  const availableDestCities = cities.filter(c => !selectedDestCountry || c.parent_value === selectedDestCountry)
  
  // В "Skąd" показываем ТОЛЬКО города
  const availableOriginCities = cities.filter(c => 
    (!originCountry || c.parent_value === originCountry) && !c.is_resort
  )

  const inputClass = "w-full bg-[#f5f5f7] border-none rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0066cc]/50"
  const labelClass = "flex items-center gap-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1"
  const cardClass = "bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3"
  const titleClass = "text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2"

  return (
    <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-visible">
        
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-5 lg:cursor-default lg:pointer-events-none border-b border-gray-100 lg:border-none rounded-t-3xl">
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <SlidersHorizontal className="w-5 h-5" /> {t('filters')}
          </div>
          <div className={`lg:hidden text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>

        <div className={`${isOpen ? 'block' : 'hidden'} lg:block p-5 space-y-4 rounded-b-3xl`}>
            
          {hasActiveFilters && (
            <div className="flex justify-end pb-2">
              <Link href="/listings" className="text-xs font-medium text-gray-500 hover:text-[#0066cc] flex items-center gap-1 transition-colors">
                <RotateCcw className="w-3 h-3" /> Pokaż wszystkie
              </Link>
            </div>
          )}

          <div className={cardClass}>
            <h3 className={titleClass}>Kiedy</h3>
            <div className="space-y-2">
              <input type="date" value={params.dateStart || ''} onChange={(e) => updateFilter('dateStart', e.target.value)} className={inputClass} />
              <input type="date" value={params.dateEnd || ''} onChange={(e) => updateFilter('dateEnd', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className={cardClass}>
            <h3 className={titleClass}>Dokąd</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Kraj</label>
                <select value={selectedDestCountry} onChange={(e) => handleDestCountryChange(e.target.value)} className={inputClass}>
                  <option value="">Wszystkie</option>
                  {countries.map(c => <option key={c.value} value={c.value}>{c.label_pl}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  <MountainSnow className="w-3 h-3 text-[#0066cc]" /> Miejsc.
                </label>
                <select value={selectedDestCity} onChange={(e) => updateFilter('cities', e.target.value)} disabled={!selectedDestCountry} className={`${inputClass} ${!selectedDestCountry ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}>
                  <option value="">Wszystkie</option>
                  {availableDestCities.map(c => (
                    <option key={c.value} value={c.value}>
                      {c.label_pl}{c.is_resort ? '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 OŚRODEK' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h3 className={titleClass}>Skąd</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Kraj</label>
                <select value={originCountry} onChange={(e) => handleOriginCountryChange(e.target.value)} className={inputClass}>
                  <option value="">Wszystkie</option>
                  {countries.map(c => <option key={c.value} value={c.value}>{c.label_pl}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  <MapPin className="w-3 h-3 text-[#0066cc]" /> Miejsc.
                </label>
                <select value={params.origin || ''} onChange={(e) => updateFilter('origin', e.target.value)} disabled={!originCountry} className={`${inputClass} ${!originCountry ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}>
                  <option value="">Wszystkie</option>
                  {availableOriginCities.map(c => (
                    <option key={c.value} value={c.value}>
                      {c.label_pl}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h3 className={titleClass}>Preferencje</h3>
            <div className="space-y-2">
              {[{ val: 'osobowy', label: 'Osobowy' }, { val: 'bus', label: 'Bus' }, { val: '', label: 'Bez znaczenia' }].map(opt => (
                <label key={opt.val} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="radio" name="transport" checked={params.transport === opt.val || (!params.transport && opt.val === '')} onChange={() => updateFilter('transport', opt.val)} className="w-4 h-4 text-[#0066cc] focus:ring-[#0066cc]" />
                  {opt.label}
                </label>
              ))}
            </div>
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={params.priceType === 'shared'} onChange={(e) => updateFilter('priceType', e.target.checked ? 'shared' : '')} className="w-4 h-4 rounded text-[#0066cc] focus:ring-[#0066cc]" />
                Koszty dzielone
              </label>
            </div>
          </div>

        </div>
      </div>
    </aside>
  )
}