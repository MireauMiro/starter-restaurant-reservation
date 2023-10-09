import React from "react";

function FormReservation({ handleChange, formData }) {

  return (
    <>
      <label htmlFor="first_name">
        <input
          className="form-control"
          placeholder="First Name"
          id="first_name"
          type="text"
          name="first_name"
          onChange={handleChange}
          value={formData.first_name}
          required
        />
      </label>
      <br />
      <label htmlFor="last_name">
        <input
          className="form-control"
          placeholder="Last Name"
          id="last_name"
          type="text"
          name="last_name"
          onChange={handleChange}
          value={formData.last_name}
          required
        />
      </label> 
      <br />
      <label htmlFor="mobile_number">
        <input
          className="form-control"
          placeholder="Phone"
          id="mobile_number"
          type="number"
          name="mobile_number"
          onChange={handleChange}
          value={formData.mobile_number}
          min="1000000000"
          max="9999999999"
          required
        />
      </label>      
      <br />
      <label htmlFor="reservation_date">
        <input
          className="form-control"
          placeholder="Date of Reservation"
          id="reservation_date"
          type="date"
          name="reservation_date"
          onChange={handleChange}
          value={formData.reservation_date}
          required          
        />
      </label> 
      <br />
      <label htmlFor="reservation_time">
        <input
          className="form-control"
          placeholder="Time of Reservation"
          id="reservation_time"
          type="time"
          name="reservation_time"
          min="10:30"
          max="21:30"
          onChange={handleChange}
          value={formData.reservation_time}
          required          
        />
      </label> 
      <br />
      <label htmlFor="party_size">
        <input
          className="form-control"
          placeholder="Size of Party"
          id="party_size"
          type="number"
          name="party_size"
          min="1"          
          onChange={handleChange}
          value={formData.party_size}
        />
      </label> 
    </>
  );
}

export default FormReservation;
