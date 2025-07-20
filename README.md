# Consulta Tiendas - Comparador de Precios

Una aplicación web para comparar precios de productos entre supermercados como Casa Ley y Walmart.

## 🚀 Características

- **Comparación Instantánea**: Compara precios entre Casa Ley y Walmart al instante
- **Búsqueda Inteligente**: Encuentra productos similares automáticamente
- **Interfaz Moderna**: Diseño limpio y responsivo con Tailwind CSS
- **Productos Simulados**: Datos de ejemplo para desarrollo y demostración

## 🛠️ Tecnologías

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Iconos

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── casa-ley/          # Página de productos Casa Ley
│   ├── walmart/           # Página de productos Walmart
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Estilos globales
├── components/
│   ├── TarjetaProducto.tsx                    # Tarjeta de producto Casa Ley
│   └── ModalComparacionInstantanea.tsx        # Modal de comparación
├── lib/
│   ├── supers/
│   │   ├── casa-ley.ts    # API Casa Ley
│   │   ├── walmart.ts     # API Walmart
│   │   └── comparador.ts  # Lógica de comparación
│   └── scrapers/
│       └── walmart-scraper.ts  # Scraper de Walmart (simulado)
└── types/
    ├── productosCasaLey.ts  # Tipos Casa Ley
    └── productosWalmart.ts  # Tipos Walmart
```

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd consulta-tiendas
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📱 Uso

### Comparación Instantánea

1. **Navega a Casa Ley** (`/casa-ley`)
2. **Haz clic en el botón de comparación** (balanza) en cualquier producto
3. **El sistema automáticamente:**
   - Busca el mismo producto en Walmart
   - Compara los precios
   - Te muestra cuál es más barato
   - Calcula cuánto ahorras

### Navegación

- **Casa Ley**: `/casa-ley` - Productos de Casa Ley
- **Walmart**: `/walmart` - Productos de Walmart (simulados)

## 🔧 Funcionalidades

### Comparación Inteligente
- **Búsqueda automática** de productos similares
- **Algoritmo de similitud** basado en marca y nombre
- **Cálculo de ahorro** en pesos y porcentaje
- **Resultado instantáneo** con modal informativo

### Productos Simulados
- **8 productos de ejemplo** en Walmart
- **Filtrado inteligente** por término de búsqueda
- **Datos realistas** para demostración

## 🎯 Ejemplos de Uso

### Para "Leche Lala Entera 1L":
- Busca: "leche" o "lala"
- Encuentra: "Leche Lala Entera 1L" en Walmart
- Compara: $25.90 vs $25.90 (o el precio que tenga)

### Para "Pan Bimbo Integral":
- Busca: "pan" o "bimbo"
- Encuentra: "Pan Bimbo Integral 680g" en Walmart
- Compara: Precios y te dice cuál es más barato

## 📊 Algoritmo de Comparación

El sistema utiliza un algoritmo de puntuación para encontrar productos similares:

1. **Coincidencia de marca** (100 puntos si es exacta, 50 si es parcial)
2. **Palabras coincidentes** (15 puntos por palabra)
3. **Palabras clave** (25 puntos por palabra clave)
4. **Longitud similar** (10 puntos si la diferencia es < 15 caracteres)
5. **Penalización** (-20 puntos si la diferencia es > 30 caracteres)

## 🚀 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construcción
npm run start        # Producción
npm run lint         # Linting
```

## 📝 Notas

- **Solo para desarrollo/educación**: Los productos de Walmart son simulados
- **No scraping real**: Por respeto a los términos de servicio
- **Datos de ejemplo**: Para demostrar la funcionalidad

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
