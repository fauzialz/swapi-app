import React, { createContext, ReactNode, useState } from 'react'
import { Film } from '../models/film'

type FilmListContext = {
    filmList: Film[],
    setFilmList(arr: Film[]): void
}

export const useFilmListContext = createContext<FilmListContext>({
    filmList: [],
    setFilmList: (arr: Film[]) => {
        throw new Error('error')
    }
})
const { Provider } = useFilmListContext

interface FilmListProviderProps {
    children: ReactNode
}

const FilmListProvider = ({ children }: FilmListProviderProps) => {
    const [filmList, setFilmList] = useState<Film[]>([])

    const filmListPackage: FilmListContext = {
        filmList,
        setFilmList
    }

    return (
        <Provider value={filmListPackage}>
            {children}
        </Provider>
    )
}

export default FilmListProvider