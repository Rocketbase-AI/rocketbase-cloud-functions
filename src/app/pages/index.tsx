import React, { Component } from "react";
// import Link from "next/link";
import Layout from "../components/HomeLayout";
import ModelCard from "../components/ModelCard";

class Index extends Component<any, any> {
  static async getInitialProps({}, firebase) {
    const models = await firebase.models();
    return { models };
  }
  render() {
    return (
      <Layout>
        <div className="columns">
          <div className="column is-8 is-offset-2 has-text-centered">
            <h1 className="is-size-2 has-text-white">
              Discover and test
              <br />
              models instantly
            </h1>
            <div className="is-flex">
              <ul>
                {this.props.models.map((model: any, index: number) => (
                  <ModelCard model={model} key={index} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Index;
