import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isExiting, setIsExiting] = React.useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 400);

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const typeConfig = {
    success: { bg: 'bg-emerald-500', icon: 'check_circle' },
    error: { bg: 'bg-red-500', icon: 'error' },
    warning: { bg: 'bg-amber-500', icon: 'warning' }
  };

  const { bg, icon } = typeConfig[type] || typeConfig.success;

  return (
    <div className={`fixed top-24 right-6 z-[9999] w-[calc(100%-3rem)] max-w-xs md:max-w-sm ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
      <style>{`
        .toast-enter {
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .toast-exit {
          animation: slideOutRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(120%); opacity: 0; }
        }
      `}</style>
      <div className={`${bg} text-white px-5 py-4 rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex items-center gap-4 border border-white/20 backdrop-blur-xl`}>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-lg">{icon}</span>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] flex-1 leading-tight">{message}</p>
        <button onClick={() => { setIsExiting(true); setTimeout(onClose, 400); }} className="opacity-50 hover:opacity-100 transition-opacity p-1">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
};

export default Toast;
