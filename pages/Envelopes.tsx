import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Currency } from '../types';

// Catálogo de iconos disponibles para el usuario
const ICON_OPTIONS = [
    // Vivienda & Servicios
    "home", "apartment", "cottage", "water_drop", "bolt", "wifi", "propane", "cleaning_services", "yard",
    // Transporte
    "directions_car", "commute", "two_wheeler", "pedal_bike", "local_gas_station", "ev_station", "flight", "train", "directions_bus", "local_taxi",
    // Comida
    "restaurant", "lunch_dining", "local_cafe", "fastfood", "local_bar", "grocery", "cake", "kitchen",
    // Salud & Bienestar
    "monitor_heart", "local_hospital", "medication", "fitness_center", "spa", "self_improvement", "dentistry",
    // Compras & Estilo
    "shopping_bag", "checkroom", "foot_print", "diamond", "watch", "content_cut",
    // Ocio & Tecnología
    "local_activity", "movie", "sports_esports", "headphones", "smartphone", "laptop_mac", "photo_camera", "book", "music_note",
    // Familia & Mascotas
    "family_restroom", "child_care", "pets", "school", "menu_book", "toys",
    // Finanzas & Ahorro
    "savings", "account_balance", "credit_card", "payments", "attach_money", "trending_up", "currency_exchange",
    // Otros
    "build", "card_giftcard", "celebration", "category", "work", "emergency"
];

const COLOR_OPTIONS = ['teal', 'blue', 'indigo', 'purple', 'pink', 'red', 'orange', 'yellow', 'green', 'emerald', 'gray', 'slate'];

const COLORS = {
    teal: { border200: 'border-teal-200', border900: 'dark:border-teal-900/30', bg50: 'bg-teal-50', bg900: 'dark:bg-teal-900/30', text600: 'text-teal-600', text400: 'dark:text-teal-400', bg500: 'bg-teal-500', text500: 'text-teal-500' },
    blue: { border200: 'border-blue-200', border900: 'dark:border-blue-900/30', bg50: 'bg-blue-50', bg900: 'dark:bg-blue-900/30', text600: 'text-blue-600', text400: 'dark:text-blue-400', bg500: 'bg-blue-500', text500: 'text-blue-500' },
    indigo: { border200: 'border-indigo-200', border900: 'dark:border-indigo-900/30', bg50: 'bg-indigo-50', bg900: 'dark:bg-indigo-900/30', text600: 'text-indigo-600', text400: 'dark:text-indigo-400', bg500: 'bg-indigo-500', text500: 'text-indigo-500' },
    purple: { border200: 'border-purple-200', border900: 'dark:border-purple-900/30', bg50: 'bg-purple-50', bg900: 'dark:bg-purple-900/30', text600: 'text-purple-600', text400: 'dark:text-purple-400', bg500: 'bg-purple-500', text500: 'text-purple-500' },
    pink: { border200: 'border-pink-200', border900: 'dark:border-pink-900/30', bg50: 'bg-pink-50', bg900: 'dark:bg-pink-900/30', text600: 'text-pink-600', text400: 'dark:text-pink-400', bg500: 'bg-pink-500', text500: 'text-pink-500' },
    red: { border200: 'border-red-200', border900: 'dark:border-red-900/30', bg50: 'bg-red-50', bg900: 'dark:bg-red-900/30', text600: 'text-red-600', text400: 'dark:text-red-400', bg500: 'bg-red-500', text500: 'text-red-500' },
    orange: { border200: 'border-orange-200', border900: 'dark:border-orange-900/30', bg50: 'bg-orange-50', bg900: 'dark:bg-orange-900/30', text600: 'text-orange-600', text400: 'dark:text-orange-400', bg500: 'bg-orange-500', text500: 'text-orange-500' },
    yellow: { border200: 'border-yellow-200', border900: 'dark:border-yellow-900/30', bg50: 'bg-yellow-50', bg900: 'dark:bg-yellow-900/30', text600: 'text-yellow-600', text400: 'dark:text-yellow-400', bg500: 'bg-yellow-500', text500: 'text-yellow-500' },
    green: { border200: 'border-green-200', border900: 'dark:border-green-900/30', bg50: 'bg-green-50', bg900: 'dark:bg-green-900/30', text600: 'text-green-600', text400: 'dark:text-green-400', bg500: 'bg-green-500', text500: 'text-green-500' },
    emerald: { border200: 'border-emerald-200', border900: 'dark:border-emerald-900/30', bg50: 'bg-emerald-50', bg900: 'dark:bg-emerald-900/30', text600: 'text-emerald-600', text400: 'dark:text-emerald-400', bg500: 'bg-emerald-500', text500: 'text-emerald-500' },
    gray: { border200: 'border-gray-200', border900: 'dark:border-gray-900/30', bg50: 'bg-gray-50', bg900: 'dark:bg-gray-900/30', text600: 'text-gray-600', text400: 'dark:text-gray-400', bg500: 'bg-gray-500', text500: 'text-gray-500' },
    slate: { border200: 'border-slate-200', border900: 'dark:border-slate-900/30', bg50: 'bg-slate-50', bg900: 'dark:bg-slate-900/30', text600: 'text-slate-600', text400: 'dark:text-slate-400', bg500: 'bg-slate-500', text500: 'text-slate-500' },
};

