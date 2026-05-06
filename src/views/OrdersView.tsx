import { Order } from '../data/mockData';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface OrdersViewProps {
  orders: Order[];
}

export default function OrdersView({ orders }: OrdersViewProps) {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
        <p className="text-sm text-slate-500">Monitor fulfillment and customer purchases.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4 text-right">Amount (Rs)</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-700">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {format(new Date(order.date), "MMM d, yyyy HH:mm")}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {order.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                        order.status === 'delivered' ? "bg-emerald-100 text-emerald-700" : 
                        order.status === 'shipped' ? "bg-blue-100 text-blue-700" : 
                        order.status === 'cancelled' ? "bg-rose-100 text-rose-700" : 
                        "bg-orange-100 text-orange-800"
                      )}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <FileText size={48} className="mb-4 opacity-50" />
            <p>No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
