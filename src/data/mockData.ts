export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  competitorPrice: number;
  category: string;
  status: 'active' | 'out_of_stock' | 'draft';
  image: string;
  description?: string;
  seoScore?: number;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "PROD-1001",
    name: "Wireless Earbuds Pro - Noise Cancelling",
    sku: "WE-PRO-01",
    stock: 124,
    price: 3499,
    competitorPrice: 3200,
    category: "Electronics",
    status: "active",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=200&auto=format&fit=crop",
    description: "High quality wireless earbuds with active noise cancellation and 24 hour battery life."
  },
  {
    id: "PROD-1002",
    name: "Cotton Casual T-Shirt Men - Black",
    sku: "TSH-BLK-M",
    stock: 12,
    price: 850,
    competitorPrice: 850,
    category: "Fashion",
    status: "active",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop",
    description: "100% pure cotton black t-shirt for men. Comfortable and stylish for daily wear."
  },
  {
    id: "PROD-1003",
    name: "Smart Watch Series 8 Fitness Tracker",
    sku: "SW-8-FIT",
    stock: 0,
    price: 4999,
    competitorPrice: 5100,
    category: "Electronics",
    status: "out_of_stock",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=200&auto=format&fit=crop",
    description: "Track your fitness, heart rate and sleep with the latest Series 8 smart watch."
  },
  {
    id: "PROD-1004",
    name: "Stainless Steel Water Bottle 1L",
    sku: "WB-SS-1L",
    stock: 350,
    price: 1200,
    competitorPrice: 1350,
    category: "Home & Lifestyle",
    status: "active",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=200&auto=format&fit=crop",
    description: "Keep your drinks hot or cold for 12 hours with this durable 1L vacuum insulated bottle."
  },
  {
    id: "PROD-1005",
    name: "Yoga Mat Non-Slip Extra Thick",
    sku: "YM-THK-01",
    stock: 45,
    price: 1500,
    competitorPrice: 1400,
    category: "Sports & Outdoors",
    status: "active",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=200&auto=format&fit=crop",
    description: "Extra thick non-slip yoga mat ideal for Pilates, exercise, and home workouts."
  }
];

export const INITIAL_ORDERS: Order[] = [
  { id: "ORD-9921", customer: "Ahmad Ali", date: "2026-05-06T08:30:00Z", amount: 3499, status: "pending", items: 1 },
  { id: "ORD-9920", customer: "Sara Khan", date: "2026-05-05T14:20:00Z", amount: 1700, status: "shipped", items: 2 },
  { id: "ORD-9919", customer: "Usman Tariq", date: "2026-05-04T09:15:00Z", amount: 4999, status: "delivered", items: 1 },
  { id: "ORD-9918", customer: "Fatima Noor", date: "2026-05-04T12:00:00Z", amount: 1200, status: "cancelled", items: 1 },
];

export const SALES_DATA = [
  { day: 'Mon', revenue: 12500, orders: 15, profit: 3200 },
  { day: 'Tue', revenue: 15400, orders: 18, profit: 4100 },
  { day: 'Wed', revenue: 11000, orders: 12, profit: 2800 },
  { day: 'Thu', revenue: 18900, orders: 25, profit: 5400 },
  { day: 'Fri', revenue: 21000, orders: 30, profit: 6000 },
  { day: 'Sat', revenue: 26500, orders: 38, profit: 8200 },
  { day: 'Sun', revenue: 32000, orders: 45, profit: 10500 },
];
