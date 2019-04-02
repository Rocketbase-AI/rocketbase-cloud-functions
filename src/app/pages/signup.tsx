import { faGift, faLock, faMagic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Router from "next/router";
import React, { Component } from "react";
import { withFirebase } from "../components/Firebase";
import Layout from "../components/HomeLayout";
import * as ROLES from "../constants/roles";
import * as ROUTES from "../constants/routes";


const SignUpPage = () => (
  <Layout>
    <SignUpForm />
  </Layout>
);

const INITIAL_STATE = {
  email: "",
  error: null,
  passwordOne: "",
  username: "",
};

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpFormBase extends Component<any, any> {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;
    const roles = {};

    roles[ROLES.ADMIN] = false;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set(
          {
            email,
            roles,
          },
          { merge: true },
        );
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        Router.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <div className="container has-text-centered">
        <div className="columns is-vcentered">
          <div className="column is-5 is-offset-2">
            <div className="flex-card wavy-login-card">
              <h2 className="is-size-3">Sign Up</h2>
              <form className="" onSubmit={this.onSubmit}>
                <div className="field has-text-left">
                  <label className="label">Username</label>
                  <div className="control">
                    <input
                      className="input"
                      name="email"
                      value={email}
                      onChange={this.onChange}
                      type="email"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div className="field has-text-left">
                  <label className="label">Password</label>
                  <div className="control">
                    <input
                      className="input"
                      name="password"
                      value={password}
                      onChange={this.onChange}
                      type="password"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div className="field">
                  <p>
                    By signing up I agree to the
                    <br />
                    <Link href={ROUTES.TERMS}>
                      <a>terms and conditions</a>
                    </Link>
                  </p>
                </div>
                <div className="">
                  <button
                    className="button is-link is-medium is-fullwidth"
                    disabled={isInvalid}
                    type="submit"
                  >
                    Login
                  </button>
                </div>
                {error && <p>{error.message}</p>}
              </form>
            </div>
          </div>
          <SignUpFeatureCard />
        </div>
      </div>
    );
  }
}

const SignUpFeatureCard = () => (
  <div className="column is-4">
    <div className="flex-card signup-context secondary-card wavy-login-card">
      <h2 className="title is-4 has-text-centered light-text">What you get.</h2>
      <div className="argument">
        <div className="icon">
          <FontAwesomeIcon icon={faMagic} size="2x" />
        </div>
        <div className="argument-text light-text">
          Update checkpoints automatically
        </div>
      </div>
      <div className="argument">
        <div className="icon">
          <FontAwesomeIcon icon={faLock} size="2x" />
        </div>
        <div className="argument-text light-text">
          First <b>5</b> private projects are free
        </div>
      </div>
      <div className="argument pb-40">
        <div className="icon">
          <FontAwesomeIcon icon={faGift} size="2x" />
        </div>
        <div className="argument-text light-text">
          <b>10Gb</b> storage included
        </div>
      </div>
    </div>
  </div>
);

const SignUpLink = () => (
  <p className="has-text-grey-light has-text-centered">
    Don't have an account?{" "}
    <Link href={ROUTES.SIGN_UP}>
      <a>Sign Up</a>
    </Link>
  </p>
);

const SignUpForm = withFirebase(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
