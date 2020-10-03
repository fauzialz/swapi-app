import React from 'react'
import PeopleCard from '../../components/molecules/people-card'
import SearchPeople from '../../components/molecules/search-people'
import SelectFilm from '../../components/molecules/select-film'
import PageWrapper from '../../components/templates/page-wrapper'
import './styles.scss'

export default function PeoplePage() {
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