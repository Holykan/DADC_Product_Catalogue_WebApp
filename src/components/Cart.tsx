import './Cart.css'
import { useState } from 'react'

type Product = {
  id: number
  code: number
  name: string
  price: number
  brand: string
  category: string
  bottle_size_cl: number
  pack_size: number
}

export type CartItem = {
  product: Product
  quantity: number
}

type Props = {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

const generateOrderNumber = () => {
  const date = new Date()
  const dateStr =
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0')
  const rand = Math.floor(Math.random() * 9000) + 1000
  return 'ORD-' + dateStr + '-' + rand
}

const getDate = () => {
  return new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }: Props) => {
  const [customerName, setCustomerName] = useState('')
  const [orderNumber] = useState(generateOrderNumber)
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // ── Logo top left ──
    const img = new Image()
    img.src = '/dadc_logo.png'
    await new Promise((resolve) => { img.onload = resolve })
    const imgWidth = 45
    const imgHeight = (img.height * imgWidth) / img.width
    pdf.addImage(img, 'WEBP', 14, 12, imgWidth, imgHeight)

    // ── ORDER REQUEST top right ──
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(15, 42, 74)
    pdf.text('ORDER REQUEST', pageWidth - 14, 20, { align: 'right' })

    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text(orderNumber, pageWidth - 14, 28, { align: 'right' })
    pdf.text(getDate(), pageWidth - 14, 34, { align: 'right' })

    // ── Divider ──
    let y = Math.max(12 + imgHeight, 40) + 6
    pdf.setDrawColor(220, 220, 220)
    pdf.setLineWidth(0.5)
    pdf.line(14, y, pageWidth - 14, y)
    y += 8

    // ── Bill To ──
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(15, 42, 74)
    pdf.text('BILL TO:', 14, y)
    y += 6

    pdf.setFontSize(13)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(15, 42, 74)
    pdf.text(customerName, 14, y)
    y += 10

    // ── Items Table ──
    const rows = items.map((item) => [
      String(item.product.code),
      item.product.name +
        (item.product.bottle_size_cl ? ' - ' + item.product.bottle_size_cl : ''),
      String(item.quantity),
      Number(item.product.price).toFixed(2),
      (item.product.price * item.quantity).toFixed(2),
    ])

    autoTable(pdf, {
      startY: y,
      head: [['Item Code', 'Description', 'Qty', 'Unit Price (GHS)', 'Total (GHS)']],
      body: rows,
      headStyles: {
        fillColor: [15, 42, 74],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
        cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
      },
      columnStyles: {
        0: { cellWidth: 25, fontSize: 8, textColor: [80, 80, 80] },
        1: { cellWidth: 'auto', fontSize: 8, textColor: [50, 65, 85] },
        2: { cellWidth: 15, halign: 'center', fontSize: 8 },
        3: { cellWidth: 35, halign: 'right', fontSize: 8 },
        4: {
          cellWidth: 35,
          halign: 'right',
          fontStyle: 'bold',
          fontSize: 8,
          textColor: [220, 50, 50],
        },
      },
      bodyStyles: {
        cellPadding: { top: 3, bottom: 3, left: 5, right: 5 },
        textColor: [50, 65, 85],
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: 14, right: 14 },
      theme: 'plain',
    })

    y = (pdf as any).lastAutoTable.finalY + 4

    // ── Divider ──
    pdf.setDrawColor(220, 220, 220)
    pdf.setLineWidth(0.5)
    pdf.line(14, y, pageWidth - 14, y)
    y += 8

    // ── Total ──
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(15, 42, 74)
    pdf.text('TOTAL:', pageWidth - 14 - 50, y)
    pdf.setTextColor(220, 50, 50)
    pdf.text('GHS ' + total.toFixed(2), pageWidth - 14, y, { align: 'right' })
    y += 16

    // ── Footer ──
    pdf.setDrawColor(220, 220, 220)
    pdf.setLineWidth(0.5)
    pdf.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20)

    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(15, 42, 74)
    pdf.text('DADC', 14, pageHeight - 13)

    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(150, 150, 150)
    pdf.text('Page 1', pageWidth - 14, pageHeight - 13, { align: 'right' })

    // ── Generate and share ──
    const pdfBlob = pdf.output('blob')
    const fileName = orderNumber + '.pdf'
    const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' })

    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      try {
        await navigator.share({
          title: 'Order Request ' + orderNumber,
          text: 'Please find attached your order request.',
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

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose} />}

      <div className={isOpen ? 'cart-panel open' : 'cart-panel'}>

        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-left">
            <h2 className="cart-title">🛒 Your Order</h2>
            <span className="cart-count">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        {/* Customer name */}
        <div className="cart-customer">
          <label className="cart-label">Customer Name *</label>
          <input
            type="text"
            className={customerName.trim() ? 'cart-customer-input' : 'cart-customer-input empty'}
            placeholder="Enter customer name..."
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        {/* Items */}
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>🛒</p>
              <p>Your cart is empty</p>
              <p>Add products from the catalogue</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="cart-item">
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.product.name}</p>
                  <p className="cart-item-meta">
                    #{item.product.code} · {item.product.brand}
                  </p>
                  <p className="cart-item-price">
                    GHS {Number(item.product.price).toFixed(2)} each
                  </p>
                </div>
                <div className="cart-item-right">
                  <div className="cart-qty-control">
                    <button
                      className="cart-qty-btn"
                      onClick={() =>
                        item.quantity <= 1
                          ? onRemove(item.product.id)
                          : onUpdateQuantity(item.product.id, item.quantity - 1)
                      }
                    >−</button>
                    <span className="cart-qty-value">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() =>
                        onUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                    >+</button>
                  </div>
                  <p className="cart-item-subtotal">
                    GHS {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="cart-remove"
                    onClick={() => onRemove(item.product.id)}
                  >🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="cart-total-amount">
                GHS {total.toFixed(2)}
              </span>
            </div>
            {!customerName.trim() && (
              <p className="cart-name-warning">
                ⚠️ Please enter a customer name before exporting
              </p>
            )}
            <button
              className={customerName.trim() ? 'cart-export-btn' : 'cart-export-btn disabled'}
              onClick={customerName.trim() ? handleExportPDF : undefined}
            >
              📄 Export Order Request
            </button>
            <button
              className="cart-clear-btn"
              onClick={() => items.forEach((i) => onRemove(i.product.id))}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Cart