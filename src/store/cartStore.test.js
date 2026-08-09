import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './cartStore.js'

const kgProduct = {
  id: 'p1',
  kirana_id: 'k1',
  name: 'Basmati Rice',
  name_hindi: 'बासमती चावल',
  price_rupees: 100,
  unit: 'kg',
  step: 0.25,
  min_order_qty: 1,
  in_stock: true,
  image_url: null,
}

const pcProduct = {
  id: 'p2',
  kirana_id: 'k1',
  name: 'Soap Bar',
  price_rupees: 35,
  unit: 'pcs',
  step: 1,
  min_order_qty: 1,
  in_stock: true,
  image_url: null,
}

const outOfStockProduct = {
  id: 'p3',
  kirana_id: 'k1',
  name: 'Garlic',
  price_rupees: 110,
  unit: 'kg',
  step: 0.25,
  min_order_qty: 1,
  in_stock: false,
  image_url: null,
}

beforeEach(() => {
  useCartStore.setState({ items: [], kiranaId: null })
})

describe('cartStore', () => {
  it('adding a new item increases count and total', () => {
    useCartStore.getState().addItem(kgProduct)

    expect(useCartStore.getState().getCount()).toBe(1)
    expect(useCartStore.getState().getTotal()).toBe(100)
  })

  it('adding an existing item updates quantity without creating a duplicate', () => {
    const { addItem } = useCartStore.getState()
    addItem(kgProduct)
    addItem(kgProduct)

    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBeCloseTo(1.25)
  })

  it('respects the product step: 0.25 for kg items, 1 for piece items', () => {
    const { addItem, incrementItem } = useCartStore.getState()

    addItem(kgProduct)
    incrementItem(kgProduct.id)
    expect(useCartStore.getState().items.find((i) => i.productId === kgProduct.id).quantity).toBeCloseTo(1.25)

    addItem(pcProduct)
    incrementItem(pcProduct.id)
    expect(useCartStore.getState().items.find((i) => i.productId === pcProduct.id).quantity).toBe(2)
  })

  it('removing an item decreases the cart correctly', () => {
    const { addItem, removeItem } = useCartStore.getState()
    addItem(kgProduct)
    addItem(pcProduct)

    removeItem(kgProduct.id)

    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].productId).toBe(pcProduct.id)
  })

  it('decrementing below the step removes the item entirely', () => {
    const { addItem, decrementItem } = useCartStore.getState()
    addItem(pcProduct) // quantity = 1
    decrementItem(pcProduct.id) // 1 - 1 = 0 -> removed

    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('clear cart empties everything', () => {
    const { addItem, clearCart } = useCartStore.getState()
    addItem(kgProduct)
    addItem(pcProduct)

    clearCart()

    const state = useCartStore.getState()
    expect(state.items).toHaveLength(0)
    expect(state.kiranaId).toBeNull()
  })

  it('persists to localStorage and can be read back', () => {
    useCartStore.getState().addItem(kgProduct)

    const raw = localStorage.getItem('tayaar-cart')
    expect(raw).toBeTruthy()

    const persisted = JSON.parse(raw)
    expect(persisted.state.items).toHaveLength(1)
    expect(persisted.state.items[0].productId).toBe(kgProduct.id)
  })

  it('cannot add an out-of-stock product', () => {
    const result = useCartStore.getState().addItem(outOfStockProduct)

    expect(result).toBe(false)
    expect(useCartStore.getState().items).toHaveLength(0)
  })
})
