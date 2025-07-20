import Image from "next/image";
import { buscarCasaLeyPorNombre } from "@/lib/supers/casa-ley";
import { ProductosCasaLeyTypes } from "@/types/productosCasaLey";
import TarjetaProducto from "@/components/TarjetaProducto";

export default async function Home() {
    const prueba: ProductosCasaLeyTypes = await buscarCasaLeyPorNombre();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Productos Casa Ley
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Encuentra los mejores productos al mejor precio
                    </p>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Información de resultados */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Mostrando <span className="font-semibold">{prueba.products?.length || 0}</span> productos
                    </p>
                </div>

                {/* Grid de productos */}
                {prueba.products && prueba.products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {prueba.products.map(producto => (
                            <TarjetaProducto 
                                key={producto.Articulo} 
                                producto={producto} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No se encontraron productos
                        </h3>
                        <p className="text-gray-500">
                            Intenta con una búsqueda diferente
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
