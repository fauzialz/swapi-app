import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import Modal from '.'

test('render correct element', () => {
    const { getByText } = render(<Modal onClose={() => {}}>
        <h1>Modal Shown</h1>
    </Modal>)

    getByText('Modal Shown')
})

test('unmount element when close', () => {
    const { getByLabelText, container, unmount } = render(
        <Modal onClose={() => unmount()}>
            <h1>Modal Shown</h1>
        </Modal>
    )

    const closeButton = getByLabelText('ModalCloseButton')

    fireEvent.click(closeButton)
    expect(container.innerHTML).toEqual('')
})