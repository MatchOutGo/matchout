'use client'

import { useState, useEffect } from 'react'
import { SlidersHorizontal, ChevronDown, RotateCcw, MountainSnow, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import CityAutocomplete from '@/components/CityAutocomplete' // <-- ДОБАВИЛИ ИМПОРТ

type SearchParams = {
  activity?: string; countries?: string; cities?: string; dateStart?: string; dateEnd?: string; transport?: string; priceType?: string; sort?: string; origin?: string;
}

type DictItem = { value: string; label_pl: string; parent_value?: string; is_resort?: boolean }

// УБРАЛИ КОНСТАНТУ FAMOUS_POLISH_CITIES

export default function FilterSidebar({ 
  params, countries, cities, hasActiveFilters
}: { 
  params: SearchParams, countries: DictItem[], cities: DictItem[], hasActiveFilters: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [today, setToday] = useState('') 
  
  const t = useTranslations('Filters')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(new Date().toLocaleDateString('sv-SE'))
  }, [])

  const selectedDestCountry = params.countries ? params.countries.split(',')[0] : ''
  const selectedDestCity = params.cities ? params.cities.split(',')[0] : ''

  const polandValue = countries.find(c => c.label_pl === 'Polska')?.value || 'PL'

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

  // В "Dokąd" показываем ТОЛЬКО КУРОРТЫ
  const availableDestCities = cities.filter(c => 
    c.is_resort && (!selectedDestCountry || c.parent_value === selectedDestCountry)
  )
  
  // В "Skąd" БЕРЕМ ВСЕ ГОРОДА ПОЛЬШИ
  const availableOriginCities = cities
    .filter(c => c.parent_value === polandValue && !c.is_resort)
    .sort((a, b) => a.label_pl.localeCompare(b.label_pl))

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
              <div className="relative">
                <input 
                  type="date" 
                  min={today}
                  value={params.dateStart || ''} 
                  onChange={(e) => updateFilter('dateStart', e.target.value)} 
                  className={`${inputClass} ${!params.dateStart ? 'text-transparent' : 'text-gray-900'}`} 
                />
                {!params.dateStart && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                    Dowolne
                  </span>
                )}
              </div>
              <div className="relative">
                <input 
                  type="date" 
                  min={params.dateStart || today}
                  value={params.dateEnd || ''} 
                  onChange={(e) => updateFilter('dateEnd', e.target.value)} 
                  className={`${inputClass} ${!params.dateEnd ? 'text-transparent' : 'text-gray-900'}`} 
                />
                {!params.dateEnd && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                    Dowolne
                  </span>
                )}
              </div>
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
                      {c.label_pl} 🚡
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h3 className={titleClass}>Skąd</h3>
            <div>
              <label className={labelClass}>
                <MapPin className="w-3 h-3 text-[#0066cc]" /> Miejscowość (Polska)
              </label>
              {/* ЗАМЕНИЛИ SELECT НА CITYAUTOCOMPLETE */}
              <CityAutocomplete 
                value={params.origin || ''}
                onChange={(val) => updateFilter('origin', val)}
                options={availableOriginCities}
                placeholder="Wpisz miasto..."
              />
            </div>
          </div>

          <div className={cardClass}>
            <h3 className={titleClass}>Preferencje</h3>
            <div className="space-y-2">
              {[
                { val: 'osobowy', label: 'Osobowy' }, 
                { val: 'bus', label: 'Bus' }, 
                { val: 'bez_znaczenia', label: 'Bez znaczenia' }
              ].map(opt => {
                const isChecked = params.transport === opt.val || (!params.transport && opt.val === 'bez_znaczenia')
                
                return (
                  <label key={opt.val} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="transport" 
                      checked={isChecked} 
                      onChange={() => updateFilter('transport', opt.val === 'bez_znaczenia' ? '' : opt.val)} 
                      className="w-4 h-4 text-[#0066cc] focus:ring-[#0066cc]" 
                    />
                    {opt.label}
                  </label>
                )
              })}
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