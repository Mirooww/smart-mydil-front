import React, { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "../App"; // Assurez-vous que le chemin d'importation est correct
import fetchData from "../hook/fetchData";
import { useNavigate } from "react-router-dom";

export default function Reservation({ token, userId }) {
   const { isAuthenticated } = useAuthContext();
   const [reservations, setReservations] = useState([]);
   const [successMessage, setSuccessMessage] = useState("");
   const [errorMessage, setErrorMessage] = useState("");

   const navigate = useNavigate();

   const fetchAllData = useCallback(async () => {
      const response = await fetchData(`reservation/${userId}`, token);
      if (response && response.success) {
         const formattedReservations = response.reservations.map((reservation, index) => ({
            index: index,
            reservationDate: reservation.reservationDate,
            idUser: reservation.idUser,
            username: reservation.username,
            idArticle: reservation.idArticle,
            article: reservation.article,
         }));
         setReservations(formattedReservations);
      } else {
         setErrorMessage(response.error);
      }
   }, [token]);

   useEffect(() => {
      fetchAllData();
   }, [fetchAllData]);

   const handleReturn = async (idArticle) => {
      const response = await fetchData(`article/${idArticle}/return/${userId}`, token, "PATCH");
      if (response && response.success) {
         setSuccessMessage(response.message);
         fetchAllData();
      } else {
         setErrorMessage("Une erreur s'est produite lors de la suppression de l'article.");
      }
   };

   function reservationsList() {
      return (
         <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
            <div key={"reservations"} className="flex w-full justify-around shadow-md h-10 mt-5 rounded-lg items-center">
               {isAuthenticated && <div key={"rendre article"} className="shadow-md rounded-md h-8 p-2"></div>}
               <div key={"article :"} style={{ width: "150px", textAlign: "center" }}>
                  nom article
               </div>
            </div>
            {reservations.map((article) => (
               <div key={"articles set" + article.index} className="w-full">
                  <div key={"articles" + article.index} className="flex w-full justify-around shadow-md h-10 mt-5 rounded-t-lg items-center">
                     {isAuthenticated && (
                        <div key={"reserver article" + article.index} className="shadow-md rounded-md h-8 p-2" onClick={() => handleReturn(article.idArticle)}>
                           Rendre
                        </div>
                     )}
                     <div key={"article type :" + article.type + article.index} style={{ width: "150px", textAlign: "center" }}>
                        {article.article}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      );
   }

   return (
      <>
         <h1>Liste des réservations {isAuthenticated ? "connectés" : "non connectés"}</h1>
         {reservationsList()}
         {successMessage && <div className="text-green-500">{successMessage}</div>}
         {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      </>
   );
}
