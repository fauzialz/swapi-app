import Axios from 'axios'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Route, Switch, useParams } from 'react-router-dom'
import { useFilmListContext } from '../../../context/filmList'
import { People } from '../../../models/people'
import './styles.scss'

interface ParamType {
    episodeIndex: string,
    peopleIndex: string
}

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

    useEffect(() => {
        fetchPeopleData() // eslint-disable-next-line
    }, [param, filmList])

    const fetchPeopleData = async () => {
        const url = filmList[parseInt(param.episodeIndex)]?.characters[parseInt(param.peopleIndex)] || ''
        if(url === '') return

        try {
            const res = await Axios.get(url)
            setPeople({...res.data})
        } catch (err) {
            console.error(err?.response?.message || err)
        }
    }

    return (
        <div className="peopleCard">
            {people &&
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
    )
}

export default function PeopleSwitch() {
    return (
        <Switch>
            <Route path="/:episodeIndex/:peopleIndex" children={<PeopleCard />} />
        </Switch>
    )
}