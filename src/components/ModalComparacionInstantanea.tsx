"use client"

import { useState, useEffect } from 'react'
import { X, TrendingDown, Minus, Loader2 } from 'lucide-react'
import { Product } from '@/types/productosCasaLey'
import { compararProductoInstantaneamente, ComparacionInstantanea } from '@/lib/supers/comparador'

interface Props {
  producto: Product
  isOpen: boolean
  onClose: () => void
}

export default function ModalComparacionInstantanea({ producto, isOpen, onClose }: Props) {
  const [comparacion, setComparacion] = useState<ComparacionInstantanea | null>(null)
  const [loading, setLoading] = useState(false)

  const realizarComparacion = async () => {
    if (!isOpen) return
    
    setLoading(true)
    setComparacion(null)
    
    try {
      const resultado = await compararProductoInstantaneamente(producto)
      setComparacion(resultado)
    } catch (error) {
      console.error('Error en comparación:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && !comparacion && !loading) {
      realizarComparacion()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Comparación Instantánea</h2>
            <p className="text-sm text-gray-600 mt-1">Comparando precios entre supermercados</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Producto original */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Producto de Casa Ley</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-4">
                {producto.picture_name && (
                  <img 
                    src={`https://serviciosapp.casaley.com.mx/rails/${producto.picture_name}`}
                    alt={producto.artdesc}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{producto.artdesc}</h4>
                  {producto.Brand && <p className="text-sm text-blue-600">{producto.Brand}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xl font-bold text-green-600">
                      ${producto.special_price || producto.normal_price}
                    </span>
                    {producto.special_price && producto.special_price !== producto.normal_price && (
                      <span className="text-sm text-gray-500 line-through">${producto.normal_price}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estado de carga */}
          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Buscando en Walmart...</p>
            </div>
          )}

          {/* Resultado de comparación */}
          {comparacion && !loading && (
            <div>
              {comparacion.encontrado ? (
                <>
                  {/* Producto de Walmart encontrado */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Producto encontrado en Walmart</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        {comparacion.productoWalmart?.imagen && (
                          <img 
                            src={comparacion.productoWalmart.imagen}
                            alt={comparacion.productoWalmart.nombre}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{comparacion.productoWalmart?.nombre}</h4>
                          {comparacion.productoWalmart?.marca && (
                            <p className="text-sm text-green-600">{comparacion.productoWalmart.marca}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xl font-bold text-green-600">${comparacion.productoWalmart?.precio}</span>
                            {comparacion.productoWalmart?.precioOriginal && comparacion.productoWalmart.precioOriginal > comparacion.productoWalmart.precio && (
                              <span className="text-sm text-gray-500 line-through">${comparacion.productoWalmart.precioOriginal}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resultado de la comparación */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Resultado de la comparación</h3>
                    
                    <div className="flex items-center gap-3 mb-4">
                      {comparacion.mejorPrecio === 'Casa Ley' ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <TrendingDown className="w-5 h-5" />
                          <span className="font-semibold">¡Mejor precio en Casa Ley!</span>
                        </div>
                      ) : comparacion.mejorPrecio === 'Walmart' ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <TrendingDown className="w-5 h-5" />
                          <span className="font-semibold">¡Mejor precio en Walmart!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Minus className="w-5 h-5" />
                          <span className="font-semibold">Precios iguales</span>
                        </div>
                      )}
                    </div>

                    {comparacion.ahorro && comparacion.ahorro > 0 && (
                      <div className="bg-white rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Ahorro:</span>
                          <span className="text-xl font-bold text-green-600">${comparacion.ahorro.toFixed(2)}</span>
                        </div>
                        {comparacion.porcentajeAhorro && (
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-gray-600">Porcentaje:</span>
                            <span className="text-lg font-semibold text-green-600">{comparacion.porcentajeAhorro.toFixed(1)}%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Producto no encontrado en Walmart</h3>
                  <p className="text-gray-600">No se encontró un producto similar en Walmart para comparar.</p>
                </div>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 mt-6 pt-6 border-t">
            <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              Cerrar
            </button>
            {comparacion && comparacion.encontrado && (
              <button
                onClick={() => window.open('/walmart', '_blank')}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Ver en Walmart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 