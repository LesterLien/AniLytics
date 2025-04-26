import '../styles/NavBar.css';
import logo from '../assets/images/logo.webp';
import {Link} from 'react-router-dom';

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
                    <Link to="/">Dashboard</Link>
                </div>
                <div className="navbarPage-text">
                    <Link to="/demographics">User Demographics</Link>
                </div>
                <div className="navbarPage-text">
                    <Link to="/popularity">Anime Popularity & Ratings</Link>
                </div>
                <div className="navbarPage-text">
                    <Link to="/status">Completion & Status Trends</Link>
                </div>
                <div className="navbarPage-text">
                    <Link to="/activity">User Engagement</Link>
                </div>
                <div className="navbarPage-text">
                    <Link to="/production">Studios & Sources</Link>
                </div>
                <div className="navbarPage-text">
                    <Link to="/genre">Genre Trends Over Time</Link>
                </div>
                <div className="navbarPage-text">
                    <Link to="/ratings">Ratings & Correlations</Link>
                </div>
                <div className="navbarPage-text">
                    <Link to="/insights">User Insights</Link>
                </div>

            </div>
        </div>
    </div>
  );
}

export default NavBar;