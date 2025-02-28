
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightToBracket, faPowerOff } from '@fortawesome/free-solid-svg-icons';

export default function NavbarIn({ setIsLoggedIn }) {

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    window.location = "/";
  };
  return (
    <nav class="navbar sticky-top navbar-expand-lg bg-dark bg-body-tertiary"  data-bs-theme="dark">
        <div class="container-fluid">
        <a class="navbar-brand" href="/">Creze</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
            <div class="collapse navbar-collapse" id="navbarScroll">
                <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="/">Home</a>
                </li>
                </ul>
                <div className="d-flex">
                    <a href="/" onClick={handleLogout} class="btn btn-outline-danger ms-3"><FontAwesomeIcon icon={faPowerOff} /> Logout</a>
                </div>
            </div>
        </div>
    </nav>

  );
}

