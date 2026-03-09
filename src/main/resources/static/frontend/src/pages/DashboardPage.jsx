import { useEffect, useState } from "react";
import axios from "axios";
import FeatureCard from "../components/FeatureCard";

const featureItems = [
  {
    title: "Web Crawler",
    description: "Crawls credit card websites and refreshes indexed content."
  },
  {
    title: "Inverted Index Search",
    description: "Performs fast keyword search across crawled pages."
  },
  {
    title: "Spell Check & Completion",
    description: "Suggests corrections and prefix completions using text processing."
  },
  {
    title: "Frequency Analytics",
    description: "Tracks word usage, search trends, and ranking signals."
  },
  {
    title: "Page Ranking",
    description: "Ranks pages by keyword occurrences and relevance."
  },
  {
    title: "Regex Tools",
    description: "Validates input and extracts structured patterns."
  }
];

function DashboardPage() {

  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/test")
      .then(res => {
        setBackendMessage(res.data);
      })
      .catch(err => {
        console.error(err);
        setBackendMessage("Backend connection failed ❌");
      });
  }, []);

  return (
    <section className="page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of search, ranking, parsing, and regex capabilities.</p>

        {/* Backend connection indicator */}
        <div style={{marginTop:"10px", fontWeight:"bold"}}>
          Backend Status: {backendMessage}
        </div>

      </div>

      <div className="card-grid">
        {featureItems.map((item) => (
          <FeatureCard
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;