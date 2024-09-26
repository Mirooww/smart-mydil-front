import React, { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "./App";
import fetchData from "./hook/fetchData";
import { useNavigate } from "react-router-dom";

export default function Home({ token }) {
   const { isAuthenticated, role, userId } = useAuthContext();
   const [articles, setArticles] = useState([]);
   const [successMessage, setSuccessMessage] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const navigate = useNavigate();

   const fetchAllData = useCallback(async () => {
      const response = await fetchData(`article`, token);
      if (response) {
         setArticles(response.articles);
      } else {
         setErrorMessage(response.error);
      }
   }, [token]);

   useEffect(() => {
      fetchAllData();
   }, [fetchAllData]);

   const handleDelete = async (idArticle) => {
      const response = await fetchData(`article/${idArticle}`, token, "DELETE");
      if (response && response.success) {
         setSuccessMessage(response.message);
         fetchAllData();
      } else {
         setErrorMessage("Une erreur s'est produite lors de la suppression de l'article.");
      }
   };

   const handleReservate = async (idArticle) => {
      const response = await fetchData(`article/${idArticle}/reserved/${userId}`, token, "PATCH");
      if (response && response.success) {
         setSuccessMessage(response.message);
         fetchAllData();
      } else {
         setErrorMessage("Une erreur s'est produite lors de la réservation de l'article.");
      }
   };

   const ArticleHeader = () => (
      <div className="flex w-full justify-around items-center bg-gray-100 p-2 rounded-t-lg font-semibold">
         {isAuthenticated && <div className="w-1/5 text-center">Action</div>}
         <div className="w-1/5 text-center">Type</div>
         <div className="w-1/5 text-center">Nom</div>
         <div className="w-1/5 text-center">Quantité</div>
         <div className="w-1/5 text-center">Image</div>
      </div>
   );

   const ArticleItem = ({ article }) => (
      <div className="w-full mb-2">
         <div className="flex w-full justify-around items-center p-2 bg-white border border-gray-200 rounded-t-lg">
            {isAuthenticated && (
               <button
                  onClick={() => handleReservate(article.id)}
                  className="w-1/5 text-center bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
               >
                  Réserver
               </button>
            )}
            <div className="w-1/5 text-center">{article.type}</div>
            <div className="w-1/5 text-center">{article.name}</div>
            <div className="w-1/5 text-center">{article.quantity}</div>
            <div className="w-1/5 text-center flex justify-center">
               <img src={`http://localhost:4000/api${article.urlImage}`} alt="article" style={{ height: "130px" }} />
            </div>
         </div>
         <div className="w-full text-left p-2" style={{ boxShadow: "0 0 0 1px", minHeight: "70px" }}>
            {article.description}
         </div>
         {isAuthenticated && role === "admin" && (
            <div className="flex justify-around bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg p-1">
               <button onClick={() => navigate(`/update-article/${article.id}`)} className="text-blue-500 hover:text-blue-700 transition duration-300">
                  Modifier
               </button>
               <button onClick={() => handleDelete(article.id)} className="text-red-500 hover:text-red-700 transition duration-300">
                  Supprimer
               </button>
            </div>
         )}
      </div>
   );

   return (
      <div className="w-full max-w-4xl mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4 text-center">Liste d'articles {isAuthenticated ? "connectés" : "non connectés"}</h1>

         <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <ArticleHeader />
            {articles.map((article) => (
               <ArticleItem key={article.id} article={article} />
            ))}
         </div>

         {successMessage && <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">{successMessage}</div>}
         {errorMessage && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{errorMessage}</div>}
      </div>
   );
}
