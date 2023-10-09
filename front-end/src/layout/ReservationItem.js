import React from "react";
import { Link } from "react-router-dom";
import NotFound from "./NotFound";

export const ReservationItem = ({ handleCancel, reservation }) => {

  if (reservation) {
    return (
          <tr>
              <td>{reservation.first_name} {reservation.last_name}</td>
              <td>{reservation.mobile_number}</td>
              <td>{reservation.reservation_time}</td>
              <td>{reservation.party_size}</td>
              <td>{reservation.status}</td>
              <td>
                  {reservation.status === "booked" && <Link to={`/reservations/${reservation.reservation_id}/seat`}>Seat</Link>}
                  {reservation.status === "booked" && <Link to={`/reservations/${reservation.reservation_id}/edit`}>Edit</Link>}
                  
                  
                  {reservation.status === "booked" &&
                  <div>
                    <button className="btn btn-danger" data-reservation-id-cancel={reservation.reservation_id} onClick={handleCancel}>
                      Cancel 
                    </button>
                  </div>
                  }
              </td>
          </tr>
    );
  }
  return <NotFound />;
};

export default ReservationItem;
