import './Header.css'
import { Bell, LayoutGrid, List } from 'lucide-react'

type Props = {
  onDownloadPDF: () => void
  viewMode: 'grid' | 'list'
  onToggleView: () => void
}

const Header = ({ viewMode, onToggleView }: Props) => {
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

        {/* View toggle */}
        <div className="view-toggle">
          <button
            className={viewMode === 'grid' ? 'view-btn active' : 'view-btn'}
            onClick={() => viewMode !== 'grid' && onToggleView()}
            title="Grid View"
          >
            <LayoutGrid size={17} />
          </button>
          <button
            className={viewMode === 'list' ? 'view-btn active' : 'view-btn'}
            onClick={() => viewMode !== 'list' && onToggleView()}
            title="List View"
          >
            <List size={17} />
          </button>
        </div>

        <button className="icon-btn" title="Notifications">
          <Bell size={18} />
        </button>

      </div>
    </header>
  )
}

export default Header