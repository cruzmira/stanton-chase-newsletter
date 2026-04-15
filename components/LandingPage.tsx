import React from 'react';
import { Language } from '../types';
import { LANGUAGES } from '../constants';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface LandingPageProps {
    onEnterApp: () => void;
    t: (key: string) => string;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, t, language, setLanguage }) => {
    const [langOpen, setLangOpen] = React.useState(false);
    const currentLang = LANGUAGES.find(l => l.code === language);

    const steps = [
        { key: 'landingStep1', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
        )},
        { key: 'landingStep2', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        )},
        { key: 'landingStep3', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
        )},
        { key: 'landingStep4', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
        )},
        { key: 'landingStep5', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )},
    ];

    return (
        <div className="min-h-screen bg-[#062152] flex flex-col relative overflow-hidden">

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#1054cc]/5 blur-[200px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#1054cc]/4 blur-[150px] pointer-events-none" />

            {/* Language switcher — top right */}
            <div className="absolute top-6 right-8 z-20">
                <div className="relative">
                    <button
                        onClick={() => setLangOpen(!langOpen)}
                        className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                    >
                        <span>{currentLang?.flag}</span>
                        <span>{currentLang?.name}</span>
                        <ChevronDownIcon className="w-3.5 h-3.5" />
                    </button>
                    {langOpen && (
                        <div className="absolute right-0 mt-1 w-36 bg-[#0a2d6e] rounded-xl shadow-2xl py-1 border border-white/10 overflow-hidden">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                                    className={`flex items-center w-full text-left px-4 py-2.5 text-sm transition-colors ${lang.code === language ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                >
                                    <span className="mr-2">{lang.flag}</span>
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-16">

                {/* Logo */}
                <img
                    src="/logo-blue.svg"
                    alt="Stanton Chase"
                    className="w-64 sm:w-80 h-auto brightness-0 invert mb-3"
                />

                {/* Subtitle */}
                <span className="text-white/35 text-xs font-light tracking-[0.35em] uppercase mb-8">
                    Newsletter Generator
                </span>

                {/* Description */}
                <p className="text-white/40 text-center text-sm leading-relaxed max-w-lg mb-14">
                    {t('landingDesc')}
                </p>

                {/* Pipeline steps — horizontal */}
                <div className="flex items-center gap-2 sm:gap-3 mb-16 flex-wrap justify-center">
                    {steps.map((step, i) => (
                        <React.Fragment key={i}>
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] transition-all group">
                                <span className="text-[#5b9aff]/60 group-hover:text-[#5b9aff] transition-colors">{step.icon}</span>
                                <span className="text-white/50 group-hover:text-white/80 text-sm font-medium transition-colors whitespace-nowrap">{t(step.key)}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <svg className="w-4 h-4 text-white/15 flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Enter button */}
                <button
                    onClick={onEnterApp}
                    className="group flex items-center gap-3 bg-[#1054cc] hover:bg-[#1260e0] text-white font-semibold py-4 px-10 rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-[#1054cc]/25 hover:scale-[1.02]"
                >
                    <span>{t('enterApp')}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>

            </div>

            {/* Footer */}
            <div className="text-center pb-6">
                <span className="text-[11px] text-white/15 font-light">Powered by Encounte s.r.o.</span>
            </div>

        </div>
    );
};

export default LandingPage;
