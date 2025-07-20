"use client"

import { buscarWalmartPorNombre } from "@/lib/supers/walmart"
import { ProductosWalmartTypes, WalmartProduct } from "@/types/productosWalmart"
import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"

export default function WalmartPage() {
  const [productos, setProductos] = useState<ProductosWalmartTypes | null>(null)
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [loading, setLoading] = useState(false)

  const buscarProductos = async (termino: string) => {
    setLoading(true)
    try {
      const resultado = await buscarWalmartPorNombre(termino)
      setProductos(resultado)
    } catch (error) {
      console.error('Error buscando productos:', error)
    } finally {
      setLoading(false)
    }
  }

  const limpiarBusqueda = () => {
    setTerminoBusqueda("")
    buscarProductos("")
  }

  useEffect(() => {
    buscarProductos("")
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Walmart</h1>
                <p className="text-gray-600 mt-1">Productos y ofertas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos en Walmart..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && buscarProductos(terminoBusqueda)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
              {terminoBusqueda && (
                <button
                  onClick={limpiarBusqueda}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => buscarProductos(terminoBusqueda)}
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Buscando productos...</p>
            </div>
          ) : (
            <>
              {/* Información de resultados */}
              {productos && (
                <div className="mb-6">
                  <p className="text-gray-600">
                    {productos.products.length > 0 
                      ? `Encontrados ${productos.products.length} productos`
                      : 'No se encontraron productos'
                    }
                  </p>
                </div>
              )}

              {/* Grid de productos */}
              {productos?.products && productos.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {productos.products.map((producto, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      {/* Imagen del producto */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        {producto.imagen ? (
                          <img 
                            src={producto.imagen} 
                            alt={producto.nombre}
                            className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <p className="text-sm">Sin imagen</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Contenido */}
                      <div className="p-4">
                        {/* Marca */}
                        {producto.marca && (
                          <p className="text-xs font-medium text-blue-600 mb-1">{producto.marca}</p>
                        )}

                        {/* Nombre del producto */}
                        <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight">
                          {producto.nombre}
                        </h3>

                        {/* Precios */}
                        <div className="mb-3">
                          {producto.precioOriginal && producto.precioOriginal > producto.precio ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-green-600">
                                ${producto.precio}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ${producto.precioOriginal}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-green-600">
                              ${producto.precio}
                            </span>
                          )}
                        </div>

                        {/* Descripción */}
                        {producto.descripcion && (
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                            {producto.descripcion}
                          </p>
                        )}

                        {/* Disponibilidad */}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            producto.disponible 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {producto.disponible ? 'Disponible' : 'No disponible'}
                          </span>
                          
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Ver más
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
                  <p className="text-gray-600">Intenta con otros términos de búsqueda.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 