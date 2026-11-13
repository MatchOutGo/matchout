'use client'

import { useState } from 'react'
import { createListing, updateListing } from './actions'
import { Loader2, MapPin, X, Bus } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import CustomSelect from '@/components/CustomSelect'
import { polishCities } from '@/data/polishCities'

type Cost = { id: string; title: string; amount: number; isShared: boolean }
type Activity = { value: string; label_pl: string }
type City = { value: string; label_pl: string }

type InitialListing = {
  type?: 'offer' | 'seek'
  max_participants?: number | null
  date_start?: string | null
  date_end?: string | null
  city?: string | null
  country?: string | null
  pickup_cities?: string[] | null
  activity?: string
  title?: string
  description?: string | null
  gender_pref?: string | null
  children_allowed?: string | null
  language_pref?: string | null
  prepayment_required?: boolean | null
  prepayment_amount?: number | null
  is_bus_trip?: boolean | null
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
    <button type="submit" disabled={pending} className="w-full py-4 bg-[#0071e3] text-white text-[17px] rounded-full font-medium hover:bg-[#0077ed] transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2">
      {pending && <Loader2 className="w-5 h-5 animate-spin" />}
      {pending ? 'Przetwarzanie...' : (isEdit ? 'Zapisz zmiany' : 'Opublikuj ogłoszenie')}
    </button>
  );
}

