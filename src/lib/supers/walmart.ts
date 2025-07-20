import { WalmartScraper } from '../scrapers/walmart-scraper'
import { ProductosWalmartTypes } from '@/types/productosWalmart'

const scraper = new WalmartScraper()

export async function buscarWalmartPorNombre(termino: string = ""): Promise<ProductosWalmartTypes> {
  try {
    console.log(`🔍 Iniciando búsqueda real en Walmart: "${termino}"`)
    
    const productos = await scraper.buscarProducto(termino.trim())
    
    return {
      result: "true",
      total_pages: 1,
      products: productos,
      suggested: termino
    }
    
  } catch (error) {
    console.error('Error buscando en Walmart:', error)
    return {
      result: "false",
      total_pages: 0,
      products: [],
      suggested: termino
    }
  }
}
