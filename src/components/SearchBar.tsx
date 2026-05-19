import './SearchBar.css'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import type { Filters } from '../App'

type Props = {
  totalItems: number
  filters: Filters
  onFilterChange: (filters: Filters) => void
  categories: string[]
  brands: string[]
  countries: string[]
}

const SearchBar = ({
  totalItems,
  filters,
  onFilterChange,
  categories,
  brands,
  countries,
}: Props) => {

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value })
  }

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, category: e.target.value })
  }

  const handleBrand = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, brand: e.target.value })
  }

  const handleCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, country: e.target.value })
  }

  const handlePrice = () => {
    const next =
      filters.priceOrder === null ? 'asc' :
      filters.priceOrder === 'asc' ? 'desc' : null
    onFilterChange({ ...filters, priceOrder: next })
  }

  const PriceIcon =
    filters.priceOrder === 'asc' ? ArrowUp :
    filters.priceOrder === 'desc' ? ArrowDown :
    ArrowUpDown

  return (
    <div className="searchbar-wrapper">

      <div className="searchbar-inner">
        {/* Search Input */}
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by code, product, brand..."
            value={filters.search}
            onChange={handleSearch}
          />
          {filters.search && (
            <button
              className="search-clear"
              onClick={() => onFilterChange({ ...filters, search: '' })}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="filters">
          <select
            className="filter-select"
            value={filters.category}
            onChange={handleCategory}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.brand}
            onChange={handleBrand}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.country}
            onChange={handleCountry}
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          <button
            className={filters.priceOrder ? 'filter-btn active' : 'filter-btn'}
            onClick={handlePrice}
          >
            <PriceIcon size={14} />
            Price
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="results-count">
        Showing <strong>{totalItems}</strong> items
      </div>

    </div>
  )
}

export default SearchBar