import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

export const LoginForm = () => {
    const { handleLogin: loginApi, isLoading, error, setError } = useLogin();
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
        <div className="h-screen w-full flex justify-center items-center bg-bg font-sans">
            <div className="w-[1126px] h-[600px] shadow-2xl overflow-hidden rounded-3xl bg-white flex border border-slate-100">
                {/* Bagian Kiri: Foto/Visual */}
                <div className="w-1/2 relative h-full hidden md:block">
                    <img
                        src="/login_side_image.png"
                        alt="Workspace"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent flex flex-col justify-end p-12">
                        <h2 className="text-white text-3xl font-bold mb-2">SIMPREIL</h2>
                        <p className="text-slate-200 text-sm tracking-wide">
                            Sistem Informasi Manajemen Terintegrasi untuk masa depan yang lebih efisien.
                        </p>
                    </div>
                </div>

                {/* Bagian Kanan: Form Login */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-16 bg-white">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-dark mb-2">Welcome Back!</h1>
                        <p className="text-slate-500">Silakan masuk untuk melanjutkan ke dashboard Anda.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6" noValidate>
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
                            <input
                                type="text"
                                placeholder="Masukkan username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isSubmitted && !username
                                    ? "border-danger ring-2 ring-danger/10"
                                    : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    }`}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Kode Keamanan</label>
                            <input
                                type="number"
                                placeholder="12345"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all tracking-[0.3em] font-mono ${isSubmitted && !code
                                    ? "border-danger ring-2 ring-danger/10"
                                    : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    }`}
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-danger/10 text-danger text-xs py-2 px-3 rounded-lg border border-danger/20 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-danger"></span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-button hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4 flex justify-center items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Memproses...
                                </>
                            ) : (
                                "Masuk Sekarang"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-slate-400">
                        &copy; 2026 SIMPREIL Team. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

