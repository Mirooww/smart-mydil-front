import React, { useState } from "react";
import fetchData from "../hook/fetchData";

export default function CreateArticle({ token }) {
   const [type, setType] = useState("");
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [quantity, setQuantity] = useState(1);
   const [errorMessage, setErrorMessage] = useState("");
   const [successMessage, setSuccessMessage] = useState("");

   const handleSubmit = async (e) => {
      e.preventDefault();

      const newArticle = { type, name, description, quantity };

      try {
         const response = await fetchData("article/", token, "POST", newArticle);
         if (response) {
            setSuccessMessage(response.message);
            console.log(successMessage);
         } else {
            setErrorMessage(response.error);
            console.log(errorMessage);
         }
      } catch (error) {
         setErrorMessage("Erreur lors de la création", error);
         console.log(errorMessage);
      }
   };

   return (
      <div className="flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8" style={{ height: "100%", width: "100%" }}>
         {" "}
         <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
            <div>
               <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Créer un nouvel article</h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
               <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                     <label htmlFor="type" className="sr-only">
                        Type de l'article
                     </label>
                     <input
                        id="type"
                        name="type"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Type de l'article"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                     />
                  </div>
                  <div>
                     <label htmlFor="name" className="sr-only">
                        Nom de l'article
                     </label>
                     <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Nom de l'article"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                     />
                  </div>
                  <div>
                     <label htmlFor="description" className="sr-only">
                        Description
                     </label>
                     <textarea
                        id="description"
                        name="description"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                     />
                  </div>
                  <div>
                     <label htmlFor="quantity" className="sr-only">
                        Quantité
                     </label>
                     <input
                        id="quantity"
                        name="quantity"
                        type="number"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Quantité"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                     />
                  </div>
               </div>

               <div>
                  <button
                     type="submit"
                     className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                     Créer l'article
                  </button>
               </div>
            </form>
            {successMessage && <div className="mt-3 text-sm text-green-600 bg-green-100 border border-green-400 rounded-md p-3">{successMessage}</div>}
            {errorMessage && <div className="mt-3 text-sm text-red-600 bg-red-100 border border-red-400 rounded-md p-3">{errorMessage}</div>}
         </div>
      </div>
   );
}
