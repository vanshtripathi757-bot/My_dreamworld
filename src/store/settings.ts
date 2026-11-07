import { create } from 'zustand'

export type Settings = {
  quality: 'High' | 'Balanced' | 'Performance'
  sound: boolean
  cameraSensitivity: number
}

type SettingsState = Settings & { update: <K extends keyof Settings>(key: K, value: Settings[K]) => void }
const defaults: Settings = { quality: 'High', sound: true, cameraSensitivity: 0.7 }
function readSettings(): Settings {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem('sc-settings') || '{}') } }
  catch { return defaults }
}
export const useSettings = create<SettingsState>((set) => ({
  ...readSettings(),
  update: (key, value) => set((state) => {
    const next = { ...state, [key]: value }
    const { quality, sound, cameraSensitivity } = next
    localStorage.setItem('sc-settings', JSON.stringify({ quality, sound, cameraSensitivity }))
    return next
  }),
}))
