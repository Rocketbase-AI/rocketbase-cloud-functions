import React, { Component } from "react";
import ReactGA from "react-ga";
// import Link from "next/link";
import Layout from "../components/HomeLayout";
import ModelCard from "../components/ModelCard";

class Index extends Component<any, any> {
  static async getInitialProps({}, firebase) {
    ReactGA.initialize('UA-139331659-3');
    const models = await firebase.models();
    return { models };
  }
  render() {
    ReactGA.pageview('/');
    return (
      <Layout>
        <div className="columns">
          <div className="column is-8 is-offset-2 has-text-centered">
            <h1 className="is-size-2 has-text-white">
              Discover and test
              <br />
              models instantly
            </h1>
            <div className="is-flex model_cards_background">
              <ul>
                {this.props.models.map((model: any, index: number) => (
                  <ModelCard model={model} key={index} />
                ))}
              </ul>
            </div>
            <img className="rockets_process" src="/static/rockets_process_illustration.svg" alt="Process Illustration" />
            <img className="features" src="/static/HomePage/Features.svg" alt="Features" />
          </div>
        </div>
      </Layout>
    );
  }
}

export default Index;
