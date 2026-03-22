import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/app.store'
import { projectService } from '../services/project.service'
import { t } from '../utils/i18n'

export default function ProjectsPage() {
  const language = useAppStore((s) => s.language)
  const setActiveProjectId = useAppStore((s) => s.setActiveProjectId)
  const navigate = useNavigate()
  const importRef = useRef(null)

  const [projects, setProjects] = useState(() =>
    projectService.getAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  )
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [importError, setImportError] = useState(null)

  function refresh() {
    setProjects(
      projectService.getAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    )
  }

  function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    const project = projectService.create({ name: newName.trim(), description: newDescription.trim() })
    refresh()
    setNewName('')
    setNewDescription('')
    setShowNewForm(false)
    setActiveProjectId(project.id)
    navigate(`/projects/${project.id}`)
  }

  function handleDelete(e, id) {
    e.stopPropagation()
    if (!window.confirm(t('projects.delete.confirm', language))) return
    projectService.remove(id)
    refresh()
  }

  function handleExport(e, id) {
    e.stopPropagation()
    projectService.exportAsJson(id)
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportError(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target.result)
        if (!raw?.name) throw new Error('missing name')
        const project = projectService.importFromJson(raw)
        refresh()
        setActiveProjectId(project.id)
        navigate(`/projects/${project.id}`)
      } catch {
        setImportError(t('projects.importError', language))
      }
    }
    reader.readAsText(file)
    // Reset so the same file can be re-imported if needed
    e.target.value = ''
  }

  const locale = language === 'sv' ? 'sv-SE' : 'en-US'

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-stone-100">{t('projects.title', language)}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => importRef.current?.click()}
            className="px-3 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-md text-sm font-medium transition-colors"
          >
            {t('projects.import', language)}
          </button>
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
          <button
            onClick={() => { setShowNewForm(true); setImportError(null) }}
            className="px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            + {t('projects.new', language)}
          </button>
        </div>
      </div>

      {importError && (
        <p className="mb-4 text-sm text-red-400 bg-red-950 border border-red-800 rounded-md px-3 py-2">{importError}</p>
      )}

      {/* New project form */}
      {showNewForm && (
        <form onSubmit={handleCreate} className="mb-5 p-4 bg-stone-800 rounded-lg border border-stone-700">
          <div className="mb-3">
            <label className="block text-sm text-stone-300 mb-1">{language === 'sv' ? 'Namn' : 'Name'}</label>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 bg-stone-900 border border-stone-600 rounded-md text-stone-100 text-sm focus:outline-none focus:border-green-600"
              placeholder={language === 'sv' ? 'Mitt terrassproject' : 'My deck project'}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-stone-300 mb-1">
              {language === 'sv' ? 'Beskrivning (valfritt)' : 'Description (optional)'}
            </label>
            <input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3 py-2 bg-stone-900 border border-stone-600 rounded-md text-stone-100 text-sm focus:outline-none focus:border-green-600"
              placeholder={language === 'sv' ? 'Kort beskrivning' : 'Short description'}
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors">
              {t('common.save', language)}
            </button>
            <button type="button" onClick={() => setShowNewForm(false)} className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-md text-sm font-medium transition-colors">
              {t('common.cancel', language)}
            </button>
          </div>
        </form>
      )}

      {/* Project list */}
      {projects.length === 0 ? (
        <p className="text-stone-400 text-sm">{t('projects.empty', language)}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {projects.map((p) => (
            <li key={p.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => { setActiveProjectId(p.id); navigate(`/projects/${p.id}`) }}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/projects/${p.id}`)}
                className="w-full text-left px-4 py-3 bg-stone-800 hover:bg-stone-750 border border-stone-700 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  {/* Left: name + description + meta */}
                  <div className="min-w-0">
                    <span className="font-medium text-stone-100 block truncate">{p.name}</span>
                    {p.description && (
                      <span className="block text-sm text-stone-400 mt-0.5 truncate">{p.description}</span>
                    )}
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-stone-500">
                        {t('projects.updated', language)}: {new Date(p.updatedAt).toLocaleDateString(locale)}
                      </span>
                      {p.items?.length > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-stone-700 text-stone-400">
                          {p.items.length} {t('projects.items', language)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleExport(e, p.id)}
                      className="px-2.5 py-1 text-xs text-stone-400 hover:text-stone-100 hover:bg-stone-700 rounded transition-colors"
                    >
                      {t('project.export', language)}
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, p.id)}
                      className="px-2.5 py-1 text-xs text-red-500 hover:text-red-400 hover:bg-stone-700 rounded transition-colors"
                    >
                      {t('common.delete', language)}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
