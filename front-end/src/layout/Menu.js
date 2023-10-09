import React from "react";

import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className="ptNav">
      <div>
        <ul>
          <li>
            <Link to="/">
              Periodic Tables
            </Link>
          </li>
        </ul>

        <ul>
          <li>
            <Link className="nav-link" to="/dashboard">
              <span className="oi oi-dashboard" /> Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/reservations/new">
              <span className="oi oi-plus" /> New Reservation
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tables/new">
              <span className="oi oi-layers" /> New Table
            </Link>
          </li>
        </ul>

        <ul>
        <li>
            <Link to="/search">
              <span className="oi oi-magnifying-glass" /> Search
            </Link>
          </li>
        </ul>

      </div>
    </nav>
  );
}

export default Menu;
