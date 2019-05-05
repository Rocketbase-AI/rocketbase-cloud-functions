import { faGitlab, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import * as ROUTES from "../constants/routes";

const Footer = () => {
  return (
    <footer className="footer footer-light-medium">
      <div className="container">
        <div className="columns">
          <div className="column is-4">
            <div className="">
              {/* <img
                className="small-footer-logo"
                src="assets/images/logos/bulkit-logo-g.png"
                alt=""
              /> */}
              <Link href={ROUTES.LANDING}>
                <h1 className="title is-3">RocketBase</h1>
              </Link>
              <div className="footer-description">
                RocketBase allows you to test Deep Learning models in a few seconds.
              </div>
            </div>
            <div>
              <span className="moto">Designed and coded by Mirage.</span>
              <div className="social-links">
                <Link href={ROUTES.LANDING}>
                  <a>
                    <div className="icon">
                      <FontAwesomeIcon icon={faGitlab} size="2x" />
                    </div>
                  </a>
                </Link>
                <Link href={ROUTES.LANDING}>
                  <a>
                    <div className="icon">
                      <FontAwesomeIcon icon={faLinkedin} size="2x" />
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="column is-6 is-offset-2">
            <div className="columns">
              <div className="column">
                <ul className="footer-column">
                  <li className="column-header">RocketBase</li>
                  <li className="column-item">
                    <Link href={ROUTES.SOLUTION}>
                      <a>Solution</a>
                    </Link>
                  </li>
                  <li className="column-item">
                    <Link href={ROUTES.PRICING}>
                      <a>Pricing</a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="column">
                <ul className="footer-column">
                  <li className="column-header">Ressources</li>
                  <li className="column-item">
                    <Link href={ROUTES.DOCS}>
                      <a>Documentation</a>
                    </Link>
                  </li>
                  <li className="column-item">
                    <Link href={ROUTES.FAQ}>
                      <a>FAQ</a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="column">
                <ul className="footer-column">
                  <li className="column-header">Terms</li>
                  <li className="column-item">
                    <Link href={ROUTES.TERMS}>
                      <a>Terms of Service</a>
                    </Link>
                  </li>
                  <li className="column-item">
                    <Link href={ROUTES.PRIVACY}>
                      <a>Privacy policy</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
