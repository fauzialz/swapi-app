import React, { ChangeEvent, KeyboardEvent, useContext, useState } from 'react'
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
    
    const [showSugestionFocus, setShowSugestionFocus] = useState<boolean>(false)
    const [sugestionFocused, setSugestionFocused] = useState<number>(0)
    
    const { filmList } = useContext(useFilmListContext)
    const history = useHistory()
 
    /* ON SEARCH TEXT CHANGE */
    const onChangeHandler = (e : ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
        if (e.target.value.length > 0) {
            searchPeople(e.target.value)
            !searchFocus && setSearchFocus(true)
        } else {
            setSearchResult([])
        }
    }

    /* SEARCH PEOPLE TI SWAPI */
    const searchPeople = async (text: string) => {
        setLoading(true)
        try {
            var res = await Axios.get(ENDPOINT.searchPeople(text))
            setSearchResult([...res.data.results])
        } catch (err) {
            console.warn(err?.response?.message || err)
            setSearchResult([])
        } finally {
            setLoading(false)
        }
    }

    /* ON SEARCH INPUT BLUR */
    const onBlurHandler = () => {
        if (searchOn) return
        setSearchFocus(false)
    }

    /* CHANG WEB ROUTE ACCORDING TO PEOPLE DATA FROM SEARCH RESULT */
    const constructRoute = (people: People) => {
        const firstFilm = people.films[0]
        const filmIndex = filmList.findIndex(film => film.url === firstFilm)
        const { characters } = filmList[filmIndex]
        const peopleIndex = characters.findIndex( value => value === people.url)
        history.push(`/${filmIndex}/${peopleIndex}`)
    }

    /* ON SUGSTION CLICKED */
    const onClickSugestion = (i: number) => {
        setShowSugestionFocus(false)
        setSugestionFocused(0)
        setSearchText('')
        setSearchFocus(false)
        constructRoute(searchResult[i])
        
    }

    /* ON KEY DOWN HANDLER, WHEN PRES ARROW DOWN<, ARROW UP, ENTER */
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (searchResult.length === 0) return

        if (!showSugestionFocus && e.key === 'ArrowDown') {
            setShowSugestionFocus(true)
        } else if(!showSugestionFocus && e.key === 'ArrowUp') {
            setShowSugestionFocus(true)
            setSugestionFocused(searchResult.length - 1)
        } else {
            switch (e.key) {
                case 'ArrowDown': {
                    if (sugestionFocused + 1 >= searchResult.length) {
                        setSugestionFocused(0)
                    } else setSugestionFocused(sugestionFocused + 1)
                    break
                }
                case 'ArrowUp': {
                    if (sugestionFocused === 0) {
                        setSugestionFocused(searchResult.length - 1)
                    }else setSugestionFocused(sugestionFocused - 1)
                    break
                }
                case 'Enter': {
                    onClickSugestion(sugestionFocused)
                    break
                }
                default: return
            }
        }

        
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
                    onKeyDown={onKeyDownHandler}
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
                                    className={cn("sugestion", {// eslint-disable-next-line
                                        ['sugestion__focus'] : showSugestionFocus && sugestionFocused === i
                                    })}
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