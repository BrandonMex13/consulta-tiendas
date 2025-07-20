export interface ProductosWalmartTypes {
    result: string
    total_pages: number
    products: WalmartProduct[]
    suggested?: string
}

export interface WalmartProduct {
    nombre: string
    precio: number
    precioOriginal?: number
    disponible: boolean
    url: string
    imagen?: string
    marca?: string
    descripcion?: string
    id?: string
    categoria?: string
    sku?: string
} 