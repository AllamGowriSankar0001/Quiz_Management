import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "sidebar-link-active" : ""}`;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Quiz Management</h1>
        <p className="sidebar-subtitle">Admin dashboard</p>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={linkClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/quiz/create" className={linkClass}>
            Create Quiz
          </NavLink>
          <NavLink to="/allquizzes" className={linkClass}>
            All Quizzes
          </NavLink>
        </nav>
      </div>

      <button onClick={handleLogout} className="sidebar-logout">
        Logout
      </button>

      <div className="menu" style={{ display: menu ? "flex" : "none" }}>
        <nav className="menu-nav">
          <NavLink
            to="/dashboard"
            className={linkClass}
            onClick={() => setMenu(false)}
            end
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/quiz/create"
            className={linkClass}
            onClick={() => setMenu(false)}
          >
            Create Quiz
          </NavLink>
          <NavLink
            to="/allquizzes"
            className={linkClass}
            onClick={() => setMenu(false)}
          >
            All Quizzes
          </NavLink>
        </nav>
        <button
          onClick={() => {
            handleLogout();
            setMenu(false);
          }}
          className="menu-logout"
        >
          {" "}
          Logout
        </button>
      </div>
      <div
        className="menu-bar"
        onClick={() => {
          setMenu(!menu);
        }}
      >
        <i className={menu ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
      </div>
    </aside>
  );
}

export default Sidebar;
