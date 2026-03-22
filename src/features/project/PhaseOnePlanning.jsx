import { useState } from 'react'
import { projectService } from '../../services/project.service'
import { t } from '../../utils/i18n'
import { LumberItemForm } from './LumberItemForm'

/**
 * @param {number} mm - length in millimeters
 * @returns {string} formatted as "X,XX m"
 */
function formatLength(mm) {
  return (mm / 1000).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 3 }) + ' m'
}

/**
 * Phase 1: Planning – add and manage desired lumber items.
 * @param {{ project: import('../../types/index').Project, language: 'sv'|'en', onProjectChange: () => void }} props
 */
export function PhaseOnePlanning({ project, language, onProjectChange }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  function handleAdd(data) {
    projectService.addItem(project.id, data)
    setShowForm(false)
    onProjectChange()
  }

  function handleEdit(itemId, data) {
    projectService.updateItem(project.id, itemId, data)
    setEditingId(null)
    onProjectChange()
  }

  function handleDelete(itemId) {
    projectService.removeItem(project.id, itemId)
    onProjectChange()
  }

  const items = project.items ?? []

  return (
    <div>
      {!showForm && (
        <div className="mb-4">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            + {t('phase1.addItem', language)}
          </button>
        </div>
      )}

      {showForm && (
        <div className="mb-4">
          <LumberItemForm
            language={language}
            onSave={handleAdd}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {items.length === 0 && !showForm ? (
        <p className="text-stone-500 text-sm">{t('phase1.empty', language)}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) =>
            editingId === item.id ? (
              <div key={item.id}>
                <LumberItemForm
                  language={language}
                  initial={item}
                  onSave={(data) => handleEdit(item.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <LumberItemRow
                key={item.id}
                item={item}
                language={language}
                onEdit={() => setEditingId(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}

/**
 * @param {{ item: import('../../types/index').LumberItem, language: 'sv'|'en', onEdit: () => void, onDelete: () => void }} props
 */
function LumberItemRow({ item, language, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg">
      <div className="flex items-center gap-4 min-w-0">
        <div className="min-w-0">
          <div className="font-mono text-stone-100 text-sm">
            {item.width}×{item.height} mm
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-stone-300 text-sm">{formatLength(item.length)}</span>
            <span className="text-stone-400 text-sm">{item.quantity} {t('phase1.totalPieces', language)}</span>
            {item.type && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-stone-700 text-stone-400">
                {t(`type.${item.type}`, language)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-1 shrink-0 ml-2">
        <button
          onClick={onEdit}
          aria-label={t('common.edit', language)}
          className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-700 rounded transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          aria-label={t('common.delete', language)}
          className="p-2 text-red-500 hover:text-red-400 hover:bg-stone-700 rounded transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
