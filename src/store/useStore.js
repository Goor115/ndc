import { useState, useEffect } from 'react'

// Початкові дані — список людей
const initialPersonnel = [
  { id: 1, name: 'Іваненко Іван', role: 'driver' },
  { id: 2, name: 'Петренко Петро', role: 'crew' },
  { id: 3, name: 'Сидоренко Сидір', role: 'crew' },
  { id: 4, name: 'Коваленко Олег', role: 'crew' },
  { id: 5, name: 'Мельник Василь', role: 'driver' },
]

// Зчитати з localStorage
const load = (key, fallback) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

// Зберегти в localStorage
const save = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export function useStore() {
  const [personnel, setPersonnel] = useState(() =>
    load('personnel', initialPersonnel),
  )

  const [schedules, setSchedules] = useState(() => load('schedules', {}))

  // Автозбереження при змінах
  useEffect(() => {
    save('personnel', personnel)
  }, [personnel])
  useEffect(() => {
    save('schedules', schedules)
  }, [schedules])

  // Отримати наряд на конкретну дату
  const getSchedule = (date) => {
    return schedules[date] || { cards: [], statuses: {} }
  }

  // Зберегти наряд на дату
  const saveSchedule = (date, schedule) => {
    setSchedules((prev) => ({ ...prev, [date]: schedule }))
  }

  // Додати картку виїзду
  const addCard = (date) => {
    const schedule = getSchedule(date)
    const newCard = {
      id: Date.now(),
      title: '',
      driver: null,
      vehicle: '',
      crew: [],
      shift: '1',
      timeFrom: '08:00',
      timeTo: '17:00',
    }
    saveSchedule(date, {
      ...schedule,
      cards: [...schedule.cards, newCard],
    })
  }

  // Видалити картку виїзду
  const removeCard = (date, cardId) => {
    const schedule = getSchedule(date)
    saveSchedule(date, {
      ...schedule,
      cards: schedule.cards.filter((c) => c.id !== cardId),
    })
  }

  // Оновити картку виїзду
  const updateCard = (date, cardId, updates) => {
    const schedule = getSchedule(date)
    saveSchedule(date, {
      ...schedule,
      cards: schedule.cards.map((c) =>
        c.id === cardId ? { ...c, ...updates } : c,
      ),
    })
  }

  // Хто зайнятий в цей день
  const getBusyPersonnel = (date) => {
    const schedule = getSchedule(date)
    const busy = new Set()
    schedule.cards.forEach((card) => {
      if (card.driver) busy.add(card.driver.id)
      card.crew.forEach((p) => busy.add(p.id))
    })
    return busy
  }

  return {
    personnel,
    setPersonnel,
    getSchedule,
    saveSchedule,
    addCard,
    removeCard,
    updateCard,
    getBusyPersonnel,
  }
}
