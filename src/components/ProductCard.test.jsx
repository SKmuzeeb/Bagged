import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from './ProductCard.jsx'

const product = {
  id: 'p1',
  kirana_id: 'k1',
  name: 'Basmati Rice',
  name_hindi: 'बासमती चावल',
  price_rupees: 120,
  unit: 'kg',
  step: 0.25,
  min_order_qty: 1,
  in_stock: true,
  image_url: null,
}

function noop() {}

describe('ProductCard', () => {
  it('renders name, Hindi name, price, and unit', () => {
    render(<ProductCard product={product} quantity={0} onAdd={noop} onIncrement={noop} onDecrement={noop} />)

    expect(screen.getByText('Basmati Rice')).toBeInTheDocument()
    expect(screen.getByText('बासमती चावल')).toBeInTheDocument()
    expect(screen.getByText('₹120')).toBeInTheDocument()
    expect(screen.getByText('/ kg')).toBeInTheDocument()
  })

  it('fires onAdd with the product when "+ Add" is clicked', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<ProductCard product={product} quantity={0} onAdd={onAdd} onIncrement={noop} onDecrement={noop} />)

    await user.click(screen.getByRole('button', { name: /add basmati rice/i }))

    expect(onAdd).toHaveBeenCalledWith(product)
  })

  it('renders an out-of-stock badge and a disabled button', () => {
    const outOfStockProduct = { ...product, in_stock: false }
    render(
      <ProductCard product={outOfStockProduct} quantity={0} onAdd={noop} onIncrement={noop} onDecrement={noop} />
    )

    expect(screen.getByText('Out of stock')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled()
  })

  it('increments and decrements via the stepper when quantity > 0', async () => {
    const onIncrement = vi.fn()
    const onDecrement = vi.fn()
    const user = userEvent.setup()
    render(
      <ProductCard product={product} quantity={1} onAdd={noop} onIncrement={onIncrement} onDecrement={onDecrement} />
    )

    await user.click(screen.getByRole('button', { name: /increase quantity/i }))
    await user.click(screen.getByRole('button', { name: /decrease quantity/i }))

    expect(onIncrement).toHaveBeenCalledWith(product.id)
    expect(onDecrement).toHaveBeenCalledWith(product.id)
  })
})
