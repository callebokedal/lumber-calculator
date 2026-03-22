import { useState } from 'react'
import { t } from '../../utils/i18n'

const LUMBER_TYPES = ['deck-board', 'joist', 'post', 'rim-joist']

/**
 * Form for adding or editing a lumber item.
 * @param {{ language: 'sv'|'en', onSave: (data: object) => void, onCancel: () => void, initial?: object }} props
 */
export function LumberItemForm({ language, onSave, onCancel, initial }) {
  const [width, setWidth] = useState(initial?.width?.toString() ?? '')
  const [height, setHeight] = useState(initial?.height?.toString() ?? '')
  const [lengthM, setLengthM] = useState(initial?.length != null ? (initial.length / 1000).toString() : '')
  const [quantity, setQuantity] = useState(initial?.quantity?.toString() ?? '1')
  const [type, setType] = useState(initial?.type ?? '')

  function handleSubmit(e) {
    e.preventDefault()
    const w = parseInt(width, 10)
    const h = parseInt(height, 10)
    const l = Math.round(parseFloat(lengthM.replace(',', '.')) * 1000)
    const q = parseInt(quantity, 10)
    if (!w || !h || !l || !q || isNaN(w) || isNaN(h) || isNaN(l) || isNaN(q)) return
    onSave({ width: w, height: h, length: l, quantity: q, type: type || null })
  }

  const inputClass =
    'w-full px-3 py-2 bg-stone-900 border border-stone-600 rounded-md text-stone-100 text-sm focus:outline-none focus:border-green-600'
  const labelClass = 'block text-xs text-stone-400 mb-1'

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-stone-800 rounded-lg border border-stone-700">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelClass}>{t('phase1.width', language)}</label>
          <input
            autoFocus
            type="number"
            min="1"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className={inputClass}
            placeholder="45"
          />
        </div>
        <div>
          <label className={labelClass}>{t('phase1.height', language)}</label>
          <input
            type="number"
            min="1"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={inputClass}
            placeholder="145"
          />
        </div>
        <div>
          <label className={labelClass}>{t('phase1.length', language)}</label>
          <input
            type="text"
            inputMode="decimal"
            value={lengthM}
            onChange={(e) => setLengthM(e.target.value)}
            className={inputClass}
            placeholder="2,15"
          />
        </div>
        <div>
          <label className={labelClass}>{t('phase1.quantity', language)}</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={inputClass}
            placeholder="1"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className={labelClass}>{t('phase1.type', language)}</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={inputClass}
        >
          <option value="">{t('phase1.type.none', language)}</option>
          {LUMBER_TYPES.map((lt) => (
            <option key={lt} value={lt}>{t(`type.${lt}`, language)}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors">
          {t('common.save', language)}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-md text-sm font-medium transition-colors">
          {t('common.cancel', language)}
        </button>
      </div>
    </form>
  )
}
