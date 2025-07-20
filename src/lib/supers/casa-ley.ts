const CASA_LEY_BASE_URL = process.env.NEXT_PUBLIC_URL_LEY || 'https://serviciosapp.casaley.com.mx'

const body = {
  "register_no": "1086"
}

export async function buscarCasaLeyPorNombre(searchTerm: string = "", page: number = 1) {
  const bodyWithSearch = {
    ...body,
    "name": searchTerm,
    "page": page
  }
  
  const res = await fetch(`${CASA_LEY_BASE_URL}/rails/api/search_products_web`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyWithSearch),
  });
  
  return res.json();
}