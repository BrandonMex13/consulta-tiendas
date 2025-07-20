import Image from "next/image";
import { buscarCasaLeyPorNombre } from "@/lib/supers/casa-ley";
import { ProductosCasaLeyTypes } from "@/types/productosCasaLey";


export default async function Home() {
    const  prueba: ProductosCasaLeyTypes = await buscarCasaLeyPorNombre();

    return (
        <div>
          <h1>Productos Casa Ley</h1>
          <ul>
            {prueba.products?.map(producto => (
              <li key={producto.Articulo}>
                {producto.Articulo} - ${producto.Articulo}
              </li>
            ))}
          </ul>
        </div>
      );
}
