import React, { useState, useCallback } from 'react';
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

// Header Component with logo
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
    <header className="bg-[#062152] sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <img src="/logo-blue.svg" alt="Stanton Chase" className="h-8 brightness-0 invert" />
          </div>
          <nav className="flex items-center space-x-1 text-sm font-medium text-white/80">
            <button onClick={() => setShowAboutPage(true)} className="hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg transition-all">{t('aboutStantonChase')}</button>
            <div className="relative">
              <button onClick={() => setPhoneOpen(!phoneOpen)} className="flex items-center hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg transition-all">
                <PhoneIcon className="w-4 h-4 mr-1.5" />
                <span>{t('phone')}</span>
              </button>
              {phoneOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0a2d6e] text-white rounded-xl shadow-2xl p-4 text-center border border-white/10">
                  <span className="text-sm font-medium">+420 222 990 210</span>
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg transition-all">
                <span>{currentLang?.flag}</span>
                <span className="mx-1">{currentLang?.name}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl py-1 overflow-hidden">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
  <footer className="text-center py-8 text-xs text-gray-400">
    <p>© {new Date().getFullYear()} Stanton Chase. All rights reserved. · Powered by Encounte s.r.o.</p>
  </footer>
);

// Initial View Component
const InitialView: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-10 mt-12 text-center max-w-4xl mx-auto shadow-sm">
    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('readyToCreate')}</h3>
    <p className="text-gray-500 mb-10 max-w-2xl mx-auto">{t('readyToCreateSubtitle')}</p>
    <div className="grid md:grid-cols-2 gap-6 text-left">
      <div className="bg-gradient-to-br from-[#f0f5ff] to-[#f8fafc] p-6 rounded-xl border border-[#e0eaff]">
        <div className="w-11 h-11 bg-[#1054cc]/10 text-[#1054cc] rounded-xl flex items-center justify-center mb-4">
          <DocumentIcon className="w-5 h-5" />
        </div>
        <h4 className="font-semibold text-gray-900 mb-1.5">{t('aiResearch')}</h4>
        <p className="text-gray-500 text-sm leading-relaxed">{t('aiResearchDesc')}</p>
      </div>
      <div className="bg-gradient-to-br from-[#f0f5ff] to-[#f8fafc] p-6 rounded-xl border border-[#e0eaff]">
        <div className="w-11 h-11 bg-[#1054cc]/10 text-[#1054cc] rounded-xl flex items-center justify-center mb-4">
          <SparklesIcon className="w-5 h-5" />
        </div>
        <h4 className="font-semibold text-gray-900 mb-1.5">{t('instantBranding')}</h4>
        <p className="text-gray-500 text-sm leading-relaxed">{t('instantBrandingDesc')}</p>
      </div>
    </div>
  </div>
);

