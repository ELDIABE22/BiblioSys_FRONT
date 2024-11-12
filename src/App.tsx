import { Routes, Route } from 'react-router-dom';
import HomePage from './page/HomePage';
import LoginPage from './page/(Auth)/LoginPage/LoginPage';
import LayoutAdmin from './layouts/LayoutAdmin';
import DashboardPage from './page/(Admin)/DashboardPage/DashboardPage';
import AuthorPage from './page/(Admin)/AuthorPage/AuthorPage';
import SubjectPage from './page/(Admin)/SubjectPage/SubjectPage';
import BookPage from './page/(Admin)/BookPage/BookPage';
import StudentPage from './page/(Admin)/StudentPage/StudentPage';
import UserPage from './page/(Admin)/UserPage/UserPage';
import LoanPage from './page/(Admin)/LoanPage/LoanPage';
import ResetPasswordForm from './page/(Auth)/ResetPasswordPage/ResetPasswordPage';

function App() {
  const adminPaths = [
    {
      path: '/library/admin/dashboard',
      componentPage: <DashboardPage />,
    },
    {
      path: '/library/admin/author',
      componentPage: <AuthorPage />,
    },
    {
      path: '/library/admin/subject',
      componentPage: <SubjectPage />,
    },
    {
      path: '/library/admin/book',
      componentPage: <BookPage />,
    },
    {
      path: '/library/admin/student',
      componentPage: <StudentPage />,
    },
    {
      path: '/library/admin/user',
      componentPage: <UserPage />,
    },
    {
      path: '/library/admin/loan',
      componentPage: <LoanPage />,
    },
  ];

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      {adminPaths.map(({ path, componentPage }) => (
        <Route
          key={path}
          path={path}
          element={<LayoutAdmin>{componentPage}</LayoutAdmin>}
        />
      ))}
    </Routes>
  );
}

export default App;
