import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Demographic from './Demographic'
import Popularity from './Popularity';
import Status from './Status';
import Activity from './Activity';
import Production from './Production';
import Genres from './Genre';
import Ratings from './Rating';
import Insights from './Insight';

function Navigator() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/demographic" element={<Demographic/>}/>
            <Route path="/popularity" element={<Popularity/>}/>
            <Route path="/status" element={<Status/>}/>
            <Route path="/activity" element={<Activity/>}/>
            <Route path="/production" element={<Production/>}/>
            <Route path="/genre" element={<Genres/>}/>
            <Route path="/rating" element={<Ratings/>}/>
            <Route path="/insight" element={<Insights/>}/>
        </Routes>
    );
}

export default Navigator;