import { getProductImage } from '../lib/imageMap.js'
import { KIRANAS } from './kiranas.js'

// The catalog every kirana draws from — real neighborhood stores mostly
// stock the same staples, so each store gets this same item list, priced
// and stocked a little differently (see KIRANA_CATALOG_CONFIG below).
const PRODUCT_TEMPLATE = [
  { key: 'rice', name: 'Basmati Rice', description: 'Long-grain aromatic rice, perfect for everyday meals.', category: 'staples', unit: 'kg', step: 0.25, basePrice: 120 },
  { key: 'atta', name: 'Wheat Atta', description: 'Whole wheat flour, stone-ground for soft rotis.', category: 'staples', unit: 'kg', step: 0.25, basePrice: 55 },
  { key: 'toor_dal', name: 'Toor Dal', description: 'Split pigeon peas, a kitchen staple for daily dal.', category: 'staples', unit: 'kg', step: 0.25, basePrice: 140 },
  { key: 'sugar', name: 'Sugar', description: 'Fine white sugar for tea, coffee, and baking.', category: 'staples', unit: 'kg', step: 0.25, basePrice: 45 },
  { key: 'salt', name: 'Salt', description: 'Iodized table salt for everyday cooking.', category: 'staples', unit: 'kg', step: 0.25, basePrice: 22 },
  { key: 'bread', name: 'Bread', description: 'Soft sliced bread, baked fresh daily.', category: 'staples', unit: 'pack', step: 1, basePrice: 45 },

  { key: 'sunflower_oil', name: 'Sunflower Oil', description: 'Light, refined cooking oil for everyday frying.', category: 'oils', unit: 'l', step: 0.25, basePrice: 150 },
  { key: 'mustard_oil', name: 'Mustard Oil', description: 'Cold-pressed oil with a bold, pungent flavor.', category: 'oils', unit: 'l', step: 0.25, basePrice: 165 },

  { key: 'tomato', name: 'Tomato', description: 'Fresh, ripe tomatoes for cooking and salads.', category: 'vegetables', unit: 'kg', step: 0.25, basePrice: 30 },
  { key: 'onion', name: 'Onion', description: 'Fresh onions, a base for most everyday dishes.', category: 'vegetables', unit: 'kg', step: 0.25, basePrice: 35 },
  { key: 'potato', name: 'Potato', description: 'All-purpose potatoes for curries, fries, and more.', category: 'vegetables', unit: 'kg', step: 0.25, basePrice: 25 },
  { key: 'green_chilli', name: 'Green Chilli', description: 'Fresh green chillies for heat and flavor.', category: 'vegetables', unit: 'kg', step: 0.25, basePrice: 60 },
  { key: 'coriander', name: 'Coriander', description: 'Fresh coriander leaves for garnish and flavor.', category: 'vegetables', unit: 'pack', step: 1, basePrice: 10 },
  { key: 'ginger', name: 'Ginger', description: 'Fresh ginger root for cooking and tea.', category: 'vegetables', unit: 'kg', step: 0.25, basePrice: 90 },
  { key: 'garlic', name: 'Garlic', description: 'Fresh garlic bulbs, a kitchen essential.', category: 'vegetables', unit: 'kg', step: 0.25, basePrice: 110 },

  { key: 'milk', name: 'Milk', description: 'Fresh full-cream milk, delivered daily.', category: 'dairy', unit: 'l', step: 0.5, basePrice: 32 },
  { key: 'curd', name: 'Curd', description: 'Fresh, thick homestyle yogurt.', category: 'dairy', unit: 'pack', step: 1, basePrice: 40 },
  { key: 'paneer', name: 'Paneer', description: 'Soft cottage cheese, ideal for curries.', category: 'dairy', unit: 'kg', step: 0.25, basePrice: 320 },
  { key: 'ghee', name: 'Ghee', description: 'Pure clarified butter with a rich, nutty aroma.', category: 'dairy', unit: 'kg', step: 0.25, basePrice: 550 },
  { key: 'butter', name: 'Butter', description: 'Creamy, salted table butter.', category: 'dairy', unit: 'pack', step: 1, basePrice: 250 },
  { key: 'eggs', name: 'Eggs', description: 'Farm-fresh eggs, sold by the half-dozen.', category: 'dairy', unit: 'pcs', step: 1, basePrice: 7, minOrderQty: 6 },

  { key: 'maggi', name: 'Maggi Noodles', description: 'Quick-cooking instant noodles with masala flavor.', category: 'snacks', unit: 'pcs', step: 1, basePrice: 14 },
  { key: 'parle_g', name: 'Parle-G Biscuits', description: 'Classic glucose biscuits, a household favorite.', category: 'snacks', unit: 'pack', step: 1, basePrice: 10 },
  { key: 'chips', name: 'Potato Chips', description: 'Crispy, salted potato chips.', category: 'snacks', unit: 'pack', step: 1, basePrice: 20 },
  { key: 'mixture', name: 'Mixture Snacks', description: 'A spicy, crunchy mix of fried snacks.', category: 'snacks', unit: 'pack', step: 1, basePrice: 45 },

  { key: 'tea', name: 'Tea Leaves', description: 'Strong black tea leaves for a proper cup of chai.', category: 'beverages', unit: 'pack', step: 1, basePrice: 180 },
  { key: 'coffee', name: 'Filter Coffee', description: 'Roasted and ground coffee for a classic filter brew.', category: 'beverages', unit: 'pack', step: 1, basePrice: 220 },

  { key: 'soap', name: 'Soap Bar', description: 'Everyday bathing soap bar.', category: 'household', unit: 'pcs', step: 1, basePrice: 35 },
  { key: 'detergent', name: 'Detergent Powder', description: 'All-purpose laundry detergent powder.', category: 'household', unit: 'pack', step: 1, basePrice: 95 },
  { key: 'toothpaste', name: 'Toothpaste', description: 'Everyday fluoride toothpaste for daily care.', category: 'household', unit: 'pcs', step: 1, basePrice: 55 },
]

// Real kirana stores mostly carry the same staples, but pricing and
// day-to-day stock varies store to store — this is what makes browsing a
// second or third store feel like an actual different shop.
const KIRANA_CATALOG_CONFIG = {
  k1: { priceMultiplier: 1.0, outOfStock: ['garlic', 'mixture'] },
  k2: { priceMultiplier: 1.1, outOfStock: ['ginger'] },
  k3: { priceMultiplier: 1.2, outOfStock: ['paneer', 'ghee'] },
  k4: { priceMultiplier: 0.9, outOfStock: ['eggs'] },
  k5: { priceMultiplier: 1.05, outOfStock: ['curd', 'butter'] },
}

export const SAMPLE_PRODUCTS = KIRANAS.flatMap((kirana) => {
  const config = KIRANA_CATALOG_CONFIG[kirana.id] ?? { priceMultiplier: 1, outOfStock: [] }

  return PRODUCT_TEMPLATE.map((item) => ({
    id: `${kirana.id}-${item.key}`,
    kirana_id: kirana.id,
    name: item.name,
    description: item.description,
    category: item.category,
    unit: item.unit,
    step: item.step,
    min_order_qty: item.minOrderQty ?? 1,
    price_rupees: Math.round(item.basePrice * config.priceMultiplier),
    in_stock: !config.outOfStock.includes(item.key),
    image_url: getProductImage(item.name),
  }))
})
