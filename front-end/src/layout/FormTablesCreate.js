import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

import FormTables from "./FormTables";
import ErrorAlert from "./ErrorAlert";

function FormTablesCreate() {
  const history = useHistory();
  const [error, setError] = useState(undefined);

  const initialFormState = {
    table_name: "",
    party_size: "",
};

  const [formData, setFormData] = useState({ ...initialFormState });
  
  const isValidFormData = () => {
    // Sample validation, adjust according to requirements
    if (!formData.table_name || !formData.party_size) {
      setError("Table name and party size are required.");
      return false;
    }
  
    // You can add more validation logic here, such as date format checks, etc.
  
    return true;
  };


  const handleChange = ({ target }) => {
    let value = target.type === "checkbox" ? target.checked : target.value;

    if (target.name === "party_size") {
      value = Number(value);
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
      console.log(formData);
      await createTable(formData);
      setFormData({ ...initialFormState });
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

    <form name="create" onSubmit={handleCreateSubmit}>
      <FormTables handleChange={handleChange} formData={formData} />
      <br/>
      <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Cancel</button>
      <button type="submit" className="btn btn-primary">Add Reservation</button>
    </form>

  </>
  );
}

export default FormTablesCreate;
