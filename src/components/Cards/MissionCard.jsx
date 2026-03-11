function MissionCard({
  card,
  date,
  onUpdate,
  onRemove,
  busyPersonnel,
  personnel,
  isAdmin,
}) {
  const shifts = [
    { value: '1', label: '1-а зміна' },
    { value: '2', label: '2-а зміна' },
    { value: 'between', label: 'Між змінами' },
    { value: 'full', label: 'Цілий день' },
  ]

  const availablePersonnel = personnel.filter(
    (p) =>
      p.role !== 'local' &&
      (!busyPersonnel.has(p.id) ||
        card.driver?.id === p.id ||
        card.crew.some((c) => c.id === p.id)),
  )

  const addToCrew = (person) => {
    if (card.crew.some((c) => c.id === person.id)) return
    if (card.driver?.id === person.id) return
    onUpdate({ crew: [...card.crew, person] })
  }

  const removeFromCrew = (personId) => {
    onUpdate({ crew: card.crew.filter((c) => c.id !== personId) })
  }

  const setDriver = (person) => {
    onUpdate({ driver: person })
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600 p-3 flex flex-col gap-2">
      {/* Заголовок картки */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Назва роботи..."
          value={card.title}
          onChange={(e) => isAdmin && onUpdate({ title: e.target.value })}
          disabled={!isAdmin}
          className={`bg-gray-700 text-white px-2 py-1 rounded text-sm flex-1 mr-2 border border-gray-600 outline-none ${isAdmin ? 'focus:border-blue-500' : 'opacity-60 cursor-not-allowed'}`}
        />
        {isAdmin && (
          <button
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 text-lg leading-none"
          >
            ✕
          </button>
        )}
      </div>

      {/* Зміна і час */}
      <div className="flex gap-2">
        <select
          value={card.shift}
          onChange={(e) => isAdmin && onUpdate({ shift: e.target.value })}
          disabled={!isAdmin}
          className={`bg-gray-700 text-white px-2 py-1 rounded text-xs border border-gray-600 flex-1 ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {shifts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Час */}
      <div className="flex gap-2 items-center text-xs text-gray-400">
        <span>З</span>
        <input
          type="time"
          value={card.timeFrom}
          onChange={(e) => onUpdate({ timeFrom: e.target.value })}
          disabled={!isAdmin}
          className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 flex-1"
        />
        <span>до</span>
        <input
          type="time"
          value={card.timeTo}
          onChange={(e) => onUpdate({ timeTo: e.target.value })}
          disabled={!isAdmin}
          className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 flex-1"
        />
      </div>

      {/* Авто */}
      <input
        type="text"
        placeholder="Номер авто..."
        value={card.vehicle}
        onChange={(e) => onUpdate({ vehicle: e.target.value })}
        disabled={!isAdmin}
        className="bg-gray-700 text-white px-2 py-1 rounded text-sm border border-gray-600 focus:border-blue-500 outline-none"
      />

      {/* Водій */}
      <div>
        <p className="text-xs text-gray-400 mb-1">🚗 Водій:</p>
        {card.driver ? (
          <div className="flex items-center justify-between bg-blue-900 rounded px-2 py-1">
            <span className="text-sm text-blue-200">{card.driver.name}</span>
            {isAdmin && (
              <button
                onClick={() => onUpdate({ driver: null })}
                className="text-blue-400 hover:text-red-400 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <select
            disabled={!isAdmin}
            onChange={(e) => {
              if (!isAdmin) return
              const person = personnel.find(
                (p) => p.id === Number(e.target.value),
              )
              if (person) setDriver(person)
              e.target.value = ''
            }}
            className={`bg-gray-700 text-white px-2 py-1 rounded text-xs border border-gray-600 w-full ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
            defaultValue=""
          >
            <option value="" disabled>
              Обрати водія...
            </option>
            {availablePersonnel
              .filter((p) => p.role === 'driver')
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        )}
      </div>

      {/* Екіпаж */}
      <div>
        <p className="text-xs text-gray-400 mb-1">👥 Екіпаж:</p>
        <div className="flex flex-col gap-1 mb-1">
          {card.crew.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between bg-green-900 rounded px-2 py-1"
            >
              <span className="text-sm text-green-200">{person.name}</span>
              {isAdmin && (
                <button
                  onClick={() => removeFromCrew(person.id)}
                  className="text-green-400 hover:text-red-400 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <select
          disabled={!isAdmin}
          onChange={(e) => {
            if (!isAdmin) return
            const person = personnel.find(
              (p) => p.id === Number(e.target.value),
            )
            if (person) addToCrew(person)
            e.target.value = ''
          }}
          className={`bg-gray-700 text-white px-2 py-1 rounded text-xs border border-gray-600 w-full ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
          defaultValue=""
        >
          <option value="" disabled>
            Додати в екіпаж...
          </option>
          {availablePersonnel.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default MissionCard
