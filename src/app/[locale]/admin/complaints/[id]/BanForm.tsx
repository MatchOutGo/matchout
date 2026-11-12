'use client'

import { useState } from 'react'
import { Ban, FileText } from 'lucide-react'
import { banUser } from './actions'

type Template = { 
  id: string, 
  title_pl: string, 
  content_pl: string,
  title_en: string,
  content_en: string
}

export default function BanForm({ 
  complaintId, 
  targetUserId, 
  templates 
}: { 
  complaintId: string, 
  targetUserId: string, 
  templates: Template[] 
}) {
  const [reason, setReason] = useState('Naruszenie regulaminu')
  const [days, setDays] = useState(7)

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    const template = templates.find(t => t.id === selectedId)
    if (template) {
      setReason(template.content_pl) 
    }
  }

  return (
    <form action={banUser} className="space-y-4">
      <input type="hidden" name="complaintId" value={complaintId} />
      <input type="hidden" name="targetUserId" value={targetUserId} />
      
      <div className="bg-red-50 p-4 rounded-xl border border-red-100">
        <label className="text-xs font-bold text-red-800 uppercase flex items-center gap-1 mb-2">
          <FileText className="w-4 h-4" /> Wybierz szablon wiadomości
        </label>
        <select 
          onChange={handleTemplateChange} 
          className="w-full bg-white border border-red-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer text-gray-700"
        >
          <option value="">-- Wybierz gotowy powód z listy --</option>
          {templates.map(t => (
            <option key={t.id} value={t.id}>{t.title_pl}</option>
          ))}
        </select>
        <p className="text-[11px] text-red-600 mt-2">Wybranie szablonu automatycznie wypełni pole poniżej.</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase">Czas bana (dni)</label>
        <input 
          type="number" 
          name="days" 
          value={days} 
          onChange={(e) => setDays(Number(e.target.value))} 
          min={1} 
          className="w-full bg-[#f5f5f7] border-none rounded-xl px-3 py-2 text-sm mt-1 outline-none focus:ring-2 focus:ring-red-500/50" 
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase">Treść wiadomości (widoczna dla użytkownika)</label>
        <textarea 
          name="reason" 
          required 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
          rows={4}
          className="w-full bg-[#f5f5f7] border-none rounded-xl px-3 py-2 text-sm mt-1 outline-none focus:ring-2 focus:ring-red-500/50 text-gray-800" 
        />
      </div>
      
      <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
        <Ban className="w-4 h-4" /> Zbanuj użytkownika
      </button>
    </form>
  )
}