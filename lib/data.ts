// ── Types ──────────────────────────────────────────────────────────
export interface Product {
  id: number
  name: string
  desc: string
  price: number
  category: 'citrus' | 'tropical' | 'berry' | 'green' | 'blend'
  badge?: 'hot' | 'new' | 'sale' | ''
  rating: number
  reviews: number
  stock: number
}

export interface Order {
  id: string
  customer: string
  email: string
  phone: string
  address: string
  state: string
  items: { name: string; qty: number; price: number }[]
  subtotal: number
  delivery: number
  total: number
  status: 'pending' | 'processing' | 'delivered' | 'cancelled'
  paymentMethod: string
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  totalSpent: number
  joinedAt: string
  state: string
}

// ── Products ───────────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  { id:1,  name:'Mango Sunrise',   desc:'Sun-ripened mangoes with cold-pressed ginger and turmeric', price:2500, category:'tropical', badge:'hot',  rating:5, reviews:84,  stock:48 },
  { id:2,  name:'Orange Burst',    desc:'Premium Valencia oranges, cold-pressed to perfection',       price:2000, category:'citrus',  badge:'',    rating:5, reviews:112, stock:60 },
  { id:3,  name:'Berry Blast',     desc:'Wild strawberries, blueberries and açaí berries blended',   price:3000, category:'berry',   badge:'new', rating:4, reviews:47,  stock:32 },
  { id:4,  name:'Green Detox',     desc:'Spinach, cucumber, celery, apple and fresh lemon cleanse',  price:2800, category:'green',   badge:'',    rating:5, reviews:93,  stock:27 },
  { id:5,  name:'Pineapple Zest',  desc:'Fresh pineapple with coconut water and a squeeze of lime',  price:2200, category:'tropical',badge:'',    rating:4, reviews:61,  stock:55 },
  { id:6,  name:'Apple Crisp',     desc:'Granny Smith apples with cinnamon and a touch of honey',    price:2100, category:'citrus',  badge:'',    rating:5, reviews:78,  stock:40 },
  { id:7,  name:'Passion Punch',   desc:'Passion fruit, guava, pineapple and fresh mint fusion',     price:2700, category:'blend',   badge:'new', rating:5, reviews:39,  stock:22 },
  { id:8,  name:'Watermelon Wave', desc:'Cooling watermelon with fresh basil and pressed lime',      price:1800, category:'tropical',badge:'sale',rating:4, reviews:55,  stock:70 },
  { id:9,  name:'Grape Revival',   desc:'Dark grapes, pomegranate and red apple antioxidant blend',  price:3200, category:'berry',   badge:'',    rating:5, reviews:66,  stock:18 },
  { id:10, name:'Immunity Shield', desc:'Orange, ginger, turmeric, carrot and lemon power blend',   price:3500, category:'blend',   badge:'hot', rating:5, reviews:120, stock:35 },
  { id:11, name:'Kale Power',      desc:'Kale, spinach, green apple, ginger and fresh lemon',        price:2900, category:'green',   badge:'',    rating:4, reviews:43,  stock:14 },
  { id:12, name:'Citrus Sunrise',  desc:'Grapefruit, orange, lemon and a touch of cayenne pepper',   price:2300, category:'citrus',  badge:'',    rating:5, reviews:71,  stock:50 },
]

