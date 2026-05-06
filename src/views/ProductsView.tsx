import React from 'react';
import { Product } from '../data/mockData';
import { PackageSearch, TrendingDown, ArrowUpRight, Copy } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductsViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCurrentView: (view: any) => void;
}

export default function ProductsView({ products, setCurrentView }: ProductsViewProps) {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Product Management</h2>
          <p className="text-sm text-slate-500">Monitor pricing, stock constraints, and competitor data.</p>
        </div>
        <button 
          onClick={() => setCurrentView('agent')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          Ask AI to Optimize
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">SKU / ID</th>
                <th className="px-6 py-4">Description & SEO</th>
                <th className="px-6 py-4 text-right">Pricing (Rs)</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => {
                const isOverpriced = product.price > product.competitorPrice;
                const isOutOfStock = product.stock === 0;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-10 h-10 rounded-md object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-medium text-slate-900 w-48 truncate">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-slate-700">{product.sku}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{product.id}</p>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                       <p className="text-xs text-slate-600 truncate">{product.description || 'No description'}</p>
                       {product.seoScore !== undefined ? (
                         <div className="flex items-center gap-1 mt-1">
                           <span className={cn(
                             "text-[10px] px-1.5 py-0.5 rounded-sm font-medium",
                             product.seoScore >= 80 ? "bg-emerald-100 text-emerald-700" :
                             product.seoScore >= 50 ? "bg-orange-100 text-orange-700" : "bg-rose-100 text-rose-700"
                           )}>
                              SEO: {product.seoScore}
                           </span>
                           <span className="text-[10px] text-emerald-600 flex items-center">
                             <ArrowUpRight size={10} /> Optimized
                           </span>
                         </div>
                       ) : (
                         <button 
                           onClick={() => setCurrentView('agent')}
                           className="text-[10px] text-indigo-600 font-medium hover:underline mt-1 block"
                         >
                           Needs SEO Optimization
                         </button>
                       )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-end justify-center">
                        <span className="font-bold text-slate-900">{product.price.toLocaleString()}</span>
                        <div className={cn(
                          "flex items-center text-xs mt-1 font-medium",
                          isOverpriced ? "text-rose-500" : "text-emerald-500"
                        )}>
                          {isOverpriced ? <TrendingDown size={12} className="mr-1" /> : <ArrowUpRight size={12} className="mr-1" />}
                          Comp: {product.competitorPrice.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "font-medium",
                        isOutOfStock ? "text-rose-600" : product.stock < 20 ? "text-orange-600" : "text-slate-700"
                      )}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                        product.status === 'active' ? "bg-emerald-100 text-emerald-700" : 
                        product.status === 'out_of_stock' ? "bg-rose-100 text-rose-700" : 
                        "bg-slate-100 text-slate-700"
                      )}>
                        {product.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <PackageSearch size={48} className="mb-4 opacity-50" />
            <p>No products found in store.</p>
          </div>
        )}
      </div>
    </div>
  );
}
