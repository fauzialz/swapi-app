import React from 'react'
import PeopleSwitch from '../../components/molecules/people-switch'
import SelectFilm from '../../components/molecules/select-film'
import Centering from '../../components/templates/centering'
import FilmListProvider from '../../context/filmList'
import './styles.scss'

export default function Main() {
    return (
        <FilmListProvider>
            <div className="main">
                <Centering>
                    <h1 className="main__title">
                        SWAPI APP
                    </h1>
                    <SelectFilm />
                    <PeopleSwitch />
                </Centering>
            </div>
        </FilmListProvider>
    )
}