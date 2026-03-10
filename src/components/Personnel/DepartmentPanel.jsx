const DEPARTMENTS = [
  { key: 'vyyizd', label: 'Виїзд' },
  { key: 'tech', label: 'Технічний відділ' },
  { key: 'auto', label: 'Автослужба' },
  { key: 'vk', label: 'ВК' },
  { key: 'siar', label: 'СІАР' },
  { key: 'rss', label: 'РСС' },
  { key: 'buh', label: 'Бухгалтерія' },
  { key: 'hosp', label: 'Госп.роботи' },
  { key: 'sick', label: 'Хворі' },
  { key: 'nach_vid', label: 'Нач. Від.' },
  { key: 'chergova', label: 'Чергова а/м' },
  { key: 'kerivnytstvo', label: 'Керівництво' },
  { key: 'vidpustka', label: 'Відпустка' },
  { key: 'navchannya', label: 'Навчання' },
  { key: 'vyhidni', label: 'Вихідні' },
  { key: 'to', label: 'ТО' },
  { key: 'nachalnyk', label: 'Начальник' },
]

function DepartmentPanel({
  schedule,
  onUpdate,
  personnel,
  busyPersonnel,
  isAdmin,
}) {
  const statuses = schedule.statuses || {}

  const getPersonInDept = (key) => {
    return statuses[key] || []
  }

  const addPersonToDept = (key, person) => {
    const current = getPersonInDept(key)
    if (current.some((p) => p.id === person.id)) return
    onUpdate({
      ...schedule,
      statuses: {
        ...statuses,
        [key]: [...current, person],
      },
    })
  }

  const removePersonFromDept = (key, personId) => {
    onUpdate({
      ...schedule,
      statuses: {
        ...statuses,
        [key]: getPersonInDept(key).filter((p) => p.id !== personId),
      },
    })
  }

  const availablePersonnel = personnel.filter((p) => !busyPersonnel.has(p.id))

  return (
    <div className="flex flex-col gap-2">
      {DEPARTMENTS.map((dept) => {
        const people = getPersonInDept(dept.key)
        return (
          <div
            key={dept.key}
            className="bg-gray-800 rounded-lg border border-gray-700 p-2"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-400 uppercase">
                {dept.label}
              </span>
              {isAdmin && (
                <select
                  onChange={(e) => {
                    const person = personnel.find(
                      (p) => p.id === Number(e.target.value),
                    )
                    if (person) addPersonToDept(dept.key, person)
                    e.target.value = ''
                  }}
                  className="bg-gray-700 text-white px-1 py-0.5 rounded text-xs border border-gray-600"
                  defaultValue=""
                >
                  <option value="" disabled>
                    + додати
                  </option>
                  {availablePersonnel.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              {people.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between bg-gray-700 rounded px-2 py-0.5"
                >
                  <span className="text-xs text-gray-200">{person.name}</span>
                  {isAdmin && (
                    <button
                      onClick={() => removePersonFromDept(dept.key, person.id)}
                      className="text-gray-500 hover:text-red-400 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DepartmentPanel
