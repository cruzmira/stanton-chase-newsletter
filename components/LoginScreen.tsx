import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (password: string) => boolean;
  t: (key: string) => string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, t }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(password)) {
      setError(t('loginError'));
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#062152] flex flex-col items-center justify-center relative overflow-hidden">

      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#1054cc]/6 blur-[200px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-md">

        {/* Logo */}
        <img
          src="/logo-blue.svg"
          alt="Stanton Chase"
          className="w-72 sm:w-96 h-auto brightness-0 invert mb-3"
        />

        {/* Subtitle */}
        <span className="text-white/40 text-sm font-light tracking-[0.3em] uppercase mb-12">
          Newsletter Generator
        </span>

        {/* Password form */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center gap-3"
        >
          <div className={`w-full rounded-2xl border transition-all duration-300 ${focused ? 'border-[#1054cc]/50 bg-white/[0.06]' : 'border-white/10 bg-white/[0.03]'} p-1`}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={t('loginPasswordPlaceholder')}
              className="w-full px-5 py-3.5 bg-transparent text-white text-sm placeholder-white/25 focus:outline-none text-center"
              autoFocus
            />
          </div>

          {error && (
            <span className="text-red-400/80 text-xs">{error}</span>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#1054cc] hover:bg-[#1260e0] text-white text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#1054cc]/20"
          >
            {t('loginButton')}
          </button>
        </form>

      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <span className="text-[11px] text-white/15 font-light">Powered by Encounte s.r.o.</span>
      </div>

    </div>
  );
};

export default LoginScreen;
