"use client"

import { Product, ProductosCasaLeyTypes } from "@/types/productosCasaLey"
import { ShoppingCart, Star, Tag, Heart, Scale } from "lucide-react"
import { useState } from "react"
import ModalComparacionInstantanea from "./ModalComparacionInstantanea"

type Props = {
  producto: Product
}

export default function TarjetaProducto({ producto }: Props) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const hasSpecialPrice = producto.special_price && producto.special_price !== producto.normal_price
  const discountPercentage = hasSpecialPrice 
    ? Math.round(((parseFloat(producto.normal_price) - parseFloat(producto.special_price!)) / parseFloat(producto.normal_price)) * 100)
    : 0

  const abrirComparacion = () => {
    setModalAbierto(true)
  }

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
        {/* Badge de descuento */}
        {hasSpecialPrice && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Tag className="w-3 h-3" />
              -{discountPercentage}%
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {/* Botón de comparación instantánea */}
          <button 
            onClick={abrirComparacion}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            title="Comparar con Walmart"
          >
            <Scale className="w-4 h-4" />
          </button>

          {/* Botón de favorito */}
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-red-50 transition-colors duration-200">
            <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors duration-200" />
          </button>
        </div>

        {/* Imagen del producto */}
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {producto.picture_name ? (
            <img 
              src={`https://serviciosapp.casaley.com.mx/rails/${producto.picture_name}`} 
              alt={producto.artdesc}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement
                target.style.display = 'none'
                const fallback = target.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
          ) : null}
          <div className="absolute inset-0 flex items-center justify-center text-gray-400" style={{ display: producto.picture_name ? 'none' : 'flex' }}>
            <div className="text-center">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Sin imagen</p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          {/* Marca */}
          {producto.Brand && (
            <p className="text-xs font-medium text-blue-600 mb-1">{producto.Brand}</p>
          )}

          {/* Nombre del producto */}
          <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight">
            {producto.artdesc}
          </h3>

          {/* Precios */}
          <div className="mb-3">
            {hasSpecialPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                  ${producto.special_price}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${producto.normal_price}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-green-600">
                ${producto.normal_price}
              </span>
            )}
          </div>

          {/* Información adicional */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>{producto.unitmeasure}</span>
            {producto.msi && producto.msi !== "0" && (
              <span className="text-blue-600 font-medium">
                {producto.msi} MSI
              </span>
            )}
          </div>

          {/* Botón de acción */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group/btn">
            <ShoppingCart className="w-4 h-4" />
            <span>Agregar al carrito</span>
          </button>
        </div>
      </div>

      {/* Modal de comparación instantánea */}
      <ModalComparacionInstantanea
        producto={producto}
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
      />
    </>
  )
}