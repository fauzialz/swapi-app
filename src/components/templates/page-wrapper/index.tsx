import React, { ReactNode } from 'react'
import Centering from '../centering'
import './styles.scss'

export default function PageWrapper(props: { children: ReactNode}) {
    return (
        <div className="pageWrapper">
            <Centering>
                <h1 className="pageWrapper__title">
                    STAR WARS CHARACTERS INFO
                </h1>
                {props.children}
            </Centering>
        </div>
    )
}