import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";

import FormReservation from "./FormReservation";
import ErrorAlert from "./ErrorAlert";

function FormReservationCreate() {
  const history = useHistory();
  const [error, setError] = useState(null);

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    party_size: "",
};

  const [formData, setFormData] = useState({ ...initialFormState });
  
  const isValidFormData = () => {
    // Sample validation, adjust according to requirements
    if (!formData.first_name || !formData.last_name || !formData.mobile_number) {
      setError("First name, last name, and mobile number are required.");
      return false;
    }
  
    // You can add more validation logic here, such as date format checks, etc.
  
    return true;
  };



  const isTuesday = (dateString) => {
    const date = new Date(dateString);
    return date.getUTCDay() === 2;  // 2 corresponds to Tuesday
  };

  const handleChange = ({ target }) => {
    let value = target.type === "checkbox" ? target.checked : target.value;

    if (target.name === "party_size") {
      value = Number(value);
    }

    if (target.name === "reservation_date" && isTuesday(value)) {
      setError("Reservations cannot be made for Tuesdays.");
      return;
    } else {
      setError(null); // clear error message for other date selections
    }

    // Validation for reservation time (between 10:00AM and 9:30PM)
    if (target.name === "reservation_time") {
      const [hours, minutes] = value.split(":").map(Number);
  
      if (
        (hours < 10) || 
        (hours === 10 && minutes < 30) || 
        (hours === 21 && minutes > 30) || 
        hours > 21
      ) {
        setError("Reservations are only allowed between 10:30AM and 9:30PM.");
        return;
      } else {
        setError(null); // clear error message for other date selections
      }
    }

    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();

    if (!isValidFormData()) return;

    try {
      await createReservation(formData);
      setFormData({ ...initialFormState });
      // Optionally navigate to another page or provide success feedback
      history.push('/dashboard');  // for example
    } catch (error) {
      setError(error);  // Assuming the error object has relevant info for the user
    }
  };

  return (
    <>

    <form name="create" onSubmit={handleCreateSubmit}>

      {/* Inline Error Message */}
      {error && <ErrorAlert error={error} />}

      <FormReservation handleChange={handleChange} formData={formData} />
      <br />
      <button type="button" className="btn btn-secondary" onClick={() => history.push(`/dashboard`)}>Cancel</button>
      <button type="submit" className="btn btn-primary">Add Reservation</button>
    </form>

  </>
  );
}

export default FormReservationCreate;
