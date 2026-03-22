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
      <div className="flex items-center gap-4">
        <div>
          <span className="font-mono text-stone-100 text-sm">
            {item.width}×{item.height} mm
          </span>
          <span className="text-stone-400 text-sm mx-2">·</span>
          <span className="text-stone-100 text-sm">{formatLength(item.length)}</span>
          {item.type && (
            <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-stone-700 text-stone-400">
              {t(`type.${item.type}`, language)}
            </span>
          )}
        </div>
        <div className="text-stone-300 text-sm font-medium">
          {item.quantity} {t('phase1.totalPieces', language)}
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={onEdit}
          className="px-2.5 py-1 text-xs text-stone-400 hover:text-stone-100 hover:bg-stone-700 rounded transition-colors"
        >
          {t('common.edit', language)}
        </button>
        <button
          onClick={onDelete}
          className="px-2.5 py-1 text-xs text-red-500 hover:text-red-400 hover:bg-stone-700 rounded transition-colors"
        >
          {t('common.delete', language)}
        </button>
      </div>
    </div>
  )
}
