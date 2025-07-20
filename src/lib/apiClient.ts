import axios, { AxiosInstance } from 'axios'

const BASE_URLS: Record<string, string> = {
    walmart: process.env.NEXT_PUBLIC_URL_WALMART || '',
    CasaLey: process.env.NEXT_PUBLIC_URL_LEY || ''
}

export function getApiClient(tienda: string): AxiosInstance {
    const baseURL = BASE_URLS[tienda];

    console.log(baseURL);

    if (!baseURL) {
        throw new Error(`No se encontró la URL base para la tienda: ${tienda}`);
    }

    return axios.create({
        baseURL,
        timeout: 5000,
        headers: {
        'Content-Type': 'application/json',
        // Puedes agregar más headers aquí si alguna tienda lo necesita
        },
    });
}