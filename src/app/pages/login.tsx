import Head from "next/head";
import React, { Component } from "react";
import { withFirebase } from "../components/Firebase";
import Layout from "../components/HomeLayout";
import { PasswordForgetLink } from "./password-forget";
import { SignUpLink } from "./signup";

const SignInPage = () => (
  <Layout>
    <Head>
      <title>Login | RocketHub</title>
    </Head>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </Layout>
);

const INITIAL_STATE = {
  email: "",
  error: null,
  password: "",
};

class SignInFormBase extends Component<any, any> {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <div className="container has-text-centered">
        <div className="columns is-vcentered">
          <div className="column is-6 is-offset-3">
            <div className="flex-card wavy-login-card">
              <h2 className="is-size-3">Log in</h2>
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
        </div>
      </div>
    );
  }
}

const SignInForm = withFirebase(SignInFormBase);

export default SignInPage;

export { SignInForm };
