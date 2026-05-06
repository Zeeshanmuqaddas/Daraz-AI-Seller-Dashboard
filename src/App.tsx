import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp, 
  Settings,
  Bot,
  Bell,
  Search,
  Menu,
  X,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from './lib/utils';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, SALES_DATA, Product, Order } from './data/mockData';
import AgentConsole from './views/AgentConsole';
import ProductsView from './views/ProductsView';
import OrdersView from './views/OrdersView';

type ViewType = 'dashboard' | 'products' | 'orders' | 'agent';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global App State to allow AI modifications
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const navigation = [
    { name: 'Overview', id: 'dashboard', icon: LayoutDashboard },
    { name: 'Products', id: 'products', icon: Package },
    { name: 'Orders', id: 'orders', icon: ShoppingCart },
    { name: 'AI Agent Console', id: 'agent', icon: Bot },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900">
      
      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 md:static md:translate-x-0 flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center flex-shrink-0 px-6 gap-3 border-b border-white/10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
            <Bot size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Daraz AI Agent</span>
          <button 
            className="ml-auto md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setCurrentView(item.id as ViewType);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "flex items-center w-full gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-orange-500 text-white" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.name}
              </button>
            )
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 flex items-center justify-center">
              <span className="font-semibold text-white">SA</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Selling Agent</span>
              <span className="text-xs text-green-400">Online & Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-slate-800 capitalize">
              {currentView === 'agent' ? 'AI Agent Console' : currentView}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block w-64 pointer-events-none opacity-50">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm focus:outline-none"
                readOnly
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-500">
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-orange-500" />
            </button>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="flex-1 overflow-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'products' && <ProductsView products={products} setProducts={setProducts} setCurrentView={setCurrentView} />}
          {currentView === 'orders' && <OrdersView orders={orders} />}
          {currentView === 'agent' && (
            <AgentConsole 
              products={products} 
              setProducts={setProducts}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardView() {
  const metrics = [
    { title: "Total Sales", value: "Rs 137,300", change: "+12.5%", trend: "up" },
    { title: "Profit Estimation", value: "Rs 40,200", change: "+8.2%", trend: "up" },
    { title: "Pending Orders", value: "8", change: "-2", trend: "down" },
    { title: "Low Stock Items", value: "2", active: true },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <div key={i} className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{metric.title}</span>
              {metric.active && <AlertTriangle size={16} className="text-rose-500" />}
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-slate-900">{metric.value}</span>
              {metric.change && (
                <span className={cn(
                  "text-sm font-medium mb-1",
                  metric.trend === 'up' ? "text-emerald-600" : "text-rose-600",
                  "flex items-center"
                )}>
                  {metric.trend === 'up' ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
                  {metric.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Revenue Overview</h2>
            <select className="text-sm border-slate-200 rounded-md bg-slate-50 py-1 px-2 pointer-events-none opacity-50">
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-500" />
            AI Insights
          </h2>
          <div className="space-y-4 flex-1">
            <div className="rounded-lg bg-orange-50 p-3 border border-orange-100">
              <h3 className="text-sm font-semibold text-orange-800 mb-1">Pricing Alert</h3>
              <p className="text-xs text-orange-700">Competitors dropped price for "Wireless Earbuds Pro" to Rs 3,200. Suggest matching to maintain buy box.</p>
            </div>
            <div className="rounded-lg bg-rose-50 p-3 border border-rose-100">
              <h3 className="text-sm font-semibold text-rose-800 mb-1">Stock Warning</h3>
              <p className="text-xs text-rose-700">"Smart Watch Series 8" is OUT OF STOCK. Missed estimated Rs 10,000 in sales today.</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-100">
              <h3 className="text-sm font-semibold text-emerald-800 mb-1">Sales Milestone</h3>
              <p className="text-xs text-emerald-700">Week-over-week revenue increased by 12.5%. Great job maintaining fulfillment speed.</p>
            </div>
          </div>
          <button className="mt-4 w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
            Generate Full Report
          </button>
        </div>
      </div>
    </div>
  );
}
