import Axios, { CancelTokenSource } from 'axios'
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import CurrentStarshipProvider from '../../../context/currentStarship'
import { useFilmListContext } from '../../../context/filmList'
import { Film } from '../../../models/film'
import { ParamType } from '../../../models/param'
import { People } from '../../../models/people'
import FetchHomeworld from '../../atoms/fetch-homeworld'
import TwoColumns, { TwoColumnsProps } from '../../templates/two-columns'
import Pagination from '../pagination'
import StarshipButton from '../starship-button'
import StarshipModal from '../starship-modal'
import './styles.scss'

function getIterablePeopleDetail(people: Partial<People>): TwoColumnsProps[] {
    if (!people) return []
    return ([
        { label: 'Name', content: people.name },
        { label: 'Height', content: people.height + ' cm'},
        { label: 'Mass', content: people.mass + ' kg' },
        { label: 'Hair Color', content: people.hair_color },
        { label: 'Eye Color', content: people.eye_color },
        { label: 'Birth Year', content: people.birth_year },
        { label: 'Gender', content: people.gender },
        { label: 'Homeworld', content: <FetchHomeworld url={people.homeworld} /> },
    ])
}

/* PEOPLE CARD SKELETON */
const PeopleCardSkeleton = () => (
    <div className="peopleCard__skeleton">
        <div className="peopleCard__skeleton__title" />
        <div className="peopleCard__skeleton__detail">
            {[0, 1, 2, 3, 4, 5, 6, 7].map( item => (
                <div key={item} className="peopleCard__skeleton__detail__grid">
                    <div id={`label__${item}`} className="peopleCard__skeleton__detail__grid__label" />
                    <div id={`content__${item}`} className="peopleCard__skeleton__detail__grid__content" />
                </div>
            ))}
        </div>
        <div className="peopleCard__skeleton__titleShip" />
        <div className="peopleCard__skeleton__ship" />
    </div>
)

export default function PeopleCard() {
    var param = useParams<ParamType>()
    const { filmList } = useContext(useFilmListContext)
    const [people, setPeople] = useState<Partial<People>>()
    const [loading, setLoading] = useState<boolean>(true)
    const [showModal, setShowModal] = useState<boolean>(false)
    
    /* FETCH CENCELATION REF */
    const source = useRef<CancelTokenSource | null>(null)
    
    /* PREV DATA REF */
    const prevPIndex = useRef<number>(parseInt(param.peopleIndex || '0'))
    const prevFilmList = useRef<Film[]>(filmList)

    /* IF ANY FETCH STILL PROCEESSING, CANCEL ALL FETCH */
    const cancelAllFetch = () => {
        if (source.current) {
            source.current.cancel('Suddenly change page or unmounted, prev fetch people canceled!')
        }
    }

    useEffect(() => {

        /* IF PAGE CHANGED */
        if (parseInt(param.peopleIndex) !== prevPIndex.current) {
            prevPIndex.current = parseInt(param.peopleIndex)
            setLoading(true)

            cancelAllFetch()
        }

        /* IF THERE ALREADY filmList, NO NEED TO FETCH PEOPLE (PEOPE ALREADY FETCH ONCE) */
        if(prevFilmList.current === filmList) {
            return
        }

        fetchPeopleData()

        return () => {
            cancelAllFetch()
        }
        // eslint-disable-next-line
    }, [param, filmList]) // filmList need to be here for check on filmList refech on page reload

    /* FETCH PEOPLE DATA */
    const fetchPeopleData = async () => {
        const url = filmList[parseInt(param.episodeIndex)]?.characters[parseInt(param.peopleIndex)] || ''
        if(url === '') return
    
        try {
            source.current = Axios.CancelToken.source()
            const res = await Axios.get(url, {
                cancelToken: source.current.token
            })
            setPeople({...res.data})
            setLoading(false)
        } catch (err) {
            console.warn(err?.response?.message || err?.message || err)
        }
    }

    return (
        <CurrentStarshipProvider>
            <div className="peopleCard">
                {loading?
                    <PeopleCardSkeleton />:

                    people &&
                    <Fragment>
                        <h2 className="peopleCard__title">
                            {people.name}
                        </h2>
                        <div className="peopleCard__detail">

                            {getIterablePeopleDetail(people).map( detail => (
                                <TwoColumns
                                    key={detail.label}
                                    label={detail.label}
                                    content={detail.content}
                                />
                            ))}

                        </div>

                        <h2 className="peopleCard__title">
                            Starship
                        </h2>

                        <div className="peopleCard__starship">
                            {people.starships?.length === 0?
                            
                                <div className="peopleCard__starship__noship">
                                    No Starship
                                </div> :

                                people.starships?.map( ship => (
                                    <StarshipButton
                                        key={ship}
                                        url={ship}
                                        onClick={() => setShowModal(true)}
                                    />
                                ))
                            }
                        </div>
                    </Fragment>
                
                }
            </div>
            
            { people && <Pagination /> }
            { showModal && 
                <StarshipModal
                    onClose={() => setShowModal(false)}
                />
            }
        </CurrentStarshipProvider>
    )
}