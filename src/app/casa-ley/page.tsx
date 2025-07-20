"use client"

import TarjetaProducto from "@/components/TarjetaProducto"
import { buscarCasaLeyPorNombre } from "@/lib/supers/casa-ley"
import { ProductosCasaLeyTypes, Product } from "@/types/productosCasaLey"
import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"

export default function CasaLeyPage() {
    const [productos, setProductos] = useState<ProductosCasaLeyTypes | null>(null)
    const [todosLosProductos, setTodosLosProductos] = useState<Product[]>([])
    const [productosFiltrados, setProductosFiltrados] = useState<Product[]>([])
    const [ordenamiento, setOrdenamiento] = useState("default")
    const [soloDescuentos, setSoloDescuentos] = useState(false)
    const [loading, setLoading] = useState(true)
    const [paginaActual, setPaginaActual] = useState(1)
    const [cargandoPagina, setCargandoPagina] = useState(false)
    const [cargandoTodos, setCargandoTodos] = useState(false)
    const [productosPorPagina] = useState(20)
    const [terminoBusqueda, setTerminoBusqueda] = useState("")
    const [busquedaActual, setBusquedaActual] = useState("")
    const [buscando, setBuscando] = useState(false)

    const cargarProductos = async (searchTerm: string = "", pagina: number = 1) => {
        try {
            setCargandoPagina(true)
            const data = await buscarCasaLeyPorNombre(searchTerm, pagina)
            setProductos(data)
            setPaginaActual(pagina)
            setBusquedaActual(searchTerm)
        } catch (error) {
            console.error("Error cargando productos:", error)
        } finally {
            setCargandoPagina(false)
            setLoading(false)
        }
    }

    const cargarTodosLosProductos = async (searchTerm: string) => {
        if (!productos?.total_pages) return
        
        try {
            setCargandoTodos(true)
            const todasLasPaginas = []
            
            // Cargar todas las páginas disponibles
            for (let pagina = 1; pagina <= productos.total_pages; pagina++) {
                const data = await buscarCasaLeyPorNombre(searchTerm, pagina)
                if (data.products) {
                    todasLasPaginas.push(...data.products)
                }
            }
            
            setTodosLosProductos(todasLasPaginas)
        } catch (error) {
            console.error("Error cargando todos los productos:", error)
        } finally {
            setCargandoTodos(false)
        }
    }

    const realizarBusqueda = async () => {
        if (!terminoBusqueda.trim()) return
        
        setBuscando(true)
        setPaginaActual(1)
        setSoloDescuentos(false)
        setOrdenamiento("default")
        setTodosLosProductos([])
        setProductosFiltrados([])
        
        await cargarProductos(terminoBusqueda.trim(), 1)
        setBuscando(false)
    }

    const limpiarBusqueda = () => {
        setTerminoBusqueda("")
        setBuscando(true)
        setPaginaActual(1)
        setSoloDescuentos(false)
        setOrdenamiento("default")
        setTodosLosProductos([])
        setProductosFiltrados([])
        
        cargarProductos("", 1).finally(() => setBuscando(false))
    }

    useEffect(() => {
        cargarProductos("", 1)
    }, [])

    // Cargar todos los productos cuando se detecta que hay filtros activos
    useEffect(() => {
        if (productos?.total_pages && productos.total_pages > 1 && (soloDescuentos || ordenamiento !== "default")) {
            cargarTodosLosProductos(busquedaActual)
        } else if (productos?.products) {
            setTodosLosProductos(productos.products)
        }
    }, [productos, soloDescuentos, ordenamiento, busquedaActual])

    // Aplicar filtros y paginación
    useEffect(() => {
        if (todosLosProductos.length === 0) return

        let productosTemp = [...todosLosProductos]

        // Filtrar por descuentos
        if (soloDescuentos) {
            productosTemp = productosTemp.filter(producto => 
                producto.special_price && 
                producto.special_price !== producto.normal_price
            )
        }

        // Ordenar productos
        switch (ordenamiento) {
            case "precio-asc":
                productosTemp.sort((a, b) => {
                    const precioA = parseFloat(a.special_price || a.normal_price)
                    const precioB = parseFloat(b.special_price || b.normal_price)
                    return precioA - precioB
                })
                break
            case "precio-desc":
                productosTemp.sort((a, b) => {
                    const precioA = parseFloat(a.special_price || a.normal_price)
                    const precioB = parseFloat(b.special_price || b.normal_price)
                    return precioB - precioA
                })
                break
            case "nombre-asc":
                productosTemp.sort((a, b) => a.artdesc.localeCompare(b.artdesc))
                break
            case "nombre-desc":
                productosTemp.sort((a, b) => b.artdesc.localeCompare(a.artdesc))
                break
            case "descuento":
                productosTemp.sort((a, b) => {
                    const descuentoA = a.special_price && a.special_price !== a.normal_price 
                        ? ((parseFloat(a.normal_price) - parseFloat(a.special_price)) / parseFloat(a.normal_price)) * 100
                        : 0
                    const descuentoB = b.special_price && b.special_price !== b.normal_price 
                        ? ((parseFloat(b.normal_price) - parseFloat(b.special_price)) / parseFloat(b.normal_price)) * 100
                        : 0
                    return descuentoB - descuentoA
                })
                break
            default:
                // Mantener orden original
                break
        }

        // Aplicar paginación
        const inicio = (paginaActual - 1) * productosPorPagina
        const fin = inicio + productosPorPagina
        const productosPaginados = productosTemp.slice(inicio, fin)
        
        setProductosFiltrados(productosPaginados)
    }, [todosLosProductos, ordenamiento, soloDescuentos, paginaActual, productosPorPagina])

    const cambiarPagina = (nuevaPagina: number) => {
        const totalPaginasFiltradas = Math.ceil(
            todosLosProductos.filter(producto => 
                !soloDescuentos || (producto.special_price && producto.special_price !== producto.normal_price)
            ).length / productosPorPagina
        )
        
        if (nuevaPagina < 1 || nuevaPagina > totalPaginasFiltradas) return
        setPaginaActual(nuevaPagina)
    }

    const generarBotonesPagina = () => {
        const productosFiltradosTotal = todosLosProductos.filter(producto => 
            !soloDescuentos || (producto.special_price && producto.special_price !== producto.normal_price)
        )
        const totalPaginas = Math.ceil(productosFiltradosTotal.length / productosPorPagina)
        
        if (totalPaginas <= 1) return []
        
        const botones = []
        
        // Botón "Anterior"
        botones.push(
            <button 
                key="prev"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual <= 1 || cargandoPagina}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
            </button>
        )

        // Botones de páginas
        const inicio = Math.max(1, paginaActual - 2)
        const fin = Math.min(totalPaginas, paginaActual + 2)

        if (inicio > 1) {
            botones.push(
                <button 
                    key="1"
                    onClick={() => cambiarPagina(1)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    1
                </button>
            )
            if (inicio > 2) {
                botones.push(
                    <span key="dots1" className="px-2 py-2 text-gray-500">...</span>
                )
            }
        }

        for (let i = inicio; i <= fin; i++) {
            botones.push(
                <button 
                    key={i}
                    onClick={() => cambiarPagina(i)}
                    className={`px-3 py-2 text-sm border rounded-lg ${
                        i === paginaActual 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {i}
                </button>
            )
        }

        if (fin < totalPaginas) {
            if (fin < totalPaginas - 1) {
                botones.push(
                    <span key="dots2" className="px-2 py-2 text-gray-500">...</span>
                )
            }
            botones.push(
                <button 
                    key={totalPaginas}
                    onClick={() => cambiarPagina(totalPaginas)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    {totalPaginas}
                </button>
            )
        }

        // Botón "Siguiente"
        botones.push(
            <button 
                key="next"
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual >= totalPaginas || cargandoPagina}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
                Siguiente
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        )

        return botones
    }

    const resetearFiltros = () => {
        setSoloDescuentos(false)
        setOrdenamiento("default")
        setPaginaActual(1)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando productos...</p>
                </div>
            </div>
        )
    }

    const productosFiltradosTotal = todosLosProductos.filter(producto => 
        !soloDescuentos || (producto.special_price && producto.special_price !== producto.normal_price)
    )
    const totalPaginasFiltradas = Math.ceil(productosFiltradosTotal.length / productosPorPagina)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Casa Ley
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Los mejores productos al mejor precio
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Barra de búsqueda */}
                <div className="mb-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={terminoBusqueda}
                                onChange={(e) => setTerminoBusqueda(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && realizarBusqueda()}
                                placeholder="Buscar productos en Casa Ley..."
                                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                {terminoBusqueda && (
                                    <button
                                        onClick={limpiarBusqueda}
                                        className="p-2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                                <button
                                    onClick={realizarBusqueda}
                                    disabled={!terminoBusqueda.trim() || buscando}
                                    className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {buscando ? 'Buscando...' : 'Buscar'}
                                </button>
                            </div>
                        </div>
                        
                        {/* Información de búsqueda actual */}
                        {busquedaActual !== "" && (
                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Búsqueda: <span className="font-medium text-gray-900">"{busquedaActual}"</span>
                                </p>
                                <button
                                    onClick={limpiarBusqueda}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Ver todos los productos
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Información de resultados */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-gray-600">
                            Mostrando <span className="font-semibold text-gray-900">{productosFiltrados.length}</span> de <span className="font-semibold text-gray-900">{productosFiltradosTotal.length}</span> productos
                            {productos?.total_pages && productos.total_pages > 1 && (
                                <span className="text-gray-500"> (de {productos.products?.length || 0} totales)</span>
                            )}
                        </p>
                        {totalPaginasFiltradas > 1 && (
                            <p className="text-sm text-gray-500 mt-1">
                                Página {paginaActual} de {totalPaginasFiltradas}
                            </p>
                        )}
                    </div>
                    
                    {/* Filtros */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {/* Filtro de descuentos */}
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={soloDescuentos}
                                onChange={(e) => {
                                    setSoloDescuentos(e.target.checked)
                                    setPaginaActual(1) // Resetear a primera página
                                }}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            Solo con descuento
                        </label>

                        {/* Selector de ordenamiento */}
                        <select 
                            value={ordenamiento}
                            onChange={(e) => {
                                setOrdenamiento(e.target.value)
                                setPaginaActual(1) // Resetear a primera página
                            }}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="default">Ordenar por</option>
                            <option value="precio-asc">Precio: Menor a Mayor</option>
                            <option value="precio-desc">Precio: Mayor a Menor</option>
                            <option value="nombre-asc">Nombre A-Z</option>
                            <option value="nombre-desc">Nombre Z-A</option>
                            <option value="descuento">Mayor Descuento</option>
                        </select>

                        {/* Botón de reset */}
                        {(soloDescuentos || ordenamiento !== "default") && (
                            <button 
                                onClick={resetearFiltros}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* Indicadores de carga */}
                {cargandoTodos && (
                    <div className="mb-6 text-center">
                        <div className="inline-flex items-center gap-2 text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm">Cargando todos los productos para filtrar...</span>
                        </div>
                    </div>
                )}

                {cargandoPagina && (
                    <div className="mb-6 text-center">
                        <div className="inline-flex items-center gap-2 text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm">Cargando página {paginaActual}...</span>
                        </div>
                    </div>
                )}

                {/* Grid de productos */}
                {productosFiltrados.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {productosFiltrados.map(producto => (
                            <TarjetaProducto 
                                key={producto.upc} 
                                producto={producto}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-6">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No se encontraron productos
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {busquedaActual !== "" 
                                ? `No se encontraron productos para "${busquedaActual}".`
                                : soloDescuentos 
                                    ? "No hay productos con descuento disponibles en este momento."
                                    : "No hay productos disponibles en Casa Ley en este momento."
                            }
                        </p>
                        {(soloDescuentos || ordenamiento !== "default" || busquedaActual !== "") && (
                            <button 
                                onClick={resetearFiltros}
                                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                )}

                {/* Paginación funcional */}
                {totalPaginasFiltradas > 1 && (
                    <div className="mt-12 flex justify-center">
                        <nav className="flex items-center gap-2 flex-wrap justify-center">
                            {generarBotonesPagina()}
                        </nav>
                    </div>
                )}
            </div>
        </div>
    )
}