// ── Mock Orders ────────────────────────────────────────────────────
export const ORDERS: Order[] = [
  { id:'FG-104821', customer:'Adaeze Okonkwo', email:'adaeze@email.com', phone:'+234 802 111 2233', address:'15 Mango Close, Victoria Island', state:'Lagos', items:[{name:'Mango Sunrise',qty:2,price:2500},{name:'Green Detox',qty:1,price:2800}], subtotal:7800, delivery:0, total:7800, status:'delivered', paymentMethod:'Debit Card', createdAt:'2025-04-03T09:14:00Z' },
  { id:'FG-104820', customer:'Emeka Nwachukwu', email:'emeka@email.com', phone:'+234 803 444 5566', address:'7 Abubakar Tafawa Balewa Way', state:'Abuja (FCT)', items:[{name:'Immunity Shield',qty:3,price:3500}], subtotal:10500, delivery:0, total:10500, status:'processing', paymentMethod:'Bank Transfer', createdAt:'2025-04-03T08:01:00Z' },
  { id:'FG-104819', customer:'Funmi Adeleke', email:'funmi@email.com', phone:'+234 805 777 8899', address:'22 Rumuola Road, D/Line', state:'Rivers', items:[{name:'Berry Blast',qty:2,price:3000},{name:'Orange Burst',qty:2,price:2000}], subtotal:10000, delivery:0, total:10000, status:'delivered', paymentMethod:'Debit Card', createdAt:'2025-04-02T17:30:00Z' },
  { id:'FG-104818', customer:'Tunde Bakare', email:'tunde@email.com', phone:'+234 807 123 4567', address:'45 Awolowo Road, Ikoyi', state:'Lagos', items:[{name:'Watermelon Wave',qty:4,price:1800}], subtotal:7200, delivery:0, total:7200, status:'pending', paymentMethod:'Pay on Delivery', createdAt:'2025-04-02T15:10:00Z' },
  { id:'FG-104817', customer:'Ngozi Eze', email:'ngozi@email.com', phone:'+234 809 321 6540', address:'3 Independence Layout', state:'Enugu', items:[{name:'Pineapple Zest',qty:1,price:2200},{name:'Apple Crisp',qty:1,price:2100}], subtotal:4300, delivery:500, total:4800, status:'delivered', paymentMethod:'USSD', createdAt:'2025-04-01T11:20:00Z' },
  { id:'FG-104816', customer:'Chidi Okeke', email:'chidi@email.com', phone:'+234 801 654 3210', address:'12 Trans Amadi Industrial', state:'Rivers', items:[{name:'Grape Revival',qty:2,price:3200},{name:'Passion Punch',qty:2,price:2700}], subtotal:11800, delivery:0, total:11800, status:'cancelled', paymentMethod:'Debit Card', createdAt:'2025-03-31T14:05:00Z' },
  { id:'FG-104815', customer:'Amaka Obi', email:'amaka@email.com', phone:'+234 802 888 9900', address:'8 Agodi GRA', state:'Oyo', items:[{name:'Kale Power',qty:3,price:2900}], subtotal:8700, delivery:0, total:8700, status:'delivered', paymentMethod:'Debit Card', createdAt:'2025-03-30T09:45:00Z' },
  { id:'FG-104814', customer:'Seun Lawal', email:'seun@email.com', phone:'+234 803 555 1234', address:'19 Obafemi Awolowo Way', state:'Lagos', items:[{name:'Citrus Sunrise',qty:2,price:2300},{name:'Mango Sunrise',qty:1,price:2500}], subtotal:7100, delivery:0, total:7100, status:'processing', paymentMethod:'Bank Transfer', createdAt:'2025-03-29T16:30:00Z' },
]

// ── Mock Customers ─────────────────────────────────────────────────
export const CUSTOMERS: Customer[] = [
  { id:'C001', name:'Adaeze Okonkwo',   email:'adaeze@email.com', phone:'+234 802 111 2233', orders:12, totalSpent:94400, joinedAt:'2024-08-10', state:'Lagos' },
  { id:'C002', name:'Emeka Nwachukwu',  email:'emeka@email.com',  phone:'+234 803 444 5566', orders:8,  totalSpent:68200, joinedAt:'2024-09-22', state:'Abuja (FCT)' },
  { id:'C003', name:'Funmi Adeleke',    email:'funmi@email.com',  phone:'+234 805 777 8899', orders:15, totalSpent:121500, joinedAt:'2024-07-15', state:'Rivers' },
  { id:'C004', name:'Tunde Bakare',     email:'tunde@email.com',  phone:'+234 807 123 4567', orders:4,  totalSpent:31800, joinedAt:'2024-11-03', state:'Lagos' },
  { id:'C005', name:'Ngozi Eze',        email:'ngozi@email.com',  phone:'+234 809 321 6540', orders:6,  totalSpent:46200, joinedAt:'2024-10-18', state:'Enugu' },
  { id:'C006', name:'Chidi Okeke',      email:'chidi@email.com',  phone:'+234 801 654 3210', orders:9,  totalSpent:72500, joinedAt:'2024-08-30', state:'Rivers' },
  { id:'C007', name:'Amaka Obi',        email:'amaka@email.com',  phone:'+234 802 888 9900', orders:11, totalSpent:89300, joinedAt:'2024-09-05', state:'Oyo' },
  { id:'C008', name:'Seun Lawal',       email:'seun@email.com',   phone:'+234 803 555 1234', orders:7,  totalSpent:55900, joinedAt:'2024-10-29', state:'Lagos' },
]

// ── Revenue chart data ─────────────────────────────────────────────
export const MONTHLY_REVENUE = [
  { month:'Oct', revenue:312000, orders:41 },
  { month:'Nov', revenue:428000, orders:57 },
  { month:'Dec', revenue:611000, orders:82 },
  { month:'Jan', revenue:389000, orders:52 },
  { month:'Feb', revenue:472000, orders:63 },
  { month:'Mar', revenue:558000, orders:74 },
  { month:'Apr', revenue:241000, orders:32 },
]

// ── Auth ───────────────────────────────────────────────────────────
export const ADMIN_CREDENTIALS = {
  email: 'admin@fruitguard.com',
  // password: FruitGuard@2025  (bcrypt hash below)
  passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
}

export const JWT_SECRET = 'fruitguard-super-secret-jwt-key-2025'
