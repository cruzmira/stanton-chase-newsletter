import React, { useState, useCallback, useEffect } from 'react';
import { Language, NewsletterData } from './types';
import { TRANSLATIONS } from './constants';
import { generateNewsletter } from './services/geminiService';
import { exportToHtml } from './utils/exportHtml';

import PhoneIcon from './components/icons/PhoneIcon';
import ChevronDownIcon from './components/icons/ChevronDownIcon';
import DocumentIcon from './components/icons/DocumentIcon';
import SparklesIcon from './components/icons/SparklesIcon';
import CheckCircleIcon from './components/icons/CheckCircleIcon';
import { LANGUAGES } from './constants';
import LoginScreen from './components/LoginScreen';
import LandingPage from './components/LandingPage';

// Header Component
const Header: React.FC<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  setShowAboutPage: (show: boolean) => void;
}> = ({ language, setLanguage, t, setShowAboutPage }) => {
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <header className="bg-[#003F2D] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <img src="/CBRE_white.png" alt="CBRE" className="h-7" />
            <span className="text-xl font-semibold text-white">Newsletter Generator</span>
          </div>
          <nav className="flex items-center space-x-2 text-sm font-medium text-white">
            <button onClick={() => setShowAboutPage(true)} className="hover:bg-white/20 p-2 rounded-md transition-colors">{t('aboutCbre')}</button>
            <div className="relative">
              <button onClick={() => setPhoneOpen(!phoneOpen)} className="flex items-center hover:bg-white/20 p-2 rounded-md transition-colors">
                <PhoneIcon className="w-4 h-4 mr-1" />
                <span>{t('phone')}</span>
              </button>
              {phoneOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#2d3748] text-white rounded-md shadow-lg p-2 text-center">
                  +420<br />224 854<br />060
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center hover:bg-white/20 p-2 rounded-md transition-colors">
                <span>{currentLang?.flag}</span>
                <span className="mx-1">{currentLang?.name}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

// Footer Component
const Footer: React.FC = () => (
  <footer className="text-center py-6 text-sm text-gray-500">
    <p>© {new Date().getFullYear()} CBRE AI Labs. Všechna práva vyhrazena.</p>
  </footer>
);

// Initial View Component
const InitialView: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-8 mt-12 text-center max-w-4xl mx-auto">
    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{t('readyToCreate')}</h3>
    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{t('readyToCreateSubtitle')}</p>
    <div className="grid md:grid-cols-2 gap-8 text-left">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="w-12 h-12 bg-[#003F2D]/10 text-[#003F2D] rounded-lg flex items-center justify-center mb-4">
          <DocumentIcon className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-lg text-gray-800 mb-2">{t('aiResearch')}</h4>
        <p className="text-gray-600 text-sm">{t('aiResearchDesc')}</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="w-12 h-12 bg-[#003F2D]/10 text-[#003F2D] rounded-lg flex items-center justify-center mb-4">
          <SparklesIcon className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-lg text-gray-800 mb-2">{t('instantBranding')}</h4>
        <p className="text-gray-600 text-sm">{t('instantBrandingDesc')}</p>
      </div>
    </div>
  </div>
);

// Newsletter Display Component
const NewsletterDisplay: React.FC<{ newsletterData: NewsletterData, t: (key: string) => string, topic: string }> = ({ newsletterData, t, topic }) => {
  const { image, content, sources } = newsletterData;
  return (
    <div className="mt-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
        <div className="bg-[#003F2D] text-white p-6">
          <img src="/CBRE_white.png" alt="CBRE" className="h-8 mb-1" />
          <p className="text-sm">{t('cbreOverview')}</p>
        </div>
        {image && <img src={image} alt={content.title} className="w-full h-64 object-cover" />}
        <div className="p-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content.intro}</p>

          <h4 className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b pb-2">{t('keyPoints')}</h4>
          <ul className="space-y-3">
            {content.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <CheckCircleIcon className="w-6 h-6 text-[#003F2D] mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>

          <div className="text-center mt-12">
            <a href="https://www.cbre.cz" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#003F2D] text-white font-bold py-3 px-8 rounded-md hover:bg-[#002A1E] transition-colors">
              {t('moreOnCbre')}
            </a>
          </div>
        </div>
        <div className="bg-gray-50 px-8 py-4 border-t">
          <p className="text-xs text-gray-500 text-center">{t('disclaimer')}</p>
        </div>
      </div>

      {sources.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('sources')}</h3>
          <ul className="space-y-2 list-disc list-inside">
            {sources.map((source, index) => source.web && (
              <li key={index}>
                <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-[#003F2D] hover:underline break-all">
                  {source.web.title || source.web.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="text-center py-4">
        <button onClick={() => exportToHtml(newsletterData, topic)} className="bg-[#003F2D] text-white font-bold py-3 px-8 rounded-md hover:bg-[#002A1E] transition-colors">
          {t('exportHtml')}
        </button>
      </div>
    </div>
  );
};

// About Page Component
const AboutPage: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl font-bold text-[#003F2D]">{t('aboutCbrePageTitle')}</h2>
    <p className="mt-4 text-lg text-gray-600">{t('aboutCbrePageContent')}</p>
  </div>
);

// Main App
const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [topic, setTopic] = useState('');
  const [domains, setDomains] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newsletterData, setNewsletterData] = useState<NewsletterData | null>(null);

  const t = useCallback((key: string) => {
    return TRANSLATIONS[language][key] || key;
  }, [language]);

  const handleLogin = (password: string): boolean => {
    if (password === 'cbre*') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleGenerate = async () => {
    if (!topic || isLoading) return;
    setIsLoading(true);
    setError(null);
    setNewsletterData(null);
    setShowAboutPage(false);

    try {
      const { content, sources, image } = await generateNewsletter(topic, language, domains);
      setNewsletterData({ content, sources, image });
    } catch (e) {
      setError(t('errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    // Reset views if language changes
    setNewsletterData(null);
    setShowAboutPage(false);
    setError(null);
    setDomains('');
  };

  const handleSetShowAboutPage = (show: boolean) => {
    setShowAboutPage(show);
    if (show) {
      setNewsletterData(null);
      setError(null);
    }
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} t={t} />;
  }

  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} t={t} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header language={language} setLanguage={handleSetLanguage} t={t} setShowAboutPage={handleSetShowAboutPage} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showAboutPage && (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#003F2D]">{t('mainTitle')}</h2>
            <p className="mt-2 text-lg text-gray-600">{t('mainSubtitle')}</p>
            <div className="mt-8 max-w-xl mx-auto space-y-3">
              <div className="relative">
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value.slice(0, 2000))}
                  placeholder={t('inputPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#003F2D] focus:border-[#003F2D] transition resize-none"
                  disabled={isLoading}
                  rows={4}
                  maxLength={2000}
                />
                <span className="absolute bottom-2 right-3 text-xs text-gray-400">{topic.length}/2000</span>
              </div>
              <button
                onClick={handleGenerate}
                disabled={isLoading || !topic}
                className={`w-full px-6 py-3 font-semibold text-white rounded-md shadow-sm transition-colors ${isLoading || !topic
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#003F2D] hover:bg-[#002A1E]'
                  }`}
              >
                {isLoading ? t('generatingButton') : t('generateButton')}
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 text-left">{t('domainsLabel')}</label>
              <input
                type="text"
                value={domains}
                onChange={(e) => setDomains(e.target.value)}
                placeholder={t('domainsPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#003F2D] focus:border-[#003F2D] transition text-sm"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-400 mt-1 text-left">{t('domainsHint')}</p>
            </div>
          </div>
        )}

        {isLoading && <div className="text-center mt-12 text-gray-600">{t('generatingButton')}...</div>}
        {error && <div className="text-center mt-12 text-red-600 bg-red-100 border border-red-300 rounded-md p-4 max-w-xl mx-auto">{error}</div>}

        {showAboutPage && <AboutPage t={t} />}
        {!showAboutPage && !isLoading && !error && !newsletterData && <InitialView t={t} />}
        {!showAboutPage && newsletterData && <NewsletterDisplay newsletterData={newsletterData} t={t} topic={topic} />}

      </main>
      <Footer />
    </div>
  );
};

export default App;
