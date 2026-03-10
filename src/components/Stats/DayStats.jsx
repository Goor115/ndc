function DayStats({ schedule, personnel }) {
  const statuses = schedule.statuses || {}

  // Кількість у відпустці
  const onVacation = (statuses['vidpustka'] || []).length

  // Кількість хворих
  const onSick = (statuses['sick'] || []).length

  // Задіяні в екіпажах
  const busyInCards = new Set()
  schedule.cards?.forEach((card) => {
    if (card.driver) busyInCards.add(card.driver.id)
    card.crew?.forEach((p) => busyInCards.add(p.id))
  })
  const inCrews = busyInCards.size
  const total = Math.max(0, personnel.length - onVacation - onSick)

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 bg-yellow-900 px-2 py-1 rounded text-xs">
        <span>🌴</span>
        <span className="text-yellow-300 font-semibold">{onVacation}</span>
        <span className="text-yellow-500">відпустка</span>
      </div>

      <div className="flex items-center gap-1 bg-red-900 px-2 py-1 rounded text-xs">
        <span>🏥</span>
        <span className="text-red-300 font-semibold">{onSick}</span>
        <span className="text-red-500">хворих</span>
      </div>

      <div className="flex items-center gap-1 bg-green-900 px-2 py-1 rounded text-xs">
        <span>🚗</span>
        <span className="text-green-300 font-semibold">{inCrews}</span>
        <span className="text-green-500">з</span>
        <span className="text-green-300 font-semibold">{total}</span>
        <span className="text-green-500">задіяно</span>
      </div>
    </div>
  )
}

export default DayStats
