import Axios, { CancelTokenSource } from 'axios'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Starship } from '../../../models/starship'
import Modal from '../../templates/modal'
import TwoColumns, { TwoColumnsProps } from '../../templates/two-columns'
import './styles.scss'

interface StarshipModalProps {
    url: string
    onClose: any
}

const StarshipModalSkeleton = () => (
    <div className="starshipModal__skeleton">
        <div className="starshipModal__skeleton__title" />
        <div className="starshipModal__skeleton__detail">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map( item => (
                <div key={item} className="starshipModal__skeleton__detail__grid">
                    <div id={`Slabel__${item}`} className="starshipModal__skeleton__detail__grid__label" />
                    <div id={`Scontent__${item}`} className="starshipModal__skeleton__detail__grid__content" />
                </div>
            ))}
        </div>
    </div>
)

function getIterableStarshipData(starship: Partial<Starship>): TwoColumnsProps[] {
    if (!starship) return []
    return ([
        { label: 'Name', content: starship.name },
        { label: 'Model', content: starship.model },
        { label: 'Manufacturer', content: starship.manufacturer },
        { label: 'Price', content: starship.cost_in_credits + ' galactic credits' },
        { label: 'Length', content: starship.length + ' meters' },
        { label: 'Max Crew', content: starship.crew + ' personnel' },
        { label: 'Max Passengers', content: starship.passengers + ' people' },
        { label: 'Max Atmospehre Speed', content: starship.max_atmosphering_speed },
        { label: 'Hyperdrive Rating', content: starship.hyperdrive_rating },
        { label: 'Max Megalights Travel', content: starship.MGLT + ' megalights' },
        { label: 'Cargo Capacity', content: starship.cargo_capacity + ' kg' },
        { label: 'Cosumables', content: starship.consumables },
    ])
}

export default function StarshipModal({ url, onClose }: StarshipModalProps) {
    const [loading, setLoading] = useState<boolean>(true)
    const [starshipData, setStarshipData] = useState<Partial<Starship>>({})
    const fetch = useRef<CancelTokenSource | null>(null)
    
    useEffect(() => {
        if (url === '') return
        fetchStarship()
        
        /* CANCEL FETCH DATA WHEN COMPONENT UNMOUNT */
        return () => {
            if(fetch.current) {
                fetch.current.cancel('Suddenly close modal, fetching data canceled!')
            }
        }
        // eslint-disable-next-line
    }, [url])

    /* FETCH STARSHIP DATA */
    const fetchStarship = async () => {
        !loading && setLoading(true)

        try {
            fetch.current = Axios.CancelToken.source()
            const res = await Axios.get(url, {
                cancelToken: fetch.current.token
            })
            setStarshipData({...res.data})
            setLoading(false)
        } catch (err) {
            console.error(err?.response?.message || err?.message || err)
        }
    }

    return (
        <Modal
            onClose={onClose}
        >
            <div className="starshipModal">
                    
                {
                    loading ?
                    <StarshipModalSkeleton />:

                    <Fragment>
                        <h2 className="starshipModal__title">
                            {starshipData.name}
                        </h2>
                        <div className="starshipModal__detail">
                            {getIterableStarshipData(starshipData).map( starship => (
                                <TwoColumns
                                    key={starship.label}
                                    leftWidth="230px"
                                    {...starship}
                                />
                            ))}
                        </div>
                    </Fragment>
                }
            </div>
        </Modal>
    )
}