import Head from "next/head";
import React from "react";
import Layout from "../components/HomeLayout";

const RocketPage = ({ rocket }) => (
  <Layout>
    <Head>
      <title>{rocket.name} | RocketHub</title>
    </Head>
    <h1>{rocket.name}</h1>
  </Layout>
);

RocketPage.getInitialProps = async (context, firebase) => {
  const { id } = context.query;
  const rocketSnapshot = await firebase.model(id);
  const rocketData = await rocketSnapshot.data();
  return { rocket: rocketData };
};

export default RocketPage;
