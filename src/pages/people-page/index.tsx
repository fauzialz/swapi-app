import React from 'react'
import PeopleCard from '../../components/molecules/people-card'
import SelectFilm from '../../components/molecules/select-film'
import PageWrapper from '../../components/templates/page-wrapper'

export default function PeoplePage() {
    return (
        <PageWrapper>
            <SelectFilm />
            <PeopleCard />
        </PageWrapper>
    )
}