import React from 'react';
import { render, screen, waitForElement } from '@testing-library/react';
import App from './App';
import { setupServer } from 'msw/node';
import { rest } from 'msw'
import { BASE, ENDPOINT } from './config/api';
import { mockFilmList } from './models/film'

export const server = setupServer(
  rest.get(BASE + ENDPOINT.getFilmList, (_, res, ctx) => {
    return res(ctx.json({
      results: [...mockFilmList]
    }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders correct element', async () => {
  const { getByText } = render(<App />);

  getByText('STAR WARS CHARACTERS INFO')

  await waitForElement(() => screen.getByLabelText('selectFilm'))

  getByText('Select Film')
  getByText(`Star Wars Episode ${mockFilmList[0].episode_id}: ${mockFilmList[0].title}`)
});