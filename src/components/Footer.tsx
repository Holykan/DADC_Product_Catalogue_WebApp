import './Footer.css'

type Props = {
  cartCount: number
  onCartOpen: () => void
  cartOpen: boolean
}

const Footer = ({ cartCount, onCartOpen, cartOpen }: Props) => {
  return (
    <>
      <footer className="footer">
        <div className="footer-icons">
          <span className="footer-icon">🍷</span>
          <span className="footer-icon">🍺</span>
          <span className="footer-icon">🥂</span>
          <span className="footer-icon">🍸</span>
          <span className="footer-icon">📦</span>
          <span className="footer-icon">🛒</span>
          <span className="footer-icon">🍾</span>
          <span className="footer-icon">🥃</span>
        </div>

        <div className="footer-content">
          <img src="/dadc_logo.webp" alt="DADC Logo" className="footer-logo-img" />
          <p className="footer-tagline">
            A premium portfolio of wines, spirits, champagne, and lifestyle
            beverages curated for modern Ghana.
          </p>
          <p className="footer-copy">
            DADC PRICE LIST © 2026. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {!cartOpen && (
        <button className="cart-btn" title="View Cart" onClick={onCartOpen}>
          🛒
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </button>
      )}
    </>
  )
}

export default Footer