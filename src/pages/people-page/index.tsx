import React from 'react'
import { Redirect, useParams } from 'react-router-dom'
import PeopleCard from '../../components/molecules/people-card'
import SearchPeople from '../../components/molecules/search-people'
import SelectFilm from '../../components/molecules/select-film'
import PageWrapper from '../../components/templates/page-wrapper'
import { ParamType } from '../../models/param'
import './styles.scss'

export default function PeoplePage() {
    const param = useParams<ParamType>()

    /* REDURECT TO MAIN PAGE IF PARAM IS NOT VALID */
    if (
        isNaN(parseInt(param.episodeIndex)) ||
        isNaN(parseInt(param.peopleIndex)) ||
        parseInt(param.episodeIndex) < 0 ||
        parseInt(param.peopleIndex) < 0
    ) {
        return <Redirect to="/" />
    }

    return (
        <div className="peoplePage">
            <PageWrapper>
                <div className="peoplePage__flex">
                    <SelectFilm />
                    <SearchPeople />
                </div>
                <PeopleCard />
            </PageWrapper>
        </div>
    )
}