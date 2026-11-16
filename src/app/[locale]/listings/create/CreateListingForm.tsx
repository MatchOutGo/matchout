'use client'

import { useState } from 'react'
import { createListing, updateListing } from './actions'
import { Loader2, MapPin, X, MountainSnow } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import CustomSelect from '@/components/CustomSelect'
import CitySelect from '@/components/CitySelect'

type DictItem = { value: string; label_pl: string; parent_value?: string; is_resort?: boolean }

type InitialListingData = {
  max_participants?: number
  date_start?: string
  date_end?: string
  trip_type?: string
  price_type?: string
  countries?: string[]
  cities?: string[]
  ski_days?: number
  origin_city?: string
  pickup_cities?: string[]
  title?: string
  description?: string
  prepayment_required?: boolean
  prepayment_amount?: number
  gender_pref?: string
  children_allowed?: string
  language_pref?: string
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full py-4 bg-[#0066cc] text-white text-[17px] rounded-full font-medium hover:bg-[#004c99] transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2">
      {pending && <Loader2 className="w-5 h-5 animate-spin" />}
      {pending ? 'Przetwarzanie...' : (isEdit ? 'Zapisz zmiany' : 'Opublikuj ogłoszenie')}
    </button>
  );
}

export default function CreateListingForm({ 
  cities, countries, tripTypes, priceTypes, initialData, listingId, showGender = false, showChildren = false
}: { 
  cities: DictItem[], 
  countries: DictItem[],
  tripTypes: DictItem[],
  priceTypes: DictItem[],
  initialData?: InitialListingData,
  initialCosts?: unknown[],
  listingId?: string,
  showGender?: boolean,
  showChildren?: boolean
}) {
  const [dateStart, setDateStart] = useState(initialData?.date_start ? initialData.date_start.split('T')[0] : '')
  const [dateEnd, setDateEnd] = useState(initialData?.date_end ? initialData.date_end.split('T')[0] : '')
  
  const [tripType, setTripType] = useState(initialData?.trip_type || tripTypes[0]?.value || 'car_shared')
  const [priceType, setPriceType] = useState(initialData?.price_type || 'shared')
  
  const [destCountry, setDestCountry] = useState<string>('')
  const [destCity, setDestCity] = useState<string>('')
  
  const [originCountry, setOriginCountry] = useState<string>('')
  const [originCity, setOriginCity] = useState(initialData?.origin_city || '')
  
  const [skiDays, setSkiDays] = useState(initialData?.ski_days || 1)
  const [pickupCities, setPickupCities] = useState<string[]>(initialData?.pickup_cities || [])
  const [pickupInput, setPickupInput] = useState('')
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)

  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  
  const [prepaymentRequired, setPrepaymentRequired] = useState(initialData?.prepayment_required || false)
  const [prepaymentAmount, setPrepaymentAmount] = useState(initialData?.prepayment_amount?.toString() || '')

  // Фильтруем города для "Dokąd" (все)
  const availableDestCities = cities.filter(c => !destCountry || c.parent_value === destCountry)
  
  // Фильтруем города для "Skąd" (ТОЛЬКО НЕ курорты)
  const availableOriginCities = cities.filter(c => 
    (!originCountry || c.parent_value === originCountry) && !c.is_resort
  )

  // Автокомплит для мест сбора (ТОЛЬКО НЕ курорты)
  const filteredPickupCities = cities.filter(city => 
    city.label_pl.toLowerCase().includes(pickupInput.toLowerCase()) && 
    pickupInput.length > 1 && 
    !pickupCities.includes(city.label_pl) &&
    (!originCountry || city.parent_value === originCountry) &&
    !city.is_resort // <--- Исключаем курорты
  )

  const addPickupCity = (cityName: string) => {
    if (!pickupCities.includes(cityName)) setPickupCities([...pickupCities, cityName])
    setPickupInput('')
    setShowPickupSuggestions(false)
  }
  const removePickupCity = (cityName: string) => setPickupCities(pickupCities.filter(c => c !== cityName))

  const inputClass = "w-full bg-[#f5f5f7] border-none rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#0066cc]/50 transition-all outline-none"
  const labelClass = "block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1"
  const cardClass = "bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6"
  const titleClass = "text-xl font-semibold tracking-tight border-b border-gray-100 pb-4"

  const formAction = listingId ? updateListing : createListing;

  return (
    <form action={formAction} className="space-y-6">
      {listingId && <input type="hidden" name="listingId" value={listingId} />}
      <input type="hidden" name="type" value="offer" />
      <input type="hidden" name="costs" value="[]" />
      <input type="hidden" name="max_participants" value="4" />
      
      {!showGender && <input type="hidden" name="gender_pref" value={initialData?.gender_pref || 'any'} />}
      {!showChildren && <input type="hidden" name="children_allowed" value={initialData?.children_allowed || 'yes'} />}
      <input type="hidden" name="language_pref" value="pl" />

      <input type="hidden" name="countries" value={destCountry ? JSON.stringify([destCountry]) : '[]'} />
      <input type="hidden" name="cities" value={destCity ? JSON.stringify([destCity]) : '[]'} />
      
      <input type="hidden" name="pickup_cities" value={JSON.stringify(pickupCities)} />
      <input type="hidden" name="prepayment_required" value={prepaymentRequired.toString()} />

      <div className={cardClass}>
        <h2 className={titleClass}>Podstawowe informacje</h2>

        <div>
          <label className={labelClass}>Tytuł</label>
          <input name="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="np. Weekend w Alpach" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rodzaj wyjazdu</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-[#f5f5f7] p-4 rounded-2xl">
            {tripTypes.map((type) => (
              <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="trip_type" 
                  value={type.value} 
                  checked={tripType === type.value}
                  onChange={(e) => setTripType(e.target.value)}
                  className="w-4 h-4 text-[#0066cc] focus:ring-[#0066cc]"
                />
                <span className="text-sm font-medium text-gray-700">{type.label_pl}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
          <div>
            <label className={labelClass}>Data wyjazdu</label>
            <input name="date_start" type="date" className={inputClass} value={dateStart} onChange={(e) => { setDateStart(e.target.value); if (dateEnd && e.target.value > dateEnd) setDateEnd('') }} />
          </div>
          <div>
            <label className={labelClass}>Data przyjazdu</label>
            <input name="date_end" type="date" className={inputClass} value={dateEnd} min={dateStart} onChange={(e) => setDateEnd(e.target.value)} disabled={!dateStart} />
          </div>
          <div>
            <label className={labelClass}>Ilość dni na nartach</label>
            <input name="ski_days" type="number" min="1" max="30" required value={skiDays} onChange={(e) => setSkiDays(Number(e.target.value))} className={inputClass} />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Gdzie jedziemy? (Dokąd)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Kraj</label>
            <select value={destCountry} onChange={(e) => { setDestCountry(e.target.value); setDestCity(''); }} className={inputClass}>
              <option value="">Wybierz kraj...</option>
              {countries.map(c => <option key={c.value} value={c.value}>{c.label_pl}</option>)}
            </select>
          </div>
          <div>
            <label className={`${labelClass} flex items-center gap-1.5`}>
              <MountainSnow className="w-3.5 h-3.5 text-[#0066cc]" /> Miejscowość / Ośrodek
            </label>
            <CitySelect 
              value={destCity}
              onChange={setDestCity}
              options={availableDestCities}
              placeholder="Wybierz miejscowość..."
              disabled={!destCountry}
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Skąd wyjeżdżamy?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Kraj (Główny)</label>
            <select value={originCountry} onChange={(e) => { setOriginCountry(e.target.value); setOriginCity(''); }} className={inputClass}>
              <option value="">Wybierz kraj...</option>
              {countries.map(c => <option key={c.value} value={c.value}>{c.label_pl}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Miasto (Główne)</label>
            <CitySelect 
              value={originCity}
              onChange={setOriginCity}
              options={availableOriginCities}
              placeholder="Wybierz miasto..."
              disabled={!originCountry}
            />
            <input type="hidden" name="origin_city" value={originCity} />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className={labelClass}>Możliwość dosiadki (Miejsca zbiórki po drodze)</label>
          <div className="relative">
            <input 
              placeholder="Wpisz miasto..." 
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
                {filteredPickupCities.map((city) => (
                  <li key={city.value} className="px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 cursor-pointer flex justify-between" onClick={() => addPickupCity(city.label_pl)}>
                    <span>{city.label_pl}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {pickupCities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {pickupCities.map(city => (
                <span key={city} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-[#0066cc] rounded-lg text-sm font-medium">
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

      <div className={cardClass}>
        <h2 className={titleClass}>Cena i płatności</h2>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Typ ceny</label>
          <div className="space-y-2 bg-[#f5f5f7] p-4 rounded-2xl">
            {priceTypes.map((type) => (
              <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="price_type" 
                  value={type.value} 
                  checked={priceType === type.value}
                  onChange={(e) => setPriceType(e.target.value)}
                  className="w-4 h-4 text-[#0066cc] focus:ring-[#0066cc]"
                />
                <span className="text-sm font-medium text-gray-700">{type.label_pl}</span>
              </label>
            ))}
          </div>
        </div>

        {(showGender || showChildren) && (
          <div className={`grid grid-cols-1 ${showGender && showChildren ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6`}>
            {showGender && (
              <div>
                <label className={labelClass}>Dla kogo miejsce?</label>
                <CustomSelect name="gender_pref" options={[{ value: 'any', label: 'Wszyscy' }, { value: 'men', label: 'Tylko mężczyźni' }, { value: 'women', label: 'Tylko kobiety' }]} defaultValue={initialData?.gender_pref || 'any'} />
              </div>
            )}
            {showChildren && (
              <div>
                <label className={labelClass}>Dzieci</label>
                <CustomSelect name="children_allowed" options={[{ value: 'yes', label: 'Można' }, { value: 'no', label: 'Tylko dorośli' }, { value: 'family', label: 'Wyjazd rodzinny' }]} defaultValue={initialData?.children_allowed || 'yes'} />
              </div>
            )}
          </div>
        )}

        <div className="bg-[#f5f5f7] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={prepaymentRequired} onChange={(e) => setPrepaymentRequired(e.target.checked)} className="w-5 h-5 rounded text-[#0066cc] focus:ring-[#0066cc]" />
            <span className="font-medium text-gray-900">Wymagana zaliczka</span>
          </label>
          {prepaymentRequired && (
            <div className="flex items-center gap-2">
              <input name="prepayment_amount" type="number" min="0" required value={prepaymentAmount} onChange={(e) => setPrepaymentAmount(e.target.value)} placeholder="Kwota (zł)" className="w-32 bg-white border-none rounded-xl px-3 py-2 text-[15px] focus:ring-2 focus:ring-[#0066cc]/50 outline-none" />
              <span className="text-gray-500">zł</span>
            </div>
          )}
        </div>
      </div>

      <div className={cardClass}>
        <div>
          <label className={labelClass}>Opis (opcjonalnie)</label>
          <textarea 
            name="description" 
            rows={4} 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Opisz plan wyjazdu, atmosferę i ustalcie koszty w czacie..." 
            className={inputClass} 
          />
        </div>
      </div>

      <div className="pt-4">
        <SubmitButton isEdit={!!listingId} />
      </div>
    </form>
  )
}