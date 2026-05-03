import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAdminStore } from '@/hooks/useAdminStore';
import { Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAdminStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Artificial delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(username, password);
    
    if (success) {
      navigate('/admin');
    } else {
      setError('Identifiants incorrects. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-forest/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-terracotta/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-[440px] relative">
        {/* Logo & Header */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[28px] shadow-xl shadow-forest/5 mb-6 p-4">
            <img src="/assets/logo.png" alt="La Petite Villagoise" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-display text-3xl text-forest mb-2">Espace Admin</h1>
          <p className="font-body text-slate-500">Connectez-vous pour gérer votre restaurant</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-forest/10 p-8 lg:p-10 border border-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 animate-in shake duration-500">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Identifiant</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-forest transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-forest/5 focus:border-forest/20 transition-all font-body disabled:opacity-50"
                    placeholder="Nom d'utilisateur"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Mot de passe</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-forest transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-forest/5 focus:border-forest/20 transition-all font-body disabled:opacity-50"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full bg-forest text-cream rounded-2xl py-4 font-display text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-xl shadow-forest/20 hover:shadow-forest/30 relative overflow-hidden group",
                isLoading && "cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Test Credentials Helper (Optional, helpful for the user) */}
          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-3">Accès Test</p>
            <div className="inline-flex gap-4 text-xs font-body text-slate-400">
              <p><span className="text-slate-500">User:</span> admin</p>
              <p><span className="text-slate-500">Pass:</span> villagoise2024</p>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-8 font-body text-sm text-slate-400">
          &copy; {new Date().getFullYear()} La Petite Villagoise. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
