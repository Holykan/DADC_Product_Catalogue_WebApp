import './ProductGrid.css'
import { useState } from 'react'
import type { CartItem } from './Cart'

type Product = {
  id: number
  code: number
  name: string
  price: number
  brand: string
  category: string
  subcategory: string
  country: string
  image_url: string
  featured: boolean
  featured_order: number
}

type Props = {
  products: Product[]
  cartItems: CartItem[]
  onAddToCart: (product: Product) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
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
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)
    const val = parseInt(raw)
    if (!isNaN(val) && val > 0) {
      onUpdateQuantity(product.id, val)
    }
  }

  const handleQtyBlur = () => {
    const val = parseInt(inputValue)
    if (isNaN(val) || val <= 0) {
      onUpdateQuantity(product.id, 1)
    }
    setInputValue('')
  }

  return (
    <div className="product-grid-card">
      <div className="product-grid-image-wrap">
        {product.image_url && !imgError ? (
          <>
            {!imgLoaded && <div className="product-grid-image-skeleton" />}
            <img
              src={product.image_url}
              alt={product.name}
              className={imgLoaded ? 'product-grid-image loaded' : 'product-grid-image'}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className="product-grid-no-image">🍾</div>
        )}
      </div>

      <div className="product-grid-info">
        <p className="product-grid-name">{product.name}</p>
        <p className="product-grid-country">{product.country}</p>
        <div className="product-grid-bottom">
          <span className="product-grid-price">
            GHS {Math.round(product.price).toLocaleString('en-GH')}
          </span>
          {!cartItem ? (
            <button
              className="product-grid-add-btn"
              onClick={() => onAddToCart(product)}
            >
              + Add
            </button>
          ) : (
            <div className="product-grid-qty">
              <button
                className="product-grid-qty-btn"
                onClick={() =>
                  cartItem.quantity <= 1
                    ? onRemove(product.id)
                    : onUpdateQuantity(product.id, cartItem.quantity - 1)
                }
              >−</button>
              <input
                className="product-grid-qty-value"
                type="number"
                min={1}
                value={inputValue !== '' ? inputValue : cartItem.quantity}
                onChange={handleQtyChange}
                onBlur={handleQtyBlur}
                onFocus={(e) => {
                  setInputValue(String(cartItem.quantity))
                  e.target.select()
                }}
              />
              <button
                className="product-grid-qty-btn"
                onClick={() => onUpdateQuantity(product.id, cartItem.quantity + 1)}
              >+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const SkeletonCard = () => (
  <div className="product-grid-card skeleton-card">
    <div className="skeleton-image" />
    <div className="skeleton-info">
      <div className="skeleton-line long" />
      <div className="skeleton-line short" />
      <div className="skeleton-line medium" />
    </div>
  </div>
)

const ProductGrid = ({
  products,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onRemove,
}: Props) => {
  return (
    <div className="product-grid-wrapper">
      {products.length === 0 ? (
        <div className="product-grid-empty">
          <p>🔍</p>
          <p>No products match your search</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
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
      )}
    </div>
  )
}

export { SkeletonCard }
export default ProductGrid