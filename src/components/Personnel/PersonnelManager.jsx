import { useState } from 'react'

function PersonnelManager({ personnel, onAdd, onRemove, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('crew')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')

  const handleAdd = () => {
    if (!newName.trim()) return
    onAdd({
      id: Date.now(),
      name: newName.trim(),
      role: newRole,
    })
    setNewName('')
    setNewRole('crew')
  }

  const handleEdit = (person) => {
    setEditId(person.id)
    setEditName(person.name)
  }

  const handleSaveEdit = (person) => {
    if (!editName.trim()) return
    onUpdate({ ...person, name: editName.trim() })
    setEditId(null)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded text-sm mb-3"
      >
        👤 Управління персоналом
      </button>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600 p-3 mb-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300">👤 Персонал</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-300 text-sm"
        >
          ✕ Закрити
        </button>
      </div>

      {/* Додати нового */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Ім'я Прізвище..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="bg-gray-700 text-white px-2 py-1 rounded text-xs border border-gray-600 flex-1 outline-none focus:border-blue-500"
        />
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="bg-gray-700 text-white px-2 py-1 rounded text-xs border border-gray-600"
        >
          <option value="crew">Екіпаж</option>
          <option value="driver">Водій</option>
        </select>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          + Додати
        </button>
      </div>

      {/* Список людей */}
      <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
        {personnel.map((person) => (
          <div
            key={person.id}
            className="flex items-center gap-2 bg-gray-700 rounded px-2 py-1"
          >
            {editId === person.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(person)}
                  className="bg-gray-600 text-white px-2 py-0.5 rounded text-xs flex-1 outline-none"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(person)}
                  className="text-green-400 hover:text-green-300 text-xs"
                >
                  ✓
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="text-gray-400 hover:text-gray-300 text-xs"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <span className="text-xs text-gray-200 flex-1">
                  {person.name}
                </span>
                <span
                  className={`text-xs px-1 rounded ${
                    person.role === 'driver'
                      ? 'bg-blue-900 text-blue-300'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {person.role === 'driver' ? '🚗' : '👤'}
                </span>
                <button
                  onClick={() => handleEdit(person)}
                  className="text-gray-400 hover:text-yellow-400 text-xs"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onRemove(person.id)}
                  className="text-gray-400 hover:text-red-400 text-xs"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PersonnelManager
