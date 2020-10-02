import Axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Route, Switch, useParams } from 'react-router-dom'
import { useFilmListContext } from '../../../context/filmList'
import { People } from '../../../models/people'

interface ParamType {
    episodeIndex: string,
    peopleIndex: string
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
                JSON.stringify(people)
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