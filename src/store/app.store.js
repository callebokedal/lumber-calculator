import { create } from 'zustand'
import { storageService } from '../services/storage.service'

const savedSettings = storageService.load(storageService.KEYS.settings, { language: 'sv' })

export const useAppStore = create((set) => ({
  /** @type {string|null} */
  activeProjectId: null,
  setActiveProjectId: (id) => set({ activeProjectId: id }),

  /** @type {'sv'|'en'} */
  language: savedSettings.language,
  setLanguage: (lang) => {
    storageService.save(storageService.KEYS.settings, { language: lang })
    set({ language: lang })
  },
}))
