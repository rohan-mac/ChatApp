import { motion } from 'framer-motion';

const AuthShell = ({ title, subtitle, footer, children }) => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(123,191,255,0.28),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(139,92,246,0.18),_transparent_22%),linear-gradient(160deg,_#eaf3ff_0%,_#dfeaff_42%,_#0a1020_100%)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top_left,_rgba(0,122,255,0.24),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(113,92,255,0.24),_transparent_26%),linear-gradient(170deg,_#030711_0%,_#08101f_52%,_#02050c_100%)]">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl dark:bg-sky-500/20" />
      <div className="absolute right-[-2rem] top-24 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-500/20" />
      <div className="absolute bottom-[-3rem] left-1/3 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-400/10" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative z-10 w-full max-w-[1120px] overflow-hidden rounded-[36px] border border-white/45 bg-white/30 shadow-[0_40px_140px_rgba(67,108,181,0.22)] backdrop-blur-[28px] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_50px_140px_rgba(0,0,0,0.45)]"
    >
      <div className="grid min-h-[760px] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.45em] text-slate-500 dark:text-slate-400">
              Premium Messaging
            </p>
            <h1 className="mt-5 max-w-md text-5xl font-semibold leading-tight text-slate-900 dark:text-white">
              iPhone-style chat UI with real-time depth.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
              Beautiful glass layers, resilient backend integration, Render cold-start handling, and a practical messaging experience that still feels luxurious.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              'Blurred glass cards with subtle gradients',
              'Fast auth flow with JWT persistence',
              'Real-time messaging, media, edit and delete controls'
            ].map((item) => (
              <div
                key={item}
                className="rounded-[28px] border border-white/45 bg-white/45 px-5 py-4 text-sm text-slate-700 shadow-[0_20px_50px_rgba(126,154,206,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-[430px]">
            <div className="mb-8">
              <p className="text-xs font-medium uppercase tracking-[0.45em] text-sky-600 dark:text-sky-300">
                ChatApp
              </p>
              <h2 className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>
            </div>

            {children}

            {footer ? <div className="mt-6 text-sm text-slate-600 dark:text-slate-300">{footer}</div> : null}
          </div>
        </section>
      </div>
    </motion.div>
  </div>
);

export default AuthShell;
