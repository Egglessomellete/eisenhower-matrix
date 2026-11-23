import { NavLink } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <button className="nav-logout" onClick={() => supabase.auth.signOut()}>
        Log out
      </button>
      <div className="nav-links">
        <NavLink to="/" end>
          Matrix
        </NavLink>
        <NavLink to="/planner">Weekly Planner</NavLink>
        <NavLink to="/attendance">Attendance Tracker</NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
