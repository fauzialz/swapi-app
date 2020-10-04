import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Starship } from '../../../models/starship'
import './styles.scss'

interface StarshipButtonProps {
    url: string
    onClick: any
}

export default function StarshipButton({ url, onClick }: StarshipButtonProps) {
    const [ starshipData, setStarshipData ] = useState<Partial<Starship>>({})

    useEffect(() => {
        const source = Axios.CancelToken.source()
        
        Axios.get(url, {
            cancelToken: source.token
        }).then( res => {
            setStarshipData({...res.data})
        }).catch( err => {
            console.warn(err?.response?.message || err?.message || err)
        })

        return () => {
            source.cancel(`Starship button got unmounted, fetch canceled.`)
        }
    }, [url])

    return (
        <button
            disabled={!starshipData}
            className="starshipButton"
            onClick={() => onClick(starshipData)}
        >
            {starshipData.name || 'Loading...'}
        </button>
    )
}