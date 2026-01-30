import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Link, useNavigate } from 'react-router-dom';

export const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: signUpError, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        if (data.session) {
            // Auto sign in successful (email confirmation disabled)
            navigate('/');
        } else {
            // Email confirmation required
            setLoading(false);
            setError("¡Cuenta creada! Por favor verifica tu correo antes de iniciar sesión.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 relative overflow-hidden">
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors font-bold text-sm z-20"
            >
                <span className="material-symbols-outlined">arrow_back</span>
                Volver al Inicio
            </button>

            <div className="w-full max-w-md bg-white/70 dark:bg-card-dark/70 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-2xl shadow-xl p-8 animate-fade-in relative overflow-hidden">

                {/* Glow effect */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 shadow-lg text-slate-900 mb-4">
                            <span className="material-symbols-outlined text-2xl font-bold">person_add</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Crear Cuenta</h1>
                        <p className="text-slate-500 dark:text-slate-400">Únete a Umbral para gestionar tus finanzas</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {loading && !error && (
                        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                            Creando cuenta...
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Nombre Completo</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">badge</span>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
                                    placeholder="Juan Pérez"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Correo Electrónico</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">mail</span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
                                    placeholder="tu@ejemplo.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Contraseña</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">lock</span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-1">
                                Mínimo 6 caracteres
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-primary to-emerald-400 hover:from-primary-dark hover:to-emerald-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-primary/20 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Crear Cuenta</span>
                                        <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors">
                            Iniciar Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
