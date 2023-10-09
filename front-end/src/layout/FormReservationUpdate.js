import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";

import FormReservation from "./FormReservation";
import ErrorAlert from "./ErrorAlert";

function FormReservationUpdate() {

  const { reservationId } = useParams();
  const [reservation, setReservation] = useState({});

  const history = useHistory();
  const [error, setError] = useState(undefined);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    party_size: "",
  });

  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservationId, abortController.signal)
      .then((selectedReservation) => {
        if (selectedReservation) {
          // Set the reservation object to state
          setReservation(selectedReservation);
          // Set the initial form data with the deck name and description
          setFormData({
            first_name: selectedReservation.first_name,
            last_name: selectedReservation.last_name,
            mobile_number: selectedReservation.mobile_number,
            reservation_date: selectedReservation.reservation_date,
            reservation_time: selectedReservation.reservation_time,
            party_size: selectedReservation.party_size,
          });
        } else {
          setError("Reservation not found.");
        }
      })
      .catch(setError);

    return () => abortController.abort();
  }, [reservationId]);
  
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
    const value = target.type === "checkbox" ? target.checked : target.value;

    if (target.name === "party_size") {
      value = Number(value);
    }

    if (target.name === "reservation_date" && isTuesday(value)) {
      setError("Reservations cannot be made for Tuesdays.");
      return;
    } else {
      setError(null); // clear error message for other date selections
    }

    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleSubmitUpdate = async (event) => {
    event.preventDefault();

    if (!isValidFormData()) return;

    if (isTuesday(formData.reservation_date)) {
      setError("Reservations cannot be made for Tuesdays.");
      return;
    }

    try {
      await updateReservation(reservationId, formData);
      // Optionally navigate to another page or provide success feedback
      if (history.length > 1) {
        history.goBack();
      } else {
        history.push('/dashboard');
      }
    } catch (error) {
      setError(error);  // Assuming the error object has relevant info for the user
    }
  };

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <>

    <form name="create" onSubmit={handleSubmitUpdate}>
      <FormReservation handleChange={handleChange} formData={formData} />
      <br />
      <button type="button" className="btn btn-secondary" onClick={() => history.push(`/dashboard`)}>Cancel</button>
      <button type="submit" className="btn btn-primary">Update Reservation</button>
    </form>

  </>
  );
}

export default FormReservationUpdate;
