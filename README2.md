consulta-tiendas/
├── app/                     # Rutas y páginas (Next.js App Router)
│   ├── layout.tsx          # Layout general (header, footer, etc)
│   ├── page.tsx            # Página principal
│   └── precios/
│       └── page.tsx        # Vista para comparar precios
│
├── components/             # Componentes reutilizables (UI)
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   ├── StoreBadge.tsx
│   └── PriceTable.tsx
│
├── lib/                    # Lógica de negocio y acceso a APIs
│   ├── apiClient.ts        # Cliente Axios
│   └── supers/
│       ├── walmart.ts      # API wrapper Walmart
│       ├── soriana.ts      # API wrapper Soriana
│       └── normalizer.ts   # Funciones para estandarizar respuestas
│
├── types/                  # Tipos TypeScript compartidos
│   └── producto.ts
│
├── public/                 # Imágenes públicas o assets
├── styles/                 # Tailwind o CSS Modules (si usas)
├── .env.local              # Variables de entorno (API keys, URLs)
├── next.config.js
└── tsconfig.json           # Si usas TypeScript (altamente recomendado)
