'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

type DictItem = { value: string; label_pl: string; is_resort?: boolean }

export default function CitySelect({
  value,
  onChange,
  options,
  placeholder,
  disabled
}: {
  value: string
  onChange: (val: string) => void
  options: DictItem[]
  placeholder: string
  disabled?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Закрываем при клике вне компонента
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find(o => o.value === value)

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#f5f5f7] border-none rounded-xl px-4 py-3 text-[15px] text-left flex justify-between items-center outline-none transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#0066cc]/50 cursor-pointer hover:bg-gray-100'}`}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label_pl : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          <div
            onClick={() => { onChange(''); setIsOpen(false) }}
            className={`px-4 py-3 text-[15px] cursor-pointer hover:bg-gray-50 ${value === '' ? 'bg-blue-50 text-[#0066cc] font-medium' : 'text-gray-900'}`}
          >
            {placeholder}
          </div>
          
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false) }}
              className={`px-4 py-3 text-[15px] cursor-pointer hover:bg-gray-50 flex justify-between items-center gap-4 ${value === opt.value ? 'bg-blue-50 text-[#0066cc] font-medium' : 'text-gray-900'}`}
            >
              <span className="truncate">{opt.label_pl}</span>
              {opt.is_resort && (
                <span className="text-[10px] text-gray-400 font-semibold tracking-wider shrink-0 uppercase">
                  Ośrodek
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}