import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Star,
  History as HistoryIcon,
  ShieldCheck,
  Calculator,
  TrendingUp,
  Percent,
  Tag,
  Receipt,
  CreditCard,
  Wallet,
  ShoppingBag,
  Boxes,
  BarChart3,
  Sprout,
  HardHat,
  Truck,
  UtensilsCrossed,
  Globe,
  Megaphone,
  UserCheck,
  Building2,
  Cog,
  Laptop,
  GraduationCap,
  ArrowLeft,
  X,
  Sparkles,
} from 'lucide-react';

import { CalculatorCategory, Language, CalculationHistoryItem } from './types';
import { calculatorsCatalog, translations } from './utils/translations';
import { Header } from './components/Header';
import { BottomNav, MobileTab } from './components/BottomNav';
import { HistoryModal } from './components/HistoryModal';
import { TestRunnerModal } from './components/TestRunnerModal';

// Calculator Component Imports
import { BasicCalculator } from './components/calculators/BasicCalculator';
import { ProfitLossCalculator } from './components/calculators/ProfitLossCalculator';
import { MarginMarkupCalculator } from './components/calculators/MarginMarkupCalculator';
import { DiscountCalculator } from './components/calculators/DiscountCalculator';
import { GstCalculator } from './components/calculators/GstCalculator';
import { EmiCalculator } from './components/calculators/EmiCalculator';
import { ExpensesCalculator } from './components/calculators/ExpensesCalculator';
import { RetailKiranaCalculator } from './components/calculators/RetailKiranaCalculator';
import { InventoryCalculator } from './components/calculators/InventoryCalculator';
import { BusinessFinanceCalculator } from './components/calculators/BusinessFinanceCalculator';
import { AgricultureMandiCalculator } from './components/calculators/AgricultureMandiCalculator';
import { ConstructionCalculator } from './components/calculators/ConstructionCalculator';
import { TransportCalculator } from './components/calculators/TransportCalculator';
import { RestaurantCalculator } from './components/calculators/RestaurantCalculator';
import { EcommerceCalculator } from './components/calculators/EcommerceCalculator';
import { MarketingCalculator } from './components/calculators/MarketingCalculator';
import { SalaryCalculator } from './components/calculators/SalaryCalculator';
import { RealEstateCalculator } from './components/calculators/RealEstateCalculator';
import { ManufacturingCalculator } from './components/calculators/ManufacturingCalculator';
import { FreelancingCalculator } from './components/calculators/FreelancingCalculator';
import { CoachingCalculator } from './components/calculators/CoachingCalculator';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Calculator,
  TrendingUp,
  Percent,
  Tag,
  Receipt,
  CreditCard,
  Wallet,
  ShoppingBag,
  Boxes,
  BarChart3,
  Sprout,
  HardHat,
  Truck,
  UtensilsCrossed,
  Globe,
  Megaphone,
  UserCheck,
  Building2,
  Cog,
  Laptop,
  GraduationCap,
};

