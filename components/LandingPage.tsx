import React from 'react';

interface LandingPageProps {
    onEnterApp: () => void;
    t: (key: string) => string;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, t }) => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-[#003F2D] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <img src="/CBRE_white.png" alt="CBRE" className="h-7" />
                            <span className="text-white/60 text-sm">|</span>
                            <span className="text-white text-sm font-medium">{t('landingHeaderSubtitle')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onEnterApp}
                                className="border border-white text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-white/10 transition-colors"
                            >
                                {t('enterApp')} →
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-[#003F2D] pb-12 pt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                            </svg>
                        </div>
                        <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">{t('landingBadge')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">CBRE Newsletter Generator</h1>
                    <p className="text-white/60 text-lg">{t('landingHeroSubtitle')}</p>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-5 gap-10">
                    {/* Left Column */}
                    <div className="lg:col-span-3 space-y-10">
                        {/* Overview */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-[#003F2D] rounded-full inline-block"></span>
                                {t('landingOverviewTitle')}
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {t('landingOverviewText')}
                            </p>
                        </div>

                        {/* Benefits */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('landingBenefitsTitle')}</h3>
                            <ul className="space-y-3">
                                {['landingBenefit1', 'landingBenefit2', 'landingBenefit3', 'landingBenefit4'].map((key) => (
                                    <li key={key} className="flex items-start gap-3">
                                        <span className="text-[#003F2D] mt-0.5 font-bold">→</span>
                                        <span className="text-gray-600">{t(key)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Business Value */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('landingValueTitle')}</h3>
                            <ul className="space-y-3">
                                {['landingValue1', 'landingValue2', 'landingValue3', 'landingValue4'].map((key) => (
                                    <li key={key} className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-[#003F2D] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <span className="text-gray-600">{t(key)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Enter Application Button */}
                        <button
                            onClick={onEnterApp}
                            className="w-full bg-[#003F2D] text-white font-semibold py-4 px-6 rounded-lg hover:bg-[#002A1E] transition-colors text-lg shadow-lg"
                        >
                            {t('enterApp')} →
                        </button>

                        {/* AI Pipeline */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-5">{t('landingPipelineTitle')}</h4>
                            <div className="space-y-1">
                                {[
                                    { icon: '📝', label: t('landingStep1'), color: 'bg-amber-50 border-amber-200' },
                                    { icon: '🔍', label: t('landingStep2'), color: 'bg-blue-50 border-blue-200' },
                                    { icon: '📊', label: t('landingStep3'), color: 'bg-green-50 border-green-200' },
                                    { icon: '✍️', label: t('landingStep4'), color: 'bg-purple-50 border-purple-200' },
                                    { icon: '✅', label: t('landingStep5'), color: 'bg-emerald-50 border-emerald-200' },
                                ].map((step, index) => (
                                    <React.Fragment key={index}>
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${step.color}`}>
                                            <span className="text-lg">{step.icon}</span>
                                            <span className="text-sm font-medium text-gray-700">{step.label}</span>
                                        </div>
                                        {index < 4 && (
                                            <div className="flex justify-center py-0.5">
                                                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                                </svg>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h4 className="text-sm font-bold text-gray-900 mb-4 underline">{t('landingInfoTitle')}</h4>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">{t('landingInfoType')}</p>
                                    <span className="inline-block bg-[#003F2D] text-white text-xs font-medium px-3 py-1 rounded">{t('landingInfoTypeValue')}</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">{t('landingInfoIndustry')}</p>
                                    <span className="text-sm font-medium text-gray-700">{t('landingInfoIndustryValue')}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">{t('landingInfoVersion')}</p>
                                <span className="text-sm font-medium text-gray-700">{t('landingInfoVersionValue')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-200">
                <p>© {new Date().getFullYear()} CBRE AI Labs. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
