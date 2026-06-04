import './SearchBar.css'
import { ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react'
import type { Filters } from '../App'

type Props = {
  totalItems: number
  filters: Filters
  onFilterChange: (filters: Filters) => void
  categories: string[]
  brands: string[]
  countries: string[]
  subcategories: string[]
}

const SearchBar = ({
  totalItems,
  filters,
  onFilterChange,
  categories,
  brands,
  countries,
  subcategories,
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

  const handleSubcategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, subcategory: e.target.value })
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

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.brand ||
    filters.country ||
    filters.subcategory ||
    filters.priceOrder

  const clearAll = () => {
    onFilterChange({
      search: '',
      category: '',
      brand: '',
      country: '',
      subcategory: '',
      priceOrder: null,
    })
  }

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
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters - all in one grid row */}
        <div className="filters">

          {/* Category */}
          <div className="filter-select-wrap">
            <select
              className={filters.category ? 'filter-select active' : 'filter-select'}
              value={filters.category}
              onChange={handleCategory}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {filters.category && (
              <button
                className="filter-clear-btn"
                onClick={() => onFilterChange({ ...filters, category: '' })}
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Brand */}
          <div className="filter-select-wrap">
            <select
              className={filters.brand ? 'filter-select active' : 'filter-select'}
              value={filters.brand}
              onChange={handleBrand}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            {filters.brand && (
              <button
                className="filter-clear-btn"
                onClick={() => onFilterChange({ ...filters, brand: '' })}
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Country */}
          <div className="filter-select-wrap">
            <select
              className={filters.country ? 'filter-select active' : 'filter-select'}
              value={filters.country}
              onChange={handleCountry}
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {filters.country && (
              <button
                className="filter-clear-btn"
                onClick={() => onFilterChange({ ...filters, country: '' })}
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Subcategory */}
          <div className="filter-select-wrap">
            <select
              className={filters.subcategory ? 'filter-select active' : 'filter-select'}
              value={filters.subcategory}
              onChange={handleSubcategory}
            >
              <option value="">All Subcategories</option>
              {subcategories.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            {filters.subcategory && (
              <button
                className="filter-clear-btn"
                onClick={() => onFilterChange({ ...filters, subcategory: '' })}
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Price */}
          <button
            className={filters.priceOrder ? 'filter-btn active' : 'filter-btn'}
            onClick={handlePrice}
          >
            <PriceIcon size={14} />
            Price
          </button>

          {/* Clear All */}
          {hasActiveFilters && (
            <button className="clear-all-btn" onClick={clearAll}>
              <X size={13} /> Clear All
            </button>
          )}

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