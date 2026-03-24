# 🔧 Детальна документація хуків та утиліт

## `useAuth.js` — Детальний розбір

```javascript
import { useState } from 'react'

// База користувачів системи
const USERS = [
  {
    id: 1,
    login: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Адміністратор',
  },
  {
    id: 2,
    login: 'viewer',
    password: 'view123',
    role: 'viewer',
    name: 'Перегляд',
  },
]
```

### Допоміжна функція `load(key, fallback)`

```javascript
const load = (key, fallback) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}
```

**Що робить:**

- Завантажує дані з `localStorage`
- Парсить JSON
- Повертає fallback значення якщо помилка

---

### Hook `useAuth()`

#### Стан:

```javascript
const [currentUser, setCurrentUser] = useState(() => load('currentUser', null))
```

- Завантажує користувача при ініціалізації з localStorage

#### Метод: `login(loginInput, passwordInput)`

```javascript
const login = (loginInput, passwordInput) => {
  // 1. Знайти користувача в масиві USERS
  const user = USERS.find(
    (u) => u.login === loginInput && u.password === passwordInput,
  )

  // 2. Якщо знайдено:
  if (user) {
    // Створити об'єкт без пароля (безпека)
    const safeUser = {
      id: user.id,
      login: user.login,
      role: user.role,
      name: user.name,
    }
    // Зберегти в localStorage
    localStorage.setItem('currentUser', JSON.stringify(safeUser))
    // Оновити state
    setCurrentUser(safeUser)
    return true // Успішний вхід
  }
  return false // Невірні облікові дані
}
```

**Повертає:** `boolean` — успішність входу

#### Метод: `logout()`

```javascript
const logout = () => {
  localStorage.removeItem('currentUser')
  setCurrentUser(null)
}
```

**Що робить:** Очищає localStorage та state

#### Метод: `isLoggedIn()`

```javascript
const isLoggedIn = !!currentUser
```

**Повертає:** `boolean` — чи залогінений користувач

#### Метод: `isAdmin()`

```javascript
const isAdmin = currentUser?.role === 'admin'
```

**Повертає:** `boolean` — чи адміністратор

---

## `useStore.js` — Детальний розбір

### Початкові дані персоналу

```javascript
const initialPersonnel = [
  { id: 1, name: 'Іваненко Іван', role: 'crew_driver' },
  { id: 2, name: 'Петренко Петро', role: 'crew' },
  // ... ще 7 людей
]
```

### Допоміжні функції

#### `load(key, fallback)` та `save(key, data)`

```javascript
const load = (key, fallback) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

const save = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}
```

---

### Hook `useStore()`

#### Ініціалізація персоналу з міграцією:

```javascript
const [personnel, setPersonnel] = useState(() => {
  const loadedPersonnel = load('personnel', initialPersonnel)

  // Міграція: оновити старі ролі
  const migratedPersonnel = loadedPersonnel.map((person) => {
    let newRole = person.role
    if (person.role === 'driver') newRole = 'crew_driver' // Старе → нове
    if (person.role === 'local_crew') newRole = 'local' // Старе → нове
    return { ...person, role: newRole }
  })

  return migratedPersonnel
})
```

**Міграції:**

- `driver` → `crew_driver`
- `local_crew` → `local`

#### Ініціалізація графіків з міграцією:

```javascript
const [schedules, setSchedules] = useState(() => {
  const loadedSchedules = load('schedules', {})
  const migratedSchedules = {}

  // Замінити 'between' на 'night'
  for (const [date, schedule] of Object.entries(loadedSchedules)) {
    migratedSchedules[date] = {
      ...schedule,
      cards: schedule.cards.map((card) => ({
        ...card,
        shift: card.shift === 'between' ? 'night' : card.shift,
      })),
    }
  }

  return migratedSchedules
})
```

---

### Основні методи

#### `addPersonnel(person)`

```javascript
// person: { id?, name: string, role: string }
const addPersonnel = (person) => {
  const newPerson = {
    id: person.id || Date.now(), // Генерувати ID якщо немає
    ...person,
  }
  const updated = [...personnel, newPerson]
  setPersonnel(updated)
  save('personnel', updated)
}
```

#### `removePersonnel(id)`

```javascript
const removePersonnel = (id) => {
  const updated = personnel.filter((p) => p.id !== id)
  setPersonnel(updated)
  save('personnel', updated)

  // Також видалити з усіх графіків
  const updatedSchedules = Object.entries(schedules).reduce(...)
  setSchedules(updatedSchedules)
  save('schedules', updatedSchedules)
}
```

#### `updatePersonnel(person)`

```javascript
const updatePersonnel = (person) => {
  const updated = personnel.map((p) => (p.id === person.id ? person : p))
  setPersonnel(updated)
  save('personnel', updated)
}
```

---

#### `addCard(card)`

```javascript
// Додати завдання на поточну дату
const addCard = (card) => {
  const today = dayjs().format('YYYY-MM-DD')
  const schedule = schedules[today] || {
    cards: [],
    statuses: {},
    header: {},
  }

  const newCard = {
    id: Date.now(),
    driver: null,
    crew: [],
    ...card,
  }

  const updated = {
    ...schedules,
    [today]: {
      ...schedule,
      cards: [...schedule.cards, newCard],
    },
  }

  setSchedules(updated)
  save('schedules', updated)
}
```

#### `updateCard(cardId, updates)`

```javascript
const updateCard = (cardId, updates) => {
  const today = dayjs().format('YYYY-MM-DD')
  const schedule = schedules[today]

  const updated = {
    ...schedules,
    [today]: {
      ...schedule,
      cards: schedule.cards.map((card) =>
        card.id === cardId ? { ...card, ...updates } : card,
      ),
    },
  }

  setSchedules(updated)
  save('schedules', updated)
}
```

