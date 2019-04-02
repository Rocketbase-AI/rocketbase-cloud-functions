import React from "react";
import { compose } from "recompose";
import Layout from "../components/HomeLayout";
import PasswordChangeForm from "../components/PasswordChange";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from "../components/Session";
import { PasswordForgetForm } from "./password-forget";

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <Layout>
        <h1>Account: {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </Layout>
    )}
  </AuthUserContext.Consumer>
);
const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AccountPage);
