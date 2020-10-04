import { render } from '@testing-library/react'
import React from 'react'
import TwoColumns from '.'

test('render correct element', () => {
    const { getByText } = render(<TwoColumns label="Name" content="Fauzi Al Aziz" />)

    getByText('Name')
    getByText('Fauzi Al Aziz')
}) 