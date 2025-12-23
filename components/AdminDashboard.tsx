
import React from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { InventoryItem, Order, OrderStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  inventory: InventoryItem[];
  orders: Order[];
  onAction: (id: string, action: OrderStatus) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ inventory, orders, onAction }) => {
  const stats = [
    { label: 'Total Sales', value: `₹${orders.filter(o => o.status === OrderStatus.DELIVERED).reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Orders', value: orders.filter(o => o.status === OrderStatus.PENDING).length, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Products', value: inventory.length, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Low Stock', value: inventory.filter(i => i.stockQuantity < 50).length, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING);

  // Sample data for charts
  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <div className="space-y-6 slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">Sales Overview</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-2 py-1 outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Pending Approvals</h3>
          <div className="flex-1 space-y-4 overflow-auto max-h-[300px] pr-2">
            {pendingOrders.length === 0 ? (
              <p className="text-center text-slate-400 mt-10 text-sm">No pending orders.</p>
            ) : (
              pendingOrders.map(order => (
                <div key={order.id} className="p-4 rounded-xl border border-slate-50 bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{order.customerName}</p>
                    <p className="text-xs text-slate-500">₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onAction(order.id, OrderStatus.ACCEPTED)}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => onAction(order.id, OrderStatus.DECLINED)}
                      className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="mt-4 w-full py-2 flex items-center justify-center gap-2 text-blue-600 font-semibold text-sm hover:underline">
            View All Orders <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
