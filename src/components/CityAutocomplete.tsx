'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin } from 'lucide-react'

type DictItem = { value: string; label_pl: string; is_resort?: boolean }

export default function CityAutocomplete({
  value,
  onChange,
  options,
  placeholder = "Wpisz miasto...",
  disabled = false
}: {
  value: string
  onChange: (val: string) => void
  options: DictItem[]
  placeholder?: string
  disabled?: boolean
}) {
  const [searchTerm, setSearchTerm] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchTerm(value)
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Нормализация (убираем польские хвостики для поиска)
  const normalize = (text: string) => 
    text.toLowerCase()
        .replace(/ż/g, 'z')
        .replace(/ó/g, 'o')
        .replace(/ł/g, 'l')
        .replace(/ą/g, 'a')
        .replace(/ę/g, 'e')
        .replace(/ś/g, 's')
        .replace(/ć/g, 'c')
        .replace(/ń/g, 'n');

  const searchLower = normalize(searchTerm.trim());

  const filteredOptions = searchLower.length >= 2 
    ? options
        .filter(opt => normalize(opt.label_pl).includes(searchLower))
        .sort((a, b) => {
          const aStarts = normalize(a.label_pl).startsWith(searchLower);
          const bStarts = normalize(b.label_pl).startsWith(searchLower);
          // Сначала те, которые НАЧИНАЮТСЯ с этих букв
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.label_pl.localeCompare(b.label_pl);
        })
        .slice(0, 50)
    : []

  const handleSelect = (cityName: string) => {
    setSearchTerm(cityName)
    onChange(cityName)
    setIsOpen(false)
  }

  const inputClass = "w-full bg-[#f5f5f7] border-none rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#0066cc]/50 transition-all outline-none"

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setIsOpen(true)
          if (e.target.value === '') onChange('')
        }}
        onFocus={() => { if (searchTerm.length >= 2) setIsOpen(true) }}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClass}
      />
      
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
          {filteredOptions.map((city) => (
            <li 
              key={city.value} 
              className="px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2" 
              onClick={() => handleSelect(city.label_pl)}
            >
              <MapPin className="w-4 h-4 text-gray-400" />
              {city.label_pl}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}