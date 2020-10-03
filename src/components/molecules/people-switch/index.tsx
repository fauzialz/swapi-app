import Axios, { CancelTokenSource } from 'axios'
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { Route, Switch, useParams } from 'react-router-dom'
import { useFilmListContext } from '../../../context/filmList'
import { ParamType } from '../../../models/param'
import { People } from '../../../models/people'
import Pagination from '../pagination'
import './styles.scss'

interface PeopleDetailProps {
    label: string,
    content: string | undefined
}

interface IterablePeopleDetail {
    label: string,
    field: string | undefined
}

function getIterablePeopleDetail(people: Partial<People>): IterablePeopleDetail[] {
    if (!people) return []
    return ([
        { label: 'Name', field: people.name },
        { label: 'Height', field: people.height },
        { label: 'Mass', field: people.mass },
        { label: 'Hair Color', field: people.hair_color },
        { label: 'Eye Color', field: people.eye_color },
        { label: 'Birth Year', field: people.birth_year },
        { label: 'Gender', field: people.gender },
        { label: 'Homeworld', field: people.homeworld },
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

function PeopleDetail({ label, content }: PeopleDetailProps ) {
    return (
        <div className="peopleDetail">
            <div className="peopleDetail__label">
                {label}
            </div>
            <div className="peopleDetail__content">
                {content}
                {
                    label === 'Height'? ' cm':
                    label === 'Mass'? ' kg': ''
                }
            </div>
        </div>
    )
}

function PeopleCard() {
    var param = useParams<ParamType>()
    const { filmList } = useContext(useFilmListContext)
    const [people, setPeople] = useState<Partial<People>>()
    const source = useRef<CancelTokenSource | null>(null)
    const prevPIndex = useRef<number>(parseInt(param.peopleIndex || '0'))
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (parseInt(param.peopleIndex) !== prevPIndex.current) {
            prevPIndex.current = parseInt(param.peopleIndex)
            if (source.current) {
                source.current.cancel('Change page...')
            }
        }
        fetchPeopleData() // eslint-disable-next-line
    }, [param, filmList])

    const fetchPeopleData = async () => {
        const url = filmList[parseInt(param.episodeIndex)]?.characters[parseInt(param.peopleIndex)] || ''
        if(url === '') return
        setLoading(true)

        try {
            source.current = Axios.CancelToken.source()
            const res = await Axios.get(url, {
                cancelToken: source.current.token
            })
            setPeople({...res.data})
        } catch (err) {
            console.error(err?.response?.message || err)
        } finally {
            setLoading(false)
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
                                <PeopleDetail
                                    key={detail.label}
                                    label={detail.label}
                                    content={detail.field}
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
        </Fragment>
    )
}

export default function PeopleSwitch() {
    return (
        <Switch>
            <Route path="/:episodeIndex/:peopleIndex" children={<PeopleCard />} />
        </Switch>
    )
}