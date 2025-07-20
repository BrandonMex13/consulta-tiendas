export interface ProductosCasaLeyTypes {
    result: string
    total_pages: number
    products: Product[]
    prices: any[]
    available_brands: any[]
    available_contents: any[]
    suggested: string
}

export interface Product {
    Articulo: string
    upc: string
    unitmeasure: string
    artdesc: string
    mixmatchcode?: string
    picture_name: string
    normal_price: string
    artconpie: string
    Brand: string
    picture_name2: string
    msi: string
    productType: string
    combo?: string
    productscombo?: string
    promocombo: string
    descriptioncombo?: string
    emarsyscategory: string
    special_price?: string
}
