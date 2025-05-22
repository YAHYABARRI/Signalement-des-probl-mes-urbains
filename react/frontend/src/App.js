import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/login';
import HomePage from './Components/HomePage';
import Register from './Components/Register';
import ProblemReportForm from './Components/signal';
import UsersManagement from './Components/admin';
import ConstateurSignalements from './Components/constateur';
import AddCategory from './Components/categories';
import SignalementList from './Components/Points';
import UserReportsPage from './Components/UserReportsPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ReportProblemPage" element={<ProblemReportForm />} />
        <Route path="/admin" element={<UsersManagement />} />
        <Route path="/constateur" element={<ConstateurSignalements />} />
        <Route path="/categories" element={<AddCategory />} />
        <Route path="/signalements" element={<SignalementList />} />
        <Route path="/user-reports" element={<UserReportsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
