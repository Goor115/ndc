import { useState } from 'react'
import dayjs from 'dayjs'
import { useStore } from './store/useStore'
import MissionCard from './components/Cards/MissionCard'

function App() {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))

  const {
    personnel,
    getSchedule,
    addCard,
    removeCard,
    updateCard,
    getBusyPersonnel,
  } = useStore()

  const schedule = getSchedule(selectedDate)
  const busyPersonnel = getBusyPersonnel(selectedDate)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Шапка */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-400">📋 Наряд робіт</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
          />
          <span className="text-gray-400 text-sm">
            {dayjs(selectedDate).format('DD.MM.YYYY')}
          </span>
        </div>
      </header>

      {/* Основний контент */}
      <main className="flex gap-4 p-4">
        {/* Ліва частина — картки виїздів */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-300">🚗 Виїзди</h2>
            <button
              onClick={() => addCard(selectedDate)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              + Додати виїзд
            </button>
          </div>

          {schedule.cards.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center text-gray-500">
              Немає виїздів на цей день.
              <br />
              Натисни "Додати виїзд" щоб створити картку.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {schedule.cards.map((card) => (
                <MissionCard
                  key={card.id}
                  card={card}
                  date={selectedDate}
                  personnel={personnel}
                  busyPersonnel={busyPersonnel}
                  onUpdate={(updates) =>
                    updateCard(selectedDate, card.id, updates)
                  }
                  onRemove={() => removeCard(selectedDate, card.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Права частина — особовий склад */}
        <div className="w-72">
          <h2 className="text-lg font-semibold text-gray-300 mb-3">
            👥 Особовий склад
          </h2>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
            {personnel.map((person) => {
              const isBusy = busyPersonnel.has(person.id)
              return (
                <div
                  key={person.id}
                  className={`flex items-center justify-between px-2 py-1 rounded mb-1 text-sm ${
                    isBusy
                      ? 'bg-green-900 text-green-300'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  <span>{person.name}</span>
                  <span className="text-xs">
                    {isBusy ? '🚗 виїзд' : '🏠 на місці'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
