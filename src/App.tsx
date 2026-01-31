import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout.tsx';
import Login from './pages/Login/Login.tsx';
import SignUp from './pages/SignUp/SignUp.tsx';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail.tsx';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.tsx';
import ResetPassword from './pages/ResetPassword/ResetPassword.tsx';
import Profile from './pages/Profile/Profile.tsx';
import Home from './pages/Home/Home.tsx';
import LevelChallenges from './pages/Level/LevelChallenges.tsx';
import ChallengeDetail from './pages/Challenge/ChallengeDetail.tsx';
import CreateTeam from './pages/CreateTeam/CreateTeam.tsx';
import Team from './pages/Team/Team.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

const App = () => {
  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* Routes with Layout (non-auth pages) */}
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/level/:levelId'
            element={
              <ProtectedRoute>
                <Layout>
                  <LevelChallenges />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/challenge/:levelId/:challengeId'
            element={
              <ProtectedRoute>
                <Layout>
                  <ChallengeDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/create-team'
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateTeam />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/team'
            element={
              <ProtectedRoute>
                <Layout>
                  <Team />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Auth routes without Layout */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
