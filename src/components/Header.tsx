import { useState } from 'react'
import './Header.css'
import {
  HelpCircle,
  Moon,
  Bell,
  MoreHorizontal,
  Download,
} from 'lucide-react'

type Props = {
  onDownloadPDF: () => void
}

const Header = ({ onDownloadPDF }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <img src="/dadc_logo.webp" alt="Company Logo" className="logo-img" />
        </div>

        <div className="header-divider"></div>

        <div className="header-title-block">
          <h1 className="header-title">Price List 2026</h1>
        </div>
      </div>

      <div className="header-right">

        {/* Desktop icons — hidden on mobile */}
        <div className="desktop-icons">
          <button className="icon-btn" title="Help">
            <HelpCircle size={18} />
          </button>
          <button className="icon-btn" title="Dark mode">
            <Moon size={18} />
          </button>
          <button className="icon-btn" title="Notifications">
            <Bell size={18} />
          </button>
        </div>

        {/* Three dots menu — mobile only */}
        <div className="menu-wrapper">
          <button
            className="icon-btn dots-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            title="More options"
          >
            <MoreHorizontal size={20} />
          </button>
          {menuOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item">
                <HelpCircle size={15} /> Help
              </button>
              <button className="dropdown-item">
                <Moon size={15} /> Dark Mode
              </button>
              <button className="dropdown-item">
                <Bell size={15} /> Notifications
              </button>
            </div>
          )}
        </div>

        <button className="download-btn" onClick={onDownloadPDF}>
          <Download size={16} />
          <span className="download-text">Download PDF</span>
        </button>

      </div>
    </header>
  )
}

export default Header