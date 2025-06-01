import { Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import OnBoardingPage from './pages/OnBoardingPage.jsx';
import Notification from './pages/Notification.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CallPage from './pages/CallPage.jsx';
import { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import Layout from './components/Layout.jsx';
import { useThemeStore } from './store/useThemeStore.js';
import FriendsPage from './pages/FriendsPage.jsx';

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore()

  const isAuthenticated = Boolean(authUser)
  const isOnboarding = authUser?.isOnboarding

  if (isLoading) return <PageLoader />;

  return (
    <div className='h-screen' data-theme={theme}>
      <Routes>
        <Route path='/signup' element={!isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarding ? "/" : "/onboarding"} />} />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarding ? (
                <OnBoardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path='/' element={isAuthenticated && isOnboarding ? (
          <Layout showSidebar={true}>
            <HomePage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )} />
        <Route path='/login' element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarding ? "/" : "/onboarding"} />} />
        <Route path='/call/:id' element={
          isAuthenticated && isOnboarding ? (
            <CallPage />
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        } />
        <Route path='/chat/:id' element={
          isAuthenticated && isOnboarding ? (
            <Layout showSidebar={false}>
              <ChatPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        } />
        <Route path='/notifications' element={isAuthenticated && isOnboarding ? (
          <Layout showSidebar>
            <Notification />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )
        } />
        <Route path='/friends' element={isAuthenticated && isOnboarding ? (
          <Layout showSidebar>
            <FriendsPage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