export default function CreateListingForm({ 
  activities, cities, countries, initialData, initialCosts, listingId, showGender = true, showChildren = true
}: { 
  activities: Activity[], 
  cities: City[],
  countries: City[],
  initialData?: InitialListing,
  initialCosts?: InitialCost[],
  listingId?: string,
  showGender?: boolean,
  showChildren?: boolean,
}) {
  const [maxParticipants, setMaxParticipants] = useState(initialData?.max_participants || 4)
  
  const [dateStart, setDateStart] = useState(initialData?.date_start ? initialData.date_start.split('T')[0] : '')
  const [dateEnd, setDateEnd] = useState(initialData?.date_end ? initialData.date_end.split('T')[0] : '')
  
  const [selectedCountry, setSelectedCountry] = useState(initialData?.country || 'Polska')
  const [cityInput, setCityInput] = useState(initialData?.city || '')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [pickupCities, setPickupCities] = useState<string[]>(initialData?.pickup_cities || [])
  const [pickupInput, setPickupInput] = useState('')
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)

  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  
  const [prepaymentRequired, setPrepaymentRequired] = useState(initialData?.prepayment_required || false)
  const [prepaymentAmount, setPrepaymentAmount] = useState(initialData?.prepayment_amount?.toString() || '')
  const [isBusTrip, setIsBusTrip] = useState(initialData?.is_bus_trip || false) // <-- Стейт для Буса
  
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

  const checkAndSetCountry = (cityName: string) => {
    const isPolish = cities.some(c => c.label_pl.toLowerCase() === cityName.toLowerCase()) || 
      polishCities.some(c => c.toLowerCase() === cityName.toLowerCase());
    if (isPolish && selectedCountry !== 'Polska') setSelectedCountry('Polska');
  }

  const filteredCities = selectedCountry === 'Polska' 
    ? cities.filter((city: City) => city.label_pl.toLowerCase().includes(cityInput.toLowerCase()) && cityInput.length > 1)
    : []; 

  const filteredPickupCities = polishCities.filter(city => 
    city.toLowerCase().includes(pickupInput.toLowerCase()) && pickupInput.length > 1 && !pickupCities.includes(city)
  )

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry)
    if (newCountry !== 'Polska') setCityInput('') 
  }

  const addPickupCity = (cityName: string) => {
    if (!pickupCities.includes(cityName)) setPickupCities([...pickupCities, cityName])
    setPickupInput('')
    setShowPickupSuggestions(false)
  }
  const removePickupCity = (cityName: string) => setPickupCities(pickupCities.filter(c => c !== cityName))

  const activityOptions = (activities || []).map((a: Activity) => ({ value: a.value, label: a.label_pl }))
  const countryOptions = (countries || []).map((c: City) => ({ value: c.label_pl, label: c.label_pl }))
  
  const genderOptions = [
    { value: 'any', label: 'Wszyscy' },
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
    { value: 'en', label: 'Angielski' }
  ]

  const addCost = () => setCosts([...costs, { id: Date.now().toString(), title: '', amount: 0, isShared: true }])
  const updateCost = (id: string, field: keyof Cost, value: string | number | boolean) => setCosts(costs.map(c => c.id === id ? { ...c, [field]: value } : c))
  const removeCost = (id: string) => setCosts(costs.filter(c => c.id !== id))

  const totalShared = costs.filter(c => c.isShared).reduce((sum, c) => sum + Number(c.amount), 0)
  const totalIndividual = costs.filter(c => !c.isShared).reduce((sum, c) => sum + Number(c.amount), 0)
  const perPersonCost = (totalShared / maxParticipants) + totalIndividual

  const inputClass = "w-full bg-[#f5f5f7] border-none rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#0071e3]/50 transition-all outline-none"
  const labelClass = "block text-[13px] font-medium text-gray-500 uppercase tracking-wide mb-2"

  const formAction = listingId ? updateListing : createListing;

  return (
    <form action={formAction} className="space-y-8 pb-12">
      {listingId && <input type="hidden" name="listingId" value={listingId} />}
      <input type="hidden" name="type" value="offer" />
      <input type="hidden" name="costs" value={JSON.stringify(costs)} />
      <input type="hidden" name="pickup_cities" value={JSON.stringify(pickupCities)} />
      <input type="hidden" name="prepayment_required" value={prepaymentRequired.toString()} />
      <input type="hidden" name="is_bus_trip" value={isBusTrip.toString()} />

      {/* Скрытые инпуты для выключенных фич */}
      {!showGender && <input type="hidden" name="gender_pref" value={initialData?.gender_pref || 'any'} />}
      {!showChildren && <input type="hidden" name="children_allowed" value={initialData?.children_allowed || 'yes'} />}

      <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
        <h2 className="text-xl font-semibold tracking-tight border-b border-gray-100 pb-4">Podstawowe informacje</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Aktywność</label>
            <CustomSelect name="activity" options={activityOptions} defaultValue={initialData?.activity || activities[0]?.value} />
          </div>
          <div>
            <label className={labelClass}>Tytuł</label>
            <input name="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="np. Weekend w Alpach" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Opis (opcjonalnie)</label>
          <textarea name="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opisz plan wyjazdu i atmosferę..." className={inputClass} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
          <div>
            <label className={labelClass}>Kraj (Dokąd?)</label>
            <CustomSelect name="country" options={countryOptions} defaultValue={selectedCountry} onChange={handleCountryChange} />
          </div>
          
          <div className="relative md:col-span-1">
            <label className={labelClass}>Miejscowość / Kurort</label>
            <input 
              name="city" required 
              placeholder={selectedCountry === 'Polska' ? "np. Zakopane" : "Wpisz miejscowość..."} 
              className={inputClass}
              value={cityInput}
              onChange={(e) => { setCityInput(e.target.value); setShowSuggestions(true); checkAndSetCountry(e.target.value); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onFocus={() => { if (cityInput.length > 1) setShowSuggestions(true) }}
            />
            {showSuggestions && selectedCountry === 'Polska' && filteredCities.length > 0 && (
              <ul className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
                {filteredCities.map((city: City) => (
                  <li key={city.value} className="px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => { setCityInput(city.label_pl); setShowSuggestions(false); checkAndSetCountry(city.label_pl); }}>
                    {city.label_pl}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div>
            <label className={labelClass}>Data wyjazdu</label>
            <input name="date_start" type="date" className={inputClass} value={dateStart} onChange={(e) => { setDateStart(e.target.value); if (dateEnd && e.target.value > dateEnd) setDateEnd('') }} />
          </div>
          <div>
            <label className={labelClass}>Data powrotu</label>
            <input name="date_end" type="date" className={inputClass} value={dateEnd} min={dateStart} onChange={(e) => setDateEnd(e.target.value)} disabled={!dateStart} />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className={labelClass}>Skąd możesz zabrać? (Miejsca zbiórki)</label>
          <div className="relative">
            <input 
              placeholder="Wpisz miasto (np. Warszawa) i naciśnij Enter..." 
              className={inputClass}
              value={pickupInput}
              onChange={(e) => { setPickupInput(e.target.value); setShowPickupSuggestions(true) }}
              onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
              onFocus={() => { if (pickupInput.length > 1) setShowPickupSuggestions(true) }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (pickupInput.trim()) addPickupCity(pickupInput.trim());
                }
              }}
            />
            {showPickupSuggestions && filteredPickupCities.length > 0 && (
              <ul className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
                {filteredPickupCities.map((city: string) => (
                  <li key={city} className="px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => addPickupCity(city)}>
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {pickupCities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {pickupCities.map(city => (
                <span key={city} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#0071e3] rounded-lg text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  {city}
                  <button type="button" onClick={() => removePickupCity(city)} className="hover:text-red-500 transition-colors ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
        <h2 className="text-xl font-semibold tracking-tight border-b border-gray-100 pb-4">Preferencje i płatności</h2>
        
        {/* БЛОК БУСА */}
        <div className="bg-[#f5f5f7] p-5 rounded-2xl flex items-center gap-3 mb-4">
          <label className="flex items-center gap-3 cursor-pointer w-full">
            <input 
              type="checkbox" 
              checked={isBusTrip} 
              onChange={(e) => setIsBusTrip(e.target.checked)} 
              className="w-5 h-5 rounded text-[#0071e3] focus:ring-[#0071e3]" 
            />
            <div>
              <span className="font-medium text-gray-900 flex items-center gap-2">
                <Bus className="w-4 h-4" /> Wyjazd busem (Transport wliczony)
              </span>
              <p className="text-xs text-gray-500 mt-0.5">Zaznacz, jeśli organizujesz transport autokarem/busem.</p>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showGender && (
            <div>
              <label className={labelClass}>Dla kogo miejsce?</label>
              <CustomSelect name="gender_pref" options={genderOptions} defaultValue={initialData?.gender_pref || 'any'} />
            </div>
          )}
          
          {showChildren && (
            <div>
              <label className={labelClass}>Dzieci</label>
              <CustomSelect name="children_allowed" options={childrenOptions} defaultValue={initialData?.children_allowed || 'yes'} />
            </div>
          )}

          <div>
            <label className={labelClass}>Język</label>
            <CustomSelect name="language_pref" options={languageOptions} defaultValue={initialData?.language_pref || 'pl'} />
          </div>
        </div>

        <div className="bg-[#f5f5f7] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={prepaymentRequired} onChange={(e) => setPrepaymentRequired(e.target.checked)} className="w-5 h-5 rounded text-[#0071e3] focus:ring-[#0071e3]" />
            <span className="font-medium text-gray-900">Wymagana zaliczka</span>
          </label>
          {prepaymentRequired && (
            <div className="flex items-center gap-2">
              <input name="prepayment_amount" type="number" min="0" required value={prepaymentAmount} onChange={(e) => setPrepaymentAmount(e.target.value)} placeholder="Kwota (zł)" className="w-32 bg-white border-none rounded-xl px-3 py-2 text-[15px] focus:ring-2 focus:ring-[#0071e3]/50 outline-none" />
              <span className="text-gray-500">zł</span>
            </div>
          )}
        </div>
      </div>

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

      <div className="pt-4">
        <SubmitButton isEdit={!!listingId} />
      </div>
    </form>
  )
}