#### `removeCard(cardId)`

```javascript
const removeCard = (cardId) => {
  const today = dayjs().format('YYYY-MM-DD')
  const schedule = schedules[today]

  const updated = {
    ...schedules,
    [today]: {
      ...schedule,
      cards: schedule.cards.filter((c) => c.id !== cardId),
    },
  }

  setSchedules(updated)
  save('schedules', updated)
}
```

---

#### `getBusyPersonnel(date, schedule)`

```javascript
// Повернути всіх людей які де-небудь призначені
const getBusyPersonnel = (date, schedule) => {
  const busy = new Set()

  // Водії та екіпаж на карточках
  schedule.cards?.forEach((card) => {
    if (card.driver?.id) busy.add(card.driver.id)
    card.crew?.forEach((p) => busy.add(p.id))
  })

  // Люди в статусах (хворі, відпустка тощо)
  Object.values(schedule.statuses || {}).forEach((people) => {
    people.forEach((p) => busy.add(p.id))
  })

  return busy // Set<id>
}
```

**Використання:**

```javascript
const busyPersonnel = getBusyPersonnel(selectedDate, schedule)
// busyPersonnel.has(personId) // true якщо зайнята
```

#### `getBusyPersonnelForTime(date, timeFrom, timeTo)`

```javascript
// Люди які зайняті в конкретний час одного дня
const getBusyPersonnelForTime = (date, timeFrom, timeTo) => {
  const schedule = schedules[date]
  const busy = new Set()

  schedule.cards?.forEach((card) => {
    // Перевірити перетин часу
    const cardStart = card.timeFrom || '00:00'
    const cardEnd = card.timeTo || '23:59'

    if (timeOverlap(cardStart, cardEnd, timeFrom, timeTo)) {
      if (card.driver?.id) busy.add(card.driver.id)
      card.crew?.forEach((p) => busy.add(p.id))
    }
  })

  return busy
}
```

#### `saveSchedule()`

```javascript
const saveSchedule = () => {
  save('schedules', schedules)
}
```

#### `copyFromPreviousDay(date)`

```javascript
// Копіювати розклад з попереднього дня
const copyFromPreviousDay = (date) => {
  const prevDate = dayjs(date).subtract(1, 'day').format('YYYY-MM-DD')
  const prevSchedule = schedules[prevDate]

  if (!prevSchedule) return false

  const newSchedule = {
    ...prevSchedule,
    cards: prevSchedule.cards.map((card) => ({
      ...card,
      id: Date.now() + Math.random(), // Нові ID
    })),
    // Статуси не копіюються
    statuses: {},
    header: {}, // Заголовок не копіюється
  }

  setSchedules({
    ...schedules,
    [date]: newSchedule,
  })

  return true
}
```

---

## API компонентів

### Card структура

```javascript
interface Card {
  id: number | string
  shift: '1' | '2' | 'night' | 'full'
  driver: Personnel | null
  crew: Personnel[]
  timeFrom: string      // HH:MM
  timeTo: string        // HH:MM
  // Інші поля...
}
```

### Schedule структура

```javascript
interface Schedule {
  cards: Card[]
  statuses: {
    [deptKey: string]: Personnel[]
  }
  header: {
    chergovyi?: string
    pislya?: string
    nachalnik?: string
    nach_zminy?: string
    oderzhal?: string
  }
}
```

### Personnel структура

```javascript
interface Personnel {
  id: number
  name: string
  role: 'crew' | 'crew_driver' | 'local' | 'local_driver'
}
```

---

## 📝 Вхідні точки хуків

### useAuth

```javascript
import { useAuth } from './store/useAuth'

function MyComponent() {
  const { currentUser, login, logout, isLoggedIn, isAdmin } = useAuth()
  // ...
}
```

### useStore

```javascript
import { useStore } from './store/useStore'

function MyComponent() {
  const {
    personnel,
    schedules,
    addCard,
    removeCard,
    updateCard,
    getBusyPersonnel,
    // ... інші методи
  } = useStore()
  // ...
}
```

---

## 🔄 Потік даних

```
localStorage
    ↓
useAuth / useStore (завантаження при ініціалізації)
    ↓
State компонентів
    ↓
Зміни користувачем
    ↓
Callback функції (onUpdate, onRemove, onAdd)
    ↓
Оновлення state
    ↓
save() → localStorage
```

---

## 🛡️ Безпека і валідація

### Що робиться для безпеки:

1. **useAuth:**
   - Пароль НЕ зберігається в localStorage
   - Зберігається тільки safe об'єкт користувача
   - Try-catch для безпеки JSON.parse

2. **useStore:**
   - Автоматична валідація при завантаженні (міграція)
   - Перевірка наявності даних перед доступом
   - Видалення персонала з графіків при видаленні

3. **Компоненти:**
   - Чекбокси для isAdmin на всі редактуючі операції
   - Валідація входу на null перевірках

### Що НЕ забезпечує безпеку:

⚠️ **Це локальний додаток без backend'у, тому:**

- Пароль впроте видний в коді (тільки для demo)
- Нічого не захищено крім перевірження на клієнті
- localStorage доступний будь-якому скрипту на сторінці

---

## 🚀 Оптимізація та розширення

### Можливі інтеграції:

- Backend API для синхронізації
- Справжню аутентифікацію (JWT)
- Календар-виб для вибору дат
- Фільтри та пошук персоналу
- Експорт у PDF/Excel

### Можливі дефекти для фіксу:

- Немає валідації на неправильні часи
- Немає запобігання перекритням часу для одної людини
- Немає відновлення при помилці
- Немає логування дій користувача

---

**Версія:** 1.0  
**Для проекту:** NDC - Наряд робіт
