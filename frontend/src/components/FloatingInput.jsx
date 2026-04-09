const FloatingInput = ({
  label,
  type = 'text',
  value,
  onChange,
  icon,
  rightAdornment,
  ...props
}) => (
  <label className="group relative block">
    <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition group-focus-within:text-sky-500 dark:text-slate-500 dark:group-focus-within:text-sky-300">
      {icon}
    </div>

    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder=" "
      className="peer h-16 w-full rounded-[22px] border border-white/55 bg-white/65 px-12 text-[15px] text-slate-900 outline-none transition placeholder:text-transparent focus:border-sky-300 focus:bg-white/80 focus:shadow-[0_0_0_5px_rgba(125,184,255,0.18)] dark:border-white/10 dark:bg-white/6 dark:text-white dark:focus:border-sky-400/50 dark:focus:bg-white/10 dark:focus:shadow-[0_0_0_5px_rgba(56,189,248,0.12)]"
      {...props}
    />

    <span className="pointer-events-none absolute left-12 top-1/2 z-10 -translate-y-1/2 rounded-full bg-transparent px-1 text-sm text-slate-500 transition-all peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-sky-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-sky-600 dark:text-slate-400 dark:peer-focus:text-sky-300 dark:peer-[:not(:placeholder-shown)]:text-sky-300">
      {label}
    </span>

    {rightAdornment ? <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2">{rightAdornment}</div> : null}
  </label>
);

export default FloatingInput;
