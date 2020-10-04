import React from 'react'
import './styles.scss'

export interface TwoColumnsProps {
    label: string
    content: string | undefined
    leftWidth?: string
}

export default function TwoColumns({ label, content, leftWidth }: TwoColumnsProps) {
    return (
        <div
            className="twoColumns"
            style={{
                gridTemplateColumns: leftWidth? `${leftWidth} 1fr` : ''
            }}
        >
            <div className="twoColumns__label">
                {label}
            </div>
            <div className="twoColumns__content">
                {content}
            </div>
        </div>
    )
}