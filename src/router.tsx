import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Main from './pages/main'

export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Main} />
            </Switch>
        </BrowserRouter>
    )
}