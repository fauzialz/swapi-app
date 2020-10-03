import Axios, { CancelTokenSource } from 'axios'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { ENDPOINT } from '../../../config/api'
import { useFilmListContext } from '../../../context/filmList'
import { Film } from '../../../models/film'
import { ParamType } from '../../../models/param'
import './styles.scss'

export default function SelectFilm() {
    const source = useRef<CancelTokenSource | null>(null)
    const param = useParams<ParamType>()
    const [activeFilm, setActiveFilm] = useState<number>(param.episodeIndex? parseInt(param.episodeIndex): -1)
    const history = useHistory()
    const { filmList, setFilmList } = useContext(useFilmListContext)

    useEffect(() => {
        fetchFilmList()

        return () => {
            if(source.current) {
                source.current.cancel('Component unmounted')
            }
        }// eslint-disable-next-line 
    }, [])

    const fetchFilmList = async () => {
        try {
            source.current = Axios.CancelToken.source()
            const res = await Axios.get(ENDPOINT.getFilmList, {
                cancelToken: source.current.token
            })

            // SORT FILM BASE ON EPISODE ID
            var filmsTemp: Film[] = [...res.data.results].sort( (a, b) => a.episode_id - b.episode_id)
            setFilmList(filmsTemp.sort( (a, b) => a.episode_id - b.episode_id))
        } catch (err) {
            console.error(err?.response?.message || err)
        }
    }

    const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        if (parseInt(e.target.value) === -1) {
            history.push(`/`)
        } else {
            history.push(`/${e.target.value}/0`)
        }
        setActiveFilm(parseInt(e.target.value))
    }

    return (
        <div className="selectMovies">
            {filmList.length === 0?
                <div className="selectMovies__skeleton" />:
                
                <select
                    className="selectMovies__select"
                    name="selectFilm"
                    id="selectFilm"
                    value={activeFilm}
                    onChange={onChangeSelect}
                >
                    <option value={-1}>
                        Select Film
                    </option>
                    {filmList.map( film => (
                        <option
                            key={film.episode_id}
                            value={film.episode_id - 1}
                        >
                            Star Wars Episode {film.episode_id}: {film.title}
                        </option>
                    ))}
                </select>
            }
        </div>
    )
}