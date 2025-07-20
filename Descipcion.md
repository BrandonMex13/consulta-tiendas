# Proyecto: ConsultaTiendas

## Descripcion
Se desea poder realizar busqueda de articulos en distintas tiendas de supermecado populares como lo son, Casa Ley, Walmart, Bodega Aurrera, etc. Con el proposito de encontrar entre ellas los distintos articulos disponibles y ver en cual de ellas esta mas barato.

## Querys a Casa Ley

### Consulta de articulos por nombre
~~~ JS
https://serviciosapp.casaley.com.mx/rails/api/search_products_web

Se Envia:
{
    "name": "exemplo",
    "register_no": "1086"
}

Retorna:
{
    "result": "true",
    "total_pages": 1,
    "products": [],
    "prices": [
        {
            "Articulo": "05224125",
            "upc": "7502214985003",
            "unitmeasure": "PZ",
            "artdesc": "Prueba de embarazo prudence 1 pz",
            "mixmatchcode": "3 X 2",
            "picture_name": "\\Images\\07502214985003\\07502214985003.1.jpg",
            "normal_price": "85",
            "artconpie": "1 PZ",
            "Brand": "Dkt De Mexico Sa De Cv",
            "picture_name2": "\\Images\\07502214985003\\07502214985003.2.jpg",
            "msi": "false",
            "productType": "1",
            "combo": null,
            "productscombo": null,
            "promocombo": "0",
            "descriptioncombo": null,
            "emarsyscategory": "FAR>FARMACIA>FARMACIA>OTC"
        }
    ],
    "available_brands": [],
    "available_contents": [],
    "suggested": ""
}
~~~