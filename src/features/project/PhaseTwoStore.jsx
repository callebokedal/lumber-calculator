import { useState } from 'react'
import { projectService } from '../../services/project.service'
import { t } from '../../utils/i18n'

/** Standard lumber lengths available at most Swedish hardware stores, in mm */
const PRESET_LENGTHS_MM = [2400, 3000, 3600, 4200, 4800, 5400, 6000]

/** @param {number} mm @returns {string} */
function fmtLength(mm) {
  const m = mm / 1000
  return m.toLocaleString('sv-SE', { minimumFractionDigits: 1, maximumFractionDigits: 3 }) + ' m'
}

/** @param {import('../../types/index').LumberItem[]} items @returns {string[]} */
function uniqueDimensionKeys(items) {
  const seen = new Set()
  for (const item of items) seen.add(`${item.width}x${item.height}`)
  return [...seen]
}

/**
 * Phase 2: Store – specify which lengths are available per dimension.
 * @param {{ project: import('../../types/index').Project, language: 'sv'|'en', onProjectChange: () => void }} props
 */
export function PhaseTwoStore({ project, language, onProjectChange }) {
  const dimensions = uniqueDimensionKeys(project.items ?? [])

  if (dimensions.length === 0) {
    return <p className="text-stone-500 text-sm">{t('phase2.noItems', language)}</p>
  }

  return (
    <div className="flex flex-col gap-6">
      {dimensions.map((dimKey) => (
        <DimensionStock
          key={dimKey}
          dimKey={dimKey}
          project={project}
          language={language}
          onProjectChange={onProjectChange}
        />
      ))}
    </div>
  )
}

/**
 * Stock editor for one dimension (e.g. "45x145").
 * @param {{ dimKey: string, project: import('../../types/index').Project, language: 'sv'|'en', onProjectChange: () => void }} props
 */
function DimensionStock({ dimKey, project, language, onProjectChange }) {
  const [customInput, setCustomInput] = useState('')

  const stock = project.storeStock ?? {}
  const selected = new Set(stock[dimKey] ?? [])

  function save(newSelected) {
    projectService.updateStoreStock(project.id, dimKey, [...newSelected].sort((a, b) => a - b))
    onProjectChange()
  }

  function toggle(lengthMm) {
    const next = new Set(selected)
    next.has(lengthMm) ? next.delete(lengthMm) : next.add(lengthMm)
    save(next)
  }

  function addCustom(e) {
    e.preventDefault()
    const mm = Math.round(parseFloat(customInput.replace(',', '.')) * 1000)
    if (!mm || isNaN(mm) || mm <= 0) return
    const next = new Set(selected)
    next.add(mm)
    save(next)
    setCustomInput('')
  }

  const [w, h] = dimKey.split('x')
  const extraLengths = [...selected].filter((l) => !PRESET_LENGTHS_MM.includes(l)).sort((a, b) => a - b)

  return (
    <div className="p-4 bg-stone-800 border border-stone-700 rounded-lg">
      <h3 className="font-mono font-medium text-stone-100 mb-4">
        {w}×{h} mm
      </h3>

      {/* Preset checkboxes */}
      <p className="text-xs text-stone-400 mb-2">{t('phase2.presets', language)}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESET_LENGTHS_MM.map((mm) => {
          const checked = selected.has(mm)
          return (
            <button
              key={mm}
              onClick={() => toggle(mm)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                checked
                  ? 'bg-green-700 border-green-600 text-white'
                  : 'bg-stone-900 border-stone-600 text-stone-400 hover:border-stone-400 hover:text-stone-200'
              }`}
            >
              {fmtLength(mm)}
            </button>
          )
        })}
      </div>

      {/* Custom length input */}
      <form onSubmit={addCustom} className="flex gap-2 items-end mb-4">
        <div>
          <label className="block text-xs text-stone-400 mb-1">{t('phase2.custom', language)}</label>
          <input
            type="text"
            inputMode="decimal"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="7,2"
            className="w-28 px-3 py-2 bg-stone-900 border border-stone-600 rounded-md text-stone-100 text-sm focus:outline-none focus:border-green-600"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-md text-sm font-medium transition-colors"
        >
          {t('phase2.addCustom', language)}
        </button>
      </form>

      {/* Custom (non-preset) lengths with remove button */}
      {extraLengths.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {extraLengths.map((mm) => (
            <span key={mm} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-sm bg-stone-700 text-stone-300 border border-stone-600">
              {fmtLength(mm)}
              <button
                onClick={() => toggle(mm)}
                className="text-stone-500 hover:text-red-400 transition-colors ml-1 text-xs"
                aria-label="Remove"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      {selected.size === 0 && (
        <p className="text-xs text-stone-500 mt-2">{t('phase2.noStock', language)}</p>
      )}
    </div>
  )
}
