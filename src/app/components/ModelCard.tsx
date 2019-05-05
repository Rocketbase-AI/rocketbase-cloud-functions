import moment from "moment";
import Link from "next/link";
import React, { Component } from "react";

const ModelCardConst = ({ model }) => (
  <div className="box model-card has-text-left model-card-background">
  <style jsx>
    {`
      .model-card-background {
        background: url(/static/modelCardBackgrounds/${model.family}_Background.svg);
      }
    `}
  </style>
    <Link href={`/rocket?id=${model.id}`}>
      <a className="model-card-title">{model.modelName.length < 14 ? model.modelName : model.modelName.substring(0, 14)+"..."}</a>
    </Link>
    <p className="model-card-publication-date">
      {" "}
      {moment(model.launchDate.seconds * 1000).format("ll")}
    </p>
    <a className="model-card-repo-link" href={model.originRepoUrl}><img src="/static/GithubLogo.svg" alt="Github Logo" /></a>
    <a className="model-card-paper-link" href={model.paperUrl}><img src="/static/PaperLogo.svg" alt="Paper Logo" /></a>
    <a className="model-card-training-logo" ><img src="/static/weightlifting.svg" alt="Training Set:" /></a>
    <p className="model-card-training-title">
      {model.trainingDataset.length < 10 ? model.trainingDataset : model.trainingDataset.substring(0, 10)+"..."}
    </p>
    <p className="model-card-task-title">
      {model.family.replace(/_/gi, ' ').toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}
    </p>
  </div>
);


class ModelCard extends Component<any, any> {
  constructor(props) {
    super(props);

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
      <div className="box model-card has-text-left model-card-background is-inline-flex">
        <style jsx>
        {`
        .model-card-background {
          background: url(/static/modelCardBackgrounds/${this.props.model.family}_Background.svg);
        }
        `}
        </style>
        <Link href={`/rocket?id=${this.props.model.id}`}>
          <a className="model-card-title">{this.clipString(this.camelCase(this.props.model.modelName, "-"), 14)}</a>
        </Link>
        <p className="model-card-publication-date">
          {" "}
          {moment(this.props.model.launchDate.seconds * 1000).format("ll")}
        </p>
        <a className="model-card-repo-link" href={this.props.model.originRepoUrl}>
          <img src="/static/GithubLogo.svg" alt="Github Logo" />
        </a>
        <a className="model-card-paper-link" href={this.props.model.paperUrl}>
          <img src="/static/PaperLogo.svg" alt="Paper Logo" />
        </a>
        <img className="model-card-training-logo" src="/static/weightlifting.svg" alt="Training Set:" />
        <p className="model-card-training-title">
          {this.clipString(this.props.model.trainingDataset, 11)}
        </p>
        <p className="model-card-task-title">
          {this.camelCase(this.props.model.family, "_")}
        </p>
      </div>
    );
  }
}

export default ModelCard;