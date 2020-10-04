import React, { ReactNode } from 'react'
import './styles.scss'

interface CenteringProps {
    children: ReactNode
}

export default function Centering({ children }: CenteringProps) {
    return (
        <div className="centering">
            {children}
        </div>
    )
}