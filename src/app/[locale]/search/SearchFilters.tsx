'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import CustomSelect from '@/components/CustomSelect'
import { Search, RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'

type DictItem = { value: string; label_pl: string }

export default function SearchFilters({ 
  activities, 
  countries,
  cities
}: { 
  activities: DictItem[], 
  countries: DictItem[],
  cities: DictItem[]
}) {
  const router = useRouter()
  const t = useTranslations('Filters') 
  
  // Устанавливаем 'narty' по умолчанию. 
  // Если в базе системное имя другое (например, 'skiing'), поменяй здесь.
  const [form, setForm] = useState({
    activity: 'narty', 
    countries: [] as string[], 
    cities: [] as string[], 
    dateStart: '', 
    dateEnd: '',
    transport: '',
    priceType: ''
  })

  const toggleCountry = (countryValue: string) => {
    setForm(prev => ({
      ...prev,
      countries: prev.countries.includes(countryValue) 
        ? prev.countries.filter(c => c !== countryValue)
        : [...prev.countries, countryValue]
    }))
  }

  const toggleCity = (cityValue: string) => {
    setForm(prev => ({
      ...prev,
      cities: prev.cities.includes(cityValue) 
        ? prev.cities.filter(c => c !== cityValue)
        : [...prev.cities, cityValue]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (form.activity) params.append('activity', form.activity)
    if (form.dateStart) params.append('dateStart', form.dateStart)
    if (form.dateEnd) params.append('dateEnd', form.dateEnd)
    if (form.transport) params.append('transport', form.transport)
    if (form.priceType) params.append('priceType', form.priceType)
    
    if (form.countries.length > 0) params.append('countries', form.countries.join(','))
    if (form.cities.length > 0) params.append('cities', form.cities.join(','))

    router.push(`/listings?${params.toString()}`)
  }

  const handleReset = () => {
    setForm({
      activity: 'narty', countries: [], cities: [], dateStart: '', dateEnd: '', transport: '', priceType: ''
    })
    router.push('/listings') 
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      
      <div className="flex justify-end border-b border-gray-100 pb-4">
        <button type="button" onClick={handleReset} className="text-sm font-medium text-gray-500 hover:text-[#0066cc] flex items-center gap-2 transition-colors">
          <RotateCcw className="w-4 h-4" />
          Pokaż wszystkie
        </button>
      </div>

      {/* БЛОК AKTYWNOŚĆ СПРЯТАН. Раскомментируй, когда будут добавлены другие виды спорта */}
      {/* 
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Aktywność</label>
        <CustomSelect 
          name="activity" 
          options={[{value:'', label:t('all')}, ...activities.map((a) => ({value:a.value, label:a.label_pl}))]} 
          onChange={(val) => setForm({...form, activity: val})} 
        />
      </div>
      */}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mogę wyjechać od</label>
          <input type="date" value={form.dateStart} onChange={(e) => setForm({...form, dateStart: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0066cc]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Muszę wrócić do</label>
          <input type="date" value={form.dateEnd} onChange={(e) => setForm({...form, dateEnd: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0066cc]" />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-gray-700">Kraj</label>
          <label className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer">
            <input type="checkbox" onChange={() => setForm({...form, countries: []})} checked={form.countries.length === 0} className="rounded text-[#0066cc]" />
            Obojętne
          </label>
        </div>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
          {countries.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => toggleCountry(c.value)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.countries.includes(c.value) ? 'bg-[#0066cc] text-white border-[#0066cc]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'}`}
            >
              {c.label_pl}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-gray-700">Miejscowość / Ośrodek</label>
          <label className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer">
            <input type="checkbox" onChange={() => setForm({...form, cities: []})} checked={form.cities.length === 0} className="rounded text-[#0066cc]" />
            Obojętne
          </label>
        </div>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
          {cities.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => toggleCity(c.value)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.cities.includes(c.value) ? 'bg-[#0066cc] text-white border-[#0066cc]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'}`}
            >
              {c.label_pl}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Preferowany transport</label>
        <div className="space-y-2">
          {['Osobowy', 'Bus', 'Bez znaczenia'].map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="radio" name="transport" value={t} checked={form.transport === t} onChange={(e) => setForm({...form, transport: e.target.value})} className="text-[#0066cc] focus:ring-[#0066cc]" />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Cena</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.priceType === 'shared'} onChange={(e) => setForm({...form, priceType: e.target.checked ? 'shared' : ''})} className="rounded text-[#0066cc] focus:ring-[#0066cc]" />
            Koszty dzielone
          </label>
          <select onChange={(e) => setForm({...form, priceType: e.target.value})} value={form.priceType} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-2 outline-none focus:border-[#0066cc] text-sm">
            <option value="">Bez znaczenia (Sortowanie)</option>
            <option value="asc">Od najniższej</option>
            <option value="desc">Od najwyższej</option>
          </select>
        </div>
      </div>

      <button type="submit" className="w-full bg-[#0066cc] text-white text-lg py-4 rounded-xl font-bold hover:bg-[#004c99] transition-colors shadow-md flex justify-center items-center gap-2">
        <Search className="w-5 h-5" /> Pokaż wyniki
      </button>
    </form>
  )
}