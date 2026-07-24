import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { AppProvider } from './context/AppContext';
import { LocaleProvider } from './i18n/LocaleContext';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CreditsPage from './pages/CreditsPage';
import ExplainDetail from './pages/ExplainDetail';
import ExplainList from './pages/ExplainList';
import FaqPage from './pages/FaqPage';
import InputPage from './pages/InputPage';
import ParamsPage from './pages/ParamsPage';
import PrivacyPage from './pages/PrivacyPage';
import ResultPage from './pages/ResultPage';
import TermsPage from './pages/TermsPage';
import TestGuide from './pages/TestGuide';
import TestSelector from './pages/TestSelector';
import VerificationPage from './pages/VerificationPage';

export default function App() {
  return (
    <LocaleProvider>
      <AppProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col bg-surface">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<TestSelector />} />
                <Route path="/guide" element={<TestGuide />} />
                <Route path="/params" element={<ParamsPage />} />
                <Route path="/input" element={<InputPage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/explain" element={<ExplainList />} />
                <Route path="/explain/:testId" element={<ExplainDetail />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/credits" element={<CreditsPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="*" element={<TestSelector />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AppProvider>
    </LocaleProvider>
  );
}
