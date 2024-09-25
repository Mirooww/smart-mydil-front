import React, { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "../App";
import fetchData from "../hook/fetchData";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";

export default function Reservation({ token }) {
   const { isAuthenticated, role, userId } = useAuthContext();
   const [reservations, setReservations] = useState([]);
   const [successMessage, setSuccessMessage] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const navigate = useNavigate();

   const fetchAllData = useCallback(async () => {
      const response = await fetchData(`reservation/${userId}`, token);
      console.log("sasa", response);
      if (response && response.success) {
         const formattedReservations = response.reservations.map((reservation, index) => ({
            index: index,
            reservationDate: reservation.reservationDate,
            idUser: reservation.idUser,
            username: reservation.username,
            idArticle: reservation.idArticle,
            article: reservation.article,
            urlImage: reservation.urlImage,
         }));
         setReservations(formattedReservations);
      } else {
         setErrorMessage(response.error);
      }
   }, []);

   useEffect(() => {
      fetchAllData();
   }, [fetchAllData]);

   const handleReturn = async (idArticle) => {
      const response = await fetchData(`article/${idArticle}/return/${userId}`, token, "PATCH");
      console.log(response);
      if (response && response.success) {
         setSuccessMessage(response.message);
         fetchAllData();
      } else {
         setErrorMessage("Une erreur s'est produite lors de la suppression de l'article.");
      }
   };

   const ReservationHeader = () => (
      <div className="flex w-full justify-around items-center bg-gray-100 p-2 rounded-t-lg font-semibold">
         {isAuthenticated && <div className="w-1/3 text-center">Action</div>}
         <div className="w-1/3 text-center">Nom</div>
         <div className="w-1/3 text-center">Image</div>
      </div>
   );

   const ReservationItem = ({ reservation }) => (
      <div className="w-full mb-2">
         <div className="flex w-full justify-around items-center p-2 bg-white border border-gray-200 rounded-t-lg">
            {isAuthenticated && (
               <button
                  onClick={() => handleReturn(reservation.idArticle)}
                  className="w-1/3 text-center px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
               >
                  Rendre
               </button>
            )}
            <div className="w-1/3 text-center">{reservation.article}</div>

            <div className="w-1/3 text-center" style={{ height: "100px", width: "100px" }}>
               <img src={`http://localhost:4000/api${reservation.urlImage}`} alt="reservation" />
            </div>
         </div>
      </div>
   );

   return (
      <div className="w-full max-w-4xl mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4 text-center">Liste d'reservations {isAuthenticated ? "connectés" : "non connectés"}</h1>

         <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <ReservationHeader />
            {reservations.map((reservation) => (
               <ReservationItem key={reservation.id} reservation={reservation} />
            ))}
         </div>

         {successMessage && <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">{successMessage}</div>}
         {errorMessage && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{errorMessage}</div>}
      </div>
   );
}
