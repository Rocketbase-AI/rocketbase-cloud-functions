import cookie from "js-cookie";
import nextCookie from "next-cookies";
import App, { Container } from "next/app";
import Router from "next/router";
import React from "react";
import Firebase, { FirebaseContext } from "../components/Firebase";
import { AuthUserContext } from "../components/Session";
import { LOG_IN } from "../constants/routes";

const firebase = new Firebase();

export const login = async authUser => {
  cookie.set("token", authUser, { expires: 1 });
  Router.push("/home");
};

interface MyAppProps {
  userData: any;
}

class MyApp extends App<MyAppProps, any> {
  static async getInitialProps({ Component, ctx }) {
    const { token } = nextCookie(ctx);
    let userData = null;
    if (token) {
      userData = JSON.parse(token);
    }
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, userData };
  }

  constructor(props) {
    super(props);

    this.syncLogout = this.syncLogout.bind(this);
    this.state = {
      listener: null,
    };
  }

  componentDidMount() {
    const listener = firebase.onAuthUserListener(
      authUser => {
        login(JSON.stringify(authUser));
      },
      () => {
        // logout();
      },
    );
    this.setState({ listener });
    window.addEventListener("storage", this.syncLogout);
  }

  componentWillUnmount() {
    window.removeEventListener("storage", this.syncLogout);
    window.localStorage.removeItem("logout");
    this.state.listener();
  }

  syncLogout(event) {
    if (event.key === "logout") {
      console.log("logged out from storage!");
      Router.push(LOG_IN);
    }
  }

  render() {
    const { Component, pageProps, userData } = this.props;
    return (
      <Container>
        <FirebaseContext.Provider value={firebase}>
          <AuthUserContext.Provider value={userData}>
            <Component {...pageProps} />
          </AuthUserContext.Provider>
        </FirebaseContext.Provider>
      </Container>
    );
  }
}

export default MyApp;
