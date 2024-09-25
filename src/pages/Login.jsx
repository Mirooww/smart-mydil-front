import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import fetchData from "../hook/fetchData";
import useWindowWidth from "../hook/useWindowWidth";
import { useAuthContext } from "../App"; // Assurez-vous que le chemin d'importation est correct

export default function Login() {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [errorMessage, setErrorMessage] = useState(null);
   const navigate = useNavigate(); // Remplacer 'navigates' par 'navigate'
   const { login } = useAuthContext();

   const isMobile = useWindowWidth();

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const userConnected = { username, password };
         const response = await fetchData("login", null, "POST", userConnected);

         if (response.success) {
            console.log("Connected");
            login(response.token);
            navigate("/", { replace: true });
         } else {
            console.log(response.message);
            setErrorMessage(response.message);
         }
      } catch (error) {
         console.error("Error:", error);
         setErrorMessage(error.message || "An error occurred.");
      }
   };

   return (
      <div style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
         <div
            style={{
               position: "absolute",
               zIndex: "2",
               width: isMobile ? "calc(100% - 40px)" : "400px",
               left: isMobile ? "20px" : "auto",
               right: isMobile ? "20px" : "auto",
               padding: "20px",
               borderRadius: "8px",
               boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
               backgroundColor: "#fff",
            }}
         >
            <h1
               style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  color: "#333",
                  fontSize: "24px",
               }}
            >
               Se connecter{" "}
            </h1>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
               <input
                  name="username"
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                     height: "45px",
                     padding: "10px",
                     borderRadius: "4px",
                     border: "1px solid #ccc",
                     fontSize: "16px",
                     backgroundColor: "#fff",
                     color: "black",
                  }}
               />
               <input
                  name="password"
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                     height: "45px",
                     padding: "10px",
                     borderRadius: "4px",
                     border: "1px solid #ccc",
                     fontSize: "16px",
                     backgroundColor: "#fff",
                  }}
               />
               <button
                  type="submit"
                  style={{
                     height: "45px",
                     backgroundColor: "#584f87",
                     color: "#fff",
                     border: "none",
                     borderRadius: "4px",
                     cursor: "pointer",
                     fontSize: "16px",
                  }}
               >
                  Envoyer
               </button>
               <button
                  type="button"
                  onClick={() => navigate("/register")} // Remplacer 'navigates' par 'navigate'
                  style={{
                     height: "45px",
                     backgroundColor: "transparent",
                     color: "#9e644d",
                     border: "1px solid #9e644d",
                     borderRadius: "4px",
                     cursor: "pointer",
                     fontSize: "16px",
                  }}
               >
                  Pas de compte ?
               </button>
            </form>

            {errorMessage && <div style={{ color: "red", marginTop: "15px", textAlign: "center" }}>{errorMessage}</div>}
         </div>
      </div>
   );
}
