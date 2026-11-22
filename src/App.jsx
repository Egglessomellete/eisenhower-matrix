import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useTasks } from "./hooks/useTasks";
import LoginScreen from "./LoginScreen";
import NavBar from "./components/NavBar";
import MatrixPage from "./pages/MatrixPage";
import PlannerPage from "./pages/PlannerPage";
import AttendancePage from "./pages/AttendancePage";
import "./App.css";

const App = () => {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const taskApi = useTasks(session);

  useEffect(function () {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin(email) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
  }

  if (sessionLoading) return <p>Loading...</p>;
  if (!session) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<MatrixPage {...taskApi} />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
