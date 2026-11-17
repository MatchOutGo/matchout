'use client'

import { useRouter, usePathname } from '@/i18n/routing'
import { ArrowUpDown } from 'lucide-react'

export default function SortSelect({ currentSort }: { currentSort?: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(window.location.search)
    if (e.target.value) {
      newParams.set('sort', e.target.value)
    } else {
      newParams.delete('sort')
    }
    router.push(`${pathname}?${newParams.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-500" />
      <select
        value={currentSort || ''}
        onChange={handleSortChange}
        className="bg-transparent border-none text-sm font-medium text-gray-700 outline-none cursor-pointer focus:ring-0"
      >
        <option value="">Domyślne</option>
        <option value="date_asc">Data wyjazdu</option>
        <option value="price_asc">Cena (od najniższej)</option>
        <option value="price_desc">Cena (od najwyższej)</option>
      </select>
    </div>
  )
}