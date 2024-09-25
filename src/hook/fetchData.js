export default async function fetchData(endpoint, token = null, method = "GET", body = null) {
   try {
      const options = {
         method,
         headers: {
            "Content-Type": "application/json",
         },
      };

      if (token) {
         options.headers.Authorization = `Bearer ${token}`;
      }

      if (body) {
         options.body = JSON.stringify(body);
      }
      //local
      const BASE_URL = "http://localhost:4000/api";

      const response = await fetch(`${BASE_URL}/${endpoint}`, options);

      if (!response.ok) {
         if (response.status === 401) {
            // Token invalide ou expiré
            throw new Error("UNAUTHORIZED");
         }
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
   } catch (error) {
      console.error("Error:", error);
      if (error.message === "UNAUTHORIZED") {
         // Déclencher la déconnexion
         const { logout } = useAuth();
         logout();
      }
      throw error;
   }
}
