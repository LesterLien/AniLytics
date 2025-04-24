import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Demographics from './Demographics'
import Popularity from './Popularity';
import Status from './Status';
import Activity from './Activity';
import Production from './Production';
import Genres from './Genres';
import Ratings from './Ratings';
import Insights from './Insights';

function Navigator() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/demographics" element={<Demographics/>}/>
            <Route path="/popularity" element={<Popularity/>}/>
            <Route path="/status" element={<Status/>}/>
            <Route path="/activity" element={<Activity/>}/>
            <Route path="/status" element={<Production/>}/>
            <Route path="/genre" element={<Genres/>}/>
            <Route path="/ratings" element={<Ratings/>}/>
            <Route path="/insights" element={<Insights/>}/>
            
        </Routes>
    );
}

export default Navigator;