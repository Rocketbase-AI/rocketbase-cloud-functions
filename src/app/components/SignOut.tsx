import React from "react";
import { withFirebase } from "./Firebase";

const SignOutButton = ({ firebase }) => (
  <div className="navbar-item">
    <button
      className="button is-primary"
      type="button"
      onClick={firebase.doSignOut}
    >
      Sign Out
    </button>
  </div>
);

export default withFirebase(SignOutButton);
