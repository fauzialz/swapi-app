import Axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useCurrentStarshipContext } from '../../../context/currentStarship'
import { Starship } from '../../../models/starship'
import './styles.scss'

interface StarshipButtonProps {
    url: string
    onClick: any
}

export default function StarshipButton({ url, onClick }: StarshipButtonProps) {
    const [ starshipData, setStarshipData ] = useState<Partial<Starship>>({})
    const { setCurrentStarship } = useContext(useCurrentStarshipContext)

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

    const onClickHandler = () => {
        setCurrentStarship({...starshipData})
        onClick()
    }

    return (
        <button
            disabled={!starshipData}
            className="starshipButton"
            onClick={onClickHandler}
        >
            {starshipData.name || 'Loading...'}
        </button>
    )
}