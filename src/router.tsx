import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import MainPage from './pages/main-page'
import PeoplePage from './pages/people-page'

export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={MainPage} />
                <Route exact path="/:episodeIndex/:peopleIndex" component={PeoplePage} />
                <Route>
                    <div>404</div>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}