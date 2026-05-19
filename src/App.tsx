import { useEffect, useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import CategoryCard from './components/CategoryCard'
import Footer from './components/Footer'
import Cart from './components/Cart'
import PriceListPDF from './components/PriceListPDF'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'
import { supabase } from './supabaseClient'
import type { CartItem } from './components/Cart'

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

type CategorySummary = {
  name: string
  productCount: number
  brandCount: number
}

export type Filters = {
  search: string
  category: string
  brand: string
  country: string
  priceOrder: 'asc' | 'desc' | null
}

function CataloguePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    brand: '',
    country: '',
    priceOrder: null,
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const allCategories = [...new Set(allProducts.map((p) => p.category).filter(Boolean))].sort()
  const allBrands = [...new Set(allProducts.map((p) => p.brand).filter(Boolean))].sort()
  const allCountries = [...new Set(allProducts.map((p) => p.country).filter(Boolean))].sort()

  const fetchAllProducts = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*')
    if (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
      return
    }
    setAllProducts(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAllProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    )
  }

  const handleRemove = (productId: number) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId))
  }

  const handleDownloadPDF = async () => {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const img = new Image()
    img.src = '/dadc_logo.webp'
    await new Promise((resolve) => { img.onload = resolve })
    const imgWidth = 50
    const imgHeight = (img.height * imgWidth) / img.width
    pdf.addImage(img, 'WEBP', (pageWidth - imgWidth) / 2, 12, imgWidth, imgHeight)

    let y = 12 + imgHeight + 5

    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text('MATRACO BUILDING ABC ACHIMOTA', pageWidth / 2, y, { align: 'center' })
    y += 6

    pdf.setFontSize(13)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(15, 42, 74)
    pdf.text('PRICE LIST - RETAIL', pageWidth / 2, y, { align: 'center' })
    y += 5

    pdf.setDrawColor(15, 42, 74)
    pdf.setLineWidth(1)
    pdf.line(14, y, pageWidth - 14, y)
    y += 7

    const productsWithPrice = allProducts.filter((p) => p.price > 0)
    const grouped: Record<string, Product[]> = {}
    productsWithPrice.forEach((p) => {
      const cat = p.category || 'Other'
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(p)
    })

    const sortedCategories = Object.keys(grouped).sort()

    sortedCategories.forEach((category) => {
      const rows = grouped[category].map((p) => [
        p.name,
        'GHS ' + Number(p.price).toFixed(2),
      ])

      autoTable(pdf, {
        startY: y,
        head: [[{ content: category, colSpan: 2 }]],
        body: rows,
        headStyles: {
          fillColor: [15, 42, 74],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5,
          cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
        },
        columnStyles: {
          0: { cellWidth: 'auto', fontSize: 8, textColor: [50, 65, 85] },
          1: {
            cellWidth: 35,
            halign: 'right',
            fontStyle: 'bold',
            fontSize: 8,
            textColor: [15, 42, 74],
          },
        },
        bodyStyles: {
          cellPadding: { top: 3, bottom: 3, left: 6, right: 6 },
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { left: 14, right: 14 },
        theme: 'grid',
        didDrawPage: () => {
          pdf.setFontSize(7)
          pdf.setTextColor(180, 180, 180)
          pdf.text(
            'DADC PRICE LIST 2026  |  ALL RIGHTS RESERVED  |  PRICES INCLUSIVE OF VAT',
            pageWidth / 2,
            pageHeight - 8,
            { align: 'center' }
          )
          pdf.text(
            'Page ' + (pdf as any).internal.getCurrentPageInfo().pageNumber,
            pageWidth - 14,
            pageHeight - 8,
            { align: 'right' }
          )
        },
      })

      y = (pdf as any).lastAutoTable.finalY + 8
    })

    const pdfBlob = pdf.output('blob')
    const pdfFile = new File([pdfBlob], 'DADC-Price-List-2026.pdf', {
      type: 'application/pdf',
    })

    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      try {
        await navigator.share({
          title: 'DADC Price List 2026',
          text: 'Please find attached the DADC Price List 2026.',
          files: [pdfFile],
        })
        return
      } catch (err) {
        console.log('Share cancelled, falling back')
      }
    }

    const pdfUrl = URL.createObjectURL(pdfBlob)
    window.open(pdfUrl, '_blank')
  }

  const filteredProducts = allProducts.filter((product) => {
    const search = filters.search.toLowerCase()
    const matchesSearch =
      !search ||
      String(product.code).includes(search) ||
      product.name?.toLowerCase().includes(search) ||
      product.brand?.toLowerCase().includes(search) ||
      product.country?.toLowerCase().includes(search) ||
      product.subcategory?.toLowerCase().includes(search)

    const matchesCategory = !filters.category || product.category === filters.category
    const matchesBrand = !filters.brand || product.brand === filters.brand
    const matchesCountry = !filters.country || product.country === filters.country

    return matchesSearch && matchesCategory && matchesBrand && matchesCountry
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.priceOrder === 'asc') return a.price - b.price
    if (filters.priceOrder === 'desc') return b.price - a.price
    return 0
  })

  const categoryMap: Record<string, { brands: Set<string>; products: Product[] }> = {}
  sortedProducts.forEach((product) => {
    const cat = product.category || 'Uncategorized'
    if (!categoryMap[cat]) {
      categoryMap[cat] = { brands: new Set(), products: [] }
    }
    categoryMap[cat].products.push(product)
    if (product.brand) categoryMap[cat].brands.add(product.brand)
  })

  const filteredCategories: CategorySummary[] = Object.entries(categoryMap)
    .map(([name, { brands, products }]) => ({
      name,
      productCount: products.length,
      brandCount: brands.size,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: 0 }}>
      <PriceListPDF products={allProducts} />
      <Header onDownloadPDF={handleDownloadPDF} />
      <SearchBar
        totalItems={sortedProducts.length}
        filters={filters}
        onFilterChange={setFilters}
        categories={allCategories}
        brands={allBrands}
        countries={allCountries}
      />
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="loading">No products match your search.</div>
      ) : (
        <div className="categories-list">
          {filteredCategories.map((cat) => (
            <CategoryCard
              key={cat.name}
              name={cat.name}
              productCount={cat.productCount}
              brandCount={cat.brandCount}
              filteredProducts={categoryMap[cat.name]?.products || []}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
      <Footer
        cartCount={cartItems.length}
        onCartOpen={() => setCartOpen(true)}
        cartOpen={cartOpen}
      />
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
      />
    </div>
  )
}

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />
  }

  return <Admin onLogout={() => setIsLoggedIn(false)} />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<CataloguePage />} />
      <Route path="/dadc-admin-9x7k" element={<AdminPage />} />
    </Routes>
  )
}

export default App