import {
  collection, doc, getDocs, addDoc, updateDoc,
  deleteDoc, onSnapshot, query, orderBy, Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

export interface Product {
  id?: string
  name: string
  desc: string
  price: number
  category: 'citrus' | 'tropical' | 'berry' | 'green' | 'blend'
  badge: 'hot' | 'new' | 'sale' | ''
  rating: number
  reviews: number
  stock: number
  imageUrl?: string   // Firebase Storage download URL
  createdAt?: Timestamp
}

const COL = 'products'

export async function getProducts(): Promise<Product[]> {
  const snap = await getDocs(query(collection(db, COL), orderBy('createdAt', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product))
}

export function subscribeProducts(cb: (products: Product[]) => void) {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)))
  })
}

export async function addProduct(data: Omit<Product, 'id' | 'createdAt'>) {
  return addDoc(collection(db, COL), { ...data, createdAt: Timestamp.now() })
}

export async function updateProduct(id: string, data: Partial<Product>) {
  return updateDoc(doc(db, COL, id), data)
}

export async function deleteProduct(id: string) {
  return deleteDoc(doc(db, COL, id))
}

export const SEED_PRODUCTS: Omit<Product, 'id' | 'createdAt'>[] = [
  { name:'Mango Sunrise',   desc:'Sun-ripened mangoes with cold-pressed ginger and turmeric', price:2500, category:'tropical', badge:'hot',  rating:5, reviews:84,  stock:48, imageUrl:'' },
  { name:'Orange Burst',    desc:'Premium Valencia oranges, cold-pressed to perfection',       price:2000, category:'citrus',  badge:'',    rating:5, reviews:112, stock:60, imageUrl:'' },
  { name:'Berry Blast',     desc:'Wild strawberries, blueberries and açaí berries blended',   price:3000, category:'berry',   badge:'new', rating:4, reviews:47,  stock:32, imageUrl:'' },
  { name:'Green Detox',     desc:'Spinach, cucumber, celery, apple and fresh lemon cleanse',  price:2800, category:'green',   badge:'',    rating:5, reviews:93,  stock:27, imageUrl:'' },
  { name:'Pineapple Zest',  desc:'Fresh pineapple with coconut water and a squeeze of lime',  price:2200, category:'tropical',badge:'',    rating:4, reviews:61,  stock:55, imageUrl:'' },
  { name:'Apple Crisp',     desc:'Granny Smith apples with cinnamon and a touch of honey',    price:2100, category:'citrus',  badge:'',    rating:5, reviews:78,  stock:40, imageUrl:'' },
  { name:'Passion Punch',   desc:'Passion fruit, guava, pineapple and fresh mint fusion',     price:2700, category:'blend',   badge:'new', rating:5, reviews:39,  stock:22, imageUrl:'' },
  { name:'Watermelon Wave', desc:'Cooling watermelon with fresh basil and pressed lime',      price:1800, category:'tropical',badge:'sale',rating:4, reviews:55,  stock:70, imageUrl:'' },
  { name:'Grape Revival',   desc:'Dark grapes, pomegranate and red apple antioxidant blend',  price:3200, category:'berry',   badge:'',    rating:5, reviews:66,  stock:18, imageUrl:'' },
  { name:'Immunity Shield', desc:'Orange, ginger, turmeric, carrot and lemon power blend',   price:3500, category:'blend',   badge:'hot', rating:5, reviews:120, stock:35, imageUrl:'' },
  { name:'Kale Power',      desc:'Kale, spinach, green apple, ginger and fresh lemon',        price:2900, category:'green',   badge:'',    rating:4, reviews:43,  stock:14, imageUrl:'' },
  { name:'Citrus Sunrise',  desc:'Grapefruit, orange, lemon and a touch of cayenne pepper',   price:2300, category:'citrus',  badge:'',    rating:5, reviews:71,  stock:50, imageUrl:'' },
]
