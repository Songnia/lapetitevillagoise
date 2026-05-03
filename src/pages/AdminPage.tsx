import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Utensils, 
  Settings, 
  Bell, 
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Phone,
  MessageSquare,
  MapPin,
  TrendingUp,
  CircleDollarSign,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  UtensilsCrossed,
  Star,
  Users,
  Menu,
  LogOut
} from 'lucide-react';
import { useAdminStore } from '@/hooks/useAdminStore';
import type { OrderStatus } from '@/hooks/useAdminStore';
import type { MenuItem } from '@/lib/menu-data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'stats' | 'settings'>('orders');
  const { 
    orders, 
    updateOrderStatus, 
    outOfStockItems, 
    toggleStockStatus, 
    deleteOrder,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    settings,
    updateSettings
  } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Menu Modal State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuForm, setMenuForm] = useState<MenuItem>({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'Traditionnel'
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState(settings);
  const [showSettingsSuccess, setShowSettingsSuccess] = useState(false);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setShowSettingsSuccess(true);
    setTimeout(() => setShowSettingsSuccess(false), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setMenuForm({
      name: '',
      price: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      category: 'Plats Signature'
    });
    setIsMenuModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setMenuForm({ ...item });
    setIsMenuModalOpen(true);
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMenuItem(editingItem.name, menuForm);
    } else {
      addMenuItem(menuForm);
    }
    setIsMenuModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuForm({ ...menuForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'warning'
  });

  const askConfirmation = (config: Omit<typeof confirmConfig, 'isOpen'>) => {
    setConfirmConfig({ ...config, isOpen: true });
  };

  const handleConfirmed = () => {
    confirmConfig.onConfirm();
    setConfirmConfig({ ...confirmConfig, isOpen: false });
  };

  // Stats calculation
  const totalRevenue = orders
    .filter(o => o.status === 'DELIVERED')
    .reduce((acc, curr) => acc + curr.total, 0);
  
  const pendingOrders = orders.filter(o => o.status === 'NEW' || o.status === 'PREPARING').length;

  const filteredOrders = orders.filter(o => 
    o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.delivery.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'NEW': return 'bg-red-100 text-red-700 border-red-200';
      case 'PREPARING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'DISPATCHED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'CANCELLED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'NEW': return <Bell className="w-4 h-4 animate-pulse" />;
      case 'PREPARING': return <Clock className="w-4 h-4" />;
      case 'DISPATCHED': return <Truck className="w-4 h-4" />;
      case 'DELIVERED': return <CheckCircle2 className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row relative">
      {/* Mobile Header */}
      <div className="lg:hidden bg-forest text-cream px-4 py-3 flex items-center justify-between sticky top-0 z-[60] shadow-md border-b border-white/5">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white p-1 rounded-lg shrink-0">
            <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base leading-none">Admin</span>
            <span className="text-[9px] text-cream/60 uppercase tracking-widest font-bold mt-0.5">Portal</span>
          </div>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-forest/40 backdrop-blur-sm z-[50] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 h-screen w-72 lg:w-64 bg-forest text-cream p-6 flex flex-col border-r border-cream/5 z-[55] transition-all duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="mb-8 lg:mb-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 bg-cream/10 rounded-xl flex items-center justify-center transition-all group-hover:bg-cream/20 group-hover:scale-105">
              <img src="/assets/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h1 className="font-display text-xl leading-none tracking-tight">Admin Portal</h1>
              <p className="text-cream/40 text-[10px] uppercase tracking-[0.2em] mt-1 font-body">La petite Villagoise</p>
            </div>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-cream/10 rounded-lg"
          >
            <X className="w-5 h-5 text-cream/60" />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
              activeTab === 'orders' ? "bg-cream text-forest shadow-lg" : "hover:bg-cream/10"
            )}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-body font-medium">Commandes</span>
            {pendingOrders > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                {pendingOrders}
              </span>
            )}
          </button>

          <button 
            onClick={() => { setActiveTab('menu'); setIsSidebarOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
              activeTab === 'menu' ? "bg-cream text-forest shadow-lg" : "hover:bg-cream/10"
            )}
          >
            <Utensils className="w-5 h-5" />
            <span className="font-body font-medium">Menu & Stocks</span>
          </button>

          <button 
            onClick={() => { setActiveTab('stats'); setIsSidebarOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
              activeTab === 'stats' ? "bg-cream text-forest shadow-lg" : "hover:bg-cream/10"
            )}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-body font-medium">Statistiques</span>
          </button>

          <button 
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
              activeTab === 'settings' ? "bg-cream text-forest shadow-lg" : "hover:bg-cream/10 text-cream/70 hover:text-cream"
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="font-body font-medium">Paramètres</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-cream/5">
          <button 
            onClick={() => useAdminStore.getState().logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-cream/40 hover:text-red-400 hover:bg-red-400/5 group"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-body font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl text-forest">
              {activeTab === 'orders' && "Gestion des Commandes"}
              {activeTab === 'menu' && "Carte & Disponibilités"}
              {activeTab === 'stats' && "Aperçu des Performances"}
            </h2>
            <p className="text-slate-500 font-body">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {activeTab === 'menu' && (
              <button 
                onClick={handleOpenAddModal}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-forest text-cream rounded-xl font-body font-bold hover:bg-forest/90 transition-all shadow-lg whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Ajouter un plat
              </button>
            )}
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 transition-all shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* Stats Summary Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-10">
          {activeTab === 'orders' ? (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-body">Commandes en attente</span>
                  <h3 className="text-2xl font-bold text-slate-800">{pendingOrders}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CircleDollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-body">CA du jour (Livré)</span>
                  <h3 className="text-2xl font-bold text-slate-800">{totalRevenue.toLocaleString()} FCFA</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-body">Total commandes</span>
                  <h3 className="text-2xl font-bold text-slate-800">{orders.length}</h3>
                </div>
              </div>
            </>
          ) : activeTab === 'menu' ? (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-forest/10 text-forest rounded-xl">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-body">Total des plats</span>
                  <h3 className="text-2xl font-bold text-slate-800">{menuItems.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-body">En stock</span>
                  <h3 className="text-2xl font-bold text-slate-800">{menuItems.length - outOfStockItems.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-body">Épuisés</span>
                  <h3 className="text-2xl font-bold text-slate-800">{outOfStockItems.length}</h3>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-body">Croissance</span>
                  <h3 className="text-2xl font-bold text-slate-800">+12%</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-body">Note moyenne</span>
                  <h3 className="text-2xl font-bold text-slate-800">4.8/5</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-body">Clients fidèles</span>
                  <h3 className="text-2xl font-bold text-slate-800">84%</h3>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dynamic Content */}
        <div className="space-y-6">
          {activeTab === 'orders' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredOrders.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
                  <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-body italic text-lg">Aucune commande trouvée</p>
                </div>
              )}
              
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6 border-b border-slate-50 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-slate-800">{order.id}</span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5",
                          getStatusColor(order.status)
                        )}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-body">
                        Reçue à {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {order.paymentRef && (
                        <div className="mt-1 flex items-center gap-1.5">
                          <CircleDollarSign className="w-3 h-3 text-amber-500" />
                          <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                            Ref: {order.paymentRef}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-lg text-forest">{order.total.toLocaleString()} FCFA</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest">{order.items.length} ARTICLES</span>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Client Info */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Client & Livraison</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                            {order.customer.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{order.customer.name}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <a href={`tel:${order.customer.phone}`} className="text-forest hover:text-terracotta transition-colors">
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a href={`https://wa.me/${order.customer.whatsapp}`} target="_blank" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 text-slate-600">
                          <MapPin className="w-4 h-4 mt-0.5 text-slate-400" />
                          <div className="text-sm">
                            <p className="font-bold">{order.delivery.neighborhood}</p>
                            <p className="text-xs text-slate-500">Repère : {order.delivery.landmark}</p>
                          </div>
                        </div>
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                          <span className="block text-[9px] font-bold text-amber-600 uppercase mb-1">Attention Monnaie</span>
                          <p className="text-sm font-bold text-amber-800">{order.delivery.monnaie || 'Aucune précision'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Détails Panier</h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-slate-50 rounded flex items-center justify-center font-bold text-[10px]">
                                {item.quantity}x
                              </span>
                              <span className="text-slate-700 font-medium">{item.name}</span>
                            </div>
                            <span className="text-slate-400 text-xs">
                              {(parseInt(item.price.replace(/\D/g, '')) * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 bg-slate-50 flex flex-wrap gap-2 justify-end">
                    {order.status === 'NEW' && (
                      <button 
                        onClick={() => askConfirmation({
                          title: 'Lancer la préparation ?',
                          message: `Voulez-vous passer la commande ${order.id} en préparation ?`,
                          variant: 'warning',
                          onConfirm: () => updateOrderStatus(order.id, 'PREPARING')
                        })}
                        className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all shadow-sm"
                      >
                        Lancer en cuisine
                      </button>
                    )}
                    {order.status === 'PREPARING' && (
                      <button 
                        onClick={() => askConfirmation({
                          title: 'Commande prête ?',
                          message: `Confirmez-vous que la commande ${order.id} est prête pour le livreur ?`,
                          variant: 'warning',
                          onConfirm: () => updateOrderStatus(order.id, 'DISPATCHED')
                        })}
                        className="px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all shadow-sm"
                      >
                        Prêt pour livraison
                      </button>
                    )}
                    {order.status === 'DISPATCHED' && (
                      <button 
                        onClick={() => askConfirmation({
                          title: 'Confirmer la livraison ?',
                          message: `La commande ${order.id} a-t-elle bien été livrée au client ?`,
                          variant: 'warning',
                          onConfirm: () => updateOrderStatus(order.id, 'DELIVERED')
                        })}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm"
                      >
                        Marquer comme livré
                      </button>
                    )}
                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                      <button 
                        onClick={() => askConfirmation({
                          title: 'Annuler la commande ?',
                          message: `Êtes-vous sûr de vouloir annuler la commande ${order.id} ? Cette action est irréversible.`,
                          variant: 'danger',
                          onConfirm: () => updateOrderStatus(order.id, 'CANCELLED')
                        })}
                        className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-white transition-all"
                      >
                        Annuler
                      </button>
                    )}
                    <button 
                      onClick={() => askConfirmation({
                        title: 'Supprimer définitivement ?',
                        message: `Voulez-vous supprimer l'historique de la commande ${order.id} ?`,
                        variant: 'danger',
                        onConfirm: () => deleteOrder(order.id)
                      })}
                      className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-xs font-bold transition-all"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 lg:px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plat</th>
                      <th className="px-4 lg:px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Catégorie</th>
                      <th className="px-4 lg:px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prix</th>
                      <th className="px-4 lg:px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut <span className="hidden sm:inline">Stock</span></th>
                      <th className="px-4 lg:px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {menuItems.map((item) => (
                      <tr key={item.name} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 lg:px-8 py-4">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <p className="font-bold text-slate-700">{item.name}</p>
                              <p className="text-[10px] text-slate-400 font-body line-clamp-1">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-8 py-4 hidden sm:table-cell">
                          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded-full font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 lg:px-8 py-4 font-body text-slate-600 font-medium">{item.price}</td>
                        <td className="px-4 lg:px-8 py-4">
                          {outOfStockItems.includes(item.name) ? (
                            <span className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-wider">
                              <XCircle className="w-3 h-3" /> <span className="hidden sm:inline">Épuisé</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
                              <CheckCircle2 className="w-3 h-3" /> <span className="hidden sm:inline">En stock</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 lg:px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => askConfirmation({
                                title: outOfStockItems.includes(item.name) ? 'Remettre en stock ?' : 'Marquer comme épuisé ?',
                                message: outOfStockItems.includes(item.name) 
                                  ? `Voulez-vous rendre le plat "${item.name}" à nouveau disponible pour les clients ?`
                                  : `Voulez-vous masquer le plat "${item.name}" du site ? Les clients ne pourront plus le commander.`,
                                variant: 'warning',
                                onConfirm: () => toggleStockStatus(item.name)
                              })}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                outOfStockItems.includes(item.name) 
                                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
                                  : "bg-red-50 text-red-600 hover:bg-red-100"
                              )}
                              title={outOfStockItems.includes(item.name) ? "Remettre en stock" : "Marquer épuisé"}
                            >
                              {outOfStockItems.includes(item.name) ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => handleOpenEditModal(item)}
                              className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                              title="Modifier"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => askConfirmation({
                                title: 'Supprimer ce plat ?',
                                message: `Êtes-vous sûr de vouloir supprimer définitivement "${item.name}" de votre carte ?`,
                                variant: 'danger',
                                onConfirm: () => deleteMenuItem(item.name)
                              })}
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
              <TrendingUp className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-body italic text-lg">Statistiques détaillées bientôt disponibles</p>
              <p className="text-xs mt-2">Suivez vos ventes et vos pics d'activité ici.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl">
              {showSettingsSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="font-body font-medium">Paramètres enregistrés avec succès !</p>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-8">
                {/* General Settings */}
                <div className="bg-white p-6 lg:p-8 rounded-2xl lg:rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-display text-xl text-forest mb-6 flex items-center gap-3">
                    <LayoutDashboard className="w-5 h-5" />
                    Informations Générales
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nom du restaurant</label>
                      <input 
                        type="text" 
                        value={settingsForm.shopName}
                        onChange={(e) => setSettingsForm({...settingsForm, shopName: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 font-body"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Adresse</label>
                      <input 
                        type="text" 
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({...settingsForm, address: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 font-body"
                      />
                    </div>
                  </div>
                </div>

                {/* Orders Configuration */}
                <div className="bg-white p-6 lg:p-8 rounded-2xl lg:rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-display text-xl text-forest mb-6 flex items-center gap-3">
                    <Bell className="w-5 h-5" />
                    Configuration des Commandes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">WhatsApp de réception</label>
                      <input 
                        type="text" 
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({...settingsForm, whatsappNumber: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 font-body"
                        placeholder="ex: +237 6 00 00 00 00"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Frais de livraison par défaut (FCFA)</label>
                      <input 
                        type="number" 
                        value={settingsForm.deliveryFeeDefault}
                        onChange={(e) => setSettingsForm({...settingsForm, deliveryFeeDefault: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 font-body"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="font-body font-bold text-slate-700">État de la boutique</p>
                          <p className="text-xs text-slate-500">Activer ou désactiver la prise de commandes en ligne</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setSettingsForm({...settingsForm, isOpen: !settingsForm.isOpen})}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                            settingsForm.isOpen ? "bg-forest" : "bg-slate-300"
                          )}
                        >
                          <span className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            settingsForm.isOpen ? "translate-x-6" : "translate-x-1"
                          )} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                            <CircleDollarSign className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-body font-bold text-slate-700">Paiements GeniusPay</p>
                            <p className="text-xs text-slate-500">Accepter les paiements Mobile Money et Carte Bancaire</p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setSettingsForm({...settingsForm, isGeniusPayEnabled: !settingsForm.isGeniusPayEnabled})}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                            settingsForm.isGeniusPayEnabled ? "bg-amber-500" : "bg-slate-300"
                          )}
                        >
                          <span className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            settingsForm.isGeniusPayEnabled ? "translate-x-6" : "translate-x-1"
                          )} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white p-6 lg:p-8 rounded-2xl lg:rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-display text-xl text-forest mb-6 flex items-center gap-3">
                    <Star className="w-5 h-5" />
                    Réseaux Sociaux
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Instagram URL</label>
                      <input 
                        type="url" 
                        value={settingsForm.instagramUrl}
                        onChange={(e) => setSettingsForm({...settingsForm, instagramUrl: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 font-body"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Facebook URL</label>
                      <input 
                        type="url" 
                        value={settingsForm.facebookUrl}
                        onChange={(e) => setSettingsForm({...settingsForm, facebookUrl: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 font-body"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-forest text-cream rounded-2xl font-display text-lg hover:bg-forest/90 transition-all shadow-xl shadow-forest/20 flex items-center justify-center gap-3"
                  >
                    <Settings className="w-5 h-5" />
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Menu Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 lg:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <h3 className="font-display text-xl lg:text-2xl text-forest">
                {editingItem ? "Modifier le plat" : "Ajouter un plat"}
              </h3>
              <button 
                onClick={() => setIsMenuModalOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveMenu} className="p-6 lg:p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nom du plat</label>
                  <input 
                    type="text" 
                    required
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 font-body"
                    placeholder="ex: Ndolé Royal"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Prix (FCFA)</label>
                    <input 
                      type="text" 
                      required
                      value={menuForm.price}
                      onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 font-body"
                      placeholder="ex: 5 000 F"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Catégorie</label>
                    <select 
                      value={menuForm.category}
                      onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 font-body"
                    >
                      <option>Traditionnel</option>
                      <option>Plats Signature</option>
                      <option>Grillades</option>
                      <option>Entrées</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    required
                    value={menuForm.description}
                    onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 font-body h-24 resize-none"
                    placeholder="Décrivez les ingrédients et les saveurs..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Photo du plat</label>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="relative group w-full md:w-40 h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center transition-all hover:border-forest/40">
                      {menuForm.image ? (
                        <>
                          <img src={menuForm.image} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-forest/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Choisir</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-xs text-slate-500 font-body leading-relaxed">
                        L'image sera automatiquement redimensionnée. Utilisez de préférence un format carré (1:1).
                      </p>
                      <button 
                        type="button"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="text-xs font-bold text-forest hover:text-terracotta transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Charger une autre photo
                      </button>
                      <input 
                        id="image-upload"
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-2xl font-display text-lg hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-forest text-cream rounded-2xl font-display text-lg hover:bg-forest/90 transition-all shadow-xl shadow-forest/20"
                >
                  {editingItem ? "Enregistrer" : "Créer le plat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Confirmation Modal */}
      {confirmConfig.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-forest/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6",
                confirmConfig.variant === 'danger' ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
              )}>
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl text-forest mb-2">{confirmConfig.title}</h3>
              <p className="font-body text-slate-500 text-sm leading-relaxed mb-8">
                {confirmConfig.message}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                  className="flex-1 py-3 border border-slate-200 text-slate-500 rounded-xl font-body font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleConfirmed}
                  className={cn(
                    "flex-1 py-3 text-white rounded-xl font-body font-bold text-sm transition-all shadow-lg",
                    confirmConfig.variant === 'danger' ? "bg-red-500 hover:bg-red-600 shadow-red-200" : "bg-forest hover:bg-forest/90 shadow-forest/20"
                  )}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
