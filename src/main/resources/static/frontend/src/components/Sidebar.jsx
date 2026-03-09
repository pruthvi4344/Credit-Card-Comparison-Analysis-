import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/crawler", label: "Web Crawler" },
  { to: "/search", label: "Search" },
  { to: "/spell-check", label: "Spell Check" },
  { to: "/word-completion", label: "Word Completion" },
  { to: "/frequency", label: "Frequency Counter" },
  { to: "/search-frequency", label: "Search Frequency" },
  { to: "/ranking", label: "Page Ranking" },
  { to: "/regex-tools", label: "Regex Tools" }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
            end={item.to === "/"}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
