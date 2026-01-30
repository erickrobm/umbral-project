import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { session } = useAuth();

    return (
        <div className="min-h-screen bg-[#0c1a18] text-white font-display overflow-hidden selection:bg-emerald-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-10 px-6 py-6 md:px-12 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="material-symbols-outlined text-white text-[24px]" style={{ fontVariationSettings: "'wght' 700" }}>change_history</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter">UMBRAL</span>
                </div>
                <div className="flex gap-4">
                    {session ? (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2.5 rounded-full bg-white text-[#0c1a18] font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-white/10"
                        >
                            Ir al Dashboard
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="hidden md:block px-5 py-2.5 rounded-full font-bold text-sm text-slate-300 hover:text-white transition-colors"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="px-6 py-2.5 rounded-full bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                Comenzar
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 container mx-auto px-6 pt-10 md:pt-20 pb-20 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Finanzas Personales Inteligentes</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    Tu dinero,<br />
                    <span className="text-emerald-400">bajo control.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Domina tus ingresos, presupuesta con el método de sobres y proyecta tu libertad financiera con el poder de la Inteligencia Artificial.
                </p>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <button
                        onClick={() => navigate(session ? '/dashboard' : '/register')}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        {session ? 'Ir a mi Panel' : 'Crear Cuenta Gratis'}
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                    {!session && (
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
                        >
                            Ya tengo cuenta
                        </button>
                    )}
                </div>

                {/* Dashboard Preview / Floating Cards */}
                <div className="mt-20 relative w-full max-w-5xl aspect-[16/9] md:aspect-[2/1] bg-slate-900/50 rounded-3xl border border-slate-800 backdrop-blur-xl overflow-hidden shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    {/* Mock UI Elements */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-800/20 to-transparent pointer-events-none"></div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80 scale-95 origin-top">
                        {/* Mock Card 1 */}
                        <div className="bg-[#0c1a18] p-6 rounded-2xl border border-slate-800">
                            <div className="flex gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                                    <span className="material-symbols-outlined">savings</span>
                                </div>
                                <div>
                                    <div className="h-2 w-20 bg-slate-700 rounded mb-1"></div>
                                    <div className="h-4 w-12 bg-slate-600 rounded"></div>
                                </div>
                            </div>
                            <div className="h-32 bg-slate-800/50 rounded-xl w-full"></div>
                        </div>
                        {/* Mock Card 2 (Center - Highlighted) */}
                        <div className="bg-[#132220] p-6 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-900/20 transform -translate-y-4">
                            <div className="flex justify-between items-center mb-6">
                                <div className="h-4 w-24 bg-slate-600 rounded"></div>
                                <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded font-bold">ACTIVO</div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">$1,250,400</div>
                            <div className="text-sm text-emerald-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                +12.5% este mes
                            </div>
                        </div>
                        {/* Mock Card 3 */}
                        <div className="bg-[#0c1a18] p-6 rounded-2xl border border-slate-800">
                            <div className="flex gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                                    <span className="material-symbols-outlined">pie_chart</span>
                                </div>
                                <div>
                                    <div className="h-2 w-20 bg-slate-700 rounded mb-1"></div>
                                    <div className="h-4 w-12 bg-slate-600 rounded"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center h-32">
                                <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 border-t-indigo-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Strip */}
            <section className="border-t border-white/5 bg-white/5 backdrop-blur-lg">
                <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">Método de Sobres</h3>
                        <p className="text-sm text-slate-400">Asigna cada peso un propósito antes de gastarlo.</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
                            <span className="material-symbols-outlined">psychology</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">Insights con IA</h3>
                        <p className="text-sm text-slate-400">Recibe consejos personalizados de Gemini AI.</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 mb-2">
                            <span className="material-symbols-outlined">currency_bitcoin</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">Multi-Activos</h3>
                        <p className="text-sm text-slate-400">Rastrea Fiat, Cripto y Acciones en un solo lugar.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
