import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34343635-249cda001649905db4d0f9217';
const PAGE_LIMIT = 40;

export const searchImages = async (searchTerm, PAGE_VALUE) => {
    try {
    const response = axios.get(`${BASE_URL}`, {
        params: {
            key: API_KEY,
            q: searchTerm,
            type: 'photo',
            orientation: 'horizontal',
            per_page: PAGE_LIMIT,
            page: PAGE_VALUE,
            safesearch: true,
        }
      });

    return response;
    } catch (error) {
        console.log(error);
}
}


