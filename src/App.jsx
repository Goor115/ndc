import { useState } from 'react'
import dayjs from 'dayjs'
import { useStore } from './store/useStore'
import MissionCard from './components/Cards/MissionCard'
import DepartmentPanel from './components/Personnel/DepartmentPanel'
import PersonnelManager from './components/Personnel/PersonnelManager'
import NaryadHeader from './components/Header/NaryadHeader'
import { useAuth } from './store/useAuth'
import LoginPage from './components/Auth/LoginPage'
import DayStats from './components/Stats/DayStats'

function App() {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))
  const { currentUser, login, logout, isAdmin, isViewer, isLoggedIn } =
    useAuth()
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={(l, p) => {
          const success = login(l, p)
          if (success) window.location.reload()
          return success
        }}
      />
    )
  }
  const {
    personnel,
    setPersonnel,
    getSchedule,
    addCard,
    removeCard,
    updateCard,
    getBusyPersonnel,
    saveSchedule,
  } = useStore()

  const schedule = getSchedule(selectedDate) || {
    cards: [],
    statuses: {},
    header: {},
  }
  const busyPersonnel = getBusyPersonnel(selectedDate)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Шапка сайту */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-blue-400">📋 Наряд робіт</h1>
          <DayStats schedule={schedule} personnel={personnel} />
        </div>
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
          <span className="text-gray-400 text-sm">👤 {currentUser.name}</span>
          <button
            onClick={() => {
              logout()
              window.location.reload()
            }}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded text-sm"
          >
            Вийти
          </button>
        </div>
      </header>

      {/* Шапка наряду */}
      <div className="px-4 pt-4">
        <NaryadHeader
          date={selectedDate}
          schedule={schedule}
          isAdmin={isAdmin}
          onUpdate={(updatedSchedule) =>
            saveSchedule(selectedDate, updatedSchedule)
          }
        />
      </div>

      {/* Основний контент */}
      <main className="flex gap-4 px-4 pb-4">
        {/* Ліва частина — картки виїздів */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-300">🚗 Виїзди</h2>
            {isAdmin && (
              <button
                onClick={() => addCard(selectedDate)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                + Додати виїзд
              </button>
            )}
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
                  isAdmin={isAdmin}
                  onUpdate={(updates) =>
                    updateCard(selectedDate, card.id, updates)
                  }
                  onRemove={() => removeCard(selectedDate, card.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Права частина — відділи */}
        <div className="w-72 overflow-y-auto max-h-screen pb-4">
          <h2 className="text-lg font-semibold text-gray-300 mb-3">
            👥 Особовий склад
          </h2>
          <PersonnelManager
            personnel={personnel}
            isAdmin={isAdmin}
            onAdd={(person) => setPersonnel((prev) => [...prev, person])}
            onRemove={(id) =>
              setPersonnel((prev) => prev.filter((p) => p.id !== id))
            }
            onUpdate={(updated) =>
              setPersonnel((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p)),
              )
            }
          />
          <DepartmentPanel
            schedule={schedule}
            personnel={personnel}
            busyPersonnel={busyPersonnel}
            isAdmin={isAdmin}
            onUpdate={(updatedSchedule) =>
              saveSchedule(selectedDate, updatedSchedule)
            }
          />
        </div>
      </main>
    </div>
  )
}

export default App
