import Axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'

interface FetchHomewordlProps {
    url?: string
}

export default function FetchHomeworld({ url }: FetchHomewordlProps) {
    const [homeworld, setHomeworld] = useState<string>('')

    useEffect(() => {
        if(!url) return

        const source = Axios.CancelToken.source()
        Axios.get(url, {
            cancelToken: source.token
        }).then( res => {
            setHomeworld(res.data.name)
        }).catch( err => {
            console.warn(err?.response?.message || err?.message || err)
        })

        return () => {
            source.cancel(`Homeworld got unmounted, fetch canceled.`)
        }
    }, [url])

    return (
        <Fragment>{homeworld || 'Loading...'}</Fragment>
    )
}