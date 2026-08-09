import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Cart from './Cart.jsx'
import { useCartStore } from '../store/cartStore.js'

const kgItem = {
  productId: 'p1',
  name: 'Basmati Rice',
  name_hindi: 'बासमती चावल',
  price_rupees: 120,
  unit: 'kg',
  step: 0.25,
  quantity: 1,
  image_url: null,
}

function renderCart() {
  return render(
    <MemoryRouter>
      <Cart />
    </MemoryRouter>
  )
}

beforeEach(() => {
  useCartStore.setState({ items: [], kiranaId: null })
})

describe('Cart page', () => {
  it('renders the empty state when the cart is empty', () => {
    renderCart()

    expect(screen.getByText('Your bag is empty')).toBeInTheDocument()
  })

  it('renders items when present', () => {
    useCartStore.setState({ items: [kgItem], kiranaId: 'k1' })
    renderCart()

    expect(screen.getByText('Basmati Rice')).toBeInTheDocument()
  })

  it('updates the total when quantity changes', async () => {
    useCartStore.setState({ items: [kgItem], kiranaId: 'k1' })
    const user = userEvent.setup()
    renderCart()

    expect(screen.getAllByText('₹120').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /increase quantity/i }))

    // 1.25 kg × ₹120 = ₹150
    expect(screen.getAllByText('₹150').length).toBeGreaterThan(0)
  })

  it('disables "Choose pickup time" below the ₹100 minimum', () => {
    useCartStore.setState({
      items: [{ ...kgItem, price_rupees: 50, quantity: 1 }],
      kiranaId: 'k1',
    })
    renderCart()

    expect(screen.getByRole('button', { name: /choose pickup time/i })).toBeDisabled()
  })
})
