import { useState } from 'react';
import './styles.css';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CrawlerPage from './pages/CrawlerPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import SpellCheckPage from './pages/SpellCheckPage.jsx';
import WordCompletionPage from './pages/WordCompletionPage.jsx';
import FrequencyPage from './pages/FrequencyPage.jsx';
import SearchHistoryPage from './pages/SearchHistoryPage.jsx';
import RankingPage from './pages/RankingPage.jsx';
import RegexToolsPage from './pages/RegexToolsPage.jsx';

const PAGES = {
  dashboard:  DashboardPage,
  crawler:    CrawlerPage,
  search:     SearchPage,
  spellcheck: SpellCheckPage,
  completion: WordCompletionPage,
  frequency:  FrequencyPage,
  history:    SearchHistoryPage,
  ranking:    RankingPage,
  regex:      RegexToolsPage,
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const Page = PAGES[page] || DashboardPage;

  return (
    <div className="app">
      <Navbar />
      <Sidebar active={page} onNav={setPage} />
      <main className="main-content">
        <Page onNav={setPage} />
      </main>
    </div>
  );
}