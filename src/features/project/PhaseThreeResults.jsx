import { optimizeProject } from '../../utils/optimizer'
import { t } from '../../utils/i18n'

/** @param {number} mm @returns {string} */
function fmtLength(mm) {
  return (mm / 1000).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 3 }) + ' m'
}

/** @param {number} fraction 0–1 @returns {string} */
function fmtPercent(fraction) {
  return (fraction * 100).toLocaleString('sv-SE', { maximumFractionDigits: 1 }) + '%'
}

/**
 * Phase 3: Shopping list – shows the optimized boards to purchase.
 * @param {{ project: import('../../types/index').Project, language: 'sv'|'en' }} props
 */
export function PhaseThreeResults({ project, language }) {
  const items = project.items ?? []

  if (items.length === 0) {
    return <p className="text-stone-500 text-sm">{t('phase3.noItems', language)}</p>
  }

  const results = optimizeProject(items, project.storeStock ?? {})

  return (
    <div className="flex flex-col gap-6">
      {results.map((r) => (
        <DimensionResult key={r.dimensionKey} result={r} language={language} />
      ))}
    </div>
  )
}

/**
 * @param {{ result: import('../../utils/optimizer').DimensionResult, language: 'sv'|'en' }} props
 */
function DimensionResult({ result, language }) {
  const { dimensionKey, boards, unplacedCuts, totalLengthNeeded, totalLengthBought, totalWaste } = result
  const [w, h] = dimensionKey.split('x')
  const wastePercent = totalLengthBought > 0 ? totalWaste / totalLengthBought : 0

  // Aggregate boards into a purchase summary: { stockLength → count }
  const purchaseSummary = new Map()
  for (const b of boards) {
    purchaseSummary.set(b.stockLength, (purchaseSummary.get(b.stockLength) ?? 0) + 1)
  }

  return (
    <div className="p-4 bg-stone-800 border border-stone-700 rounded-lg">
      {/* Dimension header */}
      <h3 className="font-mono font-medium text-stone-100 mb-4">
        {w}×{h} mm
      </h3>

      {/* No stock warning */}
      {boards.length === 0 && unplacedCuts.length > 0 && (
        <p className="text-amber-400 text-sm mb-3">{t('phase3.noStock', language)}</p>
      )}

      {/* Cuts that couldn't be placed */}
      {unplacedCuts.length > 0 && boards.length > 0 && (
        <div className="mb-4 p-3 bg-red-950 border border-red-800 rounded-md">
          <p className="text-red-400 text-sm mb-1">{t('phase3.cutTooLong', language)}</p>
          <ul className="flex flex-wrap gap-1">
            {unplacedCuts.map((c, i) => (
              <li key={i} className="text-xs font-mono bg-red-900 text-red-300 px-2 py-0.5 rounded">
                {fmtLength(c)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Purchase summary */}
      {purchaseSummary.size > 0 && (
        <div className="mb-4">
          <p className="text-xs text-stone-400 mb-2 uppercase tracking-wide">{t('phase3.toBuy', language)}</p>
          <ul className="flex flex-col gap-1">
            {[...purchaseSummary.entries()]
              .sort((a, b) => a[0] - b[0])
              .map(([len, count]) => (
                <li key={len} className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-400 w-8 text-right">{count}</span>
                  <span className="text-stone-300 text-sm">×</span>
                  <span className="font-mono text-stone-100">{fmtLength(len)}</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Detailed breakdown per board */}
      {boards.length > 0 && (
        <details className="mt-2">
          <summary className="text-xs text-stone-500 cursor-pointer hover:text-stone-300 transition-colors select-none">
            {language === 'sv' ? 'Visa kapningsdetaljer' : 'Show cut details'}
          </summary>
          <div className="mt-3 flex flex-col gap-2">
            {boards.map((board, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-stone-500 w-5 text-right shrink-0">{i + 1}.</span>
                <div className="min-w-0">
                  <span className="font-mono text-stone-300">{fmtLength(board.stockLength)}</span>
                  <span className="text-stone-500 mx-1">→</span>
                  <span className="text-stone-400">
                    {board.cuts
                      .slice()
                      .sort((a, b) => b - a)
                      .map(fmtLength)
                      .join(' + ')}
                  </span>
                  {board.waste > 0 && (
                    <span className="ml-2 text-xs text-stone-600">
                      ({t('phase3.waste', language)}: {fmtLength(board.waste)})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Stats footer */}
      {totalLengthBought > 0 && (
        <div className="mt-4 pt-3 border-t border-stone-700 flex flex-wrap gap-x-6 gap-y-1 text-xs text-stone-500">
          <span>
            {t('phase3.totalBought', language)}: <strong className="text-stone-300">{fmtLength(totalLengthBought)}</strong>
          </span>
          <span>
            {t('phase3.wastePercent', language)}: <strong className={wastePercent > 0.2 ? 'text-amber-400' : 'text-stone-300'}>{fmtPercent(wastePercent)}</strong>
          </span>
        </div>
      )}
    </div>
  )
}
