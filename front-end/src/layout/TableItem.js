import React from "react";
import NotFound from "./NotFound";

export const TableItem = ({ handleFinish, table }) => {



  const tableStatus = table.reservation_id ? "Occupied" : "Free";

  if (table) {
    return (
          <tr>
            <td>{table.table_name}</td>
            <td>{table.party_size}</td>
            <td data-table-id-status={table.table_id}>{tableStatus}</td>
            <td>
              <button className="btn" data-table-id-finish={table.table_id} onClick={handleFinish}>
                Finish
              </button>
            </td>
          </tr>
    );
  }
  return <NotFound />;
};

export default TableItem;
