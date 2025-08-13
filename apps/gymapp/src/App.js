// src/App.js
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'; // Import our new router component
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
        <AppRoutes /> {/* Render the routes */}
      </div>
    </BrowserRouter>
  );
}

export default App;
