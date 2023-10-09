import React from "react";

function FormSeat({ reservation, handleChange, formData, tables }) {
  return (
    <>
      {tables && reservation ? (
        <select name="table_id" onChange={handleChange} value={formData.table_id}>
          <option>Make a Selection</option>
          {tables
            .filter((table) => table.party_size >= reservation.party_size)
            .map((table) => (
              <option key={table.table_id} value={table.table_id}>
                {table.table_id} - {table.table_name} - {table.party_size}
              </option>
            ))}
        </select>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default FormSeat;