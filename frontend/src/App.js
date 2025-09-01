import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OnboardingPage from "./components/OnboardingPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;