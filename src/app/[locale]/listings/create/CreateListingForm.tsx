'use client'

import { useState, useEffect } from 'react'
import { createListing, updateListing } from './actions'
import { Loader2, MapPin, X, MountainSnow, Flame, Check } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import CustomSelect from '@/components/CustomSelect'
import CitySelect from '@/components/CitySelect'
import CityAutocomplete from '@/components/CityAutocomplete'

type DictItem = { value: string; label_pl: string; parent_value?: string; is_resort?: boolean }

type InitialListingData = {
  max_participants?: number
  date_start?: string
  date_end?: string
  trip_type?: string
  price_type?: string
  fixed_price?: number
  fixed_price_no_meals?: number
  fixed_price_with_meals?: number
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
  is_special?: boolean
  cover_image?: string
}

const TRIP_TYPE_OPTIONS = [
  { value: 'bus', label: 'Bus' },
  { value: 'osobowy', label: 'Osobowy' },
  { value: 'bez_znaczenia', label: 'Bez znaczenia' },
] as const

const PRICE_TYPE_OPTIONS = [
  { value: 'shared', label: 'Koszty dzielone' },
  { value: 'fixed_no_meals', label: 'Koszty ustalone bez wyżywienia' },
  { value: 'fixed_with_meals', label: 'Koszty ustalone z wyżywieniem' },
] as const

const AVAILABLE_IMAGES = Array.from({ length: 20 }, (_, i) => `/images/activities/${i + 1}.jpg`);

