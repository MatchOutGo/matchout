'use client'

import { useState } from 'react'
import { createListing, updateListing } from './actions'
import { Wallet, Car, Search, Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import CustomSelect from '@/components/CustomSelect' // <-- ИМПОРТ НАШЕГО СЕЛЕКТА

type Cost = { id: string; title: string; amount: number; isShared: boolean }
type Activity = { value: string; label_pl: string }
type City = { value: string; label_pl: string }

type InitialListing = {
  type?: 'offer' | 'seek'
  max_participants?: number | null
  date_start?: string | null
  date_end?: string | null
  city?: string | null
  activity?: string
  title?: string
  description?: string | null
  budget_max?: number | null
  gender_pref?: string | null
  children_allowed?: string | null
  language_pref?: string | null
  prepayment_required?: boolean | null
  prepayment_amount?: number | null
}

type InitialCost = {
  id: string
  title: string
  amount: number
  is_shared: boolean | null
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full py-4 bg-[#0071e3] text-white text-[17px] rounded-full font-medium hover:bg-[#0077ed] transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
    >
      {pending && <Loader2 className="w-5 h-5 animate-spin" />}
      {pending ? 'Przetwarzanie...' : (isEdit ? 'Zapisz zmiany' : 'Opublikuj ogłoszenie')}
    </button>
  );
}

export default function CreateListingForm({ 
  activities, 
  cities,
  initialData,
  initialCosts,
  listingId
}: { 
  activities: Activity[], 
  cities: City[],
  initialData?: InitialListing,
  initialCosts?: InitialCost[],
  listingId?: string
}) {
  const [listingType, setListingType] = useState<'offer' | 'seek'>(initialData?.type || 'offer')
  const [maxParticipants, setMaxParticipants] = useState(initialData?.max_participants || 4)
  
  const [dateStart, setDateStart] = useState(initialData?.date_start ? initialData.date_start.split('T')[0] : '')
  const [dateEnd, setDateEnd] = useState(initialData?.date_end ? initialData.date_end.split('T')[0] : '')
  
  const [cityInput, setCityInput] = useState(initialData?.city || '')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [budgetMax, setBudgetMax] = useState(initialData?.budget_max?.toString() || '')
  
  const [prepaymentRequired, setPrepaymentRequired] = useState(initialData?.prepayment_required || false)
  const [prepaymentAmount, setPrepaymentAmount] = useState(initialData?.prepayment_amount?.toString() || '')
  
  const [costs, setCosts] = useState<Cost[]>(
    initialCosts && initialCosts.length > 0 
      ? initialCosts.map((c) => ({
          id: c.id,
          title: c.title,
          amount: c.amount,
          isShared: c.is_shared ?? true
        }))
      : [
          { id: '1', title: 'Nocleg', amount: 1000, isShared: true },
          { id: '2', title: 'Paliwo', amount: 400, isShared: true },
          { id: '3', title: 'Skipass', amount: 200, isShared: false }
        ]
  )

  const filteredCities = cities.filter(city => 
    city.label_pl.toLowerCase().includes(cityInput.toLowerCase()) && cityInput.length > 1
  )

  // Формируем массивы опций для наших кастомных селектов
  const activityOptions = activities.map(a => ({ value: a.value, label: a.label_pl }))
  const genderOptions = [
    { value: 'any', label: 'Mieszane' },
    { value: 'men', label: 'Tylko mężczyźni' },
    { value: 'women', label: 'Tylko kobiety' }
  ]
  const childrenOptions = [
    { value: 'yes', label: 'Można' },
    { value: 'no', label: 'Tylko dorośli' },
    { value: 'family', label: 'Wyjazd rodzinny' }
  ]
  const languageOptions = [
    { value: 'pl', label: 'Polski' },
    { value: 'en', label: 'Angielski' },
    { value: 'ru', label: 'Rosyjski' },
    { value: 'uk', label: 'Ukraiński' }
  ]

  const addCost = () => {
    setCosts([...costs, { id: Date.now().toString(), title: '', amount: 0, isShared: true }])
  }

  const updateCost = (id: string, field: keyof Cost, value: string | number | boolean) => {
    setCosts(costs.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const removeCost = (id: string) => {
    setCosts(costs.filter(c => c.id !== id))
  }

  const totalShared = costs.filter(c => c.isShared).reduce((sum, c) => sum + Number(c.amount), 0)
  const totalIndividual = costs.filter(c => !c.isShared).reduce((sum, c) => sum + Number(c.amount), 0)
  const perPersonCost = (totalShared / maxParticipants) + totalIndividual

  const inputClass = "w-full bg-[#f5f5f7] border-none rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#0071e3]/50 transition-all outline-none"
  const labelClass = "block text-[13px] font-medium text-gray-500 uppercase tracking-wide mb-2"

  const formAction = listingId ? updateListing : createListing;

  return (
    <form action={formAction} className="space-y-8 pb-12">
      {listingId && <input type="hidden" name="listingId" value={listingId} />}
      <input type="hidden" name="type" value={listingType} />
      <input type="hidden" name="costs" value={listingType === 'offer' ? JSON.stringify(costs) : '[]'} />
      <input type="hidden" name="prepayment_required" value={prepaymentRequired.toString()} />

      <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
        <h2 className="text-xl font-semibold tracking-tight border-b border-gray-100 pb-4">Podstawowe informacje</h2>
        
        <div className="flex gap-2 mb-6 bg-[#f5f5f7] p-1.5 rounded-2xl">
          <button 
            type="button" 
            onClick={() => setListingType('offer')} 
            className={`flex-1 py-3 rounded-xl font-medium text-[14px] transition-all flex items-center justify-center gap-2 ${listingType === 'offer' ? 'bg-white shadow-sm text-[#0071e3] ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Car className="w-4 h-4" /> Mam miejsce
          </button>
          <button 
            type="button" 
            onClick={() => setListingType('seek')} 
            className={`flex-1 py-3 rounded-xl font-medium text-[14px] transition-all flex items-center justify-center gap-2 ${listingType === 'seek' ? 'bg-white shadow-sm text-[#0071e3] ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Search className="w-4 h-4" /> Szukam wyjazdu
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Aktywność</label>
            {/* ЗАМЕНИЛИ СИСТЕМНЫЙ SELECT НА НАШ */}
            <CustomSelect 
              name="activity" 
              options={activityOptions} 
              defaultValue={initialData?.activity || activities[0]?.value} 
            />
          </div>
          <div>
            <label className={labelClass}>Tytuł</label>
            <input name="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="np. Weekend w Zakopanem" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Opis (opcjonalnie)</label>
          <textarea name="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opisz plan wyjazdu i atmosferę..." className={inputClass} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <label className={labelClass}>Miasto (opcjonalnie)</label>
            <input 
              name="city" required={listingType === 'offer'} placeholder="np. Zakopane" className={inputClass}
              value={cityInput}
              onChange={(e) => { setCityInput(e.target.value); setShowSuggestions(true) }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onFocus={() => { if (cityInput.length > 1) setShowSuggestions(true) }}
            />
            {showSuggestions && filteredCities.length > 0 && (
              <ul className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
                {filteredCities.map((city) => (
                  <li key={city.value} className="px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => { setCityInput(city.label_pl); setShowSuggestions(false) }}>
                    {city.label_pl}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div>
            <label className={labelClass}>{listingType === 'offer' ? 'Data wyjazdu' : 'Dostępny od'}</label>
            <input name="date_start" type="date" className={inputClass} value={dateStart} onChange={(e) => { setDateStart(e.target.value); if (dateEnd && e.target.value > dateEnd) setDateEnd('') }} />
          </div>
          <div>
            <label className={labelClass}>{listingType === 'offer' ? 'Data powrotu' : 'Dostępny do'}</label>
            <input name="date_end" type="date" className={inputClass} value={dateEnd} min={dateStart} onChange={(e) => setDateEnd(e.target.value)} disabled={!dateStart} />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
        <h2 className="text-xl font-semibold tracking-tight border-b border-gray-100 pb-4">Preferencje i płatności</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Kto jedzie?</label>
            {/* ЗАМЕНИЛИ */}
            <CustomSelect 
              name="gender_pref" 
              options={genderOptions} 
              defaultValue={initialData?.gender_pref || 'any'} 
            />
          </div>
          <div>
            <label className={labelClass}>Dzieci</label>
            {/* ЗАМЕНИЛИ */}
            <CustomSelect 
              name="children_allowed" 
              options={childrenOptions} 
              defaultValue={initialData?.children_allowed || 'yes'} 
            />
          </div>
          <div>
            <label className={labelClass}>Język</label>
            {/* ЗАМЕНИЛИ */}
            <CustomSelect 
              name="language_pref" 
              options={languageOptions} 
              defaultValue={initialData?.language_pref || 'pl'} 
            />
          </div>
        </div>

        <div className="bg-[#f5f5f7] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={prepaymentRequired}
              onChange={(e) => setPrepaymentRequired(e.target.checked)}
              className="w-5 h-5 rounded text-[#0071e3] focus:ring-[#0071e3]"
            />
            <span className="font-medium text-gray-900">
              {listingType === 'offer' ? 'Wymagana zaliczka' : 'Gotowość do zaliczki'}
            </span>
          </label>

          {prepaymentRequired && (
            <div className="flex items-center gap-2">
              <input 
                name="prepayment_amount" 
                type="number" 
                min="0"
                required
                value={prepaymentAmount}
                onChange={(e) => setPrepaymentAmount(e.target.value)}
                placeholder="Kwota (zł)" 
                className="w-32 bg-white border-none rounded-xl px-3 py-2 text-[15px] focus:ring-2 focus:ring-[#0071e3]/50 outline-none" 
              />
              <span className="text-gray-500">zł</span>
            </div>
          )}
        </div>
      </div>

      {listingType === 'seek' ? (
        <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
          <h2 className="text-xl font-semibold tracking-tight border-b border-gray-100 pb-4">Twój budżet</h2>
          <div className="bg-[#f5f5f7] p-6 rounded-2xl">
            <label className={`${labelClass} flex items-center gap-2`}>
              <Wallet className="w-4 h-4 text-[#0071e3]" /> Maksymalna kwota, jaką chcesz zapłacić (zł)
            </label>
            <div className="relative">
              <input name="budget_max" type="number" min="0" required value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} placeholder="np. 500" className="w-full bg-white border-none rounded-xl pl-4 pr-12 py-4 text-xl font-semibold text-gray-900 placeholder-gray-300 focus:ring-2 focus:ring-[#0071e3]/50 transition-all outline-none" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">zł</span>
            </div>
            <p className="text-[13px] text-gray-500 mt-3">
              Podaj kwotę, którą jesteś gotów przeznaczyć na ten wyjazd.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
          <h2 className="text-xl font-semibold tracking-tight border-b border-gray-100 pb-4">Kalkulator kosztów</h2>
          <div className="flex items-center justify-between bg-[#f5f5f7] p-5 rounded-2xl">
            <label className="font-medium text-gray-900">Liczba osób w grupie</label>
            <input name="max_participants" type="number" min="2" max="10" value={maxParticipants} onChange={(e) => setMaxParticipants(Number(e.target.value))} className="w-20 bg-white rounded-xl border-none p-2 text-center text-lg font-semibold text-[#0071e3] shadow-sm outline-none focus:ring-2 focus:ring-[#0071e3]/50" />
          </div>

          <div className="space-y-3">
            {costs.map((cost) => (
              <div key={cost.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50/50 p-3 rounded-2xl">
                <input value={cost.title} onChange={(e) => updateCost(cost.id, 'title', e.target.value)} placeholder="Nazwa (np. Dom)" className="flex-1 w-full bg-white rounded-lg border border-gray-200 px-3 py-2 text-[14px] outline-none focus:border-[#0071e3]" />
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input value={cost.amount} onChange={(e) => updateCost(cost.id, 'amount', e.target.value)} type="number" min="0" className="w-24 bg-white rounded-lg border border-gray-200 px-3 py-2 text-[14px] outline-none focus:border-[#0071e3]" />
                  <label className="flex items-center gap-2 text-[13px] text-gray-600 cursor-pointer min-w-[140px]">
                    <input type="checkbox" checked={cost.isShared} onChange={(e) => updateCost(cost.id, 'isShared', e.target.checked)} className="w-4 h-4 rounded text-[#0071e3] focus:ring-[#0071e3]" />
                    Dzielone
                  </label>
                  <button type="button" onClick={() => removeCost(cost.id)} className="text-gray-400 hover:text-red-500 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={addCost} className="text-[14px] font-medium text-[#0071e3] hover:opacity-70 transition-opacity">+ Dodaj koszt</button>

          <div className="mt-8 bg-gray-900 text-white p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div>
              <p className="text-gray-400 text-[13px] uppercase tracking-wide mb-1">Całkowity koszt</p>
              <p className="text-2xl font-medium">{totalShared + totalIndividual} zł</p>
            </div>
            <div className="md:text-right">
              <p className="text-gray-400 text-[13px] uppercase tracking-wide mb-1">Cena za osobę ({maxParticipants} os.)</p>
              <p className="text-4xl font-semibold text-green-400">{Math.round(perPersonCost)} zł</p>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4">
        <SubmitButton isEdit={!!listingId} />
      </div>
    </form>
  )
}