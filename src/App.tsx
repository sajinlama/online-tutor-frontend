  import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

  import Register from "./pages/register";
  import Login from "./pages/login";
  import Layout from "./components/layout";
  import Dashboard from "./pages/dashboard";

  import ProtectedRoute from "./components/protectedRoutes";
  import Homepage from "./pages/homepage";
  import SubjectQuizWrapper from "./components/SubjectQuizWrapper";
import Setting from "./pages/setting";

  function App() {
    return (
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Layout />}>
              <Route index element={<Dashboard />} />
            <Route path="quiz/:subjectId" element={<SubjectQuizWrapper />} />
             <Route path="setting" element={<Setting />} />
            
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  export default App;
