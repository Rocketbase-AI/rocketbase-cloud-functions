import React from "react";
import { compose } from "recompose";
import Layout from "../components/HomeLayout";
import {
  withAuthorization,
  withEmailVerification,
} from "../components/Session";

const HomePage = () => (
  <Layout>
    <h1>Home Page</h1>
    <p>The Home Page is accessible by every signed in user.</p>

  </Layout>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(HomePage);
