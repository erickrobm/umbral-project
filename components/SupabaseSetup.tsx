
import React, { useState } from 'react';

export const SupabaseSetup: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const envExample = `VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`;

    const handleCopy = () => {
        navigator.clipboard.writeText(envExample);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-6">
            <div className="w-full max-w-2xl bg-white dark:bg-[#162e2a] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row">

                {/* Visual Side */}
                <div className="md:w-1/3 bg-gradient-to-br from-primary to-emerald-600 p-8 flex flex-col justify-between text-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-3xl font-bold text-white">database</span>
                        </div>
                        <h2 className="text-3xl font-black leading-tight text-white mb-2">Connect Database</h2>
                        <p className="font-medium text-emerald-900/70">Supabase Integration</p>
                    </div>
                </div>

                {/* Content Side */}
                <div className="md:w-2/3 p-8 md:p-10 flex flex-col">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Missing Credentials</h1>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                            To run Umbral, you need to connect it to a Supabase project.
                            Please update your <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-primary font-bold">.env</code> file.
                        </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6 relative group">
                        <pre className="text-sm font-mono text-slate-700 dark:text-slate-300 overflow-x-auto p-2">
                            {envExample}
                        </pre>
                        <button
                            onClick={handleCopy}
                            className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            title="Copy to clipboard"
                        >
                            <span className="material-symbols-outlined text-sm">
                                {copied ? 'check' : 'content_copy'}
                            </span>
                        </button>
                    </div>

                    <div className="space-y-4 mb-8">
                        <h3 className="font-bold text-sm uppercase tracking-wide text-slate-400">Next Steps</h3>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 font-bold text-slate-500">1</div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Create Supabase Project</p>
                                <p className="text-sm text-slate-500">Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-primary underline hover:text-primary-dark">supabase.com</a> and create a new project.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 font-bold text-slate-500">2</div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Get Credentials</p>
                                <p className="text-sm text-slate-500">Find <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">Project URL</code> and <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">anon key</code> in Project Settings &gt; API.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 font-bold text-slate-500">3</div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Update and Restart</p>
                                <p className="text-sm text-slate-500">Add them to <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">.env</code> and restart the terminal (Ctrl+C, then npm run dev).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
