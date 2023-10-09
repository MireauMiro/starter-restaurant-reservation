import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { fetchReservation, listTables, assignTableToReservation } from "../utils/api";

import FormSeat from "./FormSeat";
import ErrorAlert from "./ErrorAlert";

function FormSeatAssign() {
  const { reservationId } = useParams();
  const history = useHistory();
  const [tablesError, setTablesError] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    async function fetchTheReservation() {
      try {
        const fetchedReservation = await fetchReservation(reservationId);
        if (fetchedReservation) {
          setReservation(fetchedReservation);
        } else {
          console.error('No reservation found with the given ID.');
          // Handle this case as necessary
        }
      } catch (error) {
        console.error('Error fetching reservation:', error);
        // Handle the error as needed
      }
    }
  
    fetchTheReservation();
  }, [reservationId]);

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const initialFormState = {
    table_id: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  
  const isValidFormData = () => {
    setError(null);
    // Sample validation, adjust according to requirements
    if (!formData.table_id) {
      setError("Choose a table");
      return false;
    }
 
    // Check if selected table can accommodate the party size
    const selectedTable = tables.find((table) => table.table_id === formData.table_id);
    if (selectedTable && parseInt(selectedTable.party_size) < parseInt(reservation.party_size)) {
        setError('Selected table cannot accommodate the party size.');
        return false;
    }

    return true;
  };


  const handleChange = ({ target }) => {
    let value = target.type === "checkbox" ? target.checked : target.value;



    setFormData({
      ...formData,
      [target.name]: value,
    });
    
  };

  const handleAssignSubmit = async (event) => {
    event.preventDefault();

    console.log(formData.table_id);

    if (!isValidFormData()) return;

    try {
      await assignTableToReservation(formData.table_id, reservationId);
      setFormData({ ...initialFormState });
      loadTables();
      // Optionally navigate to another page or provide success feedback
      history.push('/dashboard');  // for example
    } catch (error) {
      setError(error);  // Assuming the error object has relevant info for the user
    }
  };

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <>

    
    <form name="create" onSubmit={handleAssignSubmit}>
    
    <p>Party Size: {reservation && reservation.party_size}</p>
    
      <FormSeat handleChange={handleChange} formData={formData} tables={tables} reservation={reservation} />
      <br />
      <br />
      <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Cancel</button>
      <button type="submit" className="btn btn-primary">Seat Party</button>
    </form>

  </>
  );
}

export default FormSeatAssign;