const normalizeTripType = (value?: string) => {
  if (value === 'bus' || value === 'osobowy' || value === 'bez_znaczenia') return value
  if (value === 'Bus') return 'bus'
  if (value === 'Osobowy' || value === 'car_shared' || value === 'car') return 'osobowy'
  return 'bez_znaczenia'
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
  cities, countries, initialData, listingId, showGender = false, showChildren = false
}: { 
  cities: DictItem[], 
  countries: DictItem[],
  tripTypes?: DictItem[],
  priceTypes?: DictItem[],
  initialData?: InitialListingData,
  initialCosts?: unknown[],
  listingId?: string,
  showGender?: boolean,
  showChildren?: boolean
}) {
  const [today, setToday] = useState('') 

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(new Date().toLocaleDateString('sv-SE'))
  }, [])

  const [dateStart, setDateStart] = useState(initialData?.date_start ? initialData.date_start.split('T')[0] : '')
  const [dateEnd, setDateEnd] = useState(initialData?.date_end ? initialData.date_end.split('T')[0] : '')
  
  const [tripType, setTripType] = useState(normalizeTripType(initialData?.trip_type))
  
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<string[]>(
    initialData?.price_type ? initialData.price_type.split(',') : []
  );
  const [priceError, setPriceError] = useState(false);

  const [priceNoMeals, setPriceNoMeals] = useState(initialData?.fixed_price_no_meals?.toString() || '')
  const [priceWithMeals, setPriceWithMeals] = useState(initialData?.fixed_price_with_meals?.toString() || '')

  const [coverImage, setCoverImage] = useState(initialData?.cover_image || AVAILABLE_IMAGES[0])
  
  const [destCountry, setDestCountry] = useState<string>('')
  const [destCity, setDestCity] = useState<string>('')
  
  const [originCity, setOriginCity] = useState(initialData?.origin_city || '')
  
  const [skiDays, setSkiDays] = useState(initialData?.ski_days || 1)
  const [pickupCities, setPickupCities] = useState<string[]>(initialData?.pickup_cities || [])
  const [pickupInput, setPickupInput] = useState('')
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)

  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  
  const [prepaymentRequired, setPrepaymentRequired] = useState(initialData?.prepayment_required || false)
  const [prepaymentAmount, setPrepaymentAmount] = useState(initialData?.prepayment_amount?.toString() || '')
  
  const [isSpecial, setIsSpecial] = useState(initialData?.is_special || false)

  // СОСТОЯНИЕ ДЛЯ ОШИБКИ ОПИСАНИЯ
  const [descriptionError, setDescriptionError] = useState(false);

  const polandValue = countries.find(c => c.label_pl === 'Polska')?.value || 'PL'

  const availableDestCities = cities.filter(c => c.is_resort && (!destCountry || c.parent_value === destCountry))

  const availableOriginCities = cities
    .filter(c => c.parent_value === polandValue && !c.is_resort)
    .sort((a, b) => a.label_pl.localeCompare(b.label_pl))

  const filteredPickupCities = cities.filter(city => 
    city.label_pl.toLowerCase().includes(pickupInput.toLowerCase()) && 
    pickupInput.length > 1 && 
    !pickupCities.includes(city.label_pl) &&
    city.parent_value === polandValue &&
    !city.is_resort
  )

  const addPickupCity = (cityName: string) => {
    if (!pickupCities.includes(cityName)) setPickupCities([...pickupCities, cityName])
    setPickupInput('')
    setShowPickupSuggestions(false)
  }
  const removePickupCity = (cityName: string) => setPickupCities(pickupCities.filter(c => c !== cityName))

  const togglePriceType = (type: string) => {
    setPriceError(false);
    setSelectedPriceTypes(prev => {
      if (type === 'shared') {
        return prev.includes('shared') ? [] : ['shared'];
      } else {
        const withoutShared = prev.filter(t => t !== 'shared');
        return withoutShared.includes(type)
          ? withoutShared.filter(t => t !== type)
          : [...withoutShared, type];
      }
    });
  };

  const inputClass = "w-full bg-[#f5f5f7] border-none rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#0066cc]/50 transition-all outline-none"
  const labelClass = "block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1"
  const cardClass = "bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6"
  const titleClass = "text-xl font-semibold tracking-tight border-b border-gray-100 pb-4"

  const formAction = listingId ? updateListing : createListing;

  // ВАЛИДАЦИЯ ФОРМЫ
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    let hasError = false;

    if (selectedPriceTypes.length === 0) {
      e.preventDefault();
      setPriceError(true);
      hasError = true;
    }

    // Проверка на телефон в описании
    const phoneRegex = /(?:\+?48[\s-]?)?\d{3}[\s-]?\d{3}[\s-]?\d{3}/g;
    if (phoneRegex.test(description)) {
      e.preventDefault();
      setDescriptionError(true);
      hasError = true;
    } else {
      setDescriptionError(false);
    }
    
    // Если есть ошибки, предотвращаем отправку (на всякий случай, если что-то упустили)
    if (hasError) {
      e.preventDefault();
    }
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
      {listingId && <input type="hidden" name="listingId" value={listingId} />}
      <input type="hidden" name="type" value="offer" />
      <input type="hidden" name="costs" value="[]" />
      <input type="hidden" name="max_participants" value="4" />
      
      <input type="hidden" name="is_special" value={isSpecial.toString()} />
      <input type="hidden" name="cover_image" value={coverImage} />
      
      {!showGender && <input type="hidden" name="gender_pref" value={initialData?.gender_pref || 'any'} />}
      {!showChildren && <input type="hidden" name="children_allowed" value={initialData?.children_allowed || 'yes'} />}
      <input type="hidden" name="language_pref" value="pl" />

      <input type="hidden" name="countries" value={destCountry ? JSON.stringify([destCountry]) : '[]'} />
      <input type="hidden" name="cities" value={destCity ? JSON.stringify([destCity]) : '[]'} />
      
      <input type="hidden" name="pickup_cities" value={JSON.stringify(pickupCities)} />
      <input type="hidden" name="prepayment_required" value={prepaymentRequired.toString()} />
      <input type="hidden" name="price_type" value={selectedPriceTypes.join(',')} />

      <div className={cardClass}>
        <h2 className={titleClass}>Podstawowe informacje</h2>

        <div>
          <label className={labelClass}>Tytuł</label>
          <input name="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="np. Weekend w Alpach" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rodzaj wyjazdu</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#f5f5f7] p-4 rounded-2xl">
            {TRIP_TYPE_OPTIONS.map((type) => (
              <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="trip_type" 
                  value={type.value} 
                  checked={tripType === type.value}
                  onChange={(e) => setTripType(e.target.value)}
                  className="w-4 h-4 text-[#0066cc] focus:ring-[#0066cc]"
                />
                <span className="text-sm font-medium text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
          <div>
            <label className={labelClass}>Data wyjazdu</label>
            <input name="date_start" type="date" min={today} className={inputClass} value={dateStart} onChange={(e) => { setDateStart(e.target.value); if (dateEnd && e.target.value > dateEnd) setDateEnd('') }} />
          </div>
          <div>
            <label className={labelClass}>Data przyjazdu</label>
            <input name="date_end" type="date" className={inputClass} value={dateEnd} min={dateStart || today} onChange={(e) => setDateEnd(e.target.value)} disabled={!dateStart} />
          </div>
          <div>
            <label className={labelClass}>Ilość dni na nartach</label>
            <input name="ski_days" type="number" min="1" max="30" required value={skiDays} onChange={(e) => setSkiDays(Number(e.target.value))} className={inputClass} />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Gdzie jedziemy</h2>
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
        <h2 className={titleClass}>Skąd wyjeżdżamy</h2>
        
        <div>
          <label className={labelClass}>Miasto</label>
          <CityAutocomplete 
            value={originCity}
            onChange={setOriginCity}
            options={availableOriginCities}
            placeholder="Wpisz miasto (np. Warszawa)..."
          />
          <input type="hidden" name="origin_city" value={originCity} />
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
        <h2 className={titleClass}>Koszty</h2>
        
        <div>
          <div className={`space-y-3 p-2 rounded-2xl border-2 transition-colors ${priceError ? 'border-red-200 bg-red-50' : 'border-transparent'}`}>
            {PRICE_TYPE_OPTIONS.map((type) => (
              <div key={type.value} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-xl transition-colors ${selectedPriceTypes.includes(type.value) ? 'bg-[#f5f5f7] border border-gray-200' : 'bg-white border border-gray-100 hover:bg-gray-50'}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedPriceTypes.includes(type.value)}
                    onChange={() => togglePriceType(type.value)}
                    className="w-5 h-5 rounded text-[#0066cc] focus:ring-[#0066cc]"
                  />
                  <span className="font-medium text-gray-900">{type.label}</span>
                </label>

                {type.value === 'fixed_no_meals' && selectedPriceTypes.includes('fixed_no_meals') && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 w-full sm:w-auto pl-8 sm:pl-0">
                    <input 
                      name="fixed_price_no_meals" 
                      type="number" 
                      min="0" 
                      required
                      value={priceNoMeals} 
                      onChange={(e) => setPriceNoMeals(e.target.value)} 
                      placeholder="Kwota" 
                      className="w-full sm:w-32 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-[#0066cc]/50" 
                    />
                    <span className="text-gray-500 text-sm font-medium">zł</span>
                  </div>
                )}

                {type.value === 'fixed_with_meals' && selectedPriceTypes.includes('fixed_with_meals') && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 w-full sm:w-auto pl-8 sm:pl-0">
                    <input 
                      name="fixed_price_with_meals" 
                      type="number" 
                      min="0" 
                      required
                      value={priceWithMeals} 
                      onChange={(e) => setPriceWithMeals(e.target.value)} 
                      placeholder="Kwota" 
                      className="w-full sm:w-32 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-[#0066cc]/50" 
                    />
                    <span className="text-gray-500 text-sm font-medium">zł</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {priceError && (
            <p className="text-red-500 text-sm mt-3 font-medium">Wybierz przynajmniej jeden rodzaj kosztów.</p>
          )}
        </div>

        {(showGender || showChildren) && (
          <div className={`grid grid-cols-1 ${showGender && showChildren ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6 pt-2`}>
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

        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
          <div>
            <p className="font-semibold text-orange-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Oferta Last Minute / Promocja
            </p>
            <p className="text-sm text-orange-700/80 mt-1">Zaznacz, jeśli chcesz wyróżnić tę ofertę na stronie głównej.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isSpecial} 
              onChange={(e) => setIsSpecial(e.target.checked)} 
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Wybierz zdjęcie główne</h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {AVAILABLE_IMAGES.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCoverImage(img)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                coverImage === img ? 'border-[#0066cc] shadow-md scale-[1.02]' : 'border-transparent hover:opacity-80'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={img} 
                alt={`Zdjęcie ${index + 1}`} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f5f5f7/a1a1aa?text=Brak+zdjęcia';
                }}
              />
              {coverImage === img && (
                <div className="absolute inset-0 bg-[#0066cc]/20 flex items-center justify-center">
                  <div className="bg-[#0066cc] text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">Wybierz jedno ze zdjęć, które pojawi się na karcie ogłoszenia.</p>
      </div>

      <div className={cardClass}>
        <div>
          <label className={labelClass}>Opis (opcjonalnie)</label>
          <textarea 
            name="description" 
            rows={4} 
            value={description} 
            onChange={(e) => { setDescription(e.target.value); setDescriptionError(false); }} 
            placeholder="Opisz plan wyjazdu, atmosferę i ustalcie koszty w czacie..." 
            className={`${inputClass} ${descriptionError ? 'ring-2 ring-red-500' : ''}`} 
          />
          {descriptionError && (
            <p className="text-red-500 text-sm mt-2 font-medium">
              Nie można podawać numeru telefonu w opisie. Skontaktuj się z uczestnikami przez czat.
            </p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <SubmitButton isEdit={!!listingId} />
      </div>
    </form>
  )
}