import React from "react";

function FormReservationSearch({ handleChange, formData }) {

  console.log(formData);
  return (
    <>
      <label htmlFor="mobile_number">
        <input
          className="form-control"
          placeholder="Enter a customer's phone number"
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
    </>
  );
}

export default FormReservationSearch;
