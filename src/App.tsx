import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./contexts/ToastContext"
import { ModalProvider } from "./contexts/ModalContext"
import ErrorBoundary from "./components/molecules/ErrorBoundary"
import ProtectedRoute from "./components/molecules/ProtectedRoute"
import { persistentApi } from "./services/localStorageApi"
import StatsPage from "./components/pages/StatsPage"

// Pages
import LoginPage from "./components/pages/LoginPage"
import RegisterPage from "./components/pages/RegisterPage"
import DashboardPage from "./components/pages/DashboardPage"
import MyProjectsPage from "./components/pages/MyProjectsPage"
import ProjectDetailsPage from "./components/pages/ProjectDetailsPage"
import AllTasksPage from "./components/pages/AllTasksPage"
import SettingsPage from "./components/pages/SettingsPage"
import AccessDeniedPage from "./components/pages/AccessDeniedPage"

// Initialize persistent storage
try {
  persistentApi.initialize()
  console.log("App initialized successfully")
} catch (error) {
  console.error("Error initializing app:", error)
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <ModalProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/access-denied" element={<AccessDeniedPage />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <MyProjectsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:id"
                  element={
                    <ProtectedRoute>
                      <ProjectDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tasks"
                  element={
                    <ProtectedRoute>
                      <AllTasksPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/stats" element={<StatsPage />} />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Router>
          </ModalProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
