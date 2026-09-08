import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Send,
  Plane,
} from "lucide-react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Plane size={22} />
        </div>
        <div>
          <h2>Travel Agent</h2>
          <span className="sidebar-subtitle">Content Pipeline</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/feeds"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Newspaper size={18} />
          Feeds
        </NavLink>

        <NavLink
          to="/drafts"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FileText size={18} />
          Drafts
        </NavLink>

        <NavLink
          to="/queue"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Send size={18} />
          Queue
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p>Powered by Groq AI</p>
      </div>
    </aside>
  );
}

export default Sidebar;
