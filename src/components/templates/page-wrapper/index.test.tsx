import { render } from '@testing-library/react'
import React from 'react'
import PageWrapper from '.'

test('renders correct element', () => {
    const { getByText } = render(<PageWrapper><h1>Child Component</h1></PageWrapper>)

    getByText('STAR WARS CHARACTERS INFO')
    getByText('Child Component')
})