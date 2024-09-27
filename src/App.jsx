import React, { createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./hook/useAuth";
import "./index.css";

// Import your components
import Home from "./Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateArticle from "./pages/CreateArticle";
import UpdateArticle from "./pages/UpdateArticle";
import Reservation from "./pages/Reservation";
import ShowUser from "./pages/ShowUser";
import ShowUserReservation from "./pages/ShowUserReservation";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
   const auth = useAuth();
   return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
   return useContext(AuthContext);
}

function Layout({ children }) {
   const { isAuthenticated, role, logout, user } = useAuthContext();
   const navigate = useNavigate();
   const handleLogout = () => {
      logout();
      navigate("/");
   };

   return (
      <div className="w-screen h-screen p-4 flex justify-between bg-gray-700">
         <div className="bg-white shadow-md rounded-lg p-4 w-64">
            <div style={{ width: "100%", aspectRatio: "1/1", display: "flex", justifyContent: "center" }}>
               <img src="/SmartMydil.svg" alt="logo SmartMyDil" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">SmartMydil</h3>

            {isAuthenticated ? (
               <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">Profil {role === "admin" && "administrateur"} </h4>
                  <p className="text-gray-600">{user}</p>
                  <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                     Se déconnecter
                  </button>
               </div>
            ) : (
               <div className="mb-4">
                  <button
                     onClick={() => navigate("/login")}
                     className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                     Se connecter
                  </button>
               </div>
            )}

            <div className="space-y-4 mt-6">
               <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition duration-300"
               >
                  Articles
               </button>

               {isAuthenticated && (
                  <button
                     onClick={() => navigate("/reservation")}
                     className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition duration-300"
                  >
                     Réservations
                  </button>
               )}

               {isAuthenticated && role === "admin" && (
                  <>
                     <button
                        onClick={() => navigate("/create-article")}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                     >
                        Créer Article
                     </button>
                     <button
                        onClick={() => navigate("/show-user")}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                     >
                        Utilisateurs
                     </button>
                  </>
               )}
            </div>
         </div>
         <main className="shadow border rounded-lg h-full w-[calc(100%-17rem)] flex flex-col items-center overflow-auto bg-white">{children}</main>
      </div>
   );
}

function PrivateRoute({ children }) {
   const { isAuthenticated, isLoading } = useAuthContext();

   if (isLoading) {
      return <div className="flex justify-center items-center h-full">Loading...</div>;
   }

   return isAuthenticated ? children : <Navigate to="/login" />;
}

function PrivateRouteAdmin({ children }) {
   const { isAuthenticated, isLoading, role } = useAuthContext();
   if (isLoading) {
      return <div className="flex justify-center items-center h-full">Loading...</div>;
   }

   return isAuthenticated && role === "admin" ? children : <Navigate to="/" />;
}
export default function App() {
   const token = localStorage.getItem("data");

   return (
      <AuthProvider>
         <Router>
            <Layout>
               <AppRoutes token={token} />
            </Layout>
         </Router>
      </AuthProvider>
   );
}

function AppRoutes({ token }) {
   const { userId } = useAuthContext();

   return (
      <Routes>
         <Route path="/" element={<Home token={token} />} />
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route
            path="/create-article"
            element={
               <PrivateRouteAdmin>
                  <CreateArticle token={token} />
               </PrivateRouteAdmin>
            }
         />
         <Route
            path="/update-article/:id"
            element={
               <PrivateRouteAdmin>
                  <UpdateArticle token={token} />
               </PrivateRouteAdmin>
            }
         />
         <Route
            path="/reservation"
            element={
               <PrivateRoute>
                  <Reservation token={token} userId={userId} />
               </PrivateRoute>
            }
         />
         <Route
            path="/show-user"
            element={
               <PrivateRouteAdmin>
                  <ShowUser token={token} userId={userId} />
               </PrivateRouteAdmin>
            }
         />
         <Route
            path="/show-user/:id"
            element={
               <PrivateRouteAdmin>
                  <ShowUserReservation token={token} userId={userId} />
               </PrivateRouteAdmin>
            }
         />
      </Routes>
   );
}
