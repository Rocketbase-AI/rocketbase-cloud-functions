import Head from "next/head";
import Link from "next/link";
import React, { Component } from "react";
import Layout from "../components/HomeLayout";
import EXTERNAL_DOCS from "../constants/routes";


class RocketPage extends Component<any, any> {
  static async getInitialProps(context, firebase){
    const { id } = context.query;
    const rocketSnapshot = await firebase.model(id);
    const rocketData = await rocketSnapshot.data();
    return { rocket: rocketData };
  }

  clipString=(_string, limit)=>{
    return _string.length < limit ? _string : _string.substring(0, limit)+"...";
  }

  camelCase=(_string, separator)=>{
    let re;
    switch (separator) {
      case "_":
        re = /_/gi; 
        break;
      case "-":
        re = /-/gi;
        break;
      default:
        re = /_/gi;
        break;
    }
    return _string.replace(re, ' ').toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>{this.props.rocket.modelName} | RocketHub</title>
        </Head>
        <div className="columns">
          <div className="column is-4 is-offset-1 has-text-centered">
            <div className="rocket-title title is-1">
              {this.camelCase(this.props.rocket.username, "")+" / "+this.camelCase(this.props.rocket.modelName, "") }
            </div>
          </div>
          <div className="column is-2 is-offset-1">
            <Link href={this.props.rocket.originRepoUrl}>
              <a>
                <div className="rocket-repo-button subtitle is-3 is-vcentered">
                  <img className="rocket-repo-logo" src="/static/GithubLogo.svg" alt="Github Logo" />
                  GitHub
                </div>
              </a>
            </Link>
          </div>
          <div className="column is-2 is-offset-1">
            <Link href={this.props.rocket.paperUrl}>
              <a>
                <div className="rocket-paper-button subtitle is-3 is-vcentered">
                      <img className="rocket-paper-logo" src="/static/PaperLogo.svg" alt="Paper Logo"/>
                  Paper
                </div>
              </a>
            </Link>
          </div>
        </div>
        <div className="columns">
          <div className="column is-4 is-offset-1">
            <div className="rocket-snippet subtitle is-4">
              <span>Rocket.land("{this.props.rocket.username}/{this.props.rocket.modelName}")</span>
            </div>
          </div>
          <div className="column is-3">
            <Link href={EXTERNAL_DOCS+"/#"+this.props.rocket.family}>
              <a>
                <div className="rocket-family subtitle is-4">
                  <h1>{this.camelCase(this.props.rocket.family, "_")} </h1>
                </div>
              </a>
            </Link>
          </div>
        </div>
        <div className="columns">
          <div className="column is-8 is-offset-2">
            <div className="rocket-description-box">
              <span className="title is-3"> Description </span>
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
          <div className="column is-3 is-offset-2">
            <div className="rocket-trainable-notice subtitle is-4">
              Trainable <img className="rocket-trainable-badge" src={`/static/${this.props.rocket.isTrainable ? "success" : "error" }.svg`} alt="Trainable badge"/>
            </div>
          </div>
          <div className="column is-3">
            <div className="rocket-public-notice subtitle is-4">
              Public <img className="rocket-public-badge" src={`/static/${!this.props.rocket.isPrivate ? "success" : "error" }.svg`} alt="Public badge"/>
            </div>
          </div>
        </div>
        
      </Layout>
    );
  }
}

export default RocketPage;