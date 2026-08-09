// Canonical product name → image URL map, shared by sampleProducts.js and
// supabase/tayaar.sql (kept in sync by hand — both describe the same demo
// catalog) so local demo mode and a connected Supabase project look identical.
export const IMAGE_MAP = {
  'Basmati Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
  'Wheat Atta': 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=600&q=80',
  'Toor Dal': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80',
  Sugar: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=600&q=80',
  Salt: 'https://images.unsplash.com/photo-1518110925495-b37653dfb0e0?w=600&q=80',
  Bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
  'Sunflower Oil': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
  'Mustard Oil': 'https://images.unsplash.com/photo-1620705851610-fa39d0d40dfa?w=600&q=80',
  Tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
  Onion: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&q=80',
  Potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80',
  'Green Chilli': 'https://images.unsplash.com/photo-1583119912267-cc97c911e416?w=600&q=80',
  Coriander: 'https://images.unsplash.com/photo-1600788907416-456578634209?w=600&q=80',
  Ginger: 'https://images.unsplash.com/photo-1573414405626-8b3168ffea4c?w=600&q=80',
  Garlic: 'https://images.unsplash.com/photo-1615477550927-6ec8445fabbf?w=600&q=80',
  Milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80',
  Curd: 'https://images.unsplash.com/photo-1571212515416-fca325dbfe12?w=600&q=80',
  Paneer: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80',
  Ghee: 'https://images.unsplash.com/photo-1631452180775-2b26c9fc6c04?w=600&q=80',
  Butter: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80',
  'Maggi Noodles': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&q=80',
  'Parle-G Biscuits': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80',
  'Potato Chips': 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=600&q=80',
  'Mixture Snacks': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&q=80',
  'Tea Leaves': 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&q=80',
  'Filter Coffee': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
  'Soap Bar': 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80',
  'Detergent Powder': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&q=80',
  Toothpaste: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=80',
  Eggs: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&q=80',
}

export const HERO_IMAGES = {
  storefront: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&q=80',
  vegetableBasket: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
  spicesFlatLay: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80',
  shopkeeperPortrait: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=800&q=80',
}

export function getProductImage(name) {
  return IMAGE_MAP[name] || null
}
