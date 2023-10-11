import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

import FormReservationCreate from "./FormReservationCreate";
import FormReservationUpdate from "./FormReservationUpdate";
import ReservationSearch from "./ReservationSearch";
import FormSeatAssign from "./FormSeatAssign";
import FormTablesCreate from "./FormTablesCreate";


/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations/new">
        <FormReservationCreate />
      </Route>

      <Route exact={true} path="/reservations/:reservationId/edit">
        <FormReservationUpdate />
      </Route>

      <Route exact={true} path="/reservations/:reservationId/seat">
        <FormSeatAssign />
      </Route>

      <Route exact={true} path="/search">
        <ReservationSearch />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/tables/new">
        <FormTablesCreate />
      </Route>

      <Route exact={true} path="/dashboard">
        <Dashboard date={today()} />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
