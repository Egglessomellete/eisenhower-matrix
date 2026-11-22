import { NavLink } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        {/* NavLink adds the class "active" to the link of the current page */}
        <NavLink to="/" end>
          Matrix
        </NavLink>
        <NavLink to="/planner">Planner</NavLink>
        <NavLink to="/attendance">Attendance</NavLink>
      </div>
      <button className="nav-logout" onClick={() => supabase.auth.signOut()}>
        Log out
      </button>
    </nav>
  );
}

export default NavBar;
