import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // N'oublie pas d'importer jwt-decode

export function useAuth() {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [role, setRole] = useState(null); // Ajoute un état pour stocker le rôle
   const [userId, setUserId] = useState(null);
   const [user, setUser] = useState("");
   useEffect(() => {
      const token = localStorage.getItem("data");

      if (token) {
         try {
            const decodedToken = jwtDecode(token); // Décode le token
            setRole(decodedToken.role); // Extrait et stocke le rôle du token
            setIsAuthenticated(true); // Utilisateur est authentifié
            setUserId(decodedToken.id);
            setUser(decodedToken.username);
         } catch (error) {
            console.error("Invalid token", error);
            setIsAuthenticated(false);
            setRole(null);
         }
      } else {
         setIsAuthenticated(false);
         setRole(null);
      }

      setIsLoading(false);
   }, []);

   const login = (token) => {
      try {
         const decodedToken = jwtDecode(token);
         localStorage.setItem("data", token);
         setRole(decodedToken.role);
         setUserId(decodedToken.id);
         setUser(decodedToken.username);
         setIsAuthenticated(true);
      } catch (error) {
         console.error("Invalid token", error);
         setRole(null);
         setUserId(null);
         setUser(null);
         setIsAuthenticated(false);
      }
   };

   const logout = () => {
      localStorage.removeItem("data");
      setRole(null);
      setUser(null);
      setUserId(null);
      console.log("id de user aprés connexion :", userId);
      setIsAuthenticated(false);
   };

   return { isAuthenticated, isLoading, role, userId, user, login, logout };
}
