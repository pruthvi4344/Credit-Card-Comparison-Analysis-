import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import CrawlerPage from "./pages/CrawlerPage";
import SearchPage from "./pages/SearchPage";
import SpellCheckPage from "./pages/SpellCheckPage";
import WordCompletionPage from "./pages/WordCompletionPage";
import FrequencyPage from "./pages/FrequencyPage";
import SearchHistoryPage from "./pages/SearchHistoryPage";
import RankingPage from "./pages/RankingPage";
import RegexToolsPage from "./pages/RegexToolsPage";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/crawler" element={<CrawlerPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/spell-check" element={<SpellCheckPage />} />
            <Route path="/word-completion" element={<WordCompletionPage />} />
            <Route path="/frequency" element={<FrequencyPage />} />
            <Route path="/search-frequency" element={<SearchHistoryPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/regex-tools" element={<RegexToolsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