export default function App() {
  // Language & Theme State
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('bizcalc_lang') as Language) || 'en';
  });
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('bizcalc_theme') === 'dark';
  });

  // Navigation State
  const [activeCategory, setActiveCategory] = useState<CalculatorCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [mobileTab, setMobileTab] = useState<MobileTab>('all');

  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTestsOpen, setIsTestsOpen] = useState(false);

  // Favourites & History (Stored in LocalStorage)
  const [favourites, setFavourites] = useState<CalculatorCategory[]>(() => {
    try {
      const saved = localStorage.getItem('bizcalc_favs');
      return saved ? JSON.parse(saved) : ['basic', 'profit_loss', 'gst', 'retail_kirana', 'emi'];
    } catch {
      return ['basic', 'profit_loss', 'gst', 'retail_kirana', 'emi'];
    }
  });

  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('bizcalc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bizcalc_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bizcalc_theme', 'light');
    }
  }, [isDark]);

  // Sync Language
  useEffect(() => {
    localStorage.setItem('bizcalc_lang', lang);
  }, [lang]);

  // Sync Favourites
  useEffect(() => {
    localStorage.setItem('bizcalc_favs', JSON.stringify(favourites));
  }, [favourites]);

  // Sync History
  useEffect(() => {
    localStorage.setItem('bizcalc_history', JSON.stringify(history));
  }, [history]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const toggleFavourite = (id: CalculatorCategory) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveHistory = (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: CalculationHistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // Store up to 50 items
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // Filter Calculators based on Search & Group
  const filteredCalculators = useMemo(() => {
    return calculatorsCatalog.filter((calc) => {
      // Group filter
      if (selectedGroup === 'favourites') {
        if (!favourites.includes(calc.id)) return false;
      } else if (selectedGroup !== 'all') {
        if (calc.group !== selectedGroup) return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchName =
        calc.name.en.toLowerCase().includes(q) || calc.name.hi.toLowerCase().includes(q);
      const matchDesc =
        calc.desc.en.toLowerCase().includes(q) || calc.desc.hi.toLowerCase().includes(q);
      const matchKeywords = calc.keywords.some((k) => k.toLowerCase().includes(q));

      return matchName || matchDesc || matchKeywords;
    });
  }, [selectedGroup, searchQuery, favourites]);

  // Handle Mobile Bottom Nav Tab clicks
  const handleSelectMobileTab = (tab: MobileTab) => {
    setMobileTab(tab);
    if (tab === 'all') {
      setActiveCategory(null);
      setSelectedGroup('all');
    } else if (tab === 'favourites') {
      setActiveCategory(null);
      setSelectedGroup('favourites');
    } else if (tab === 'basic') {
      setActiveCategory('basic');
    } else if (tab === 'history') {
      setIsHistoryOpen(true);
    } else if (tab === 'tests') {
      setIsTestsOpen(true);
    }
  };

  const t = translations[lang];

  // Render the selected active calculator component
  const renderActiveCalculator = () => {
    if (!activeCategory) return null;

    const commonProps = {
      lang,
      onSaveHistory: handleSaveHistory,
      isFavourite: favourites.includes(activeCategory),
      onToggleFavourite: () => toggleFavourite(activeCategory),
    };

    switch (activeCategory) {
      case 'basic':
        return <BasicCalculator {...commonProps} />;
      case 'profit_loss':
        return <ProfitLossCalculator {...commonProps} />;
      case 'margin_markup':
        return <MarginMarkupCalculator {...commonProps} />;
      case 'discount':
        return <DiscountCalculator {...commonProps} />;
      case 'gst':
        return <GstCalculator {...commonProps} />;
      case 'emi':
        return <EmiCalculator {...commonProps} />;
      case 'expenses':
        return <ExpensesCalculator {...commonProps} />;
      case 'retail_kirana':
        return <RetailKiranaCalculator {...commonProps} />;
      case 'inventory':
        return <InventoryCalculator {...commonProps} />;
      case 'business_finance':
        return <BusinessFinanceCalculator {...commonProps} />;
      case 'agriculture':
        return <AgricultureMandiCalculator {...commonProps} />;
      case 'construction':
        return <ConstructionCalculator {...commonProps} />;
      case 'transport':
        return <TransportCalculator {...commonProps} />;
      case 'restaurant':
        return <RestaurantCalculator {...commonProps} />;
      case 'ecommerce':
        return <EcommerceCalculator {...commonProps} />;
      case 'marketing':
        return <MarketingCalculator {...commonProps} />;
      case 'salary':
        return <SalaryCalculator {...commonProps} />;
      case 'real_estate':
        return <RealEstateCalculator {...commonProps} />;
      case 'manufacturing':
        return <ManufacturingCalculator {...commonProps} />;
      case 'freelancing':
        return <FreelancingCalculator {...commonProps} />;
      case 'coaching':
        return <CoachingCalculator {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors pb-20 md:pb-12">
      {/* Top Bar Contract Compliant Header */}
      <Header
        lang={lang}
        onToggleLang={toggleLang}
        isDark={isDark}
        onToggleDark={toggleDark}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenTests={() => setIsTestsOpen(true)}
        historyCount={history.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeCategory ? (
          /* Active Calculator View */
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline min-h-[44px] px-2 -ml-2 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{lang === 'hi' ? 'सभी कैलकुलेटर पर वापस' : 'Back to all calculators'}</span>
              </button>

              <div className="text-xs text-slate-500 hidden sm:block">
                <span>BizCalc Pro</span> <span aria-hidden="true">·</span>{' '}
                <span>{calculatorsCatalog.find((c) => c.id === activeCategory)?.name[lang]}</span>
              </div>
            </div>

            {/* Active Calculator Body */}
            {renderActiveCalculator()}
          </div>
        ) : (
          /* Directory & Search View */
          <div className="space-y-6">
            {/* Hero / Filter Section */}
            <div className="text-center max-w-2xl mx-auto space-y-3 pt-2 pb-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 text-balance">
                {lang === 'hi'
                  ? 'भारतीय व्यापार और वित्त के सटीक कैलकुलेटर'
                  : 'Smart Business Calculators for India'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'किराना, जीएसटी, मंडी भाव, ईएमआई, वेतन, निर्माण, होटल व ई-कॉमर्स हेतु 21 विशेष उपकरण।'
                  : '21 specialized financial tools for retail, GST, Mandi trade, EMI, construction, restaurant, and salary.'}
              </p>

              {/* Live Search Input */}
              <div className="relative max-w-lg mx-auto pt-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full min-h-[48px] pl-11 pr-10 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-slate-100 placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Segmented Category Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none max-w-4xl mx-auto justify-start sm:justify-center">
              {[
                { id: 'all', label: lang === 'hi' ? 'सभी (21)' : 'All (21)' },
                {
                  id: 'favourites',
                  label: `${lang === 'hi' ? 'पसंदीदा' : 'Starred'} (${favourites.length})`,
                  icon: Star,
                },
                { id: 'core', label: lang === 'hi' ? 'व्यापार व छूट' : 'Trade & Pricing' },
                { id: 'finance', label: lang === 'hi' ? 'जीएसटी व ऋण' : 'GST & Loans' },
                { id: 'industry', label: lang === 'hi' ? 'उद्योग व निर्माण' : 'Industry & Fleet' },
                { id: 'services', label: lang === 'hi' ? 'सेवाएं व वेतन' : 'Services & Payroll' },
              ].map((grp) => {
                const Icon = grp.icon;
                const isActive = selectedGroup === grp.id;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => setSelectedGroup(grp.id)}
                    className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-teal-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'fill-current' : ''}`} />}
                    <span>{grp.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Calculators Grid */}
            {filteredCalculators.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500 space-y-3">
                <Search className="w-10 h-10 mx-auto opacity-30 stroke-1" />
                <p className="text-sm font-medium">
                  {lang === 'hi'
                    ? 'कोई कैलकुलेटर नहीं मिला। कृपया अलग खोज शब्द आज़माएँ।'
                    : 'No calculators found matching your search.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGroup('all');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl"
                >
                  {lang === 'hi' ? 'फ़िल्टर हटाएं' : 'Clear Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCalculators.map((calc) => {
                  const Icon = ICON_MAP[calc.icon] || Calculator;
                  const isFav = favourites.includes(calc.id);

                  return (
                    <div
                      key={calc.id}
                      onClick={() => setActiveCategory(calc.id)}
                      className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {/* Top card row: Icon, Badge, Star */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="flex items-center gap-2">
                            {calc.badge && (
                              <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200/60 dark:border-teal-800/60">
                                {calc.badge}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavourite(calc.id);
                              }}
                              className={`p-1.5 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                                isFav
                                  ? 'text-amber-500'
                                  : 'text-slate-300 hover:text-slate-500 dark:text-slate-600'
                              }`}
                              title={isFav ? 'Remove from favourites' : 'Add to favourites'}
                            >
                              <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {calc.name[lang]}
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {calc.desc[lang]}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
                        <span>{lang === 'hi' ? 'गणना शुरू करें →' : 'Open Calculator →'}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {calc.group}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-100">BizCalc Pro</span>
            <span>·</span>
            <span>{lang === 'hi' ? 'भारतीय व्यापारिक कैलकुलेटर' : 'Indian Business Calculators'}</span>
          </div>

          <div className="text-[11px] text-slate-500">
            {lang === 'hi'
              ? 'सटीक सूत्र · ऑफ़लाइन सुरक्षित · कोई अनिवार्य लॉगिन नहीं'
              : 'Precise Formulas · 100% Offline & Private · No Login Required'}
          </div>
        </div>
      </footer>

      {/* Mobile Ergonomic Bottom Navigation Bar */}
      <BottomNav
        activeTab={mobileTab}
        onSelectTab={handleSelectMobileTab}
        lang={lang}
        historyCount={history.length}
        favouritesCount={favourites.length}
      />

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onSelectCalculator={(id) => {
          setActiveCategory(id);
          setIsHistoryOpen(false);
        }}
        lang={lang}
      />

      <TestRunnerModal
        isOpen={isTestsOpen}
        onClose={() => setIsTestsOpen(false)}
        lang={lang}
      />
    </div>
  );
}
