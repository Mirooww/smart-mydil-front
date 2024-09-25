import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import fetchData from "../hook/fetchData";

export default function UpdateArticle({ token }) {
   const { id } = useParams();
   const [errorMessage, setErrorMessage] = useState("");
   const [successMessage, setSuccessMessage] = useState("");
   const [updatedType, setUpdatedType] = useState("");
   const [updatedName, setUpdatedName] = useState("");
   const [updatedDescription, setUpdatedDescription] = useState("");
   const [updatedQuantity, setUpdatedQuantity] = useState(1);

   useEffect(() => {
      const fetchArticle = async () => {
         try {
            const response = await fetchData(`article/${id}`, token, "GET");
            if (response && response.success) {
               console.log(response.articles);
               setUpdatedType(response.articles.type || "");
               setUpdatedName(response.articles.name || "");
               setUpdatedDescription(response.articles.description || "");
               setUpdatedQuantity(response.articles.quantity || 1);
            } else {
               setErrorMessage("Impossible de charger l'article");
            }
         } catch (error) {
            setErrorMessage("Erreur lors de la récupération de l'article");
         }
      };

      fetchArticle();
   }, [id, token]);

   const handleChange = async (e) => {
      e.preventDefault();

      const updatedArticleBody = {
         type: updatedType,
         name: updatedName,
         description: updatedDescription,
         quantity: updatedQuantity,
      };

      try {
         const response = await fetchData(`article/${id}`, token, "PATCH", updatedArticleBody);
         if (response) {
            setSuccessMessage(response.message);
         } else {
            setErrorMessage("Erreur lors de la mise à jour de l'article");
         }
      } catch (error) {
         setErrorMessage("Erreur lors de la mise à jour", error);
      }
   };

   return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Mettre à jour l'article</h2>
         <form onSubmit={handleChange} className="space-y-4">
            <div>
               <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type de l'article
               </label>
               <input
                  id="type"
                  name="type"
                  value={updatedType}
                  onChange={(e) => setUpdatedType(e.target.value)}
                  placeholder="Type de l'article"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               />
            </div>
            <div>
               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom de l'article
               </label>
               <input
                  id="name"
                  name="name"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  placeholder="Nom de l'article"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               />
            </div>
            <div>
               <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
               </label>
               <textarea
                  id="description"
                  name="description"
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  placeholder="Description"
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               ></textarea>
            </div>
            <div>
               <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantité
               </label>
               <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={updatedQuantity}
                  onChange={(e) => setUpdatedQuantity(e.target.value)}
                  placeholder="Quantité"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               />
            </div>
            <button
               type="submit"
               className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
               Mettre à jour
            </button>
         </form>
         {successMessage && <p className="mt-4 text-sm text-green-600">{successMessage}</p>}
         {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}
      </div>
   );
}
