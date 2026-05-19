import './CategoryCard.css'
import { useState } from 'react'
import type { CartItem } from './Cart'

type Product = {
  id: number
  code: number
  name: string
  price: number
  brand: string
  subcategory: string
  supplier: string
  country: string
  bottle_size_cl: number
  pack_size: number
}

type Props = {
  name: string
  productCount: number
  brandCount: number
  filteredProducts: Product[]
  cartItems: CartItem[]
  onAddToCart: (product: Product) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

const getCategoryIcon = (category: string): string => {
  const cat = category.toUpperCase()
  if (cat === 'BRANDY') return '🫗'
  if (cat === 'CHAMPAGNE') return '🥂'
  if (cat === 'CIDER') return '🍺'
  if (cat === 'COCKTAIL FLAVORS') return '🍹'
  if (cat === 'COGNAC') return '🥃'
  if (cat === 'GIN') return '🍸'
  if (cat === 'LIQUEUR') return '🫙'
  if (cat === 'NON-ALCOGOLIC SPARKLING BEVERAGE') return '🥤'
  if (cat === 'RUM') return '🌴'
  if (cat === 'SPARKLING WINE') return '🍾'
  if (cat === 'TEQUILA') return '🌵'
  if (cat === 'VERMOUTH') return '🍶'
  if (cat === 'VODKA') return '🧊'
  if (cat === 'WATER') return '💧'
  if (cat === 'WHISKEY') return '🥃'
  if (cat === 'WINE') return '🍷'
  return '🍻'
}

const ProductCard = ({
  product,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onRemove,
}: {
  product: Product
  cartItems: CartItem[]
  onAddToCart: (product: Product) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}) => {
  const cartItem = cartItems.find((i) => i.product.id === product.id)

  return (
    <div className="product-card">
      {/* Left side */}
      <div className="product-card-left">
        <span className="product-code">#{product.code}</span>
        <div className="product-card-info">
          <p className="product-card-name">{product.name}</p>
          <p className="product-card-country">{product.country}</p>
        </div>
      </div>

      {/* Right side */}
      <div className="product-card-right">
        <span className="product-price">
          GHS {Number(product.price).toFixed(2)}
        </span>
        {!cartItem ? (
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
          >
            + Add
          </button>
        ) : (
          <div className="quantity-control">
            <button
              className="qty-btn"
              onClick={() =>
                cartItem.quantity <= 1
                  ? onRemove(product.id)
                  : onUpdateQuantity(product.id, cartItem.quantity - 1)
              }
            >−</button>
            <span className="qty-value">{cartItem.quantity}</span>
            <button
              className="qty-btn"
              onClick={() => onUpdateQuantity(product.id, cartItem.quantity + 1)}
            >+</button>
          </div>
        )}
      </div>
    </div>
  )
}

const CategoryCard = ({
  name,
  productCount,
  brandCount,
  filteredProducts,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onRemove,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const groupedByBrand: Record<string, Product[]> = {}
  filteredProducts.forEach((product) => {
    const brand = product.brand || 'Other'
    if (!groupedByBrand[brand]) groupedByBrand[brand] = []
    groupedByBrand[brand].push(product)
  })

  return (
    <div className={isOpen ? 'category-card open' : 'category-card'}>
      <div className="category-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="category-left">
          <div className="category-icon">
            <span>{getCategoryIcon(name)}</span>
          </div>
          <div className="category-info">
            <h2 className="category-name">{name}</h2>
            <div className="category-meta">
              <span className="meta-products">{productCount} Products</span>
              <span className="meta-divider">·</span>
              <span className="meta-brands">in {brandCount} brands</span>
            </div>
          </div>
        </div>
        <div className={isOpen ? 'category-chevron rotated' : 'category-chevron'}>›</div>
      </div>

      {isOpen && (
        <div className="category-body">
          {filteredProducts.length === 0 ? (
            <p className="category-placeholder">No products found.</p>
          ) : (
            <div className="brands-list">
              {Object.entries(groupedByBrand).map(([brand, brandProducts]) => (
                <div key={brand} className="brand-group">
                  <div className="brand-header">
                    <span className="brand-name">{brand}</span>
                    <span className="brand-count">
                      {brandProducts.length} product{brandProducts.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="brand-products">
                    {brandProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        cartItems={cartItems}
                        onAddToCart={onAddToCart}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemove}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CategoryCard