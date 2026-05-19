import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import './Admin.css'
import { Plus, Pencil, Trash2, Search, X, Upload, LogOut, Download } from 'lucide-react'

type Product = {
  id: number
  code: number
  name: string
  price: number
  brand: string
  category: string
  subcategory: string
  supplier: string
  country: string
  bottle_size_cl: number
  pack_size: number
}

const emptyProduct = {
  code: '',
  name: '',
  price: '',
  brand: '',
  category: '',
  subcategory: '',
  supplier: '',
  country: '',
  bottle_size_cl: '',
  pack_size: '',
}

type Props = {
  onLogout: () => void
}

const Admin = ({ onLogout }: Props) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState(emptyProduct)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [csvUploading, setCsvUploading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name')
    if (!error) setProducts(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredProducts = products.filter((p) => {
    const s = search.toLowerCase()
    return (
      !s ||
      p.name?.toLowerCase().includes(s) ||
      p.brand?.toLowerCase().includes(s) ||
      p.category?.toLowerCase().includes(s) ||
      String(p.code).includes(s)
    )
  })

  const handleAdd = async () => {
    setSaving(true)
    const { error } = await supabase.from('products').insert([{
      code: Number(formData.code),
      name: formData.name,
      price: Number(formData.price),
      brand: formData.brand,
      category: formData.category,
      subcategory: formData.subcategory,
      supplier: formData.supplier,
      country: formData.country,
      bottle_size_cl: Number(formData.bottle_size_cl),
      pack_size: Number(formData.pack_size),
    }])
    if (error) {
      showToast('Error adding product: ' + error.message)
    } else {
      showToast('Product added successfully!')
      setShowAddForm(false)
      setFormData(emptyProduct)
      fetchProducts()
    }
    setSaving(false)
  }

  const handleEdit = async () => {
    if (!editingId) return
    setSaving(true)
    const { error } = await supabase
      .from('products')
      .update({
        code: Number(formData.code),
        name: formData.name,
        price: Number(formData.price),
        brand: formData.brand,
        category: formData.category,
        subcategory: formData.subcategory,
        supplier: formData.supplier,
        country: formData.country,
        bottle_size_cl: Number(formData.bottle_size_cl),
        pack_size: Number(formData.pack_size),
      })
      .eq('id', editingId)
    if (error) {
      showToast('Error updating product: ' + error.message)
    } else {
      showToast('Product updated successfully!')
      setEditingId(null)
      setFormData(emptyProduct)
      fetchProducts()
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteId)
    if (error) {
      showToast('Error deleting product: ' + error.message)
    } else {
      showToast('Product deleted successfully!')
      setDeleteId(null)
      fetchProducts()
    }
  }

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvUploading(true)

    const text = await file.text()
    const lines = text.split('\n').filter(Boolean)
    const headers = lines[0]
      .split(',')
      .map((h) => h.trim().toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, ''))

    const rows = lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
      const row: Record<string, string> = {}
      headers.forEach((h, i) => { row[h] = values[i] || '' })
      return row
    })

    const upsertData = rows
      .filter((row) => row['code'] && !isNaN(Number(row['code'])))
      .map((row) => {
        const product: Record<string, string | number | null> = {
          code: Number(row['code']),
        }
        if (row['name']) product['name'] = row['name']
        if (row['price'] && !isNaN(Number(row['price']))) {
          product['price'] = Number(row['price'])
        }
        if (row['brand']) product['brand'] = row['brand']
        if (row['category']) product['category'] = row['category']
        if (row['subcategory']) product['subcategory'] = row['subcategory']
        if (row['supplier']) product['supplier'] = row['supplier']
        if (row['country']) product['country'] = row['country']
        if (row['bottle_size_cl'] && !isNaN(Number(row['bottle_size_cl']))) {
          product['bottle_size_cl'] = Number(row['bottle_size_cl'])
        }
        if (row['pack_size'] && !isNaN(Number(row['pack_size']))) {
          product['pack_size'] = Number(row['pack_size'])
        }
        return product
      })

    if (upsertData.length === 0) {
      showToast('No valid rows found in CSV')
      setCsvUploading(false)
      e.target.value = ''
      return
    }

    const { error } = await supabase
      .from('products')
      .upsert(upsertData, { onConflict: 'code' })

    if (error) {
      showToast('Upload failed: ' + error.message)
    } else {
      showToast(upsertData.length + ' products upserted successfully!')
      fetchProducts()
    }

    setCsvUploading(false)
    e.target.value = ''
  }

  const handleDownloadTemplate = () => {
    const headers = 'code,name,price,brand,category,subcategory,supplier,country,bottle_size_cl,pack_size'
    const example = '10001,Example Product 6x70cl,450.00,Brand Name,WHISKEY,Single Malt,Supplier Name,Scotland,70,6'
    const blob = new Blob([headers + '\n' + example], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'DADC-product-template.csv'
    a.click()
  }

  const startEdit = (product: Product) => {
    setEditingId(product.id)
    setFormData({
      code: String(product.code),
      name: product.name,
      price: String(product.price),
      brand: product.brand || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      supplier: product.supplier || '',
      country: product.country || '',
      bottle_size_cl: String(product.bottle_size_cl || ''),
      pack_size: String(product.pack_size || ''),
    })
    setShowAddForm(false)
  }

  const ProductForm = ({ onSave, onCancel, title }: {
    onSave: () => void
    onCancel: () => void
    title: string
  }) => (
    <div className="admin-form-card">
      <h3 className="admin-form-title">{title}</h3>
      <div className="admin-form-grid">
        <div className="admin-form-group">
          <label>Product Code *</label>
          <input
            type="number"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g. 10001"
          />
        </div>
        <div className="admin-form-group">
          <label>Product Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Hennessy VS 6x70cl"
          />
        </div>
        <div className="admin-form-group">
          <label>Price (GHS) *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="e.g. 450.00"
          />
        </div>
        <div className="admin-form-group">
          <label>Brand</label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="e.g. Hennessy"
          />
        </div>
        <div className="admin-form-group">
          <label>Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g. COGNAC"
          />
        </div>
        <div className="admin-form-group">
          <label>Subcategory</label>
          <input
            type="text"
            value={formData.subcategory}
            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
            placeholder="e.g. VS Cognac"
          />
        </div>
        <div className="admin-form-group">
          <label>Supplier</label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            placeholder="e.g. Moet Hennessy"
          />
        </div>
        <div className="admin-form-group">
          <label>Country</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="e.g. France"
          />
        </div>
        <div className="admin-form-group">
          <label>Bottle Size (cL)</label>
          <input
            type="number"
            value={formData.bottle_size_cl}
            onChange={(e) => setFormData({ ...formData, bottle_size_cl: e.target.value })}
            placeholder="e.g. 70"
          />
        </div>
        <div className="admin-form-group">
          <label>Pack Size</label>
          <input
            type="number"
            value={formData.pack_size}
            onChange={(e) => setFormData({ ...formData, pack_size: e.target.value })}
            placeholder="e.g. 6"
          />
        </div>
      </div>
      <div className="admin-form-actions">
        <button
          className="admin-save-btn"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Product'}
        </button>
        <button className="admin-cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )

  return (
    <div className="admin-page">

      {/* Toast */}
      {toast && <div className="admin-toast">{toast}</div>}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Delete Product</h3>
            <p>Are you sure you want to delete this product? This cannot be undone.</p>
            <div className="admin-modal-actions">
              <button className="admin-delete-confirm-btn" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="admin-cancel-btn" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <img src="/dadc_logo.webp" alt="DADC" className="admin-logo" />
          <div>
            <h1 className="admin-title">Admin Panel</h1>
            <p className="admin-subtitle">{products.length} products in database</p>
          </div>
        </div>
        <button className="admin-logout-btn" onClick={onLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Actions bar */}
      <div className="admin-actions-bar">
        <div className="admin-search-wrap">
          <Search size={15} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="admin-search-clear" onClick={() => setSearch('')}>
              <X size={13} />
            </button>
          )}
        </div>

        <div className="admin-action-btns">
          {/* Download Template */}
          <button
            className="admin-template-btn"
            onClick={handleDownloadTemplate}
          >
            <Download size={15} /> Download Template
          </button>

          {/* CSV Upload */}
          <label className="admin-csv-btn">
            {csvUploading ? 'Uploading...' : (
              <>
                <Upload size={15} /> Bulk Update CSV
              </>
            )}
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              style={{ display: 'none' }}
            />
          </label>

          {/* Add product */}
          <button
            className="admin-add-btn"
            onClick={() => {
              setShowAddForm(!showAddForm)
              setEditingId(null)
              setFormData(emptyProduct)
            }}
          >
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAddForm && (
        <ProductForm
          title="Add New Product"
          onSave={handleAdd}
          onCancel={() => {
            setShowAddForm(false)
            setFormData(emptyProduct)
          }}
        />
      )}

      {/* Edit form */}
      {editingId && (
        <ProductForm
          title="Edit Product"
          onSave={handleEdit}
          onCancel={() => {
            setEditingId(null)
            setFormData(emptyProduct)
          }}
        />
      )}

      {/* Products table */}
      {loading ? (
        <div className="admin-loading">Loading products...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Product Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Country</th>
                <th>Price (GHS)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="td-code">{product.code}</td>
                  <td className="td-name">{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>{product.country}</td>
                  <td className="td-price">
                    GHS {Number(product.price).toFixed(2)}
                  </td>
                  <td className="td-actions">
                    <button
                      className="admin-edit-btn"
                      onClick={() => startEdit(product)}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="admin-delete-btn"
                      onClick={() => setDeleteId(product.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Admin