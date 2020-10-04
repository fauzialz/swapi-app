import { render } from '@testing-library/react'
import React from 'react'
import Centering from '.'

test('renders correct element', () => {
    const { getByText } = render(<Centering><h1>Child Component</h1></Centering>)

    getByText('Child Component')
})