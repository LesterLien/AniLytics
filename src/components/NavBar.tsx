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
                    Dashboard
                </div>
                <div className="navbarPage-text">
                    User Demographics
                </div>
                <div className="navbarPage-text">
                    Anime Popularity & Ratings
                </div>
                <div className="navbarPage-text">
                    Completion & Status Trends
                </div>
                <div className="navbarPage-text">
                    User Activity
                </div>
                <div className="navbarPage-text">
                    Production & Licensing
                </div>
                <div className="navbarPage-text">
                    Genre Evolution
                </div>
                <div className="navbarPage-text">
                    User Insights
                </div>

            </div>
        </div>
    </div>
  );
}

export default NavBar;