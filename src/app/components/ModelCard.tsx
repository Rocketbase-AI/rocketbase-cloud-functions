import moment from "moment";
import Link from "next/link";
import React from "react";

const ModelCard = ({ model }) => (
  <div className="box model-card has-text-left">
    <Link href={`/rocket?id=${model.id}`}>
      <a className="is-size-4">{model.name}</a>
    </Link>
    <p>
      Publication date:{" "}
      {moment(model.publicationDate.seconds * 1000).format("ll")}
    </p>
    <p>Framework: {model.framework}</p>
    <p>
      GitHub: <a href={model.githubUrl}>{model.githubUrl}</a>
    </p>
    <p>
      Arxiv: <a href={model.paperUrl}>{model.paperUrl}</a>
    </p>
  </div>
);

export default ModelCard;
