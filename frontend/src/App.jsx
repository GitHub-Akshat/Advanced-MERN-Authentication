/* eslint-disable react/prop-types */
import { Navigate, Route, Routes } from "react-router-dom"
import FloatingShapes from "./components/floatingshapes"
import SignUpPage from "./pages/SignUpPage"
import LogInPage from "./pages/LogInPage"
import EmailVerification from "./pages/EmailVerification"
import { Toaster } from "react-hot-toast"
import useAuthStore from "./store/authStore"
import { useEffect } from "react"
import HomePage from "./pages/HomePage"
import LoadindSpinner from "./components/LoadingSpinner"
import ForgotPassPage from "./pages/ForgotPassPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"

const ProtectedRoute = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();
  if(!isAuthenticated)
  {
    return <Navigate to={"/signin"} replace/>
  }
  if(!user.isVerified)
  {
    return <Navigate to={"/verify-email"} replace/>
  }
  return children;
}

const RedirectAuthenticatedUser = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();
  if(isAuthenticated && user.isVerified)
  {
    return <Navigate to={"/"} replace />
  }
  return children;
}

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  if(isCheckingAuth)
  {
    return <LoadindSpinner/>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShapes color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShapes color="bg-green-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShapes color="bg-green-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage/>
            </ProtectedRoute>
          }/>
        <Route 
          path="/signup" 
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage/>
            </RedirectAuthenticatedUser>
          }
        />
        <Route 
          path="/signin" 
          element={
            <RedirectAuthenticatedUser>
              <LogInPage/>
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerification/>}/>
        <Route 
          path="/forgot-password" 
          element={
            <RedirectAuthenticatedUser>
              <ForgotPassPage/>
            </RedirectAuthenticatedUser>
          }
        />
        <Route
					path='/reset-password/:token'
					element={
            <RedirectAuthenticatedUser>  
						  <ResetPasswordPage/>
            </RedirectAuthenticatedUser>
					}
				/>
				{/* catch all routes */}
				<Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
