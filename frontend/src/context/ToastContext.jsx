import { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const pushToast = ({ title, description = '', tone = 'info' }) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, title, description, tone }]);
    window.setTimeout(() => removeToast(id), 3200);
  };

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-3xl border px-4 py-3 shadow-2xl backdrop-blur-xl transition ${
              toast.tone === 'error'
                ? 'border-rose-200/70 bg-rose-50/90 text-rose-950'
                : toast.tone === 'success'
                  ? 'border-emerald-200/70 bg-emerald-50/90 text-emerald-950'
                  : 'border-white/70 bg-white/90 text-slate-900'
            }`}
          >
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description ? <p className="mt-1 text-xs opacity-75">{toast.description}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
