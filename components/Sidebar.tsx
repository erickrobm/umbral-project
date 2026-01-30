import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface NavLinkProps {
    to: string;
    icon: string;
    label: string;
    isActive: boolean;
    onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, isActive, onClick }) => {
    const baseClass = "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group font-medium relative overflow-hidden";
    const activeClass = "bg-primary text-slate-900 shadow-lg shadow-primary/20 font-bold";
    const inactiveClass = "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white";

    return (
        <Link to={to} onClick={onClick} className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}>
            <span
                className={`material-symbols-outlined text-[22px] transition-transform group-hover:scale-110 ${isActive ? "" : "opacity-70 group-hover:opacity-100"}`}
                style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 600" } : { fontVariationSettings: "'FILL' 0, 'wght' 400" }}
            >
                {icon}
            </span>
            <span className="text-sm tracking-wide">{label}</span>
            {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-white/30 rounded-r-full"></div>}
        </Link>
    );
};

// Componente interno con el contenido del menú para reutilizar en Móvil y Escritorio
const SidebarContent: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { profile } = useApp();

    return (
        <div className="flex flex-col h-full">
            {/* --- LOGO AREA --- */}
            <div className="p-8 pb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 shadow-lg shadow-primary/25 text-slate-900 rotate-3 transition-transform hover:rotate-6">
                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'wght' 700" }}>change_history</span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                            UMBRAL
                        </h1>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 dark:text-primary pt-0.5">
                            Finance
                        </span>
                    </div>
                </div>
                {/* Close button for mobile only */}
                {onCloseMobile && (
                    <button onClick={onCloseMobile} className="md:hidden text-slate-500 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
            </div>

            {/* --- NAVIGATION --- */}
            <div className="flex-1 px-4 py-2 flex flex-col gap-2 overflow-y-auto">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-600 px-4 mb-1 uppercase tracking-wider">Menu</div>
                <NavLink to="/dashboard" icon="space_dashboard" label="Panel Principal" isActive={currentPath === '/dashboard'} onClick={onCloseMobile} />
                <NavLink to="/envelopes" icon="mail" label="Mis Sobres" isActive={currentPath === '/envelopes'} onClick={onCloseMobile} />
                <NavLink to="/projections" icon="trending_up" label="Proyecciones" isActive={currentPath === '/projections'} onClick={onCloseMobile} />

                <div className="my-2 border-t border-slate-100 dark:border-slate-800/50 mx-4"></div>

                <div className="text-xs font-bold text-slate-400 dark:text-slate-600 px-4 mb-1 mt-2 uppercase tracking-wider">Ajustes</div>
                <NavLink to="/settings" icon="settings" label="Configuración" isActive={currentPath === '/settings'} onClick={onCloseMobile} />
            </div>

            {/* --- USER PROFILE (BOTTOM) --- */}
            <div className="p-4 mt-auto">
                <Link to="/settings" onClick={onCloseMobile} className="group flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-md transition-all">
                    <div className="relative">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt={profile.name} className="h-10 w-10 rounded-full object-cover shadow-sm bg-slate-100 dark:bg-slate-800" />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {profile.name.charAt(0)}
                            </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#0c1a18] rounded-full"></div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-primary transition-colors">
                            {profile.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 group-hover:text-primary transition-colors font-medium">
                            Ver Cuenta
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Desktop Sidebar (Static) */}
            <aside className="hidden md:flex w-72 bg-white dark:bg-[#0c1a18] border-r border-slate-100 dark:border-slate-800 flex-col h-screen shrink-0 sticky top-0 z-20 transition-colors duration-300">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar (Drawer/Modal) */}
            <div className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Drawer */}
                <aside className={`absolute top-0 left-0 w-[80%] max-w-[300px] h-full bg-white dark:bg-[#0c1a18] shadow-2xl transition-transform duration-300 ease-out border-r border-slate-100 dark:border-slate-800 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SidebarContent onCloseMobile={onClose} />
                </aside>
            </div>
        </>
    );
};