import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Stores from './Stores.jsx'
import { KIRANAS } from '../data/kiranas.js'
import { useLocationStore } from '../store/locationStore.js'

function renderStores() {
  return render(
    <MemoryRouter>
      <Stores />
    </MemoryRouter>
  )
}

beforeEach(() => {
  useLocationStore.setState({ city: null })
})

describe('Stores page', () => {
  it('prompts for a location instead of listing every store by default', () => {
    renderStores()

    expect(screen.getByText('Set your location')).toBeInTheDocument()
    KIRANAS.forEach((kirana) => {
      expect(screen.queryByText(kirana.name)).not.toBeInTheDocument()
    })
  })

  it('only lists stores in the selected city once a location is set', () => {
    useLocationStore.setState({ city: 'Hyderabad' })
    renderStores()

    expect(screen.getByText('Rakesh Kirana Store')).toBeInTheDocument()
    expect(screen.queryByText('Sharma General Store')).not.toBeInTheDocument()
  })

  it('searching works across every city even without a location set', async () => {
    const user = userEvent.setup()
    renderStores()

    await user.type(screen.getByRole('textbox'), 'Bangalore')

    expect(screen.getByText('Sharma General Store')).toBeInTheDocument()
    expect(screen.queryByText('Rakesh Kirana Store')).not.toBeInTheDocument()
  })

  it('shows an empty state when a search matches nothing', async () => {
    const user = userEvent.setup()
    renderStores()

    await user.type(screen.getByRole('textbox'), 'no such place')

    expect(screen.getByText('No stores found')).toBeInTheDocument()
  })
})
