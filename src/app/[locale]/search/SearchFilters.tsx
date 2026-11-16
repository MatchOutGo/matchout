'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { Search, RotateCcw, MountainSnow, MapPin } from 'lucide-react'

type DictItem = { value: string; label_pl: string; parent_value?: string; is_resort?: boolean }

export default function SearchFilters({ 
  activities, countries, cities
}: { 
  activities: DictItem[], countries: DictItem[], cities: DictItem[]
}) {
  const router = useRouter()
  
  const [form, setForm] = useState({
    activity: 'narty', destCountry: '', destCity: '', originCountry: '', originCity: '',
    dateStart: '', dateEnd: '', transport: '', priceType: ''
  })

  // В "Dokąd" показываем всё (и города, и курорты)
  const availableDestCities = cities.filter(c => !form.destCountry || c.parent_value === form.destCountry)
  
  // В "Skąd" показываем ТОЛЬКО города (исключаем is_resort)
  const availableOriginCities = cities.filter(c => 
    (!form.originCountry || c.parent_value === form.originCountry) && !c.is_resort
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (form.activity) params.append('activity', form.activity)
    if (form.dateStart) params.append('dateStart', form.dateStart)
    if (form.dateEnd) params.append('dateEnd', form.dateEnd)
    if (form.transport) params.append('transport', form.transport)
    if (form.priceType) params.append('priceType', form.priceType)
    if (form.destCountry) params.append('countries', form.destCountry)
    if (form.destCity) params.append('cities', form.destCity)
    if (form.originCity) params.append('origin', form.originCity)
    router.push(`/listings?${params.toString()}`)
  }

  const handleReset = () => {
    setForm({ activity: 'narty', destCountry: '', destCity: '', originCountry: '', originCity: '', dateStart: '', dateEnd: '', transport: '', priceType: '' })
    router.push('/listings') 
  }

  const inputClass = "w-full bg-[#f5f5f7] border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0066cc]/50 text-[15px]"
  const labelClass = "flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2"
  const cardClass = "bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6"
  const titleClass = "text-xl font-semibold tracking-tight border-b border-gray-100 pb-4"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className="flex justify-end px-2">
        <button type="button" onClick={handleReset} className="text-sm font-medium text-gray-500 hover:text-[#0066cc] flex items-center gap-2 transition-colors">
          <RotateCcw className="w-4 h-4" /> Pokaż wszystkie
        </button>
      </div>
      
      <div className={cardClass}>
        <h2 className={titleClass}>Kiedy</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Mogę wyjechać od</label>
            <input type="date" value={form.dateStart} onChange={(e) => setForm({...form, dateStart: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Muszę wrócić do</label>
            <input type="date" value={form.dateEnd} onChange={(e) => setForm({...form, dateEnd: e.target.value})} className={inputClass} />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Dokąd</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Kraj</label>
            <select value={form.destCountry} onChange={(e) => setForm({...form, destCountry: e.target.value, destCity: ''})} className={inputClass}>
              <option value="">Wszystkie</option>
              {countries.map(c => <option key={c.value} value={c.value}>{c.label_pl}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>
              <MountainSnow className="w-3.5 h-3.5 text-[#0066cc]" /> Miejscowość / Ośrodek
            </label>
            <select value={form.destCity} onChange={(e) => setForm({...form, destCity: e.target.value})} disabled={!form.destCountry} className={`${inputClass} ${!form.destCountry ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}>
              <option value="">Wszystkie</option>
              {availableDestCities.map(c => (
                <option key={c.value} value={c.value}>
                  {c.label_pl}{c.is_resort ? '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 OŚRODEK' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Skąd</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Kraj</label>
            <select value={form.originCountry} onChange={(e) => setForm({...form, originCountry: e.target.value, originCity: ''})} className={inputClass}>
              <option value="">Wszystkie</option>
              {countries.map(c => <option key={c.value} value={c.value}>{c.label_pl}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>
              <MapPin className="w-3.5 h-3.5 text-[#0066cc]" /> Miejscowość (Tylko miasta)
            </label>
            <select value={form.originCity} onChange={(e) => setForm({...form, originCity: e.target.value})} disabled={!form.originCountry} className={`${inputClass} ${!form.originCountry ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}>
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
        <h2 className={titleClass}>Preferencje</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Preferowany transport</label>
            <div className="flex flex-wrap gap-4">
              {['Osobowy', 'Bus', 'Bez znaczenia'].map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="radio" name="transport" value={t} checked={form.transport === t} onChange={(e) => setForm({...form, transport: e.target.value})} className="w-4 h-4 text-[#0066cc] focus:ring-[#0066cc]" />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.priceType === 'shared'} onChange={(e) => setForm({...form, priceType: e.target.checked ? 'shared' : ''})} className="w-4 h-4 rounded text-[#0066cc] focus:ring-[#0066cc]" />
              Tylko koszty dzielone
            </label>
          </div>
        </div>
      </div>

      <button type="submit" className="w-full bg-[#0066cc] text-white text-lg py-4 rounded-xl font-bold hover:bg-[#004c99] transition-colors shadow-lg flex justify-center items-center gap-2">
        <Search className="w-5 h-5" /> Pokaż wyniki
      </button>
    </form>
  )
}