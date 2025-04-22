import '../styles/NavBar.css';
import logo from '../assets/images/logo.webp';

function NavBar() {
  return (
    <div className="navbarPage-body">
        <div className="navbarPage-container">
            <div className="navbarPage-container-title">
                <img src={logo} alt="AniLytics Logo" className="navbarPage-logo" />
                <span className="navbarPage-title">AniLytics</span>
            </div>
            <div className="navbarPage-container-text">
                <div className="navbarPage-text-menu">
                    Menu
                </div>
                <div className="navbarPage-text">
                    Placeholder
                </div>
                <div className="navbarPage-text">
                    Placeholder
                </div>
                <div className="navbarPage-text">
                    Placeholder
                </div>
            </div>
        </div>
    </div>
  );
}

export default NavBar;