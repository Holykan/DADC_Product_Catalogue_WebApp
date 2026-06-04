export type Product = {
  id: number
  code: number
  name: string
  price: number
  brand: string
  category: string
  subcategory: string
  supplier: string
  country: string
  bottle_size_cl: number
  pack_size: number
  image_url: string
  featured: boolean
  featured_order: number
}

export type CartItem = {
  product: Product
  quantity: number
}