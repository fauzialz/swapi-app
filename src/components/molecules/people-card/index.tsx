import Axios, { CancelTokenSource } from 'axios'
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFilmListContext } from '../../../context/filmList'
import { ParamType } from '../../../models/param'
import { People } from '../../../models/people'
import TwoColumns, { TwoColumnsProps } from '../../templates/two-columns'
import Pagination from '../pagination'
import StarshipModal from '../starship-modal'
import './styles.scss'

interface ModalState {
    show: boolean
    url: string
}

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
        { label: 'Homeworld', content: people.homeworld },
    ])
}

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
    const source = useRef<CancelTokenSource | null>(null)
    const prevPIndex = useRef<number>(parseInt(param.peopleIndex || '0'))
    const [loading, setLoading] = useState<boolean>(true)
    const [modal, setModal] = useState<ModalState>({ show: false, url: '' })

    useEffect(() => {
        if (parseInt(param.peopleIndex) !== prevPIndex.current) {
            prevPIndex.current = parseInt(param.peopleIndex)
            setLoading(true)

            if (source.current) {
                source.current.cancel('Suddenly change page, prev fetch canceled!')
            }
        }
        fetchPeopleData() // eslint-disable-next-line
    }, [param, filmList])

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
            console.error(err?.response?.message || err?.message || err)
        }
    }

    return (
        <Fragment>
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

                                people.starships?.map( (ship, i) => (
                                    <button
                                        key={i}
                                        className="peopleCard__starship__button"
                                        onClick={() => setModal({
                                            show: true,
                                            url: ship
                                        })}
                                    >
                                        Starship {i + 1}
                                    </button>
                                ))
                            }
                        </div>
                    </Fragment>
                
                }
            </div>
            
            { people && <Pagination /> }
            { modal.show && 
                <StarshipModal
                    onClose={() => setModal({show: false, url: ''})}
                    url={modal.url}
                />
            }
        </Fragment>
    )
}