import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useSettings } from "@/features/settings/hooks/useSettings";

export const LoginForm = () => {
    const { handleLogin: loginApi, isLoading, error, setError } = useLogin();
    const { settings } = useSettings();
    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitted(true);

        if (!username || !code) {
            setError("Harap isi semua bidang.");
            return;
        }

        await loginApi(username, code);
    }

    return (
        <div className="min-h-screen w-full flex justify-center items-center bg-bg2 font-sans relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            <div className="w-full max-w-[1100px] h-[600px] shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] overflow-hidden rounded-[2.5rem] bg-white/80 backdrop-blur-xl flex border border-white z-10 mx-4">
                
                {/* Bagian Kiri: Visual Mewah (Gradients & Glassmorphism) */}
                <div className="w-1/2 relative h-full hidden md:flex flex-col justify-between p-14 bg-gradient-to-br from-primary via-button to-secondary overflow-hidden">
                    {/* Decorative geometric shapes */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
                    <div className="absolute top-1/2 left-1/2 w-full h-full border-[40px] border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    
                    <div className="relative z-10 flex gap-4 items-center bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 w-max shadow-xl">
                        {settings?.schoolLogo ? (
                            <img src={settings.schoolLogo} alt="Logo Sekolah" className="w-14 h-14 object-contain drop-shadow-md" />
                        ) : (
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                                <span className="text-white font-black text-xs">LOGO</span>
                            </div>
                        )}
                        {settings?.organizationLogo ? (
                            <img src={settings.organizationLogo} alt="Logo OSIS" className="w-14 h-14 object-contain drop-shadow-md" />
                        ) : (
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                                <span className="text-white font-black text-xs">OSIS</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="relative z-10 mt-auto">
                        <span className="inline-block px-3.5 py-1.5 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-5 border border-white/20 shadow-sm backdrop-blur-md">
                            Portal E-Voting
                        </span>
                        <h2 className="text-white text-4xl font-black mb-4 leading-tight drop-shadow-lg">
                            {settings?.schoolName || "Sistem Pemilihan Digital"}
                        </h2>
                        <p className="text-white/90 text-sm tracking-wide leading-relaxed font-medium drop-shadow-md max-w-sm">
                            Gunakan hak suara Anda dengan cerdas. Ciptakan masa depan organisasi yang lebih baik melalui pemilihan yang aman, efisien, dan transparan.
                        </p>
                    </div>
                </div>

                {/* Bagian Kanan: Form Login */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-12 lg:px-16 bg-white/60">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">Selamat Datang! <span className="text-primary">👋</span></h1>
                        <p className="text-slate-500 text-sm font-medium">Silakan masuk menggunakan kredensial Anda untuk memberikan hak suara di bilik pemilihan.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6" noValidate>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Username / NISN</label>
                            <input
                                type="text"
                                placeholder="Masukkan username Anda"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full px-5 py-3.5 rounded-xl border-2 outline-none transition-all font-medium text-slate-700 bg-white/80 ${isSubmitted && !username
                                    ? "border-rose-400 bg-rose-50 focus:border-rose-500"
                                    : "border-slate-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 hover:border-slate-200"
                                    }`}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Kode Keamanan / Passcode</label>
                            <input
                                type="number"
                                placeholder="• • • • • •"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className={`w-full px-5 py-3.5 rounded-xl border-2 outline-none transition-all tracking-[0.3em] font-mono font-bold text-slate-700 bg-white/80 ${isSubmitted && !code
                                    ? "border-rose-400 bg-rose-50 focus:border-rose-500"
                                    : "border-slate-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 hover:border-slate-200"
                                    }`}
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-rose-50 text-rose-600 text-xs font-bold py-3 px-4 rounded-xl border border-rose-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-primary to-button hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] mt-2 flex justify-center items-center gap-2 uppercase tracking-wide text-sm"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Memverifikasi...
                                </>
                            ) : (
                                "Masuk ke Bilik Suara"
                            )}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                        &copy; 2026 SIMPREIL Team. Hak Cipta Dilindungi.
                    </p>
                </div>
            </div>
        </div>
    );
};

