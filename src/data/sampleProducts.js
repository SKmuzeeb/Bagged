import { getProductImage } from '../lib/imageMap.js'
import { KIRANA } from './kirana.js'

function product(spec) {
  return {
    kirana_id: KIRANA.id,
    in_stock: true,
    min_order_qty: 1,
    ...spec,
    image_url: getProductImage(spec.name),
  }
}

// 30 products, matching supabase/tayaar.sql, so demo mode and a connected
// Supabase project always show the same catalog. This is the data source
// the app runs on out of the box, before any Supabase project exists.
export const SAMPLE_PRODUCTS = [
  // Staples
  product({ id: 'p1', name: 'Basmati Rice', name_hindi: 'बासमती चावल', category: 'staples', price_rupees: 120, unit: 'kg', step: 0.25 }),
  product({ id: 'p2', name: 'Wheat Atta', name_hindi: 'गेहूं का आटा', category: 'staples', price_rupees: 55, unit: 'kg', step: 0.25 }),
  product({ id: 'p3', name: 'Toor Dal', name_hindi: 'तूर दाल', category: 'staples', price_rupees: 140, unit: 'kg', step: 0.25 }),
  product({ id: 'p4', name: 'Sugar', name_hindi: 'चीनी', category: 'staples', price_rupees: 45, unit: 'kg', step: 0.25 }),
  product({ id: 'p5', name: 'Salt', name_hindi: 'नमक', category: 'staples', price_rupees: 22, unit: 'kg', step: 0.25 }),
  product({ id: 'p6', name: 'Bread', name_hindi: 'ब्रेड', category: 'staples', price_rupees: 45, unit: 'pack', step: 1 }),

  // Oils
  product({ id: 'p7', name: 'Sunflower Oil', name_hindi: 'सूरजमुखी तेल', category: 'oils', price_rupees: 150, unit: 'l', step: 0.25 }),
  product({ id: 'p8', name: 'Mustard Oil', name_hindi: 'सरसों तेल', category: 'oils', price_rupees: 165, unit: 'l', step: 0.25 }),

  // Vegetables
  product({ id: 'p9', name: 'Tomato', name_hindi: 'टमाटर', category: 'vegetables', price_rupees: 30, unit: 'kg', step: 0.25 }),
  product({ id: 'p10', name: 'Onion', name_hindi: 'प्याज़', category: 'vegetables', price_rupees: 35, unit: 'kg', step: 0.25 }),
  product({ id: 'p11', name: 'Potato', name_hindi: 'आलू', category: 'vegetables', price_rupees: 25, unit: 'kg', step: 0.25 }),
  product({ id: 'p12', name: 'Green Chilli', name_hindi: 'हरी मिर्च', category: 'vegetables', price_rupees: 60, unit: 'kg', step: 0.25 }),
  product({ id: 'p13', name: 'Coriander', name_hindi: 'धनिया पत्ता', category: 'vegetables', price_rupees: 10, unit: 'pack', step: 1 }),
  product({ id: 'p14', name: 'Ginger', name_hindi: 'अदरक', category: 'vegetables', price_rupees: 90, unit: 'kg', step: 0.25 }),
  product({ id: 'p15', name: 'Garlic', name_hindi: 'लहसुन', category: 'vegetables', price_rupees: 110, unit: 'kg', step: 0.25, in_stock: false }),

  // Dairy
  product({ id: 'p16', name: 'Milk', name_hindi: 'दूध', category: 'dairy', price_rupees: 32, unit: 'l', step: 0.5 }),
  product({ id: 'p17', name: 'Curd', name_hindi: 'दही', category: 'dairy', price_rupees: 40, unit: 'pack', step: 1 }),
  product({ id: 'p18', name: 'Paneer', name_hindi: 'पनीर', category: 'dairy', price_rupees: 320, unit: 'kg', step: 0.25 }),
  product({ id: 'p19', name: 'Ghee', name_hindi: 'घी', category: 'dairy', price_rupees: 550, unit: 'kg', step: 0.25 }),
  product({ id: 'p20', name: 'Butter', name_hindi: 'मक्खन', category: 'dairy', price_rupees: 250, unit: 'pack', step: 1 }),
  product({ id: 'p21', name: 'Eggs', name_hindi: 'अंडा', category: 'dairy', price_rupees: 7, unit: 'pcs', step: 1, min_order_qty: 6 }),

  // Snacks
  product({ id: 'p22', name: 'Maggi Noodles', name_hindi: 'मैगी नूडल्स', category: 'snacks', price_rupees: 14, unit: 'pcs', step: 1 }),
  product({ id: 'p23', name: 'Parle-G Biscuits', name_hindi: 'पार्ले-जी बिस्कुट', category: 'snacks', price_rupees: 10, unit: 'pack', step: 1 }),
  product({ id: 'p24', name: 'Potato Chips', name_hindi: 'आलू चिप्स', category: 'snacks', price_rupees: 20, unit: 'pack', step: 1 }),
  product({ id: 'p25', name: 'Mixture Snacks', name_hindi: 'मिक्सचर', category: 'snacks', price_rupees: 45, unit: 'pack', step: 1, in_stock: false }),

  // Beverages
  product({ id: 'p26', name: 'Tea Leaves', name_hindi: 'चाय पत्ती', category: 'beverages', price_rupees: 180, unit: 'pack', step: 1 }),
  product({ id: 'p27', name: 'Filter Coffee', name_hindi: 'फिल्टर कॉफी', category: 'beverages', price_rupees: 220, unit: 'pack', step: 1 }),

  // Household
  product({ id: 'p28', name: 'Soap Bar', name_hindi: 'साबुन', category: 'household', price_rupees: 35, unit: 'pcs', step: 1 }),
  product({ id: 'p29', name: 'Detergent Powder', name_hindi: 'डिटर्जेंट पाउडर', category: 'household', price_rupees: 95, unit: 'pack', step: 1 }),
  product({ id: 'p30', name: 'Toothpaste', name_hindi: 'टूथपेस्ट', category: 'household', price_rupees: 55, unit: 'pcs', step: 1 }),
]
