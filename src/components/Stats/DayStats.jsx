function DayStats({ schedule, personnel }) {
  const statuses = schedule.statuses || {}

  const crewAndDrivers = personnel.filter(
    (p) => p.role === 'driver' || p.role === 'crew',
  )

  const sickIds = new Set((statuses['sick'] || []).map((p) => p.id))
  const vacationIds = new Set((statuses['vidpustka'] || []).map((p) => p.id))
  const dayoffIds = new Set((statuses['vyhidni'] || []).map((p) => p.id))

  const onSick = crewAndDrivers.filter((p) => sickIds.has(p.id)).length
  const onVacation = crewAndDrivers.filter((p) => vacationIds.has(p.id)).length
  const onDayoff = crewAndDrivers.filter((p) => dayoffIds.has(p.id)).length

  const total = Math.max(
    0,
    crewAndDrivers.length - onSick - onVacation - onDayoff,
  )

  let inCrews = 0
  schedule.cards?.forEach((card) => {
    if (card.driver?.id) inCrews++
    inCrews += card.crew?.length || 0
  })

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
