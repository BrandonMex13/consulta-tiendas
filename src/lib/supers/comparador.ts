import { buscarWalmartPorNombre } from './walmart'
import { Product } from '@/types/productosCasaLey'
import { WalmartProduct } from '@/types/productosWalmart'

export interface ComparacionInstantanea {
  productoOriginal: Product
  productoWalmart?: WalmartProduct
  mejorPrecio: 'Casa Ley' | 'Walmart' | 'Igual'
  ahorro?: number
  porcentajeAhorro?: number
  encontrado: boolean
}

export async function compararProductoInstantaneamente(productoCasaLey: Product): Promise<ComparacionInstantanea> {
  try {
    console.log(`🔍 Comparando "${productoCasaLey.artdesc}" con precios reales de Walmart...`)
    
    // Extraer términos de búsqueda del producto de Casa Ley
    const terminosBusqueda = extraerTerminosBusqueda(productoCasaLey.artdesc)
    console.log(`📝 Buscando: "${terminosBusqueda}"`)
    
    // Buscar en Walmart (datos reales)
    const resultadoWalmart = await buscarWalmartPorNombre(terminosBusqueda)
    console.log(`🛒 Productos encontrados en Walmart: ${resultadoWalmart.products.length}`)
    
    // Mostrar productos encontrados para debug
    if (resultadoWalmart.products.length > 0) {
      console.log('📋 Productos de Walmart encontrados:')
      resultadoWalmart.products.slice(0, 3).forEach((prod, index) => {
        console.log(`  ${index + 1}. ${prod.nombre} - $${prod.precio}`)
      })
    }
    
    // Encontrar el producto más similar
    const productoWalmart = encontrarProductoSimilar(productoCasaLey, resultadoWalmart.products)
    
    if (!productoWalmart) {
      console.log('❌ No se encontró producto similar en Walmart')
      return {
        productoOriginal: productoCasaLey,
        mejorPrecio: 'Casa Ley',
        encontrado: false
      }
    }
    
    console.log(`✅ Producto similar encontrado: ${productoWalmart.nombre} - $${productoWalmart.precio}`)
    
    // Calcular comparación
    const precioCasaLey = parseFloat(productoCasaLey.special_price || productoCasaLey.normal_price)
    const precioWalmart = productoWalmart.precio
    
    console.log(`💰 Comparación: Casa Ley $${precioCasaLey} vs Walmart $${precioWalmart}`)
    
    let mejorPrecio: 'Casa Ley' | 'Walmart' | 'Igual' = 'Igual'
    let ahorro = 0
    let porcentajeAhorro = 0
    
    if (precioCasaLey < precioWalmart) {
      mejorPrecio = 'Casa Ley'
      ahorro = precioWalmart - precioCasaLey
      porcentajeAhorro = (ahorro / precioWalmart) * 100
    } else if (precioWalmart < precioCasaLey) {
      mejorPrecio = 'Walmart'
      ahorro = precioCasaLey - precioWalmart
      porcentajeAhorro = (ahorro / precioCasaLey) * 100
    }
    
    console.log(`🏆 Resultado: ${mejorPrecio} es más barato. Ahorro: $${ahorro.toFixed(2)} (${porcentajeAhorro.toFixed(1)}%)`)
    
    return {
      productoOriginal: productoCasaLey,
      productoWalmart,
      mejorPrecio,
      ahorro,
      porcentajeAhorro,
      encontrado: true
    }
    
  } catch (error) {
    console.error('Error en comparación instantánea:', error)
    return {
      productoOriginal: productoCasaLey,
      mejorPrecio: 'Casa Ley',
      encontrado: false
    }
  }
}

function extraerTerminosBusqueda(nombreProducto: string): string {
  console.log(`🔤 Procesando: "${nombreProducto}"`)
  
  // Limpiar el nombre del producto para búsqueda
  let termino = nombreProducto
    .replace(/[^\w\s]/g, ' ') // Remover caracteres especiales
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim()
  
  // Remover palabras comunes que no ayudan en la búsqueda
  const palabrasComunes = [
    'de', 'la', 'el', 'y', 'con', 'sin', 'para', 'por', 'del', 'las', 'los',
    'kg', 'g', 'ml', 'l', 'pza', 'pzas', 'pkg', 'pack', 'caja', 'botella',
    'marca', 'producto', 'tipo', 'sabor', 'presentacion', 'tamaño'
  ]
  
  const palabras = termino.split(' ').filter(palabra => 
    palabra.length > 2 && !palabrasComunes.includes(palabra.toLowerCase())
  )
  
  // Si no hay palabras suficientes, usar el nombre original
  if (palabras.length < 2) {
    const resultado = nombreProducto.split(' ').slice(0, 3).join(' ')
    console.log(`⚠️ Usando: "${resultado}"`)
    return resultado
  }
  
  // Tomar las primeras 3-4 palabras más relevantes
  const resultado = palabras.slice(0, 4).join(' ')
  console.log(`✅ Término final: "${resultado}"`)
  return resultado
}

