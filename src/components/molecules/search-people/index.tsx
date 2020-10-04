import React, { ChangeEvent, useContext, useState } from 'react'
import cn from 'classnames'
import './styles.scss'
import { useFilmListContext } from '../../../context/filmList'
import Axios from 'axios'
import { ENDPOINT } from '../../../config/api'
import { People } from '../../../models/people'
import { useHistory } from 'react-router-dom'

export default function SearchPeople() {
    const [searchText, setSearchText] = useState<string>('')
    const [searchOn, setSearchOn] = useState<boolean>(false)
    const [searchFocus, setSearchFocus] = useState<boolean>(false)
    const [searchResult, setSearchResult] = useState<People[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const { filmList } = useContext(useFilmListContext)
    const history = useHistory()

    const onChangeHandler = (e : ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
        if (e.target.value.length > 0) {
            searchPeople(e.target.value)
        } else {
            setSearchResult([])
        }
    }

    const searchPeople = async (text: string) => {
        setLoading(true)
        try {
            var res = await Axios.get(ENDPOINT.searchPeople(text))
            setSearchResult([...res.data.results])
        } catch (err) {
            console.error(err?.response?.message || err)
            setSearchResult([])
        } finally {
            setLoading(false)
        }
    }

    const onBlurHandler = () => {
        if (searchOn) return
        setSearchFocus(false)
    }

    const constructRoute = (people: People) => {
        const firstFilm = people.films[0]
        const filmIndex = filmList.findIndex(film => film.url === firstFilm)
        const { characters } = filmList[filmIndex]
        const peopleIndex = characters.findIndex( value => value === people.url)
        history.push(`/${filmIndex}/${peopleIndex}`)
    }

    const onClickSugestion = (i: number) => {
        setSearchText('')
        setSearchFocus(false)
        constructRoute(searchResult[i])
        
    }

    return (
        <div className="searchPeople">
            <div
                className={cn("searchPeople__wrapper", {// eslint-disable-next-line
                    ["searchPeople__wrapper__active"] : searchFocus
                })}
                onMouseOver={() => setSearchOn(true)}
                onMouseLeave={() => setSearchOn(false)}
            >

                {/* SEARCH INPUT */}
                <input
                    className="searchPeople__input"
                    value={searchText}
                    id="searchPeople"
                    onChange={onChangeHandler}
                    placeholder="Search for People"
                    onFocus={() => setSearchFocus(true)}
                    onBlur={onBlurHandler}
                />
                {searchText.length > 0 &&
                    <div
                        className={cn("searchPeople__result", {// eslint-disable-next-line
                            ["searchPeople__result__hide"] : !searchFocus
                        })}
                    >
                        {/* WHEN SEEARCHING DATA TO SERVER */}
                        {loading?
                            <div className="sugestion">
                                Loading...
                            </div>:

                        /* WHEN NO RESULT FROM SERVER */
                        searchResult.length === 0?
                            <div className="sugestion sugestion__noResult">
                                No Result!
                            </div>:

                        /* PRINT SUGESTION WHEN ANY */
                            searchResult.map( (people, i) => (
                                <button
                                    key={people.name}
                                    className="sugestion"
                                    onClick={() => onClickSugestion(i)}
                                >
                                    {people.name}
                                </button>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    )
}