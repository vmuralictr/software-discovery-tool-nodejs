import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LandingPage from './screens/LandingPage';
import Faq from './screens/Faq/Faq';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/faq" element={<Faq />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
