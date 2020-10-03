import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Starship } from '../../../models/starship'
import Modal from '../../templates/modal'
import './styles.scss'

interface StarshipModalProps {
    url: string
    onClose: any
}

export default function StarshipModal({ url, onClose }: StarshipModalProps) {
    const [loading, setLoading] = useState<boolean>(true)
    const [starshipData, setStarshipData] = useState<Partial<Starship>>({})
    
    useEffect(() => {
        if (url === '') return
        fetchStarship()// eslint-disable-next-line
    }, [url])

    const fetchStarship = async () => {
        !loading && setLoading(true)
        try {
            const res = await Axios.get(url)
            setStarshipData({...res.data})
        } catch (err) {
            console.error(err?.response?.message || err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            onClose={onClose}
        >
            <div className="starshipModal">
                {
                    !loading &&
                    JSON.stringify(starshipData)
                }
            </div>
        </Modal>
    )
}