
import React from 'react';
import { User, UserRole } from '../types';
import { APP_CONFIG } from '../constants';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  History, 
  Users, 
  LifeBuoy, 
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.EMPLOYEE], id: 'dashboard' },
    { name: 'Store', icon: ShoppingCart, roles: [UserRole.CUSTOMER], id: 'store' },
    { name: 'Inventory', icon: Package, roles: [UserRole.ADMIN, UserRole.EMPLOYEE], id: 'inventory' },
    { name: 'Orders', icon: History, roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CUSTOMER], id: 'orders' },
    { name: 'Employees', icon: Users, roles: [UserRole.ADMIN], id: 'employees' },
    { name: 'Support', icon: LifeBuoy, roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CUSTOMER], id: 'support' },
  ].filter(item => item.roles.includes(user.role));

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img src={APP_CONFIG.logoUrl} className="w-10 h-10 object-contain bg-blue-50 p-1.5 rounded-xl shadow-sm border border-blue-100" alt="MediMart Logo" />
            <span className="font-bold text-xl text-blue-700 leading-tight">MediMart Pro</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-[0.2em]">Harsh Enterprises</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 font-bold shadow-sm shadow-blue-500/5' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-blue-700' : 'text-slate-400'} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl mb-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20">
              {user.name[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-slate-800">{user.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Header - Mobile */}
      <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <img src={APP_CONFIG.logoUrl} className="w-8 h-8 object-contain" alt="Logo" />
          <div>
            <span className="font-black text-lg text-blue-700 block leading-none">MediMart Pro</span>
            <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">Harsh Enterprises</span>
          </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden pt-20 px-4 animate-fadeIn">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-lg ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700 font-black shadow-sm' 
                    : 'text-slate-600'
                }`}
              >
                <item.icon size={24} />
                {item.name}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-4 px-6 py-4 text-red-600 font-bold"
              >
                <LogOut size={24} />
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                {navigation.find(n => n.id === activeTab)?.name || 'Welcome'}
              </h2>
            </div>
            <p className="text-slate-500 text-sm font-medium">Harsh Enterprises • Quality Medicine, Trusted Care</p>
          </div>
          <div className="flex gap-4">
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
              <Bell size={20} />
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};

export default Layout;
