import Head from "next/head";
import Link from "next/link";
import React, { Component } from "react";
import Layout from "../components/HomeLayout";


class RocketPage extends Component<any, any> {
  static async getInitialProps(context, firebase){
    const { id } = context.query;
    const rocketSnapshot = await firebase.model(id);
    const rocketData = await rocketSnapshot.data();
    return { rocket: rocketData };
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>{this.props.rocket.modelName} | RocketHub</title>
        </Head>
        <div className="columns">
          <div className="column is-3 has-text-centered">
            <div className="rocket-title">
              {this.props.rocket.username} / {this.props.rocket.modelName} 
            </div>
          </div>
          <div className="column is-2 is-offset-3">
            <div className="rocket-repo-button">
              <h1>
              <Link href={this.props.rocket.originRepoUrl}>
                <a>
                  <img className="rocket-repo-logo" src="/static/GithubLogo.svg" alt="Github Logo" />
                </a>
              </Link>
              GitHub
              </h1>
            </div>
          </div>
          <div className="column is-2">
            <div className="rocket-paper-button">
              <Link href={this.props.rocket.paperUrl}>
                <a>
                  <img className="rocket-paper-logo" src="/static/PaperLogo.svg" alt="Paper Logo"/>
                </a>
              </Link>
              Paper
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-3">
            <div className="rocket-family">
              <h1>{this.props.rocket.family}</h1>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-8 is-offset-2">
            <div className="rocket-description-box">
              <h1> Description </h1>
              <p className="rocket-description-body">
                {this.props.rocket.description ? 
                  this.props.rocket.description
                  :
                  "No description available."}
              </p>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-2">
            <div className="rocket-trainable-notice">
              Trainable <img className="rocket-trainable-badge" src={`/static/${this.props.rocket.isTrainable ? "success" : "error" }.svg`} alt="Trainable badge"/>
            </div>
          </div>
          <div className="column is-2">
            <div className="rocket-public-notice">
              Trainable <img className="rocket-public-badge" src={`/static/${!this.props.rocket.isPrivate ? "success" : "error" }.svg`} alt="Public badge"/>
            </div>
          </div>
        </div>
        
      </Layout>
    );
  }
}

export default RocketPage;