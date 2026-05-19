import './PriceListPDF.css'

type Product = {
  id: number
  code: number
  name: string
  price: number
  brand: string
  category: string
  subcategory: string
  bottle_size_cl: number
  pack_size: number
}

type Props = {
  products: Product[]
}

const PriceListPDF = ({ products }: Props) => {
  const grouped: Record<string, Product[]> = {}
  products.forEach((p) => {
    const cat = p.category || 'Other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(p)
  })

  const sortedCategories = Object.keys(grouped).sort()

  return (
    <div className="pricelist-pdf">

      {/* Top Header */}
      <div className="pricelist-header">
        <img src="/dadc_logo.webp" alt="DADC Logo" className="pricelist-logo" />
        <p className="pricelist-address">MATRACO BUILDING ABC ACHIMOTA</p>
        <p className="pricelist-subtitle">PRICE LIST - RETAIL</p>
      </div>

      <div className="pricelist-divider" />

      {/* Categories */}
      {sortedCategories.map((category) => (
        <div key={category} className="pricelist-category">

          {/* Category title */}
          <div className="pricelist-category-title">
            {category}
          </div>

          {/* Table */}
          <table className="pricelist-table">
            <thead>
              <tr>
                <th className="col-name">Product Name</th>
                <th className="col-price">Price (GHS)</th>
              </tr>
            </thead>
            <tbody>
              {grouped[category].map((product) => (
                <tr key={product.id}>
                  <td className="col-name">{product.name}</td>
                  <td className="col-price">
                    GH₵ {Number(product.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      ))}

      {/* Footer */}
      <div className="pricelist-footer">
        <p>DADC PRICE LIST © 2026 · ALL RIGHTS RESERVED · PRICES INCLUSIVE OF VAT</p>
      </div>

    </div>
  )
}

export default PriceListPDF