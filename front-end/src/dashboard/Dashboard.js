import React, { useEffect, useState } from "react";
import { listReservations, listTables, resetTable, reservationStatus } from "../utils/api";
import { previous, next } from "../utils/date-time";

import ErrorAlert from "../layout/ErrorAlert";
import ReservationItem from "../layout/ReservationItem";
import TableItem from "../layout/TableItem";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date);


  function goToPreviousDay() {
    setCurrentDate(previous(currentDate));
  }

  function goToNextDay() {
      setCurrentDate(next(currentDate));
  }  


  useEffect(loadTables, []);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(loadDashboard, [currentDate]);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  function handleFinish(event) {
    const tableId = event.target.getAttribute("data-table-id-finish");
    const confirmation = window.confirm("Is this table ready to seat new guests? This cannot be undone.");

    if (confirmation) {
        resetTable(tableId)
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            // Reload both reservations and tables
            loadDashboard();
            loadTables();
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
  }

  function handleCancel(event) {
    const reservationId = event.target.getAttribute("data-reservation-id-cancel");
    const confirmation = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
    
    if (confirmation) {
      // Call the API function to set the status to "cancelled"
      reservationStatus(reservationId, "Cancelled")
        .then(() => {
          // Refresh the reservations 
          loadDashboard();  
        })
        .catch(error => {
          console.error("Error cancelling reservation:", error);
        });
    }
  }

  const filteredReservations = reservations.filter(reservation => reservation.status !== "finished");
  const reservationList = filteredReservations.map((reservation) => <ReservationItem key={reservation.id} reservation={reservation} handleCancel={handleCancel} />);
  const tableList = tables.map((table) => <TableItem key={table.id} table={table} handleFinish={handleFinish} />);



  return (
    <main>
      <h1>Dashboard | Reservations for {currentDate}</h1>

      <div className="buttonContainer">
        <button onClick={goToPreviousDay}>Previous</button>
        <button onClick={goToNextDay}>Next</button>
      </div>

      {/* Inline Error Message */}
      {error && <ErrorAlert error={error} />}
      {reservationsError && <ErrorAlert error={reservationsError} />}
      {tablesError && <ErrorAlert error={tablesError} />}


      <div>
        
        <table>
          <tr>
            <td>Name</td>
            <td>Phone</td>
            <td>Reservation Time</td>
            <td>Party Size</td>
            <td>Status</td>
            <td>Actions</td>
          </tr>
          { reservationList }
        </table>
      </div>



      <div>
        <h4>Tables</h4>
        <table>
          <tr>
            <td>Table Name</td>
            <td>Party Size</td>
            <td>Status</td>
            <td>Actions</td>
          </tr>
          { tableList }
        </table>
      </div>

    </main>
  );
}

export default Dashboard;
