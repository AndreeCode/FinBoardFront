'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, ChevronDown, ChevronRight, Loader2, Pencil, X, Check } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { createCategory, updateCategory, deleteCategory, getCategories, Category } from '@/src/lib/actions/categories'
import { toast } from 'sonner'

interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[]
  level: number
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', description: '', parent_id: '' as string | null })
  const [addingSubTo, setAddingSubTo] = useState<string | null>(null)
  const [newSubName, setNewSubName] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    setIsLoading(true)
    try {
      const data = await getCategories()
      setCategories(data)
    } catch {
      toast.error('Error al cargar categorías')
    } finally {
      setIsLoading(false)
    }
  }

  function buildTree(cats: Category[]): CategoryWithChildren[] {
    const map = new Map<string, CategoryWithChildren>()
    const roots: CategoryWithChildren[] = []

    cats.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [], level: 0 })
    })

    map.forEach((node) => {
      if (node.parent_id && map.has(node.parent_id)) {
        const parent = map.get(node.parent_id)!
        node.level = parent.level + 1
        parent.children.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots
  }

  function flattenTree(nodes: CategoryWithChildren[]): CategoryWithChildren[] {
    const result: CategoryWithChildren[] = []
    
    function traverse(node: CategoryWithChildren) {
      result.push(node)
      node.children.forEach(traverse)
    }
    
    nodes.forEach(traverse)
    return result
  }

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  async function handleCreate() {
    if (!newCategory.name.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    setIsLoading(true)
    try {
      const result = await createCategory({
        name: newCategory.name,
        description: newCategory.description,
        parent_id: newCategory.parent_id || null,
      })

      if (result.status === 201) {
        toast.success(result.msg)
        setNewCategory({ name: '', description: '', parent_id: '' })
        setShowCreateForm(false)
        loadCategories()
      } else {
        toast.error(result.msg)
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddSubcategory(parentId: string) {
    if (!newSubName.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    setIsLoading(true)
    try {
      const result = await createCategory({
        name: newSubName,
        description: '',
        parent_id: parentId,
      })

      if (result.status === 201) {
        toast.success(result.msg)
        setNewSubName('')
        setAddingSubTo(null)
        loadCategories()
      } else {
        toast.error(result.msg)
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpdate(id: string) {
    if (!editForm.name.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    setIsLoading(true)
    try {
      const result = await updateCategory(id, {
        name: editForm.name,
        description: editForm.description,
      })

      if (result.status === 200) {
        toast.success(result.msg)
        setEditingId(null)
        loadCategories()
      } else {
        toast.error(result.msg)
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta categoría?')) return

    setIsLoading(true)
    try {
      const result = await deleteCategory(id)
      if (result.status === 200) {
        toast.success(result.msg)
        loadCategories()
      } else {
        toast.error(result.msg)
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditForm({ name: cat.name, description: cat.description || '' })
  }

  const tree = buildTree(categories)
  const flatList = flattenTree(tree)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Crear Nueva Categoría</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        {showCreateForm && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  placeholder="Nombre de la categoría"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Categoría padre (opcional)</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newCategory.parent_id || ''}
                  onChange={(e) => setNewCategory({ ...newCategory, parent_id: e.target.value || null })}
                >
                  <option value="">Ninguna (categoría principal)</option>
                  {categories.filter(c => !c.parent_id).map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input
                placeholder="Descripción de la categoría"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Crear
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="space-y-2">
        {isLoading && categories.length === 0 ? (
          <Card>
            <CardContent className="p-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : flatList.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No hay categorías creadas</p>
              <p className="text-sm text-muted-foreground mt-1">
                Crea tu primera categoría usando el formulario de arriba
              </p>
            </CardContent>
          </Card>
        ) : (
          flatList.map((cat) => (
            <div key={cat.id} style={{ marginLeft: `${cat.level * 24}px` }}>
              <Card className={cat.level > 0 ? 'border-l-4 border-l-primary/30' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {cat.children.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-6 w-6"
                        onClick={() => toggleExpand(cat.id)}
                      >
                        {expandedIds.has(cat.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                    {cat.children.length === 0 && <div className="w-6" />}

                    <div className="flex-1">
                      {editingId === cat.id ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Input
                            className="w-40"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                          <Input
                            className="w-48"
                            placeholder="Descripción"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          />
                          <Button size="sm" onClick={() => handleUpdate(cat.id)}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {cat.level === 0 ? '📁' : '📄'}
                          </span>
                          <div>
                            <h3 className="font-semibold text-foreground">{cat.name}</h3>
                            {cat.description && (
                              <p className="text-sm text-muted-foreground">{cat.description}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1">
                      {addingSubTo === cat.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            className="w-32 h-8"
                            placeholder="Nombre"
                            value={newSubName}
                            onChange={(e) => setNewSubName(e.target.value)}
                            autoFocus
                          />
                          <Button size="sm" onClick={() => handleAddSubcategory(cat.id)}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => { setAddingSubTo(null); setNewSubName('') }}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setAddingSubTo(cat.id)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(cat)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(cat.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
