import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface OnboardingModalProps {
    onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
    const { profile, updateProfile } = useApp();
    const [name, setName] = useState(profile.name);
    const [income, setIncome] = useState(profile.monthlyIncome.toString());
    const [goal, setGoal] = useState(profile.firstMillionGoal.toString());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile.name && profile.name !== 'Usuario' && profile.name !== 'User') {
            setName(profile.name);
        }
    }, [profile.name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const updates: any = {
            monthlyIncome: Number(income),
            firstMillionGoal: Number(goal),
        };

        // Update name only if it's currently generic
        if (profile.name === 'Usuario' || profile.name === 'User' || !profile.name) {
            updates.name = name;
        }

        await updateProfile(updates);
        setLoading(false);
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-surface-dark rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-slate-700 animate-fade-in-up">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 shadow-lg text-slate-900 mb-6">
                        <span className="material-symbols-outlined text-3xl font-bold">rocket_launch</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Configuremos tu espacio</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Para que la IA y las proyecciones funcionen correctamente, necesitamos calibrar estos datos iniciales.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {(profile.name === 'Usuario' || profile.name === 'User' || !profile.name) && (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 ml-1">¿Cómo te llamas?</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="Tu Nombre"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 ml-1">Ingreso Mensual Neto Estimado</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input
                                type="number"
                                required
                                min="1"
                                value={income}
                                onChange={(e) => setIncome(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 ml-1">Tu Primera Gran Meta Financiera</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input
                                type="number"
                                required
                                min="1"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="1000000"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 ml-1">Por defecto: 1 Millón. Puedes cambiarlo después.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full py-4 bg-gradient-to-r from-primary to-emerald-500 hover:to-emerald-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-primary/20 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Comenzar mi viaje</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
