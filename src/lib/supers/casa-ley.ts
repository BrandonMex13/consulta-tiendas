import { ProductosCasaLeyTypes } from '@/types/productosCasaLey';
import { getApiClient } from '../apiClient'
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';

const CasaLey = getApiClient('CasaLey')

const body = {
  "name": "prueba",
  "register_no": "1086"
}

export async function buscarCasaLeyPorNombre() {
  const res = await CasaLey.post(`/rails/api/search_products_web`, body);
  return res.data;
}