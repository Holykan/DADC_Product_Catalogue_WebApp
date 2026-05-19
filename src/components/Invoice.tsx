import './Invoice.css'
import type { CartItem } from './Cart'

type Props = {
  items: CartItem[]
  customerName: string
  invoiceNumber: string
  date: string
}

const Invoice = ({ items, customerName, invoiceNumber, date }: Props) => {
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <div className="invoice">
      {/* Header */}
      <div className="invoice-header">
        <img src="/dadc_logo.webp" alt="DADC Logo" className="invoice-logo" />
        <div className="invoice-meta">
          <p className="invoice-number">Invoice #{invoiceNumber}</p>
          <p className="invoice-date">Date: {date}</p>
        </div>
      </div>

      <div className="invoice-divider" />

      {/* Bill to */}
      <div className="invoice-bill-to">
        <p className="invoice-bill-label">Bill To</p>
        <p className="invoice-bill-name">
          {customerName || 'Valued Customer'}
        </p>
      </div>

      {/* Table */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th className="col-name">Item Description</th>
            <th className="col-qty">Qty</th>
            <th className="col-price">Unit Price</th>
            <th className="col-subtotal">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.product.id}>
              <td className="col-name">
                <p className="invoice-item-name">{item.product.name}</p>
                <p className="invoice-item-meta">
                  {item.product.brand} · #{item.product.code}
                </p>
              </td>
              <td className="col-qty">{item.quantity}</td>
              <td className="col-price">
                GH₵ {Number(item.product.price).toFixed(2)}
              </td>
              <td className="col-subtotal">
                GH₵ {(item.product.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <div className="invoice-total-row">
        <span className="invoice-total-label">Total Amount</span>
        <span className="invoice-total-amount">
          GH₵ {total.toFixed(2)}
        </span>
      </div>

      <div className="invoice-divider" />

      {/* Footer */}
      <div className="invoice-footer">
        <p>Thank you for your business!</p>
        <p>DADC Price List © 2026 · All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Invoice