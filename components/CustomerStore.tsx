
import React, { useState, useMemo } from 'react';
import { InventoryItem, OrderItem } from '../types';
import { APP_CONFIG } from '../constants';
import { Search, ShoppingCart, Info, Plus, Minus, X, Trash2, Package, MapPin, Calendar, CheckCircle, Clock, CheckCircle2 } from 'lucide-react';

interface CustomerStoreProps {
  inventory: InventoryItem[];
  onPlaceOrder: (items: OrderItem[], address: string, deliveryDate: string) => void;
}

const CustomerStore: React.FC<CustomerStoreProps> = ({ inventory, onPlaceOrder }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  
  // Delivery form state
  const [address, setAddress] = useState('');
  const [stateType, setStateType] = useState<'Bihar' | 'Other'>('Bihar');
  const [deliveryDate, setDeliveryDate] = useState('');

  const addToCart = (item: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.itemId === item.id);
      if (existing) {
        return prev.map(i => i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { itemId: item.id, name: item.name, price: item.wholesalePrice, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.itemId === itemId) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const filteredInventory = inventory.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) && i.stockQuantity > 0
  );

  const cartTotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const isFreeDelivery = cartTotal >= APP_CONFIG.freeDeliveryThreshold;

  // Calculate minimum delivery date based on state (Bihar: 7 days, Other: 14 days)
  const minDate = useMemo(() => {
    const date = new Date();
    const daysToAdd = stateType === 'Bihar' ? 7 : 14;
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split('T')[0];
  }, [stateType]);

  const handleFinalOrder = () => {
    if (!address.trim()) {
      alert("Delivery address is mandatory.");
      return;
    }
    if (!deliveryDate) {
      alert("Please select a requested delivery date.");
      return;
    }
    
    onPlaceOrder(cart, address, deliveryDate);
    setCart([]);
    setIsCartOpen(false);
    setShowDeliveryForm(false);
    setAddress('');
    setDeliveryDate('');
  };

  return (
    <div className="space-y-6 relative slide-up pb-20">
      {/* Free Delivery Promo */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-2xl text-white flex items-center justify-between shadow-lg shadow-blue-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Package size={20} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wider">Free Delivery Offer</p>
            <p className="text-xs text-blue-100 font-medium">Orders above ₹{APP_CONFIG.freeDeliveryThreshold.toLocaleString()} qualify for free shipping.</p>
          </div>
        </div>
        <div className="hidden sm:block">
          {cartTotal > 0 && cartTotal < APP_CONFIG.freeDeliveryThreshold ? (
            <p className="text-[10px] font-bold bg-white/10 px-3 py-1 rounded-full">
              Add ₹{(APP_CONFIG.freeDeliveryThreshold - cartTotal).toLocaleString()} more for FREE delivery
            </p>
          ) : isFreeDelivery ? (
            <div className="flex items-center gap-1 text-[10px] font-bold bg-green-500 px-3 py-1 rounded-full">
              <CheckCircle2 size={12} /> FREE DELIVERY UNLOCKED
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm sticky top-0 md:top-8 z-20">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for medicines..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 font-semibold"
        >
          <ShoppingCart size={20} />
          <span className="hidden md:inline">Cart</span>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Package size={24} />
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-50 px-2 py-1 rounded-md">
                {item.category}
              </span>
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-1">{item.name}</h4>
            <p className="text-xs text-slate-400 mb-4">Batch: {item.batchNumber} • Exp: {item.expiryDate}</p>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-700 font-bold text-xl">₹{item.wholesalePrice}</span>
              <span className="text-slate-400 text-sm line-through">₹{item.retailPrice}</span>
              <span className="text-green-600 text-xs font-bold">Wholesale</span>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className={`text-xs font-medium ${item.stockQuantity < 50 ? 'text-amber-600' : 'text-slate-400'}`}>
                {item.stockQuantity < 50 ? `Limited Stock: ${item.stockQuantity}` : 'In Stock'}
              </span>
              <button 
                onClick={() => addToCart(item)}
                className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => { if(!showDeliveryForm) setIsCartOpen(false); }}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col slide-up">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {showDeliveryForm ? <><MapPin className="text-blue-600" /> Delivery Details</> : <><ShoppingCart className="text-blue-600" /> My Cart</>}
              </h3>
              <button onClick={() => { setIsCartOpen(false); setShowDeliveryForm(false); }} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {!showDeliveryForm ? (
                <div className="space-y-6">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 gap-4">
                      <div className="p-6 bg-slate-50 rounded-full">
                        <ShoppingCart size={48} />
                      </div>
                      <p>Your cart is empty.</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.itemId} className="flex gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-sm text-blue-600 font-semibold">₹{item.price} / unit</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.itemId, -1)} className="p-1 border border-slate-200 rounded-lg hover:bg-slate-50"><Minus size={16} /></button>
                          <span className="font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.itemId, 1)} className="p-1 border border-slate-200 rounded-lg hover:bg-slate-50"><Plus size={16} /></button>
                        </div>
                        <button onClick={() => updateQuantity(item.itemId, -item.quantity)} className="p-1 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Shipping To</label>
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                      <button 
                        onClick={() => { setStateType('Bihar'); setDeliveryDate(''); }}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${stateType === 'Bihar' ? 'bg-white shadow text-blue-700' : 'text-slate-500'}`}
                      >
                        Bihar
                      </button>
                      <button 
                        onClick={() => { setStateType('Other'); setDeliveryDate(''); }}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${stateType === 'Other' ? 'bg-white shadow text-blue-700' : 'text-slate-500'}`}
                      >
                        Outside Bihar
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Full Delivery Address (Compulsory)</label>
                    <textarea 
                      required
                      placeholder="Enter full address, City, Pincode"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm min-h-[100px]"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Required Date (Compulsory)</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="date"
                        required
                        min={minDate}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                      />
                    </div>
                    <p className="text-[10px] text-blue-600 mt-2 font-semibold">
                      {stateType === 'Bihar' ? 'Bihar: Min 7 days required' : 'Outside Bihar: Min 14 days required'}
                    </p>
                  </div>

                  {!isFreeDelivery && (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                      <Clock className="text-amber-600 flex-shrink-0" size={18} />
                      <p className="text-xs text-amber-700 font-medium">
                        Delivery cost will be calculated and disclosed within 2 days after order acceptance.
                      </p>
                    </div>
                  )}
                  {isFreeDelivery && (
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex gap-3">
                      <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                      <p className="text-xs text-green-700 font-bold uppercase">
                        Free delivery applied! (Order exceeds ₹{APP_CONFIG.freeDeliveryThreshold.toLocaleString()})
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Items Total</span>
                  <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-slate-500">Delivery Cost</span>
                  {isFreeDelivery ? (
                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded uppercase">
                      FREE DELIVERY
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded uppercase">
                      PENDING APPROVAL
                    </span>
                  )}
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between text-xl font-black text-slate-900">
                  <span>Grand Total</span>
                  <span>₹{cartTotal.toLocaleString()}{!isFreeDelivery ? ' + Delivery' : ''}</span>
                </div>
                
                {!showDeliveryForm ? (
                  <button 
                    onClick={() => setShowDeliveryForm(true)}
                    className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    Next Step <CheckCircle size={20} />
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => setShowDeliveryForm(false)} className="flex-1 py-4 bg-slate-200 text-slate-600 font-bold rounded-2xl">Back</button>
                    <button onClick={handleFinalOrder} className="flex-[2] py-4 bg-slate-900 text-white font-black rounded-2xl shadow-lg">Confirm Order</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerStore;
