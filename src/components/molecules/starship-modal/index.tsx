import React, { useContext } from 'react'
import { useCurrentStarshipContext } from '../../../context/currentStarship'
import { Starship } from '../../../models/starship'
import Modal from '../../templates/modal'
import TwoColumns, { TwoColumnsProps } from '../../templates/two-columns'
import './styles.scss'

interface StarshipModalProps {
    onClose: any
}

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

export default function StarshipModal({ onClose }: StarshipModalProps) {
    const { currentStarship } = useContext(useCurrentStarshipContext)

    return (
        <Modal
            onClose={onClose}
        >
            <div className="starshipModal">
                <h2 className="starshipModal__title">
                    {currentStarship.name}
                </h2>
                <div className="starshipModal__detail">
                    {getIterableStarshipData(currentStarship).map( starship => (
                        <TwoColumns
                            key={starship.label}
                            leftWidth="230px"
                            {...starship}
                        />
                    ))}
                </div>
            </div>
        </Modal>
    )
}