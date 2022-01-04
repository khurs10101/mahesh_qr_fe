import React, { Fragment } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import Dashboard from "../pages/Dashboard";

const EntryRoutes = () => {
    return (

        <Router>

            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/signin" element={<AuthPage authType={0} />} />
                <Route path="/signup" element={<AuthPage authType={1} />} />
            </Routes>

        </Router>

    )
}

export default EntryRoutes