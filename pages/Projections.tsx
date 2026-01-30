import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { useApp } from '../context/AppContext';

export const Projections: React.FC = () => {
    const { profile, formatCurrency, updateProfile, calculatedMonthlySavings, totalNetWorth, toggleCurrency } = useApp();
    
    // Estados del simulador
    const [extraSavings, setExtraSavings] = useState(0);
    const [annualReturn, setAnnualReturn] = useState(8); 
    const [yearsToProject, setYearsToProject] = useState(20);
    
    // Estado local para el input de la meta
    const [localGoalInput, setLocalGoalInput] = useState(profile.firstMillionGoal.toString());

    // Sincronizar input local si cambia la moneda globalmente
    useEffect(() => {
        setLocalGoalInput(profile.firstMillionGoal.toFixed(0));
    }, [profile.currency]);

    // Manejador del input de meta
    const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setLocalGoalInput(rawValue); // Actualizar UI inmediatamente para que no se sienta "trabado"
        
        const numValue = Number(rawValue);
        if (!isNaN(numValue) && rawValue !== '') {
            updateProfile({ firstMillionGoal: numValue });
        }
    };

    // Cálculo de la Proyección (Memoized)
    const chartData = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const data = [];
        
        // Valores iniciales
        let balanceCurrent = totalNetWorth;
        let balanceOptimized = totalNetWorth;
        const rate = annualReturn / 100;
        
        // Generar datos año por año
        for (let i = 0; i <= yearsToProject; i++) {
            const year = currentYear + i;
            
            data.push({
                year: year,
                Actual: Math.round(balanceCurrent),
                Optimizado: Math.round(balanceOptimized),
                // Pasamos la meta en cada punto de datos para ayudar a recharts a escalar si es necesario
                MetaRef: profile.firstMillionGoal 
            });

            // Interés compuesto anual + Aportaciones mensuales anualizadas
            balanceCurrent = (balanceCurrent * (1 + rate)) + (calculatedMonthlySavings * 12);
            balanceOptimized = (balanceOptimized * (1 + rate)) + ((calculatedMonthlySavings + extraSavings) * 12);
        }
        return data;
    }, [totalNetWorth, calculatedMonthlySavings, extraSavings, annualReturn, yearsToProject, profile.firstMillionGoal]);

    // Cálculo dinámico del dominio del Eje Y para asegurar que la Meta y la Proyección sean visibles
    const chartDomain = useMemo(() => {
        if (chartData.length === 0) return ['auto', 'auto'];
        
        const maxProjection = Math.max(...chartData.map(d => d.Optimizado));
        const maxVal = Math.max(maxProjection, profile.firstMillionGoal);
        
        // Agregamos un 10% de margen arriba para que la gráfica no toque el techo
        return [0, maxVal * 1.1];
    }, [chartData, profile.firstMillionGoal]);

    // Analíticas de resultados
    const results = useMemo(() => {
        const goal = profile.firstMillionGoal;
        const currentHit = chartData.find(d => d.Actual >= goal);
        const optimizedHit = chartData.find(d => d.Optimizado >= goal);

        return {
            currentYear: currentHit ? currentHit.year : null,
            optimizedYear: optimizedHit ? optimizedHit.year : null,
            yearsSaved: (currentHit && optimizedHit) ? (currentHit.year - optimizedHit.year) : 0
        };
    }, [chartData, profile.firstMillionGoal]);

    return (
        <div className="flex-1 h-full overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-6 lg:p-10 transition-colors">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
                
                {/* Header Simplificado */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-text-main dark:text-white tracking-tight">Tu Futuro Financiero</h1>
                        <p className="text-text-muted dark:text-gray-400 mt-1">
                            Simula cómo tus decisiones de hoy impactan tu patrimonio mañana.
                        </p>
                    </div>
                    
                    {/* Tarjeta de Resumen Rápido */}
                    <div className="flex gap-4 bg-white dark:bg-surface-dark p-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-x-auto">
                        <div className="px-4 py-2 border-r border-slate-100 dark:border-slate-700 shrink-0">
                            <span className="text-xs uppercase text-text-muted font-bold">Patrimonio Hoy</span>
                            <div className="text-xl font-bold text-text-main dark:text-white">{formatCurrency(totalNetWorth)}</div>
                        </div>
                        <div className="px-4 py-2 shrink-0">
                            <span className="text-xs uppercase text-text-muted font-bold">Ahorro Mensual</span>
                            <div className="text-xl font-bold text-primary">{formatCurrency(calculatedMonthlySavings)}</div>
                        </div>
                    </div>
                </header>

                {/* Sección Principal del Gráfico */}
                <section className="bg-white dark:bg-surface-dark rounded-3xl p-4 md:p-6 lg:p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors">
                    
                    {/* Configuración de Meta Flotante */}
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6 z-10 relative">
                         
                         {/* Input de Meta + Selector de Moneda */}
                         <div className="flex flex-col gap-2 w-full md:w-auto">
                             <div className="flex justify-between items-center w-full min-w-[300px]">
                                <label className="text-xs font-bold uppercase text-text-muted">Tu Meta Financiera</label>
                                {/* Selector de Moneda */}
                                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                                    <button 
                                        onClick={() => profile.currency !== 'MXN' && toggleCurrency()}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${profile.currency === 'MXN' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        MXN
                                    </button>
                                    <button 
                                        onClick={() => profile.currency !== 'USD' && toggleCurrency()}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${profile.currency === 'USD' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        USD
                                    </button>
                                </div>
                             </div>
                             
                             <div className="flex items-center gap-2 group relative">
                                 <span className="text-2xl font-bold text-text-main dark:text-white md:text-4xl select-none opacity-50">
                                     {profile.currency === 'MXN' ? '$' : 'US$'}
                                 </span>
                                 <input 
                                     type="number"
                                     value={localGoalInput}
                                     onChange={handleGoalChange}
                                     className="bg-transparent border-none p-0 text-3xl md:text-4xl font-black text-text-main dark:text-white focus:ring-0 w-full placeholder-slate-300 tracking-tight"
                                     placeholder="0"
                                 />
                                 {/* Icono de lápiz eliminado a petición del usuario */}
                             </div>
                             <p className="text-xs text-slate-400 hidden sm:block">
                                 Define el monto. El gráfico ajustará su escala automáticamente.
                             </p>
                         </div>

                         {/* Resultado del Simulador */}
                         <div className="flex flex-wrap gap-4 text-right bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 w-full md:w-auto justify-end">
                             <div className="flex flex-col items-end px-2">
                                 <span className="text-xs font-bold text-slate-400 uppercase">Proyección Actual</span>
                                 <span className="text-xl font-bold text-slate-600 dark:text-slate-300">
                                     {results.currentYear ? results.currentYear : `> ${new Date().getFullYear() + yearsToProject}`}
                                 </span>
                             </div>
                             <div className="w-px bg-slate-200 dark:bg-slate-600 h-10 hidden sm:block"></div>
                             <div className="flex flex-col items-end px-2">
                                 <span className="text-xs font-bold text-primary uppercase">Proyección Optimizada</span>
                                 <div className="flex items-center gap-2">
                                     <span className="text-2xl font-bold text-primary">
                                         {results.optimizedYear ? results.optimizedYear : `> ${new Date().getFullYear() + yearsToProject}`}
                                     </span>
                                     {results.yearsSaved > 0 && (
                                         <span className="text-[10px] font-bold bg-primary text-slate-900 px-2 py-0.5 rounded-full animate-pulse">
                                             -{results.yearsSaved} años
                                         </span>
                                     )}
                                 </div>
                             </div>
                         </div>
                    </div>

                    {/* El Gráfico */}
                    <div className="h-[300px] md:h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorOptimizado" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#13ecc8" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#13ecc8" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
                                <XAxis 
                                    dataKey="year" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 12}} 
                                    minTickGap={30}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    // Usamos el dominio calculado para asegurar que la Meta siempre sea visible
                                    domain={chartDomain} 
                                    tick={{fill: '#94a3b8', fontSize: 12}} 
                                    tickFormatter={(val) => {
                                        if (val >= 1000000000) return `${(val/1000000000).toFixed(1)}B`;
                                        if (val >= 1000000) return `${(val/1000000).toFixed(0)}M`;
                                        if (val >= 1000) return `${(val/1000).toFixed(0)}k`;
                                        return val;
                                    }}
                                />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff'}}
                                    itemStyle={{paddingTop: '4px'}}
                                    formatter={(val: number) => formatCurrency(val)}
                                    labelStyle={{color: '#94a3b8', marginBottom: '8px'}}
                                />
                                <ReferenceLine 
                                    y={profile.firstMillionGoal} 
                                    label={{ 
                                        value: "META", 
                                        position: 'insideTopRight', 
                                        fill: '#f59e0b', 
                                        fontSize: 10, 
                                        fontWeight: 'bold' 
                                    }} 
                                    stroke="#f59e0b" 
                                    strokeDasharray="3 3" 
                                    strokeWidth={2}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="Optimizado" 
                                    stroke="#13ecc8" 
                                    strokeWidth={3} 
                                    fill="url(#colorOptimizado)" 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="Actual" 
                                    stroke="#94a3b8" 
                                    strokeWidth={2} 
                                    fill="url(#colorActual)" 
                                    strokeDasharray="5 5"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Panel de Control de Vuelo */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Control 1: Ahorro Extra */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-primary/30 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-primary/10 text-primary p-2 rounded-lg material-symbols-outlined">savings</span>
                                <span className="font-bold text-text-main dark:text-white">Ahorro Extra</span>
                            </div>
                            <span className="text-primary font-bold">+{formatCurrency(extraSavings)}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max={Math.max(calculatedMonthlySavings * 2, 10000)} 
                            step="100" 
                            value={extraSavings}
                            onChange={(e) => setExtraSavings(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <p className="text-xs text-text-muted mt-3">
                            Suma esto a tu ahorro actual de {formatCurrency(calculatedMonthlySavings)}/mes.
                        </p>
                    </div>

                    {/* Control 2: Rendimiento */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-blue-400/30 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-2 rounded-lg material-symbols-outlined">trending_up</span>
                                <span className="font-bold text-text-main dark:text-white">Rendimiento</span>
                            </div>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">{annualReturn}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="20" 
                            step="0.5" 
                            value={annualReturn}
                            onChange={(e) => setAnnualReturn(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <p className="text-xs text-text-muted mt-3">
                            Retorno anual promedio de tus inversiones. (S&P500 prom ~8-10%)
                        </p>
                    </div>

                    {/* Control 3: Horizonte */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-purple-400/30 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 p-2 rounded-lg material-symbols-outlined">schedule</span>
                                <span className="font-bold text-text-main dark:text-white">Horizonte</span>
                            </div>
                            <span className="text-purple-600 dark:text-purple-400 font-bold">{yearsToProject} años</span>
                        </div>
                        <input 
                            type="range" 
                            min="5" 
                            max="50" 
                            step="5" 
                            value={yearsToProject}
                            onChange={(e) => setYearsToProject(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <p className="text-xs text-text-muted mt-3">
                            Hasta el año {new Date().getFullYear() + yearsToProject}.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};