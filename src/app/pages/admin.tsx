import React from "react";
import { compose } from "recompose";
import Layout from "../components/HomeLayout";
import {
  withAuthorization,
  withEmailVerification,
} from "../components/Session";
import { UserItem, UserList } from "../components/Users";
import * as ROLES from "../constants/roles";

const AdminPage = () => (
  <Layout>
    <h1>Admin</h1>
    <p>The Admin Page is accessible by every signed in admin user.</p>
    <UserItem />
    <UserList />
  </Layout>
);

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AdminPage);
