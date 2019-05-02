import Head from "next/head";
import Link from "next/link";
import React, { Component } from "react";
import { withFirebase } from "../components/Firebase";
import Layout from "../components/HomeLayout";
import * as ROUTES from "../constants/routes";


const PasswordForgetPage = () => (
  <Layout>
    <Head>
      <title>Reset your Password | RocketHub</title>
    </Head>
    <PasswordForgetForm />
  </Layout>
);

const INITIAL_STATE = {
  email: "",
  error: null,
};

class PasswordForgetFormBase extends Component<any, any> {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === "";

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const PasswordForgetLink = () => (
  <p className="has-text-grey-light has-text-centered">
    <Link href={ROUTES.PASSWORD_FORGET}>
      <a>Forgot Password?</a>
    </Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