function encontrarProductoSimilar(productoCasaLey: Product, productosWalmart: WalmartProduct[]): WalmartProduct | undefined {
  if (productosWalmart.length === 0) {
    console.log('❌ No hay productos de Walmart para comparar')
    return undefined
  }
  
  const nombreCasaLey = productoCasaLey.artdesc.toLowerCase()
  const marcaCasaLey = productoCasaLey.Brand?.toLowerCase() || ''
  
  console.log(`🔍 Buscando similitud para: "${nombreCasaLey}" (marca: "${marcaCasaLey}")`)
  
  // Buscar por similitud de nombre y marca
  const productosConPuntuacion = productosWalmart.map(producto => {
    const nombreWalmart = producto.nombre.toLowerCase()
    const marcaWalmart = producto.marca?.toLowerCase() || ''
    
    let puntuacion = 0
    
    // Puntuación por coincidencia exacta de marca
    if (marcaCasaLey && marcaWalmart) {
      if (marcaCasaLey === marcaWalmart) {
        puntuacion += 100
        console.log(`🎯 Marca exacta: ${marcaCasaLey} (+100)`)
      } else if (marcaCasaLey.includes(marcaWalmart) || marcaWalmart.includes(marcaCasaLey)) {
        puntuacion += 50
        console.log(`🎯 Marca parcial: ${marcaCasaLey} ~ ${marcaWalmart} (+50)`)
      }
    }
    
    // Puntuación por palabras coincidentes en el nombre
    const palabrasCasaLey = nombreCasaLey.split(' ').filter(p => p.length > 2)
    const palabrasWalmart = nombreWalmart.split(' ').filter(p => p.length > 2)
    
    let palabrasCoincidentes = 0
    palabrasCasaLey.forEach(palabra => {
      if (palabrasWalmart.some(p => p.includes(palabra) || palabra.includes(p))) {
        palabrasCoincidentes++
      }
    })
    
    // Puntuación por palabras coincidentes
    puntuacion += palabrasCoincidentes * 15
    if (palabrasCoincidentes > 0) {
      console.log(`📝 Palabras coincidentes: ${palabrasCoincidentes} (+${palabrasCoincidentes * 15})`)
    }
    
    // Puntuación por coincidencia de palabras clave importantes
    const palabrasClave = ['leche', 'pan', 'huevo', 'arroz', 'aceite', 'coca', 'galleta', 'atun', 'lala', 'bimbo', 'oreo']
    palabrasClave.forEach(clave => {
      if (nombreCasaLey.includes(clave) && nombreWalmart.includes(clave)) {
        puntuacion += 25
        console.log(`🔑 Palabra clave: ${clave} (+25)`)
      }
    })
    
    // Puntuación por longitud similar del nombre
    const diferenciaLongitud = Math.abs(nombreCasaLey.length - nombreWalmart.length)
    if (diferenciaLongitud < 15) {
      puntuacion += 10
    }
    
    // Penalización por diferencias muy grandes
    if (diferenciaLongitud > 30) {
      puntuacion -= 20
    }
    
    console.log(`📊 ${producto.nombre}: ${puntuacion} puntos`)
    
    return { producto, puntuacion }
  })
  
  // Ordenar por puntuación y tomar el mejor
  productosConPuntuacion.sort((a, b) => b.puntuacion - a.puntuacion)
  
  console.log(`🏆 Mejor puntuación: ${productosConPuntuacion[0].puntuacion} para "${productosConPuntuacion[0].producto.nombre}"`)
  
  // Solo devolver si la puntuación es suficientemente alta
  if (productosConPuntuacion[0].puntuacion >= 10) {
    return productosConPuntuacion[0].producto
  }
  
  console.log(`❌ Puntuación insuficiente: ${productosConPuntuacion[0].puntuacion} < 10`)
  return undefined
} 