
import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  InventoryItem, 
  Order, 
  SupportTicket, 
  OrderStatus, 
  OrderItem 
} from './types';
import { MOCK_INVENTORY, APP_CONFIG } from './constants';
import SplashScreen from './components/SplashScreen';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import InventoryManager from './components/InventoryManager';
import CustomerStore from './components/CustomerStore';
import Support from './components/Support';
import { 
  ShieldCheck, 
  Smartphone, 
  Mail,
  CheckCircle2,
  Users,
  MapPin,
  Calendar,
  Check,
  X as XIcon,
  Clock,
  IndianRupee,
  BadgeAlert
} from 'lucide-react';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Auth Form State
  const [authStep, setAuthStep] = useState<'LOGIN' | 'OTP' | 'VERIFIED'>('LOGIN');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);

  // Initialize
  useEffect(() => {
    const savedUser = localStorage.getItem('medimart_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      setActiveTab(u.role === UserRole.CUSTOMER ? 'store' : 'dashboard');
    }
  }, []);

  const handleLogin = () => {
    if (phone.length < 10) return alert('Enter valid phone number');
    setAuthStep('OTP');
  };

  const handleVerifyOtp = () => {
    if (otp !== '1234') return alert('Incorrect OTP (Use 1234)');
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedRole === UserRole.ADMIN ? 'Harsh Admin' : 'Demo Customer',
      email: selectedRole === UserRole.ADMIN ? 'admin@harshpharmacy.com' : 'customer@demo.com',
      phone: phone,
      role: selectedRole,
      isVerified: true,
      address: 'Harsh Enterprises, Patna, Bihar'
    };
    
    setUser(newUser);
    localStorage.setItem('medimart_user', JSON.stringify(newUser));
    setAuthStep('VERIFIED');
    setTimeout(() => {
      setActiveTab(newUser.role === UserRole.CUSTOMER ? 'store' : 'dashboard');
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('medimart_user');
    setUser(null);
    setAuthStep('LOGIN');
    setPhone('');
    setOtp('');
  };

  const handleUpdateInventory = (item: InventoryItem) => {
    setInventory(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? item : i);
      }
      return [...prev, { ...item, id: Math.random().toString(36).substr(2, 9) }];
    });
  };

  const handleDeleteInventory = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const handleResetInventory = () => {
    if (confirm('Are you sure you want to reset all inventory?')) {
      setInventory(MOCK_INVENTORY);
    }
  };

  const handlePlaceOrder = (items: OrderItem[], address: string, deliveryDate: string) => {
    const amount = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const isFree = amount >= APP_CONFIG.freeDeliveryThreshold;
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: user?.id || 'guest',
      customerName: user?.name || 'Guest',
      phone: user?.phone || '',
      email: user?.email || '',
      address: address,
      lastDeliveryDate: deliveryDate,
      items,
      totalAmount: amount,
      deliveryCharge: isFree ? 0 : 0, // 0 for now, admin will confirm/set
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    
    setOrders(prev => [newOrder, ...prev]);
    const msg = isFree 
      ? 'Order placed! Free delivery qualified. Waiting for Admin approval.'
      : 'Order placed! Delivery cost will be updated by Admin upon acceptance.';
    alert(msg);
    setActiveTab('orders');
  };

  const handleOrderAction = (id: string, action: OrderStatus, deliveryCharge?: number) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        return { ...o, status: action, deliveryCharge: deliveryCharge !== undefined ? deliveryCharge : o.deliveryCharge };
      }
      return o;
    }));
  };

  const handleAddTicket = (ticket: Partial<SupportTicket>) => {
    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: ticket.customerId!,
      customerName: ticket.customerName!,
      subject: ticket.subject!,
      message: ticket.message!,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden slide-up">
          <div className="p-8 bg-blue-700 text-white text-center">
            <img src={APP_CONFIG.logoUrl} className="w-16 h-16 mx-auto mb-4 bg-white p-2 rounded-2xl" alt="Logo" />
            <h1 className="text-2xl font-black">MediMart Pro</h1>
            <p className="text-blue-200 text-sm mt-1 uppercase tracking-widest font-bold">Harsh Enterprises</p>
          </div>
          
          <div className="p-8">
            {authStep === 'LOGIN' && (
              <div className="space-y-6">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                  {(Object.keys(UserRole) as (keyof typeof UserRole)[]).map(role => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(UserRole[role])}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        selectedRole === UserRole[role] ? 'bg-white shadow text-blue-700' : 'text-slate-500'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block flex items-center gap-2">
                    <Smartphone size={16} className="text-blue-500" /> Phone Number
                  </label>
                  <div className="flex gap-2">
                    <span className="flex items-center justify-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-bold">+91</span>
                    <input 
                      type="tel" 
                      placeholder="9876543210"
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleLogin}
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg"
                >
                  Get Verification Code
                </button>
              </div>
            )}

            {authStep === 'OTP' && (
              <div className="space-y-6 text-center animate-fadeIn">
                <div className="p-4 bg-blue-50 rounded-2xl inline-block mx-auto text-blue-600 mb-4">
                  <ShieldCheck size={48} />
                </div>
                <h2 className="text-xl font-bold">Verify Identity</h2>
                <p className="text-slate-500 text-sm">Enter code sent to <b>+91 {phone}</b>. Use <b>1234</b> for demo.</p>
                <input 
                  type="text" 
                  maxLength={4}
                  placeholder="0000"
                  className="w-full text-center py-4 bg-slate-50 border border-slate-200 rounded-2xl text-3xl font-black tracking-[1rem] outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button 
                  onClick={handleVerifyOtp}
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg"
                >
                  Verify & Enter Store
                </button>
                <button onClick={() => setAuthStep('LOGIN')} className="text-sm font-bold text-slate-400 hover:text-blue-600">Change Number</button>
              </div>
            )}

            {authStep === 'VERIFIED' && (
              <div className="text-center py-10 animate-bounce">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Verified!</h2>
                <p className="text-slate-500 mt-2">Entering MediMart Pro...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (user.role === UserRole.ADMIN || user.role === UserRole.EMPLOYEE) && (
        <AdminDashboard inventory={inventory} orders={orders} onAction={handleOrderAction} />
      )}
      
      {activeTab === 'inventory' && (
        <InventoryManager 
          inventory={inventory} 
          role={user.role} 
          onUpdate={handleUpdateInventory} 
          onDelete={handleDeleteInventory}
          onReset={handleResetInventory}
        />
      )}

      {activeTab === 'store' && user.role === UserRole.CUSTOMER && (
        <CustomerStore inventory={inventory} onPlaceOrder={handlePlaceOrder} />
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6 slide-up">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Customer Profile</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Delivery Logistics</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Financials</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                    {(user.role === UserRole.ADMIN || user.role === UserRole.EMPLOYEE) && (
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders
                    .filter(o => user.role === UserRole.CUSTOMER ? o.customerId === user.id : true)
                    .map(order => {
                      const orderIsFreeDelivery = order.totalAmount >= APP_CONFIG.freeDeliveryThreshold;
                      return (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors align-top">
                          <td className="px-6 py-4 font-bold text-blue-600">{order.id}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-800">{order.customerName}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1"><Smartphone size={10} /> {order.phone}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Mail size={10} /> {order.email}</p>
                          </td>
                          <td className="px-6 py-4 max-w-[240px]">
                            <p className="text-xs text-slate-600 flex items-start gap-1">
                              <MapPin size={10} className="mt-1 flex-shrink-0 text-blue-500" /> {order.address}
                            </p>
                            <p className="text-xs font-black text-blue-700 mt-2 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded inline-block">
                              <Calendar size={10} /> Required: {order.lastDeliveryDate ? new Date(order.lastDeliveryDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">₹{order.totalAmount.toLocaleString()}</p>
                            {order.status === OrderStatus.PENDING ? (
                              orderIsFreeDelivery ? (
                                <p className="text-[10px] text-green-600 font-bold uppercase flex items-center gap-1 mt-1">
                                  <BadgeAlert size={10} /> Free Delivery Confirmed
                                </p>
                              ) : (
                                <p className="text-[10px] text-amber-600 font-bold uppercase flex items-center gap-1 mt-1">
                                  <Clock size={10} /> Delivery Cost TBD
                                </p>
                              )
                            ) : (
                              <p className={`text-[10px] font-bold uppercase mt-1 ${order.deliveryCharge === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                                Delivery: {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
                              </p>
                            )}
                            {order.status !== OrderStatus.PENDING && (
                               <p className="text-[10px] text-slate-400 font-bold mt-1">
                                 Total: ₹{(order.totalAmount + order.deliveryCharge).toLocaleString()}
                               </p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              order.status === OrderStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                              order.status === OrderStatus.ACCEPTED ? 'bg-blue-100 text-blue-700' :
                              order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          {(user.role === UserRole.ADMIN || user.role === UserRole.EMPLOYEE) && (
                            <td className="px-6 py-4 text-right">
                              {order.status === OrderStatus.PENDING && (
                                <div className="flex flex-col items-end gap-2">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => {
                                        if (orderIsFreeDelivery) {
                                          if (confirm(`Order above ₹${APP_CONFIG.freeDeliveryThreshold.toLocaleString()} qualifies for free delivery. Accept with ₹0 charge?`)) {
                                            handleOrderAction(order.id, OrderStatus.ACCEPTED, 0);
                                          }
                                        } else {
                                          const charge = prompt("Enter Delivery Charge (₹) for this order:");
                                          if (charge !== null) {
                                            handleOrderAction(order.id, OrderStatus.ACCEPTED, Number(charge));
                                          }
                                        }
                                      }} 
                                      className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center gap-1 text-xs font-bold" 
                                      title="Accept Order"
                                    >
                                      <Check size={14} /> Accept
                                    </button>
                                    <button onClick={() => handleOrderAction(order.id, OrderStatus.DECLINED)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Reject"><XIcon size={18} /></button>
                                  </div>
                                  {!orderIsFreeDelivery && (
                                    <span className="text-[9px] text-slate-400 font-medium italic">Disclose cost to customer</span>
                                  )}
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {orders.length === 0 && <div className="p-20 text-center text-slate-400">No records found.</div>}
          </div>
        </div>
      )}

      {activeTab === 'support' && (
        <Support 
          user={user} 
          tickets={tickets.filter(t => user.role === UserRole.CUSTOMER ? t.customerId === user.id : true)} 
          onAddTicket={handleAddTicket} 
        />
      )}

      {activeTab === 'employees' && user.role === UserRole.ADMIN && (
        <div className="p-10 bg-white rounded-3xl border border-slate-100 text-center">
           <Users size={48} className="mx-auto text-slate-200 mb-4" />
           <h3 className="text-xl font-bold text-slate-800">User Management</h3>
           <p className="text-slate-500 mt-2">Manage all registered entities here (Beta).</p>
        </div>
      )}
    </Layout>
  );
};

export default App;
