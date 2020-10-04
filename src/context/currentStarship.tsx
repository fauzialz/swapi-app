import React, { createContext, ReactNode, useState } from 'react'
import { Starship } from '../models/starship'

type CurrentStarshipContext = {
    currentStarship: Partial<Starship>,
    setCurrentStarship(obj: Partial<Starship>): void
}

export const useCurrentStarshipContext = createContext<CurrentStarshipContext>({
    currentStarship: {},
    setCurrentStarship: (obj: Partial<Starship>) => {
        throw new Error('error')
    }
})
const { Provider } = useCurrentStarshipContext

interface CurrentStarshipProviderProps {
    children: ReactNode
}

const CurrentStarshipProvider = ({ children }: CurrentStarshipProviderProps) => {
    const [currentStarship, setCurrentStarship] = useState<Partial<Starship>>({})

    const currentStarshipPackage: CurrentStarshipContext = {
        currentStarship,
        setCurrentStarship
    }

    return (
        <Provider value={currentStarshipPackage}>
            {children}
        </Provider>
    )
}

export default CurrentStarshipProvider