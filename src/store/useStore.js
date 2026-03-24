import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

// Початкові дані — список людей
const initialPersonnel = [
  { id: 1, name: 'Іваненко Іван', role: 'crew_driver' },
  { id: 2, name: 'Петренко Петро', role: 'crew' },
  { id: 3, name: 'Сидоренко Сидір', role: 'crew' },
  { id: 4, name: 'Коваленко Олег', role: 'crew' },
  { id: 5, name: 'Мельник Василь', role: 'crew_driver' },
  { id: 6, name: 'Локальний Водій 1', role: 'local_driver' },
  { id: 7, name: 'Локальний Водій 2', role: 'local_driver' },
  { id: 8, name: 'Локальний Екіпаж 1', role: 'local' },
  { id: 9, name: 'Локальний Екіпаж 2', role: 'local' },
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
  const [personnel, setPersonnel] = useState(() => {
    const loadedPersonnel = load('personnel', initialPersonnel)
    // Міграція: оновити ролі персоналу
    const migratedPersonnel = loadedPersonnel.map((person) => {
      let newRole = person.role
      if (person.role === 'driver') newRole = 'crew_driver'
      if (person.role === 'local_crew') newRole = 'local'
      // 'local' і 'local_driver' залишаються без змін
      return { ...person, role: newRole }
    })
    return migratedPersonnel
  })

  const [schedules, setSchedules] = useState(() => {
    const loadedSchedules = load('schedules', {})
    // Міграція: замінити 'between' на 'night'
    const migratedSchedules = {}
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
      timeFrom: '07:00',
      timeTo: '14:00',
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
  const getBusyPersonnel = (date, currentSchedule) => {
    const schedule = currentSchedule || getSchedule(date)
    const busy = new Set()

    // Задіяні у виїздах
    schedule.cards.forEach((card) => {
      if (card.driver) busy.add(card.driver.id)
      card.crew.forEach((p) => busy.add(p.id))
    })

    // Хворі, відпустка, вихідні — не можуть їхати
    const statuses = schedule.statuses || {}
    ;(statuses['sick'] || []).forEach((p) => busy.add(p.id))
    ;(statuses['vidpustka'] || []).forEach((p) => busy.add(p.id))
    ;(statuses['vyhidni'] || []).forEach((p) => busy.add(p.id))

    return busy
  }

  const parseMinutes = (time) => {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  const timeRangesOverlap = (fromA, toA, fromB, toB) => {
    let startA = parseMinutes(fromA)
    let endA = parseMinutes(toA)
    let startB = parseMinutes(fromB)
    let endB = parseMinutes(toB)

    if (endA <= startA) endA += 24 * 60
    if (endB <= startB) endB += 24 * 60

    return startA < endB && startB < endA
  }

  const getBusyPersonnelForTime = (date, cardId, timeFrom, timeTo) => {
    const schedule = getSchedule(date)
    const busy = new Set()

    schedule.cards.forEach((card) => {
      if (card.id === cardId) return
      if (timeRangesOverlap(card.timeFrom, card.timeTo, timeFrom, timeTo)) {
        if (card.driver) busy.add(card.driver.id)
        card.crew.forEach((p) => busy.add(p.id))
      }
    })

    // Хворі, відпустка, вихідні — не можуть їхати
    const statuses = schedule.statuses || {}
    ;(statuses['sick'] || []).forEach((p) => busy.add(p.id))
    ;(statuses['vidpustka'] || []).forEach((p) => busy.add(p.id))
    ;(statuses['vyhidni'] || []).forEach((p) => busy.add(p.id))

    return busy
  }

  const copyFromPreviousDay = (date, type) => {
    const prevDate = dayjs(date).subtract(1, 'day').format('YYYY-MM-DD')
    const prevSchedule = getSchedule(prevDate)
    const currentSchedule = getSchedule(date)

    if (type === 'departments') {
      saveSchedule(date, {
        ...currentSchedule,
        statuses: { ...prevSchedule.statuses },
      })
    }

    if (type === 'cards') {
      const newCards = prevSchedule.cards.map((card) => ({
        ...card,
        id: Date.now() + Math.random(),
      }))
      saveSchedule(date, {
        ...currentSchedule,
        cards: newCards,
      })
    }
  }

  return {
    schedules,
    personnel,
    setPersonnel,
    getSchedule,
    saveSchedule,
    addCard,
    removeCard,
    updateCard,
    getBusyPersonnel,
    getBusyPersonnelForTime,
    copyFromPreviousDay,
  }
}
