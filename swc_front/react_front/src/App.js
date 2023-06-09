import './App.css';
import WebCam from "./components/WebCam";
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import DataChart from './components/DataChart';
import RecordCalendar from './components/RecordCalendar';

function App() {
  return (
    <Router>
      <Routes >
        <Route path="/" element={<WebCam />} />
        <Route path="/chart" element={<DataChart/>} />
        <Route path="/calendar" element={<RecordCalendar/>} />
      </Routes >
    </Router>
  );
}

export default App;
