
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ThemeToggle } from './components/ThemeToggle';
import { Chatbot } from './components/Chatbot';
import { DashboardV1 } from './pages/DashboardV1';
import { Envelopes } from './pages/Envelopes';
import { Projections } from './pages/Projections';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { LandingPage } from './pages/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { SupabaseSetup } from './components/SupabaseSetup';
import { isSupabaseConfigured } from './services/supabase';

// ... (MobileHeader component remains unchanged) ...

const MobileHeader: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    return (
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#0c1a18] border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-emerald-400 shadow-md text-slate-900">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 700" }}>change_history</span>
                </div>
                <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                    UMBRAL
                </h1>
            </div>
            <button
                onClick={onMenuClick}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                <span className="material-symbols-outlined">menu</span>
            </button>
        </div>
    );
};

const MainLayout: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col md:flex-row overflow-hidden selection:bg-primary/30">
            <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <MobileHeader onMenuClick={() => setMobileMenuOpen(true)} />
                <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
                    <Outlet />
                </div>
            </div>

            <Chatbot />
            <ThemeToggle />
        </div>
    );
};



// ... (previous code)

const PrivateRoute = () => {
    const { session, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return session ? <MainLayout /> : <Navigate to="/login" state={{ from: location }} replace />;
};

const App: React.FC = () => {
    if (!isSupabaseConfigured) {
        return <SupabaseSetup />;
    }

    return (
        <AuthProvider>
            <AppProvider>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<DashboardV1 />} />
                            <Route path="/envelopes" element={<Envelopes />} />
                            <Route path="/projections" element={<Projections />} />
                            <Route path="/settings" element={<Settings />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </HashRouter>
            </AppProvider>
        </AuthProvider>
    );
};

export default App;