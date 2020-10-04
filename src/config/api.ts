export const BASE = 'https://swapi.dev/api'

export const ENDPOINT = {
    getFilmList: '/films',
    searchPeople: (name: string) => `/people/?search=${name}`
}