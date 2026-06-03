import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Travel Content Agent</div>

      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/feeds">Feeds</Link>
        <Link to="/drafts">Drafts</Link>
        <Link to="/queue">Queue</Link>
      </div>
    </nav>
  );
}

export default Navbar;
