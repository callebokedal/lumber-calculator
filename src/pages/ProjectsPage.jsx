import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/app.store'
import { projectService } from '../services/project.service'
import { t } from '../utils/i18n'

export default function ProjectsPage() {
  const language = useAppStore((s) => s.language)
  const setActiveProjectId = useAppStore((s) => s.setActiveProjectId)
  const navigate = useNavigate()

  const [projects, setProjects] = useState(() => projectService.getAll())
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')

  function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    const project = projectService.create({ name: newName.trim(), description: newDescription.trim() })
    setProjects(projectService.getAll())
    setNewName('')
    setNewDescription('')
    setShowNewForm(false)
    setActiveProjectId(project.id)
    navigate(`/projects/${project.id}`)
  }

  function handleOpen(id) {
    setActiveProjectId(id)
    navigate(`/projects/${id}`)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-stone-100">{t('projects.title', language)}</h1>
        <button
          onClick={() => setShowNewForm(true)}
          className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          {t('projects.new', language)}
        </button>
      </div>

      {showNewForm && (
        <form onSubmit={handleCreate} className="mb-6 p-4 bg-stone-800 rounded-lg border border-stone-700">
          <div className="mb-3">
            <label className="block text-sm text-stone-300 mb-1">Name</label>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 bg-stone-900 border border-stone-600 rounded-md text-stone-100 text-sm focus:outline-none focus:border-green-600"
              placeholder="My deck project"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-stone-300 mb-1">Description (optional)</label>
            <input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3 py-2 bg-stone-900 border border-stone-600 rounded-md text-stone-100 text-sm focus:outline-none focus:border-green-600"
              placeholder="Short description"
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

      {projects.length === 0 ? (
        <p className="text-stone-400 text-sm">{t('projects.empty', language)}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => handleOpen(p.id)}
                className="w-full text-left px-4 py-3 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors"
              >
                <span className="font-medium text-stone-100">{p.name}</span>
                {p.description && (
                  <span className="block text-sm text-stone-400 mt-0.5">{p.description}</span>
                )}
                <span className="block text-xs text-stone-500 mt-1">
                  {new Date(p.updatedAt).toLocaleDateString(language === 'sv' ? 'sv-SE' : 'en-US')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
