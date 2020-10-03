import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import MainPage from './pages/main-page'
import PeoplePage from './pages/people-page'

export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={MainPage} />
                <Route path="/:episodeIndex/:peopleIndex" component={PeoplePage} />
            </Switch>
        </BrowserRouter>
    )
}