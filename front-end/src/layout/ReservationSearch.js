import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { searchReservation } from "../utils/api";

import FormReservationSearch from "./FormReservationSearch";
import ErrorAlert from "./ErrorAlert";

function ReservationSearch() {
  const history = useHistory();
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(undefined);

  const initialFormState = {
    mobile_number: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  
  console.log(formData);

  const isValidFormData = () => {
    // Sample validation, adjust according to requirements
    if (!formData.mobile_number) {
      setError("Mobile number is required for searching.");
      return false;
    }
  
    // You can add more validation logic here, such as date format checks, etc.
  
    return true;
  };


  const handleChange = ({ target }) => {
    const value = target.type === "checkbox" ? target.checked : target.value;

    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    
    // Validate form data
    if (!isValidFormData()) return;
  
    const abortController = new AbortController();
  
    try {
      // Fetch results from the backend
      const results = await searchReservation(formData.mobile_number, abortController.signal);
      
      // Store the search results.
      setSearchResults(results || []);
      console.log(results);
      
    } catch (error) {
      // Handle any errors that occurred during the fetch
      setError(error);
    } finally {
      // Cleanup
      abortController.abort();
    }
  };

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <>

    <form name="create" onSubmit={handleSearchSubmit}>
      <FormReservationSearch handleChange={handleChange} formData={formData} />
      <br />
      <br />
      <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Cancel</button>
      <button type="submit" className="btn btn-primary">Find</button>
    </form>

    <div>
    {searchResults && searchResults.length === 0 && <p>No reservations found.</p>}

    {searchResults.map((reservation, index) => (
      <div key={index}>
        <h3>{reservation.first_name} {reservation.last_name}</h3>
        <p>Mobile Number: {reservation.mobile_number}</p>
      </div>
    ))}
  </div>

  </>
  );
}

export default ReservationSearch;
