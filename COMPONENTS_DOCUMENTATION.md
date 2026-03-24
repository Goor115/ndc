# 🎨 Документація компонентів з прикладами

## Навігація по файлах
- [LoginPage](#logginpage---страница-входа)
- [NaryadHeader](#naryadheader---заголовок-розпорядження)
- [MissionCard](#missioncard---карточка-завдання)
- [DepartmentPanel](#departmentpanel---панель-відділів)
- [PersonnelManager](#personnelmanager---управління-персоналом)
- [DayStats](#daystats---статистика-дня)

---

## LoginPage — Сторінка входу

**Файл:** `src/components/Auth/LoginPage.jsx`

### Структура компонента

```jsx
function LoginPage({ onLogin }) {
  // State для форми
  const [login, setLogin] = useState('')          // Введений логін
  const [password, setPassword] = useState('')    // Введений пароль
  const [error, setError] = useState('')          // Повідомлення про помилку
}
```

### Props

| Проп | Тип | Обов'язковий | Опис |
|------|-----|-------------|------|
| `onLogin` | `(login: string, password: string) => boolean` | ✅ | Функція входу з `useAuth` хуку |

### Внутрішні методи

#### `handleSubmit()`
```javascript
const handleSubmit = () => {
  // 1. Перевірити що дані введені
  if (!login || !password) {
    setError('Введіть логін та пароль')
    return
  }
  
  // 2. Викликати функцію входу
  const success = onLogin(login, password)
  
  // 3. Якщо успішно - перезагрузити
  if (success) {
    window.location.reload()
  } else {
    // Якщо нет - показати помилку и очистити пароль
    setError('Невірний логін або пароль')
    setPassword('')
  }
}
```

### Приклад використання в App.jsx

```jsx
function App() {
  const { isLoggedIn, login } = useAuth()
  
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
  
  return <div>/* Головний контент */</div>
}
```

### Мережева отримання

Вхідні дані:
- **Логін:** admin | **Пароль:** admin123 → Адміністратор
- **Логін:** viewer | **Пароль:** view123 → Тільки перегляд

### Зовнішній вид

- Темне вікно (bg-gray-800) з синім акцентом
- Центровано на екрані (flexbox)
- Ширина 384px (мобільна-оптимальна)
- Синя кнопка для входу

---

## NaryadHeader — Заголовок розпорядження

**Файл:** `src/components/Header/NaryadHeader.jsx`

### Структура компонента

```jsx
function NaryadHeader({ date, schedule, onUpdate, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false)  // Розгорнутий/згорнутий
  const header = schedule.header || {}         // Дані заголовку
  
  const update = (field, value) => {
    onUpdate({
      ...schedule,
      header: { ...header, [field]: value },
    })
  }
}
```

### Props

| Проп | Тип | Обов'язковий | Опис |
|------|-----|-------------|------|
| `date` | `string` | ✅ | Дата у форматі YYYY-MM-DD |
| `schedule` | `object` | ✅ | Об'єкт графіку з `header` |
| `onUpdate` | `function` | ✅ | Callback для оновлення всього schedule |
| `isAdmin` | `boolean` | ✅ | Дозвіл на редагування |

### Поля в заголовку

```javascript
header = {
  chergovyi: string       // Черговий (дежурний)
  pislya: string          // Після чергування
  nachalnik: string       // Начальник ч/ч
  nach_zminy: string      // Начальник зміни
  oderzhal: string        // Одержав наказ
}
```

### Приклад використання

```jsx
// В App.jsx
function App() {
  const { schedules } = useStore()
  const [selectedDate, setSelectedDate] = useState('2024-03-15')
  
  const rawSchedule = schedules[selectedDate]
  
  const handleHeaderUpdate = (updatedSchedule) => {
    // Оновити всій графік
    setSchedules({
      ...schedules,
      [selectedDate]: updatedSchedule,
    })
  }
  
  return (
    <NaryadHeader
      date={selectedDate}
      schedule={rawSchedule}
      onUpdate={handleHeaderUpdate}
      isAdmin={isAdmin}
    />
  )
}
```

### Функціональність

1. **Виведення дати** — DD.MM.YYYY формат
2. **Кнопка розгортання** — Видима тільки для адміна
3. **Поля редагування** — Вводяться ПІБ основних осіб
4. **Реальне-часове оновлення** — При зміні полів

### Структура полів (grid)

```
┌─────────────────────────────────┐
│ Дата              │ [▼/▲ Шапка] │
├─────────────────┬───────────────┤
│ Черговий        │ Дежурний      │
├─────────────────┼───────────────┤
│ Після чергування│ ПІБ           │
├─────────────────┼───────────────┤
│ Начальник ч/ч   │ ПІБ           │
├─────────────────┼───────────────┤
│ Нач. зміни      │ ПІБ           │
├─────────────────┼───────────────┤
│ Одержав         │ ПІБ           │
└─────────────────┴───────────────┘
```

---

## MissionCard — Карточка завдання

**Файл:** `src/components/Cards/MissionCard.jsx`

### Структура компонента

```jsx
function MissionCard({
  card,                // Об'єкт карточки { id, shift, driver, crew, ... }
  onUpdate,           // Callback для оновлення
  onRemove,           // Callback для видалення
  busyPersonnel,      // Set<id> зайнятих людей
  personnel,          // Массив всіх людей
  isAdmin,            // Дозвіл редагувати
}) {
  const shifts = [
    { value: '1', label: '1-а зміна' },
    { value: '2', label: '2-а зміна' },
    { value: 'night', label: 'Нічна зміна' },
    { value: 'full', label: 'Цілий день' },
  ]
}
```

### Props

| Проп | Тип | Обов'язковий | Опис |
|------|-----|-------------|------|
| `card` | `object` | ✅ | Об'єкт завдання |
| `onUpdate` | `function` | ✅ | Оновлення карточки |
| `onRemove` | `function` | ✅ | Видалення карточки |
| `busyPersonnel` | `Set<number>` | ✅ | ID зайнятих людей |
| `personnel` | `array` | ✅ | Всі люди в системі |
| `isAdmin` | `boolean` | ✅ | Редагування |

### Часи змін

```javascript
'1'    → 07:00 - 14:00 (1-а зміна)
'2'    → 14:00 - 21:00 (2-а зміна)
'full' → 09:00 - 18:00 (Цілий день)
'night'→ 21:00 - 07:00 (Нічна зміна)
```

### Методи

#### `getShiftTimes(shift)`
```javascript
const getShiftTimes = (shift) => {
  switch (shift) {
    case '1': return { timeFrom: '07:00', timeTo: '14:00' }
    case '2': return { timeFrom: '14:00', timeTo: '21:00' }
    case 'full': return { timeFrom: '09:00', timeTo: '18:00' }
    case 'night': return { timeFrom: '21:00', timeTo: '07:00' }
    default: return { timeFrom: '08:00', timeTo: '17:00' }
  }
}
```

#### `handleShiftChange(newShift)`
```javascript
const handleShiftChange = (newShift) => {
  if (!isAdmin) return
  const times = getShiftTimes(newShift)
  onUpdate({ shift: newShift, ...times })
}
```

#### `addToCrew(person)`
```javascript
const addToCrew = (person) => {
  // НЕ додавати якщо вже в екіпажі
  if (card.crew.some((c) => c.id === person.id)) return
  // НЕ додавати якщо водій
  if (card.driver?.id === person.id) return
  
  onUpdate({ crew: [...card.crew, person] })
}
```

#### `setDriver(person)`
```javascript
const setDriver = (person) => {
  onUpdate({ driver: person })
}
```

#### `removeFromCrew(personId)`
```javascript
const removeFromCrew = (personId) => {
  onUpdate({ crew: card.crew.filter((c) => c.id !== personId) })
}
```

### Приклад використання

```jsx
// В App.jsx
const {
  schedules,
  addCard,
  removeCard,
  updateCard,
  getBusyPersonnel,
  personnel,
} = useStore()

const schedule = schedules[selectedDate]
const busyPersonnel = getBusyPersonnel(selectedDate, schedule)

return (
  <div>
    {schedule.cards.map((card) => (
      <MissionCard
        key={card.id}
        card={card}
        onUpdate={(updates) => updateCard(card.id, updates)}
        onRemove={() => removeCard(card.id)}
        busyPersonnel={busyPersonnel}
        personnel={personnel}
        isAdmin={isAdmin}
      />
    ))}
  </div>
)
```

### Фільтрація персоналу

```javascript
const availablePersonnel = personnel.filter((p) =>
  // Доступні якщо:
  !busyPersonnel.has(p.id) || // - НЕ зайняті
  card.driver?.id === p.id || // - АБО це водій карточки
  card.crew.some((c) => c.id === p.id) // - АБО вже в екіпажі цієї карточки
)
```

---

## DepartmentPanel — Панель відділів

**Файл:** `src/components/Personnel/DepartmentPanel.jsx`

### Структура компонента

```jsx
function DepartmentPanel({
  schedule,        // Об'єкт графіку зі statuses
  onUpdate,       // Callback для оновлення
  personnel,      // Всі люди
  busyPersonnel,  // Set<id> зайнятих
  isAdmin,        // Редагування
}) {
  const statuses = schedule.statuses || {}
  
  // Для кожного відділу отримати людей
  const getPersonInDept = (key) => statuses[key] || []
}
```

### Props

| Проп | Тип | Обов'язковий | Опис |
|------|-----|-------------|------|
| `schedule` | `object` | ✅ | Об'єкт графіку |
| `onUpdate` | `function` | ✅ | Оновлення |
| `personnel` | `array` | ✅ | Всі люди |
| `busyPersonnel` | `Set<number>` | ✅ | Зайняті ID |
| `isAdmin` | `boolean` | ✅ | Редагування |

### Список відділів

```javascript
const DEPARTMENTS = [
  { key: 'ou', label: 'ОУ' },
  { key: 'vyyizd', label: 'Виїзд' },
  { key: 'tech', label: 'Технічний відділ' },
  { key: 'auto', label: 'Автослужба' },
  { key: 'vk', label: 'ВК' },
  { key: 'siar', label: 'СІАР' },
  { key: 'rss', label: 'РСС' },
  { key: 'buh', label: 'Бухгалтерія' },
  { key: 'hosp', label: 'Госп.роботи' },
  { key: 'sick', label: 'Хворі' },           // ← Статус здоров'я
  { key: 'nach_vid', label: 'Нач. Від.' },
  { key: 'chergova', label: 'Чергова а/м' },
  { key: 'kerivnytstvo', label: 'Керівництво' },
  { key: 'vidpustka', label: 'Відпустка' },  // ← Статус відпустки
  { key: 'navchannya', label: 'Навчання' },
  { key: 'vyhidni', label: 'Вихідні' },      // ← Вихідні días
  { key: 'to', label: 'ТО' },
  { key: 'nachalnyk', label: 'Начальник' },
]
```

### Методи

#### `getPersonInDept(key)`
```javascript
const getPersonInDept = (key) => {
  return statuses[key] || []  // Масив personas в отділі
}
```

#### `addPersonToDept(key, person)`
```javascript
const addPersonToDept = (key, person) => {
  const current = getPersonInDept(key)
  
  // НЕ додавати якщо вже розподілений в цьому відділі
  if (current.some((p) => p.id === person.id)) return
  
  // Оновити весь график
  onUpdate({
    ...schedule,
    statuses: {
      ...statuses,
      [key]: [...current, person],
    },
  })
}
```

#### `removePersonFromDept(key, personId)`
```javascript
const removePersonFromDept = (key, personId) => {
  onUpdate({
    ...schedule,
    statuses: {
      ...statuses,
      [key]: getPersonInDept(key).filter((p) => p.id !== personId),
    },
  })
}
```

### Фільтрація доступних людей

```javascript
// Всі люди що вже мають статус в якому-небудь відділі
const assignedPersonnel = new Set()
Object.values(statuses).forEach((people) => {
  people.forEach((p) => assignedPersonnel.add(p.id))
})

// Доступні = НЕ зайняті AND НЕ мають статусу в інших відділах
const availablePersonnel = personnel.filter(
  (p) => !busyPersonnel.has(p.id) && !assignedPersonnel.has(p.id),
)
```

### Приклад використання

```jsx
const handleDeptUpdate = (updatedSchedule) => {
  setSchedules({
    ...schedules,
    [selectedDate]: updatedSchedule,
  })
}

return (
  <DepartmentPanel
    schedule={schedule}
    onUpdate={handleDeptUpdate}
    personnel={personnel}
    busyPersonnel={busyPersonnel}
    isAdmin={isAdmin}
  />
)
```

---

## PersonnelManager — Управління персоналом

**Файл:** `src/components/Personnel/PersonnelManager.jsx`

### Структура компонента

```jsx
function PersonnelManager({ personnel, onAdd, onRemove, onUpdate, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false)        // Розгорнутий
  const [newName, setNewName] = useState('')         // Нове ім'я для добавления
  const [newRole, setNewRole] = useState('crew')     // Роль для добавления
  const [editId, setEditId] = useState(null)         // ID редагуємої персоны
  const [editName, setEditName] = useState('')       // Редагуєме ім'я
  const [editRole, setEditRole] = useState('crew')   // Редагуєма роль
  
  // Видима тільки для адміна
  if (!isAdmin) return null
}
```

### Props

| Проп | Тип | Обов'язковий | Опис |
|------|-----|-------------|------|
| `personnel` | `array` | ✅ | Список всіх людей |
| `onAdd` | `function` | ✅ | `(person) => void` |
| `onRemove` | `function` | ✅ | `(id) => void` |
| `onUpdate` | `function` | ✅ | `(person) => void` |
| `isAdmin` | `boolean` | ✅ | Видимість |

### Ролі персоналу

```javascript
getRoleIcon(role) {
  switch (role) {
    case 'crew': return '👥'        // Екіпаж
    case 'crew_driver': return '🚗' // Водій екіпажу
    case 'local': return ''          // Місцевий
    case 'local_driver': return '🚌' // Місцевий водій
  }
}
```

### Методи

#### `handleAdd()`
```javascript
const handleAdd = () => {
  // Перевірити ім'я
  if (!newName.trim()) return
  
  // Додати нову персону
  onAdd({
    id: Date.now(),           // Генерувати ID
    name: newName.trim(),
    role: newRole,
  })
  
  // Очистити поля
  setNewName('')
  setNewRole('crew')
}
```

#### `handleEdit(person)` та `handleSaveEdit(person)`
```javascript
const handleEdit = (person) => {
  setEditId(person.id)
  setEditName(person.name)
  setEditRole(person.role)
}

const handleSaveEdit = (person) => {
  if (!editName.trim()) return
  
  onUpdate({
    ...person,
    name: editName.trim(),
    role: editRole,
  })
  
  setEditId(null)
}
```

#### `handleRemove(personId)`
```javascript
// Прямо у JSX
onClick={() => onRemove(person.id)}
```

### Приклад використання

```jsx
const { personnel, addPersonnel, removePersonnel, updatePersonnel } = useStore()
const { isAdmin } = useAuth()

return (
  <PersonnelManager
    personnel={personnel}
    onAdd={addPersonnel}
    onRemove={removePersonnel}
    onUpdate={updatePersonnel}
    isAdmin={isAdmin}
  />
)
```

### Макет

```
┌─────────────────────────────────┐
│ 👤 Управління персоналом  | ✕ |
├─────────────────────────────────┤
│ Додати нового:                  │
│                                 │
│ [Ім'я Прізвище...]              │
│ [Роль        ] [+ Додати]       │
├─────────────────────────────────┤
│ Список персоналу:               │
│                                 │
│ 👥 Іваненко Іван (crew_driver)  │
│    [✏️ Edit] [❌ Видалити]      │
│ 👥 Петренко Петро (crew)        │
│    [✏️ Edit] [❌ Видалити]      │
│ ...                             │
└─────────────────────────────────┘
```

---

## DayStats — Статистика дня

**Файл:** `src/components/Stats/DayStats.jsx`

### Структура компонента

```jsx
function DayStats({ schedule, personnel }) {
  const statuses = schedule.statuses || {}
  
  // Pessoas с ролями crew або crew_driver
  const crewAndDrivers = personnel.filter(
    (p) => p.role === 'driver' || 
           p.role === 'crew' || 
           p.role === 'crew_driver'
  )
  
  // Набір ID людей в кожному статусі
  const sickIds = new Set((statuses['sick'] || []).map((p) => p.id))
  const vacationIds = new Set((statuses['vidpustka'] || []).map((p) => p.id))
  const dayoffIds = new Set((statuses['vyhidni'] || []).map((p) => p.id))
}
```

### Props

| Проп | Тип | Обов'язковий | Опис |
|------|-----|-------------|------|
| `schedule` | `object` | ✅ | Об'єкт графіку |
| `personnel` | `array` | ✅ | Всі люди |

### Розраховані значення

```javascript
// Всього людей на операціях (зі статусом)
const onSick = (statuses['sick'] || []).length
const onVacation = (statuses['vidpustka'] || []).length
const onDayoff = crewAndDrivers.filter((p) => dayoffIds.has(p.id)).length

// Crew/driver людей зі статусом
const sickCrewCount = crewAndDrivers.filter((p) => sickIds.has(p.id)).length
const vacationCrewCount = crewAndDrivers.filter((p) => vacationIds.has(p.id)).length

// Всього доступних екіпажу
const total = Math.max(
  0,
  crewAndDrivers.length - sickCrewCount - vacationCrewCount - onDayoff
)

// Люди призначені на карточки
const engagedIds = new Set()
schedule.cards?.forEach((card) => {
  if (card.driver?.role === 'crew' || card.driver?.role === 'crew_driver') {
    engagedIds.add(card.driver.id)
  }
  card.crew?.forEach((p) => {
    if (p.role === 'crew' || p.role === 'crew_driver') {
      engagedIds.add(p.id)
    }
  })
})
const inCrews = engagedIds.size
```

### Виведена інформація

```
┌──────────────────────────────────────────────────┐
│ 🌴 2 відпустка  │  🏥 1 хворих  │  🚗 3 з 7 задіяно│
└──────────────────────────────────────────────────┘
```

| Показник | Значення | Колір | Де з'являється |
|----------|----------|-------|-----------------|
| Відпустка | onVacation | Жовтий (yellow-900) | Header |
| Хворі | onSick | Червоний (red-900) | Header |
| Задіяні | inCrews з total | Зелений (green-900) | Header |

### Приклад використання

```jsx
import DayStats from './components/Stats/DayStats'

function App() {
  const { schedules, personnel } = useStore()
  const schedule = schedules[selectedDate]
  
  return (
    <header>
      <DayStats schedule={schedule} personnel={personnel} />
    </header>
  )
}
```

### Логіка розрахунків

```
Всього crew/driver = 5
- Хворих (crew) = 1
- На відпустці (crew) = 1
- На вихідних = 0
───────────────────
Доступних = 3

Задіяних на карточках = 2
Статистика: 2 з 3 задіяно
```

---

## 📊 Взаємодія компонентів

```
App.jsx
├─ LoginPage (якщо !isLoggedIn)
│
└─ Головна сторінка
   ├─ [Вибір дати] [◀ ▶ Дні]
   │
   ├─ NaryadHeader
   │  └─ Заголовок розпорядження (адмін)
   │
   ├─ DayStats
   │  └─ Статистика персоналу
   │
   ├─ PersonnelManager (адмін)
   │  └─ Управління людьми
   │
   ├─ MissionCard[]
   │  ├─ Вибір зміни (адмін)
   │  ├─ Вибір водія
   │  └─ Додання екіпажу
   │
   └─ DepartmentPanel
      └─ Розподіл по відділам
```

---

**Версія:** 1.0  
**Для проекту:** NDC - Наряд робіт
