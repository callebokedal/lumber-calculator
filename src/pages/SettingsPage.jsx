import { useAppStore } from '../store/app.store'
import { t } from '../utils/i18n'

export default function SettingsPage() {
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold text-stone-100 mb-6">{t('settings.title', language)}</h1>

      <div className="p-4 bg-stone-800 rounded-lg border border-stone-700">
        <label className="block text-sm font-medium text-stone-300 mb-3">
          {t('settings.language', language)}
        </label>
        <div className="flex gap-2">
          {(['sv', 'en']).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                language === lang
                  ? 'bg-green-700 text-white'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}
            >
              {t(`settings.language.${lang}`, language)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
