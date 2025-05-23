import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import logoImage from "@assets/web/icon-192.png";
import useAuth from "@hooks/useAuth.jsx";

function Sidebar() {
  const { auth } = useAuth();

  return (
    <aside>
      <div className={styles.top}>
        <div className={styles.logo}>
          <img src={logoImage} alt="logo"></img>
          <h2>
            VirtuAid <small>Administration</small>
          </h2>
        </div>
        <div className={styles.close} id="close-btn">
          <span className="material-symbols-rounded">close</span>
        </div>
      </div>
      <div className={styles.sidebar}>
        <NavLink
          className={({ isActive }) => (isActive ? styles.active : "")}
          to="/dashboard"
        >
          <span className="material-symbols-rounded">dashboard</span>
          <h3>Dashboard</h3>
        </NavLink>

        {auth.isSuperAdmin && (
          <>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/carehomes/add"
            >
              <span className="material-symbols-rounded">add_home</span>
              <h3>Add Care Home</h3>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/carehomes/manage"
            >
              <span className="material-symbols-rounded">holiday_village</span>
              <h3>Manage Care Homes</h3>
            </NavLink>

            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/admins/add"
            >
              <span className="material-symbols-rounded">person_add</span>
              <h3>Add admin</h3>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/admins/manage"
            >
              <span className="material-symbols-rounded">manage_accounts</span>
              <h3>Manage admins</h3>
            </NavLink>
          </>
        )}

        {auth.isAdmin && (
          <>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/sessions/view"
            >
              <span className="material-symbols-rounded">event</span>
              <h3>View sessions</h3>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/sessions/add"
            >
              <span className="material-symbols-rounded">calendar_add_on</span>
              <h3>Add sessions</h3>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/feedbacks/view"
            >
              <span className="material-symbols-rounded">inbox</span>
              <h3>Access feedbacks</h3>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/residents/manage"
            >
              <span className="material-symbols-rounded">location_away</span>
              <h3>Manage residents</h3>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/managers/add"
            >
              <span className="material-symbols-rounded">person_add</span>
              <h3>Add Care Home manager</h3>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/managers/manage"
            >
              <span className="material-symbols-rounded">manage_accounts</span>
              <h3>Manage Care Home managers</h3>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/reports/view"
            >
              <span className="material-symbols-rounded">contact_page</span>
              <h3>Access reports</h3>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/reports/add"
            >
              <span className="material-symbols-rounded">upload_file</span>
              <h3>Upload report</h3>
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
