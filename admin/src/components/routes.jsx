import React, { useContext } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import login from "../pages/login";
import register from "../pages/register";
import dashboard from "../pages/dashboard";
import adminDashboard from "../pages/admin/dashboard";
import adminReports from "../pages/admin/reports";
import reports from "../pages/reports";
import report from "../pages/admin/reportByLocation";
import profile from "../pages/profile";
import adminReportDetails from "../pages/admin/reportDetails";
import manageOrganization from "../pages/admin/manageOrganization";
import { AuthContext } from "../data/auth";
import { Context } from "../data/context";
import ViewReportByLocation from "../pages/admin/ViewReportByLocation";
import Profile from "../pages/admin/profile";
import ManageUsers from "../pages/admin/manageUsers";
import UserDetails from "../pages/admin/userDetails";

const Routes = () => {
  const { currentUser } = useContext(AuthContext);
  const { role } = useContext(Context);

  if (currentUser && role === "admin") {
    return (
      <Switch>
        <Route path="/admin/dashboard" component={adminDashboard} />
        <Route
          path="/admin/reportByLocation"
          component={ViewReportByLocation}
        />
        <Route path="/admin/reports" component={adminReports} />
        <Route path="/admin/report/:reportId" component={adminReportDetails} />
        <Route path="/admin/organization" component={manageOrganization} />
        <Route path="/profile" component={Profile} />
        <Route path="/profile" component={Profile} />
        <Route path="/admin/users" component={ManageUsers} />
        <Route path="/admin/user/:id" component={UserDetails} />
        <Route path="/admin/report" component={report} />
        <Redirect to="/admin/report" />
      </Switch>
    );
  } else if (currentUser && role === "organization") {
    return (
      <Switch>
        <Route path="/dashboard" component={dashboard} />
        <Route path="/reports" component={reports} />
        <Route path="/profile" component={profile} />
        <Redirect to="/dashboard" />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route path="/login" component={login} />
        <Route path="/register" component={register} />
        <Redirect to="/login" />
      </Switch>
    );
  }
};
export default Routes;
