import Link from "next/link";
import * as ROUTES from "../constants/routes";
import { AuthUserContext } from "./Session";
import SignOutButton from "./SignOut";

const toggleStyles = () => {
  document.querySelector("#burger")!.classList.toggle("is-active");
  document.querySelector("#navbarmenu")!.classList.toggle("is-active");
};

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? <NavigationAuth authUser={authUser} /> : <NavigationSimple />
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
  <div className="navbar-end">
    <div className="navbar-item">
    <Link prefetch={true} href={ROUTES.HOME}>
      <a className="navbar-item">Dashboard</a>
    </Link>
    </div>
    <div className="navbar-item">
    <Link href={ROUTES.ACCOUNT}>
      <a className="navbar-item">{authUser.username}'s Account</a>
    </Link>
    </div>
    <SignOutButton />
  </div>
);

const NavigationNonAuth = () => (
  <div className="navbar-end">
    <div className="navbar-item">
      <Link prefetch={true} href={ROUTES.SOLUTION}>
        <a className="navbar-item">Solution</a>
      </Link>
    </div>
    <div className="navbar-item">
      <Link prefetch={true} href={ROUTES.PRICING}>
        <a className="navbar-item">Pricing</a>
      </Link>
    </div>
    <div className="navbar-item">
      <Link href={ROUTES.DOCS}>
        <a className="navbar-item">Docs</a>
      </Link>
    </div>
    <div className="navbar-item">
      <Link href={ROUTES.LOG_IN}>
        <a className="navbar-item">Login</a>
      </Link>
    </div>
    <div className="navbar-item">
      <Link href={ROUTES.SIGN_UP}>
        <a className="button is-primary">Sign Up</a>
      </Link>
    </div>
  </div>
);

const NavigationSimple = () => (
  <div className="navbar-end">
    <div className="navbar-item">
      <Link href={ROUTES.EXTERNAL_DOCS}>
        <a className="button is-primary">Docs</a>
      </Link>
    </div>
    <div className="navbar-item">
      <span className="navbar-item">BETA COMING SOON</span>
    </div>
  </div>
);

const Header = () => (
  <div className="hero-head">
    <header>
      <div className="container">
        <nav
          className="navbar is-transparent"
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-brand">
            <Link href="/">
              <a className="is-size-4 navbar-item">RocketBase</a>
            </Link>
            <a
              id="burger"
              onClick={toggleStyles}
              role="button"
              className="navbar-burger burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarmenu"
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>
          </div>
          <div id="navbarmenu" className="navbar-menu">
            <div className="navbar-start" />
            <Navigation />
          </div>
        </nav>
      </div>
    </header>
  </div>
);

export default Header;
