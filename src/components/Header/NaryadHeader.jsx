import { useState } from 'react'
import dayjs from 'dayjs'

function NaryadHeader({ date, schedule, onUpdate, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false)
  const header = schedule.header || {}

  const update = (field, value) => {
    onUpdate({
      ...schedule,
      header: { ...header, [field]: value },
    })
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-blue-400 font-bold text-lg">
            {dayjs(date).format('DD.MM.YYYY')}
          </span>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-gray-200 text-sm"
          >
            {isOpen ? '▲ Згорнути' : '▼ Шапка наряду'}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <label className="text-xs text-gray-400">Черговий</label>
            <input
              type="text"
              value={header.chergovyi || ''}
              onChange={(e) => update('chergovyi', e.target.value)}
              disabled={!isAdmin}
              placeholder="ПІБ чергового..."
              className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm border border-gray-600 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Після чергування</label>
            <input
              type="text"
              value={header.pislya || ''}
              onChange={(e) => update('pislya', e.target.value)}
              disabled={!isAdmin}
              placeholder="ПІБ..."
              className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm border border-gray-600 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Начальник ч/ч</label>
            <input
              type="text"
              value={header.nachalnyk || ''}
              onChange={(e) => update('nachalnyk', e.target.value)}
              disabled={!isAdmin}
              placeholder="ПІБ начальника..."
              className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm border border-gray-600 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Відповідальний</label>
            <input
              type="text"
              value={header.vidpovidalnyi || ''}
              onChange={(e) => update('vidpovidalnyi', e.target.value)}
              disabled={!isAdmin}
              placeholder="ПІБ відповідального..."
              className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm border border-gray-600 outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default NaryadHeader