type ColorKey = keyof typeof COLORS;


export const Envelopes: React.FC = () => {
    const { envelopes, formatCurrency, updateEnvelope, profile, addEnvelope, deleteEnvelope, exchangeRate } = useApp();
    const [editingId, setEditingId] = useState<string | null>(null);

    // Estado para el modal de selección de iconos
    const [iconPickerId, setIconPickerId] = useState<string | null>(null);

    // 1. Cálculos en tiempo real (Normalización de Monedas)
    const totalAssigned = envelopes.reduce((acc, env) => {
        let amount = env.val;

        // Convertir a la moneda del perfil si es necesario
        if (env.currency !== profile.currency) {
            if (profile.currency === 'MXN') {
                // Sobre es USD, Perfil es MXN -> Multiplicar
                amount = amount * exchangeRate;
            } else {
                // Sobre es MXN, Perfil es USD -> Dividir
                amount = amount / exchangeRate;
            }
        }
        return acc + amount;
    }, 0);

    const income = profile.monthlyIncome;
    const toAssign = income - totalAssigned;
    const usagePercentage = (totalAssigned / income) * 100;

    // 2. Lógica del "Semáforo" para el color del gráfico
    let statusColor = '#13ecc8'; // Verde/Teal (Healthy)
    let statusMessage = "Presupuesto Saludable";

    if (usagePercentage > 85 && usagePercentage <= 100) {
        statusColor = '#facc15'; // Amarillo (Caution)
        statusMessage = "Llegando al Límite";
    } else if (usagePercentage > 100) {
        statusColor = '#ef4444'; // Rojo (Overdraft)
        statusMessage = "¡Presupuesto Excedido!";
    }

    // Datos para el gráfico
    const chartData = [
        { name: 'Asignado', value: totalAssigned },
        { name: 'Disponible', value: Math.max(0, toAssign) } // Evitar negativos en el gráfico
    ];

    // Helper para calcular días restantes
    const getDaysRemaining = (dateString?: string) => {
        if (!dateString) return null;
        const target = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Ajustar zona horaria (aproximación simple)
        const targetDate = new Date(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate());

        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getUrgencyColor = (days: number | null) => {
        if (days === null) return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
        if (days < 0) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'; // Vencido
        if (days <= 3) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'; // Urgente
        if (days <= 7) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'; // Próximo
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'; // Bien
    };

    const getUrgencyLabel = (days: number | null) => {
        if (days === null) return 'Sin fecha';
        if (days < 0) return `Venció hace ${Math.abs(days)} días`;
        if (days === 0) return 'Vence hoy';
        if (days === 1) return 'Vence mañana';
        return `${days} días restantes`;
    };

    return (
        <div className="flex-1 max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row bg-background-light dark:bg-background-dark overflow-hidden h-full relative">

            {/* Left Sidebar (Budget Traffic Light) */}
            <aside className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-[#eff4f4] dark:border-[#1f3834] bg-surface-light dark:bg-surface-dark p-6 flex flex-col gap-6 shrink-0 overflow-y-auto transition-colors">

                <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-lg text-text-main dark:text-white">Semáforo Presupuestal</h3>
                    <p className="text-xs text-text-muted">Distribución de tu Ingreso Mensual</p>
                </div>

                {/* Gráfico Semáforo */}
                <div className="relative h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                                stroke="none"
                            >
                                {/* Segmento Asignado (Color Dinámico) */}
                                <Cell fill={statusColor} />
                                {/* Segmento Disponible (Gris) */}
                                <Cell fill="#e2e8f0" fillOpacity={0.2} />
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => formatCurrency(value)}
                                contentStyle={{ backgroundColor: '#162e2a', borderColor: '#2a423e', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Texto Central */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-text-main dark:text-white transition-colors">
                            {Math.round(usagePercentage)}%
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-text-muted" style={{ color: statusColor }}>
                            {usagePercentage > 100 ? 'Excedido' : 'Utilizado'}
                        </span>
                    </div>
                </div>

                {/* Resumen Numérico */}
                <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
                        <span className="text-sm text-text-muted font-medium">Ingreso Total</span>
                        <span className="font-bold text-text-main dark:text-white">{formatCurrency(income)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
                        <span className="text-sm text-text-muted font-medium">Asignado a Sobres</span>
                        <span className="font-bold" style={{ color: statusColor }}>{formatCurrency(totalAssigned)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                        <span className="text-sm font-bold uppercase text-text-muted">Por Asignar</span>
                        <span className={`text-xl font-bold ${toAssign < 0 ? 'text-red-500' : 'text-primary'}`}>
                            {formatCurrency(toAssign)}
                        </span>
                    </div>
                </div>

                <div className={`p-3 rounded-lg border text-center text-sm font-medium transition-colors duration-300`} style={{ borderColor: statusColor, color: statusColor, backgroundColor: `${statusColor}10` }}>
                    {statusMessage}
                </div>
            </aside>

            {/* Main Content (Envelopes Grid) */}
            <main className="flex-1 p-4 md:p-6 lg:p-10 flex flex-col relative overflow-y-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white">Mis Sobres</h2>
                        <p className="text-text-muted">Ajusta los montos para equilibrar tu semáforo.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 mb-24">
                    {envelopes.map((env) => {
                        const isEd = editingId === env.id;
                        const percentage = env.tot > 0 ? Math.min((env.val / env.tot) * 100, 100) : 100;
                        const daysRemaining = getDaysRemaining(env.dueDate);

                        return (
                            <div key={env.id} className={`group bg-surface-light dark:bg-surface-dark rounded-xl border ${env.warn ? 'border-yellow-200 dark:border-yellow-900/50 ring-1 ring-yellow-100 dark:ring-yellow-900/20' : `${COLORS[env.color as ColorKey]?.border200 || COLORS['teal'].border200} ${COLORS[env.color as ColorKey]?.border900 || COLORS['teal'].border900}`} p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 w-full">
                                        {/* ICONO DEL SOBRE */}
                                        <div className="relative">
                                            <button
                                                onClick={() => isEd && setIconPickerId(env.id)}
                                                disabled={!isEd}
                                                className={`p-2.5 rounded-lg ${COLORS[env.color as ColorKey]?.bg50 || COLORS['teal'].bg50} ${COLORS[env.color as ColorKey]?.bg900 || COLORS['teal'].bg900} ${COLORS[env.color as ColorKey]?.text600 || COLORS['teal'].text600} ${COLORS[env.color as ColorKey]?.text400 || COLORS['teal'].text400} transition-all ${isEd ? 'cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900' : ''}`}
                                            >
                                                <span className="material-symbols-outlined block">{env.icon}</span>
                                            </button>
                                            {isEd && (
                                                <div className="absolute -top-1 -right-1 bg-primary text-text-main rounded-full w-4 h-4 flex items-center justify-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-[10px] font-bold">edit</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            {isEd ? (
                                                <input
                                                    type="text"
                                                    value={env.title}
                                                    onChange={(e) => updateEnvelope(env.id, { title: e.target.value })}
                                                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded px-2 py-1 text-sm font-bold dark:text-white mb-1 focus:ring-1 focus:ring-primary"
                                                />
                                            ) : (
                                                <h3 className="font-bold text-lg leading-tight dark:text-white">{env.title}</h3>
                                            )}
                                            <div className="flex items-center gap-2 flex-wrap mt-0.5">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${env.currency === 'USD' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'} dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-600`}>
                                                    {env.currency}
                                                </span>
                                                <p className="text-xs text-text-muted font-medium">{env.type}</p>
                                                {!isEd && env.dueDate && (
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${getUrgencyColor(daysRemaining)}`}>
                                                        {getUrgencyLabel(daysRemaining)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Botón de Borrar solo en edición */}
                                    {isEd && (
                                        <button
                                            onClick={() => deleteEnvelope(env.id)}
                                            className="transition-colors p-1 text-red-400 hover:text-red-600"
                                            title="Eliminar Sobre"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 mt-1">
                                    <div className="flex justify-between items-baseline flex-wrap gap-2">
                                        {isEd ? (
                                            <div className="flex flex-col gap-3 w-full">
                                                <div className="flex items-center gap-2 w-full">
                                                    <div className="flex flex-col w-1/2">
                                                        <label className="text-[10px] text-text-muted uppercase">Asignado</label>
                                                        <input
                                                            type="number"
                                                            value={env.val}
                                                            onChange={(e) => updateEnvelope(env.id, { val: Number(e.target.value) })}
                                                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded px-2 font-mono font-bold text-lg focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                    <span className="text-text-muted">/</span>
                                                    <div className="flex flex-col w-1/2">
                                                        <label className="text-[10px] text-text-muted uppercase">Tope</label>
                                                        <input
                                                            type="number"
                                                            value={env.tot}
                                                            onChange={(e) => updateEnvelope(env.id, { tot: Number(e.target.value) })}
                                                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded px-2 font-mono font-bold text-lg focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="flex flex-col w-1/3">
                                                        <label className="text-[10px] text-text-muted uppercase mb-1">Moneda</label>
                                                        <select
                                                            value={env.currency}
                                                            onChange={(e) => updateEnvelope(env.id, { currency: e.target.value as Currency })}
                                                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded px-2 py-1 text-sm dark:text-white font-bold"
                                                        >
                                                            <option value="MXN">MXN</option>
                                                            <option value="USD">USD</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex flex-col w-2/3">
                                                        <label className="text-[10px] text-text-muted uppercase mb-1">Fecha Límite</label>
                                                        <input
                                                            type="date"
                                                            value={env.dueDate || ''}
                                                            onChange={(e) => updateEnvelope(env.id, { dueDate: e.target.value })}
                                                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded px-2 py-1 text-sm dark:text-white focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                </div>
                                                {/* Selector de Color */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-[10px] text-text-muted uppercase">Color del Estilo</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(Object.keys(COLORS) as ColorKey[]).map(color => (
                                                            <button
                                                                key={color}
                                                                onClick={() => updateEnvelope(env.id, { color })}
                                                                className={`w-6 h-6 rounded-full ${COLORS[color].bg500} transition-all ${env.color === color ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-surface-dark scale-110' : 'opacity-60 hover:opacity-100'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-2xl font-bold font-mono tracking-tight dark:text-white">
                                                    {formatCurrency(env.val, env.currency)}
                                                </span>
                                                <span className="text-sm text-text-muted font-medium">de {formatCurrency(env.tot, env.currency)}</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${env.title === 'Vivienda' ? 'bg-primary' : `${COLORS[env.color as ColorKey]?.bg500 || COLORS['teal'].bg500}`} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                                    </div>

                                    <div className="flex justify-between text-xs mt-1">
                                        <span className={`${env.title === 'Vivienda' ? 'text-primary' : `${COLORS[env.color as ColorKey]?.text500 || COLORS['teal'].text500}`} font-medium flex items-center gap-1`}>
                                            {env.warn && <span className="material-symbols-outlined text-[14px]">warning</span>}
                                            {env.warn ? 'Saldo Bajo' : `${percentage.toFixed(0)}% del Tope`}
                                        </span>
                                        <span className="text-text-muted">{env.msg}</span>
                                    </div>
                                </div>

                                <div className="pt-4 mt-auto border-t border-gray-100 dark:border-gray-800 flex gap-2">
                                    <button
                                        onClick={() => setEditingId(isEd ? null : env.id)}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${isEd ? 'bg-text-main text-white dark:bg-white dark:text-slate-900' : 'text-text-main dark:text-white bg-background-light dark:bg-background-dark hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                    >
                                        {isEd ? 'Terminar Edición' : 'Detalles / Editar'}
                                    </button>
                                    {!isEd && (
                                        <button
                                            onClick={() => updateEnvelope(env.id, { val: env.val + 100 })}
                                            className="flex-1 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
                                        >
                                            +100 Rápido
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    <button
                        onClick={addEnvelope}
                        className="group bg-transparent rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-5 hover:border-primary/50 dark:hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 min-h-[200px]"
                    >
                        <div className="size-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">add</span>
                        </div>
                        <span className="text-sm font-bold text-text-muted group-hover:text-primary transition-colors">Crear Nuevo Sobre</span>
                    </button>
                </div>

                {/* Modal de Selección de Iconos */}
                {iconPickerId && (
                    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-slate-200 dark:border-slate-700">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-text-main dark:text-white">Selecciona un Icono</h3>
                                <button onClick={() => setIconPickerId(null)} className="text-text-muted hover:text-text-main">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                                {ICON_OPTIONS.map((icon) => (
                                    <button
                                        key={icon}
                                        onClick={() => {
                                            updateEnvelope(iconPickerId, { icon: icon });
                                            setIconPickerId(null);
                                        }}
                                        className="aspect-square flex flex-col items-center justify-center gap-1 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-text-muted hover:text-primary dark:hover:text-primary transition-all group"
                                    >
                                        <span className="material-symbols-outlined text-2xl">{icon}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};