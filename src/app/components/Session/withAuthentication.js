import React, { Component } from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";
import Router from "next/router";
import nextCookie from "next-cookies";
import cookie from "js-cookie";

export const login = async ({ token }) => {
  cookie.set("token", token, { expires: 1 });
  Router.push("/profile");
};

export const logout = () => {
  cookie.remove("token");
  // to support logging out from all windows
  window.localStorage.setItem("logout", Date.now());
  Router.push("/login");
};

// Gets the display name of a JSX component for dev tools
const getDisplayName = Component =>
  Component.displayName || Component.name || "Component";

const withAuthentication = WrappedComponent => {
  class WithAuthentication extends Component {
    static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps(ctx) {
      const { token } = nextCookie(ctx);

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));
      console.log(componentProps);
      return { ...componentProps, token };
    }

    constructor(props) {
      super(props);

      this.syncLogout = this.syncLogout.bind(this);
    }

    componentDidMount() {
      window.addEventListener("storage", this.syncLogout);
    }

    componentWillUnmount() {
      window.removeEventListener("storage", this.syncLogout);
      window.localStorage.removeItem("logout");
    }

    syncLogout(event) {
      if (event.key === "logout") {
        console.log("logged out from storage!");
        Router.push("/login");
      }
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.props.token}>
          <WrappedComponent {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
