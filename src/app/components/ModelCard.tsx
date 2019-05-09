import moment from "moment";
import Link from "next/link";
import React, { Component } from "react";


class ModelCard extends Component<any, any> {
  constructor(props) {
    super(props);

  }

  clipString=(longString, limit)=>{
    return longString.length < limit ? longString : longString.substring(0, limit)+"...";
  }

  camelCase=(origString, separator)=>{
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
    return origString.replace(re, " ").toLowerCase().split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" ");
  }



  render() {
    return (
    	<div className="box model-card has-text-left is-inline-flex model-card-background">
		        <style jsx={true}>
		        {`
		        .model-card-background {
		          background: url(/static/modelCardBackgrounds/${this.props.model.family}_Background.svg);
		        }
		        `}
				    </style>
	    	<Link href={`/rocket?id=${this.props.model.id}`} passHref={true}>
	    	<a className="">
		        <p className="model-card-title">{this.clipString(this.camelCase(this.props.model.modelName, "-"), 14)}</p>
		        <p className="model-card-publication-date">
		          {" "}
		          {moment(this.props.model.launchDate.seconds * 1000).format("ll")}
		        </p>
		        <img className="model-card-training-logo" src="/static/weightlifting.svg" alt="Training Set:" />
		        <p className="model-card-training-title">
		          {this.clipString(this.props.model.trainingDataset, 11)}
		        </p>
		        <p className="model-card-task-title">
		          {this.camelCase(this.props.model.family, "_")}
		        </p>
	      </a>
	      </Link>
	      <Link href={this.props.model.originRepoUrl}>
	      	<a>
		      	<img className="model-card-repo-link" src="/static/GithubLogo.svg" alt="Github Logo" />
		      </a>
		    </Link>
		    <Link href={this.props.model.paperUrl}>
		    	<a>
		      	<img className="model-card-paper-link" src="/static/PaperLogo.svg" alt="Paper Logo"/>
		      </a>
		    </Link>
      </div>
    );
  }
}

export default ModelCard;