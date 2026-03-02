import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (password: string) => boolean;
  t: (key: string) => string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, t }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(password)) {
      setError(t('loginError'));
      setPassword('');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <img src="/CBRE_green.png" alt="CBRE" className="h-10" />
        </div>
        <h2 className="text-2xl font-bold text-[#003F2D] text-center mb-2">{t('loginTitle')}</h2>
        <p className="text-gray-600 text-center mb-6">{t('loginSubtitle')}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="sr-only">{t('loginPasswordPlaceholder')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder={t('loginPasswordPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#003F2D] focus:border-[#003F2D] transition"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#003F2D] text-white font-bold py-2 px-4 rounded-md hover:bg-[#002A1E] transition-colors"
          >
            {t('loginButton')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
