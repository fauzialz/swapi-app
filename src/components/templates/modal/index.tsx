import React, { ReactNode } from 'react'
import './styles.scss'
import close from './close.svg'

interface ModalProps {
    children: ReactNode
    onClose: any
}

export default function Modal({ children, onClose }: ModalProps) {
    return (
        <div
            className="modal"
            onClick={onClose}
        >
            <div
                className="modal__container"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="modal__container__close"
                >
                    <img src={close} alt="logo" />
                </button>
                {children}
            </div>
        </div>
    )
}