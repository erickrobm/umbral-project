import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
    const { user, signOut } = useAuth();
    const { profile, updateProfile } = useApp();

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Manejo de carga de imagen
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateProfile({ avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    // Manejo de Toggles de Preferencias
    const togglePreference = (key: 'aiNotifications' | 'emailSummary') => {
        const currentPrefs = profile.preferences || { aiNotifications: true, emailSummary: false };
        updateProfile({
            preferences: {
                ...currentPrefs,
                [key]: !currentPrefs[key]
            }
        });
    };

    const prefs = profile.preferences || { aiNotifications: true, emailSummary: false };

    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8 md:p-12 transition-colors">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                <header>
                    <h1 className="text-2xl md:text-3xl font-black text-text-main dark:text-white tracking-tight">Configuración</h1>
                    <p className="text-text-muted dark:text-gray-400 mt-2">Gestiona tu identidad y los parámetros base de tu sistema financiero.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Columna Izquierda: Identidad */}
                    <div className="flex flex-col gap-6">
                        <section className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-text-main dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">badge</span>
                                Identidad
                            </h2>

                            <div className="flex flex-col items-center mb-6">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt="Avatar" className="h-24 w-24 rounded-full object-cover shadow-lg mb-4 border-2 border-slate-100 dark:border-slate-700" />
                                    ) : (
                                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-4xl shadow-lg mb-4 border-2 border-white dark:border-slate-700">
                                            {profile.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity mb-4">
                                        <span className="material-symbols-outlined text-white">photo_camera</span>
                                    </div>
                                </div>

                                {/* Input de archivo oculto */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                                >
                                    Cambiar Foto
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-400">Nombre de Pila</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        disabled
                                        className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-400">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 cursor-not-allowed"
                                    />
                                    <p className="text-[10px] text-slate-400">El correo no se puede cambiar en esta versión.</p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-text-main dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">tune</span>
                                Preferencias
                            </h2>
                            <div className="flex flex-col gap-4">
                                {/* Toggle AI Notifications */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notificaciones de IA</span>
                                    <button
                                        onClick={() => togglePreference('aiNotifications')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${prefs.aiNotifications ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-300 ease-in-out ${prefs.aiNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                {/* Toggle Email Summary */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Resumen Semanal por Correo</span>
                                    <button
                                        onClick={() => togglePreference('emailSummary')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${prefs.emailSummary ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-300 ease-in-out ${prefs.emailSummary ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Columna Derecha: Calibración Financiera */}
                    <div className="flex flex-col gap-6">
                        <section className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 h-full">
                            <h2 className="text-lg font-bold text-text-main dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-500">account_balance</span>
                                Calibración Financiera
                            </h2>
                            <p className="text-sm text-slate-500 mb-6">
                                Estos valores son fundamentales para los cálculos de tus proyecciones y semáforos presupuestales.
                            </p>

                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-400">Ingreso Mensual Neto</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{profile.currency === 'MXN' ? '$' : 'US$'}</span>
                                        <input
                                            type="number"
                                            value={profile.monthlyIncome}
                                            onChange={(e) => updateProfile({ monthlyIncome: Number(e.target.value) })}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 text-lg font-mono font-bold text-text-main dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400">Tu ingreso después de impuestos.</p>
                                </div>

                                <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

                                <div className="flex flex-col gap-2">
                                    {/* Cambiado a "Meta Principal" por solicitud */}
                                    <label className="text-xs font-bold uppercase text-slate-400">Meta Principal</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{profile.currency === 'MXN' ? '$' : 'US$'}</span>
                                        <input
                                            type="number"
                                            value={profile.firstMillionGoal}
                                            onChange={(e) => updateProfile({ firstMillionGoal: Number(e.target.value) })}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 text-lg font-mono font-bold text-text-main dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400">El objetivo financiero que define tu progreso.</p>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20 mt-2">
                                    <div className="flex gap-3">
                                        <span className="material-symbols-outlined text-blue-500">info</span>
                                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                            <strong>Nota:</strong> Tu Patrimonio Neto actual se calcula automáticamente sumando todas tus cuentas activas en el Panel Principal. No es necesario editarlo aquí.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">logout</span>
                                Sesión
                            </h2>
                            <p className="text-sm text-slate-500 mb-6">
                                Cierra tu sesión actual para proteger tus datos si estás en un dispositivo compartido.
                            </p>
                            <button
                                onClick={() => signOut()}
                                className="w-full py-4 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                Cerrar Sesión
                            </button>
                        </section>

                        <section className="mt-auto">
                            <button className="w-full py-4 rounded-2xl border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">delete_forever</span>
                                Borrar todos los datos y reiniciar
                            </button>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
};