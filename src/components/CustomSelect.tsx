'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

type Option = { value: string, label: string }

export default function CustomSelect({
  name,
  options,
  defaultValue,
  placeholder = "Wybierz..."
}: {
  name: string,
  options: Option[],
  defaultValue?: string,
  placeholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(defaultValue || '')
  const containerRef = useRef<HTMLDivElement>(null)

  // Закрываем при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(o => o.value === selected)

  return (
    <div className="relative" ref={containerRef}>
      {/* Скрытый инпут для отправки формы */}
      <input type="hidden" name={name} value={selected} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#f5f5f7] border-none rounded-xl pl-3 pr-8 py-2.5 text-sm focus:ring-2 focus:ring-[#0071e3]/50 outline-none flex items-center justify-between text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 max-h-60 overflow-y-auto py-2 animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSelected(option.value)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${
                selected === option.value ? 'text-[#0071e3] font-medium bg-blue-50/50' : 'text-gray-700'
              }`}
            >
              <span className="truncate">{option.label}</span>
              {selected === option.value && <Check className="w-4 h-4 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}