// Newsletter Display Component — premium design
const NewsletterDisplay: React.FC<{ newsletterData: NewsletterData, t: (key: string) => string, topic: string }> = ({ newsletterData, t, topic }) => {
  const { image, content, sources } = newsletterData;
  return (
    <div className="mt-10 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">

        {/* Newsletter header with logo */}
        <div className="bg-[#062152] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-blue.svg" alt="Stanton Chase" className="h-7 brightness-0 invert" />
            <div className="w-px h-8 bg-white/20" />
            <span className="text-white/60 text-sm font-light tracking-wide">{t('stantonChaseOverview')}</span>
          </div>
        </div>

        {/* Hero image with gradient overlay */}
        {image && (
          <div className="relative">
            <img src={image} alt={content.title} className="w-full h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}

        {/* Content body */}
        <div className="px-10 py-8">
          {/* Title */}
          <h3 className="text-3xl font-bold text-gray-900 leading-tight mb-6">{content.title}</h3>

          {/* Intro with drop cap effect */}
          <div className="text-gray-600 text-[15px] leading-[1.8] whitespace-pre-wrap mb-10 first-letter:text-4xl first-letter:font-bold first-letter:text-[#1054cc] first-letter:float-left first-letter:mr-2 first-letter:leading-none">
            {content.intro}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <span className="text-xs font-semibold text-[#1054cc] tracking-[0.2em] uppercase">{t('keyPoints')}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>

          {/* Key points as cards */}
          <div className="space-y-3 mb-10">
            {content.keyPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-[#f7f9ff] to-[#fafbff] border border-[#edf1ff] hover:border-[#d4dfff] transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[#1054cc] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-gray-700 text-[15px] leading-relaxed">{point}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a href="https://www.stantonchase.com" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-[#1054cc] text-white font-semibold py-3 px-10 rounded-xl hover:bg-[#0d44ab] transition-all duration-200 hover:shadow-lg hover:shadow-[#1054cc]/20">
              {t('moreOnStantonChase')}
            </a>
          </div>
        </div>

        {/* Disclaimer footer */}
        <div className="bg-gray-50 px-10 py-4 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 text-center leading-relaxed">{t('stantonChaseDisclaimer')}</p>
        </div>
      </div>

      {/* Sources — compact, just domain names */}
      {sources.length > 0 && (
        <div className="bg-white rounded-2xl px-8 py-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-sm font-semibold text-gray-500">{t('sources')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => {
              if (!source.web) return null;
              let domain = source.web.title || '';
              if (!domain) {
                try { domain = new URL(source.web.uri).hostname.replace('www.', ''); } catch { domain = source.web.uri; }
              }
              return (
                <a
                  key={index}
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-[#f0f5ff] border border-gray-100 hover:border-[#d4dfff] text-sm text-gray-600 hover:text-[#1054cc] transition-all"
                >
                  <span className="truncate max-w-[200px]">{domain}</span>
                  <svg className="w-3 h-3 opacity-40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Export button */}
      <div className="text-center py-4">
        <button onClick={() => exportToHtml(newsletterData, topic)}
          className="inline-flex items-center gap-2 bg-[#062152] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#0a2d6e] transition-all duration-200 hover:shadow-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {t('exportHtml')}
        </button>
      </div>
    </div>
  );
};

// About Page Component
const AboutPage: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl font-bold text-[#062152]">{t('aboutStantonChasePageTitle')}</h2>
    <p className="mt-4 text-lg text-gray-500 leading-relaxed">{t('aboutStantonChasePageContent')}</p>
  </div>
);

// Loading animation
const LoadingState: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <div className="flex flex-col items-center justify-center mt-16 gap-4">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-[#1054cc]/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1054cc] animate-spin" />
    </div>
    <span className="text-gray-500 text-sm">{t('generatingButton')}...</span>
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
    if (password === 'stanton*') {
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
    return <LandingPage onEnterApp={() => setShowLanding(false)} t={t} language={language} setLanguage={handleSetLanguage} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8f9fb]">
      <Header language={language} setLanguage={handleSetLanguage} t={t} setShowAboutPage={handleSetShowAboutPage} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!showAboutPage && (
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[#062152] mb-2">{t('mainTitle')}</h2>
            <p className="text-gray-500 mb-8">{t('mainSubtitle')}</p>
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value.slice(0, 2000))}
                  placeholder={t('inputPlaceholder')}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#1054cc]/20 focus:border-[#1054cc] transition-all resize-none bg-white text-gray-800"
                  disabled={isLoading}
                  rows={4}
                  maxLength={2000}
                />
                <span className="absolute bottom-3 right-4 text-xs text-gray-300">{topic.length}/2000</span>
              </div>
              <button
                onClick={handleGenerate}
                disabled={isLoading || !topic}
                className={`w-full px-6 py-3.5 font-semibold text-white rounded-xl shadow-sm transition-all duration-200 ${isLoading || !topic
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#1054cc] hover:bg-[#0d44ab] hover:shadow-lg hover:shadow-[#1054cc]/15'
                  }`}
              >
                {isLoading ? t('generatingButton') : t('generateButton')}
              </button>
              <div className="text-left">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('domainsLabel')}</label>
                <input
                  type="text"
                  value={domains}
                  onChange={(e) => setDomains(e.target.value)}
                  placeholder={t('domainsPlaceholder')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#1054cc]/20 focus:border-[#1054cc] transition-all text-sm bg-white"
                  disabled={isLoading}
                />
                <p className="text-[11px] text-gray-400 mt-1.5">{t('domainsHint')}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading && <LoadingState t={t} />}
        {error && <div className="text-center mt-12 text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 max-w-xl mx-auto text-sm">{error}</div>}

        {showAboutPage && <AboutPage t={t} />}
        {!showAboutPage && !isLoading && !error && !newsletterData && <InitialView t={t} />}
        {!showAboutPage && newsletterData && <NewsletterDisplay newsletterData={newsletterData} t={t} topic={topic} />}

      </main>
      <Footer />
    </div>
  );
};

export default App;
