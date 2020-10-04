import React, { ReactNode, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useFilmListContext } from '../../../context/filmList'
import { ParamType } from '../../../models/param'
import cn from 'classnames'
import './styles.scss'

interface PaginationNavProps {
    children: ReactNode
    pIndex: number
    lastPIndex: number
    onClick: Function
}

/* PAGINATION NAVIGATOR (FIST BUTTON< PREV BUTTON, NEXT BUTTON, LAST BUTTON) */
function PaginationNav({ children, pIndex, lastPIndex, onClick }: PaginationNavProps) {
    return (
        <div className="paginationNav">

            {/* FIRST BUTTON */}
            <button
                className="paginationNav__nav"
                disabled={pIndex === 0}
                onClick={() => onClick(0)}
            >
                {'<< First'}
            </button>

            {/* PREV BUTTON */}
            <button
                className="paginationNav__nav"
                disabled={pIndex === 0}
                onClick={() => onClick(pIndex - 1)}
            >
                {'< Previous'}
            </button>

            {/* NUMBER BUTTONS */}
            {children}

            {/* NEXT BUTTON */}
            <button
                className="paginationNav__nav"
                disabled={pIndex === lastPIndex}
                onClick={() => onClick(pIndex + 1)}
            >
                {'Next >'}
            </button>

            {/* LAST BUTTON */}
            <button
                className="paginationNav__nav"
                disabled={pIndex === lastPIndex}
                onClick={() => onClick(lastPIndex)}
            >
                {'Last >>'}
            </button>
        </div>
    )
}

export default function Pagination() {
    const history = useHistory()
    const { episodeIndex, peopleIndex } = useParams<ParamType>()
    const { filmList } = useContext(useFilmListContext)

    /* INDEXT TO INTEGER | NUMBER */
    const eIndex = parseInt(episodeIndex)
    const pIndex = parseInt(peopleIndex)

    /* CALCULATE PAGINATION NUMBER BUTTONS BOUNDERY */
    const lastPIndex = filmList[eIndex]?.characters.length - 1 || 0
    const leftBoundery = pIndex < 5? 0:
        pIndex > (lastPIndex - 5)? (lastPIndex - 10): 
        pIndex - 5;
    const rightBoundery = pIndex > (lastPIndex - 5)? lastPIndex:
        pIndex < 5? 10:
        pIndex + 5;

    const onClickHandler = (index: number) => {
        history.push(`/${(eIndex)}/${index}`)
    }

    return (
        <div className="page">
            <PaginationNav
                pIndex={pIndex}
                lastPIndex={lastPIndex}
                onClick={onClickHandler}
            >
                {/* RENDER PAGINATION NUMBER BUTTON */}
                {filmList[parseInt(episodeIndex)]?.characters.map( (_, i) => {
                    if (i < leftBoundery || i > rightBoundery) return 
                    return (
                        <button
                            key={i}
                            className={cn("page__number", {// eslint-disable-next-line
                                ["page__number__active"] : i === pIndex
                            })}
                            onClick={() => onClickHandler(i)}
                        >
                            {i + 1}
                        </button>
                    )
                })}
            </PaginationNav>
        </div>
    )
}