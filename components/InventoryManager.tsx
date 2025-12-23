
import React, { useState } from 'react';
import { InventoryItem, UserRole } from '../types';
import { Search, Plus, Edit2, Trash2, Filter } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  role: UserRole;
  onUpdate: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ inventory, role, onUpdate, onDelete, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingItem, setEditingItem] = useState<Partial<InventoryItem> | null>(null);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const canDelete = role === UserRole.ADMIN;

  return (
    <div className="space-y-6 slide-up">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search medicines, batch..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {role === UserRole.ADMIN && (
            <button 
              onClick={() => onReset()}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors text-sm font-semibold"
            >
              Reset All
            </button>
          )}
          <button 
            onClick={() => setEditingItem({})}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
          >
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Medicine Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Batch / Expiry</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{item.name}</div>
                    <div className="text-xs text-slate-400">ID: {item.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{item.batchNumber}</div>
                    <div className={`text-xs ${new Date(item.expiryDate) < new Date() ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                      Expires: {item.expiryDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.stockQuantity < 50 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <span className="font-bold">{item.stockQuantity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">Wholesale: <span className="font-bold">₹{item.wholesalePrice}</span></div>
                    <div className="text-xs text-slate-400">Retail: ₹{item.retailPrice}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      {canDelete && (
                        <button 
                          onClick={() => onDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredInventory.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            No items found matching your criteria.
          </div>
        )}
      </div>

      {/* Edit Modal Placeholder */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 slide-up">
            <h3 className="text-xl font-bold mb-4">{editingItem.id ? 'Edit Medicine' : 'Add New Medicine'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-500 mb-1 block">Medicine Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  defaultValue={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Category</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  defaultValue={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Stock Quantity</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  defaultValue={editingItem.stockQuantity}
                  onChange={(e) => setEditingItem({...editingItem, stockQuantity: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Wholesale (₹)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  defaultValue={editingItem.wholesalePrice}
                  onChange={(e) => setEditingItem({...editingItem, wholesalePrice: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Retail (₹)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  defaultValue={editingItem.retailPrice}
                  onChange={(e) => setEditingItem({...editingItem, retailPrice: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setEditingItem(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                   onUpdate(editingItem as InventoryItem);
                   setEditingItem(null);
                }}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
