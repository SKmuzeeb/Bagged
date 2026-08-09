// Every kirana a customer can search for and shop from. Mirrors the rows
// inserted by supabase/tayaar.sql.
export const KIRANAS = [
  {
    id: 'k1',
    name: 'Rakesh Kirana Store',
    owner_name: 'Rakesh Sharma',
    address: 'Shop 12, Gachibowli Main Road, Hyderabad 500032',
    locality: 'Gachibowli, Hyderabad',
    city: 'Hyderabad',
    phone: '+91 98765 43210',
    tagline: 'Serving Gachibowli since 1998',
    hours_open: '07:00',
    hours_close: '22:00',
  },
  {
    id: 'k2',
    name: 'Sharma General Store',
    owner_name: 'Vinod Sharma',
    address: 'Shop 4, 100 Feet Road, Indiranagar, Bangalore 560038',
    locality: 'Indiranagar, Bangalore',
    city: 'Bangalore',
    phone: '+91 98450 11223',
    tagline: 'Your corner store since 2005',
    hours_open: '07:00',
    hours_close: '22:00',
  },
  {
    id: 'k3',
    name: 'Gupta Provision Store',
    owner_name: 'Anita Gupta',
    address: 'Shop 7, Veera Desai Road, Andheri West, Mumbai 400058',
    locality: 'Andheri West, Mumbai',
    city: 'Mumbai',
    phone: '+91 98200 33445',
    tagline: 'Family-run since 1985',
    hours_open: '07:00',
    hours_close: '22:00',
  },
  {
    id: 'k4',
    name: 'Patel Kirana & Grocers',
    owner_name: 'Jayesh Patel',
    address: 'B-22, Satellite Road, Ahmedabad 380015',
    locality: 'Satellite, Ahmedabad',
    city: 'Ahmedabad',
    phone: '+91 98980 55667',
    tagline: 'Quality groceries since 1992',
    hours_open: '07:00',
    hours_close: '22:00',
  },
  {
    id: 'k5',
    name: 'Singh Super Bazaar',
    owner_name: 'Harpreet Singh',
    address: 'Shop 15, Central Market, Lajpat Nagar, Delhi 110024',
    locality: 'Lajpat Nagar, Delhi',
    city: 'Delhi',
    phone: '+91 98100 77889',
    tagline: 'Neighborhood favorite since 2001',
    hours_open: '07:00',
    hours_close: '22:00',
  },
]

export function getKiranaById(id) {
  return KIRANAS.find((kirana) => kirana.id === id) || null
}

// The store spotlighted on the landing page's "Meet your kirana" section.
export const FEATURED_KIRANA = KIRANAS[0]
