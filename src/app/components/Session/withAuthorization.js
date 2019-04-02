import React from "react";
import Router from "next/router";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          if (!condition(authUser)) {
            Router.push(ROUTES.LOG_IN);
          }
        },
        () => Router.push(ROUTES.LOG_IN),
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
    // render() {
    //   return <Component {...this.props} />;
    // }
  }

  return withFirebase(WithAuthorization);
};

export default withAuthorization;
