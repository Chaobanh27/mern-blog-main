import { useEffect, useState } from 'react'

const useBattery = () => {
  const [battery, setBattery] = useState({
    level: null,
    charging: null
  })

  useEffect(() => {
    let batteryManager

    const initBattery = async () => {
      if (!navigator.getBattery) return

      batteryManager = await navigator.getBattery()

      const updateBattery = () => {
        setBattery({
          level: Math.round(batteryManager.level * 100),
          charging: batteryManager.charging
        })
      }

      updateBattery()

      batteryManager.addEventListener('levelchange', updateBattery)
      batteryManager.addEventListener('chargingchange', updateBattery)
    }

    initBattery()

    return () => {
      if (!batteryManager) return
      batteryManager.removeEventListener('levelchange', () => {})
      batteryManager.removeEventListener('chargingchange', () => {})
    }
  }, [])

  return battery
}

export default useBattery
