import React, { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "../App";
import fetchData from "../hook/fetchData";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function ShowUserReservation({ token }) {
   const { id } = useParams();

   const { isAuthenticated, role } = useAuthContext();
   const [users, setUsers] = useState([]);

   const [successMessage, setSuccessMessage] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const navigate = useNavigate();

   const fetchAllData = useCallback(async () => {
      const response = await fetchData(`user/${id}`, token);
      console.log("pitie ", response);
      if (response && response.success) {
         setUsers(response.users.reservations);
      } else {
         setErrorMessage(response.error);
      }
   }, [token]);

   useEffect(() => {
      fetchAllData();
   }, [fetchAllData]);

   const UserHeader = () => (
      <div className="flex w-full justify-around items-center bg-gray-100 p-2 rounded-t-lg font-semibold">
         <div>id</div>
         <div>name</div>
      </div>
   );

   const UserItem = ({ user }) => (
      <div className="w-full mb-2">
         <div className="flex w-full justify-around items-center p-2 bg-white border border-gray-200 rounded-t-lg">
            <div>{user.id}</div>
            <div>{user.article.name}</div>
         </div>
      </div>
   );

   return (
      <div className="w-full max-w-4xl mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4 text-center">Les réservations {isAuthenticated ? "connectés" : "non connectés"}</h1>

         <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <UserHeader />
            {users.map((user) => (
               <UserItem key={user.id} user={user} />
            ))}
         </div>

         {successMessage && <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">{successMessage}</div>}
         {errorMessage && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{errorMessage}</div>}
      </div>
   );
}
