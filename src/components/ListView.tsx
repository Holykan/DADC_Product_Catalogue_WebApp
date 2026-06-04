import './ListView.css'
import { useState } from 'react'
import type { Product, CartItem } from '../types'

type Props = {
  products: Product[]
  cartItems: CartItem[]
  onAddToCart: (product: Product) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

const ListRow = ({
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
    <div className="list-row">
      <div className="list-row-left">
        <div className="list-row-info">
          <p className="list-row-name">{product.name}</p>
          <p className="list-row-country">{product.country}</p>
        </div>
      </div>

      <div className="list-row-right">
        <span className="list-row-price">
          GHS {Math.round(product.price).toLocaleString('en-GH')}
        </span>
        {!cartItem ? (
          <button
            className="list-add-btn"
            onClick={() => onAddToCart(product)}
          >
            + Add
          </button>
        ) : (
          <div className="list-qty">
            <button
              className="list-qty-btn"
              onClick={() =>
                cartItem.quantity <= 1
                  ? onRemove(product.id)
                  : onUpdateQuantity(product.id, cartItem.quantity - 1)
              }
            >−</button>
            <input
              className="list-qty-value"
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
              className="list-qty-btn"
              onClick={() => onUpdateQuantity(product.id, cartItem.quantity + 1)}
            >+</button>
          </div>
        )}
      </div>
    </div>
  )
}

const ListView = ({
  products,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onRemove,
}: Props) => {
  return (
    <div className="list-wrapper">
      {products.length === 0 ? (
        <div className="list-empty">
          <p>🔍</p>
          <p>No products match your search</p>
        </div>
      ) : (
        <div className="list-container">
          <div className="list-header-row">
            <span>Product Name</span>
            <span>Country</span>
            <span>Price</span>
            <span>Add</span>
          </div>
          {products.map((product) => (
            <ListRow
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

export default ListView