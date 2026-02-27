/**
 * Gestiona el estado de amigos del usuario actual.
 *   1. Sustituir MOCK_CURRENT_USER_ID per l'id del usuari logeat
 *   2. Sustituir les funcions mock per crides a la API (friendsService.js)
 */

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getAmigos, addAmigo, removeAmigo as removeAmigoAPI, getUsuarios } from "../../services/communicationManager";

const FriendsContext = createContext(null);

export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const storedUser = localStorage.getItem("usuario");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = currentUser ? (currentUser.id_usuario || currentUser.id) : null;

  const fetchFriends = useCallback(async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const res = await getAmigos(currentUserId);
      if (res.success) {
        setFriends(res.data);
      }
    } catch (err) {
      console.error("Error al cargar amigos:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await getUsuarios();
      if (res.success) {
        setAllUsers(res.data.filter(u => u.id_usuario !== currentUserId));
      }
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      fetchFriends();
      fetchAllUsers();
    }
  }, [currentUserId, fetchFriends, fetchAllUsers]);

  const addFriend = useCallback(async (userId) => {
    if (!currentUserId) return;
    try {
      const res = await addAmigo(currentUserId, userId);
      if (res.success) {
        fetchFriends();
      }
      return res;
    } catch (err) {
      console.error("Error al añadir amigo:", err);
      return { success: false, message: err.message };
    }
  }, [currentUserId, fetchFriends]);

  const removeFriend = useCallback(async (userId) => {
    if (!currentUserId) return;
    try {
      const res = await removeAmigoAPI(currentUserId, userId);
      if (res.success) {
        fetchFriends();
      }
    } catch (err) {
      console.error("Error al eliminar amigo:", err);
    }
  }, [currentUserId, fetchFriends]);

  const isFriend = useCallback(
    (userId) => friends.some((f) => (f.id_usuario || f.id) == userId),
    [friends],
  );

  // Usuarios que NO son amigos todavía (para el buscador)
  const suggestions = allUsers.filter((u) => !isFriend(u.id_usuario || u.id));

  return (
    <FriendsContext.Provider
      value={{
        friends,
        allUsers,
        suggestions,
        addFriend,
        removeFriend,
        isFriend,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const ctx = useContext(FriendsContext);
  if (!ctx) throw new Error("useFriends must be used inside FriendsProvider");
  return ctx;
};
