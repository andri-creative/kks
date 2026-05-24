import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';

// ==========================================
// SERVICES & API LAYER IMPORTS
// ==========================================
import { authApi } from "@/features/auth/api/authApi";
import { authService } from "@/services/authService";
import { expireVoteSession } from '@/features/candidate/api/candidateApi';

// ==========================================
// CUSTOM HOOKS IMPORTS
// ==========================================
import { useSettings } from '@/features/settings/hooks/useSettings';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

// ==========================================
// ICONS IMPORTS (React Icons)
// ==========================================
import { FiShield, FiLogOut, FiUser, FiClock } from 'react-icons/fi';

/**
 * ClientLayout component
 * Serves as the main layout wrapper for student-facing (Client) pages.
 * Handles the session countdown, real-time visual progress bar, auto-logout,
 * and top navigation bar display.
 */
export default function ClientLayout() {
  const navigate = useNavigate();
  const [confirmConfig, setConfirmConfig] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void }>({
    isOpen: false, title: "", message: "", onConfirm: () => {}
  });
  
  // Get active session user info
  const currentUser = authService.getCurrentUser();
  
  // Retrieve global settings (academic year, school logo, customized timer duration)
  const { settings } = useSettings();
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  // The total duration allowed per election session (retrieved dynamically from backend settings)
  const totalDuration = settings.timerDuration || 300; // Fallback to 5 minutes (300s)
  
  // Real-time counter representing remaining seconds for the active student session
  const [timeLeft, setTimeLeft] = useState(totalDuration);

  // ==========================================
  // SIDE EFFECTS & LIFECYCLES
  // ==========================================

  /**
   * Effect: Synchronizes active timeLeft state with totalDuration from backend
   * whenever configuration settings are fetched/loaded successfully.
   */
  useEffect(() => {
    setTimeLeft(totalDuration);
  }, [totalDuration]);

  /**
   * Effect: Orchestrates the core 1-second countdown interval.
   * Automatically triggers force logout when time reaches zero.
   */
  useEffect(() => {
    // Sync remaining seconds to global window scope so child pages can read it
    (window as any).votingTimeLeft = timeLeft;

    // If the counter reaches zero, execute session destruction instantly
    if (timeLeft <= 0) {
      const forceLogout = async () => {
        try {
          // 🔒 Call backend to mark user's voting_status as 'waktu_habis' in the database
          await expireVoteSession();
        } catch (dbError) {
          console.error("Failed to mark session as expired in DB:", dbError);
        }
        try {
          await authApi.logout();
          navigate({ to: "/" });
        } catch (error) {
          console.error("Auto logout failed:", error);
          // Safety fallback: force clear local storage credentials and redirect
          authService.logout();
          window.location.href = '/';
        }
      };
      forceLogout();
      return;
    }

    // Start 1-second tick decrement
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    // Clean up interval on unmount or when timeLeft state updates to prevent memory leaks
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  // ==========================================
  // USER ACTIONS / HANDLERS
  // ==========================================

  /**
   * Triggers explicit manual logout when requested by the student.
   * Asks for confirmation to prevent accidental session termination.
   */
  const handleLogout = async () => {
    setConfirmConfig({
      isOpen: true,
      title: "Keluar dari Sistem",
      message: "Apakah Anda yakin ingin keluar dari sistem? Waktu voting Anda akan tetap berjalan jika belum selesai.",
      onConfirm: async () => {
        try {
          await authApi.logout();
          navigate({ to: "/" });
        } catch (error) {
          console.error("Logout failed:", error);
        }
      }
    });
  };

  // ==========================================
  // HELPER FORMATTERS
  // ==========================================

  /**
   * Formats raw seconds into human-readable MM:SS format.
   * Example: 300 seconds -> "05:00"
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ==========================================
  // DYNAMIC STYLE & WARNING LEVEL CALCULATION
  // ==========================================
  
  // Default values: Emerald Green theme representing a safe session duration
  let timerStyles = "bg-emerald-50 border-emerald-150 text-emerald-700 font-bold";
  let timerIconColor = "text-emerald-500 animate-pulse";
  let progressColor = "bg-emerald-500";

  // Dynamic warning thresholds based on total duration
  const redThreshold = Math.min(60, totalDuration * 0.2);     // Red alert: remaining time under 20% or 1 minute
  const warningThreshold = totalDuration * 0.6;               // Orange alert: remaining time under 60%

  if (timeLeft <= redThreshold) {
    // Stage 3: CRITICAL (Red Glow with bouncing elements to notify urgency)
    timerStyles = "bg-rose-50 border-rose-200 text-rose-700 font-bold";
    timerIconColor = "text-rose-500 animate-bounce";
    progressColor = "bg-rose-500 animate-pulse";
  } else if (timeLeft <= warningThreshold) {
    // Stage 2: WARNING (Orange/Amber representation of warning zone)
    timerStyles = "bg-amber-50 border-amber-150 text-amber-700 font-bold";
    timerIconColor = "text-amber-500 animate-pulse";
    progressColor = "bg-amber-500";
  }

  // ==========================================
  // VIEW RENDER
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-bg2 text-gray-700 font-sans">
      
      {/* Global Client Header Navbar */}
      <header className="h-16 border-b border-gray-150 flex items-center px-6 justify-between sticky top-0 bg-white/95 backdrop-blur-md z-40 relative">
        
        {/* Left Side: System Branding & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-150 flex items-center justify-center">
            <FiShield className="size-4 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-sm font-black text-text-green uppercase tracking-widest leading-none">E-Voting Pemilu</h1>
            <p className="text-[9px] text-gray-400 mt-1 font-semibold uppercase tracking-wider">Kartu Suara Digital Terenkripsi</p>
          </div>
        </div>

        {/* Center: Absolute Positioned Security Countdown Timer Pill */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 select-none">
          <div className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border font-mono text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-colors duration-500 ${timerStyles}`}>
            <FiClock className={`size-4 ${timerIconColor}`} />
            <span>Sesi Pemilu: {formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Right Side: Active Student profile card & Manual Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-black text-gray-700 flex items-center gap-1.5">
              <FiUser className="size-3 text-emerald-600" />
              {currentUser.name || 'Pemilih'}
            </span>
            <span className="text-[8px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded font-black uppercase tracking-wider mt-0.5">
              @{currentUser.username || 'Siswa'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer bg-white shadow-xs"
            title="Keluar dari Aplikasi"
          >
            <FiLogOut className="size-4" />
          </button>
        </div>

        {/* Bottom edge: Dynamic Real-time colored progress timer bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-100 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${progressColor}`}
            style={{ width: `${(timeLeft / totalDuration) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Ballot Area Container */}
      <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
        <Outlet />
      </main>

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        isDestructive={false}
      />
    </div>
  );
}
