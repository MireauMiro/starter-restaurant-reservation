import React from "react";

function FormTables({ handleChange, formData }) {

  return (
    <>
      <label htmlFor="table_name">
        <input
          className="form-control"
          placeholder="Table Name"
          id="table_name"
          type="text"
          name="table_name"
          onChange={handleChange}
          value={formData.table_name}
          required
        />
      </label>
      <br />
      <label htmlFor="party_size">
        <input
          className="form-control"
          placeholder="Party Size"
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

export default FormTables;
