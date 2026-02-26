/**
 * Gestiona el estado de amigos del usuario actual.
 *   1. Sustituir MOCK_CURRENT_USER_ID per l'id del usuari logeat
 *   2. Sustituir les funcions mock per crides a la API (friendsService.js)
 */

import { createContext, useContext, useState, useCallback } from "react";

// ─── MOCK DATA ──────────────────────────────────────────
// TODO: cuando hi hagi login, cargar desde GET /api/usuarios
const MOCK_USERS = [
  {
    id: 1,
    nombre: "Alex Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=12",
    badge: "Gold Member",
  },
  {
    id: 2,
    nombre: "Sara Martínez",
    avatar: "https://i.pravatar.cc/150?img=5",
    badge: "F1 Fan",
  },
  {
    id: 3,
    nombre: "Marc Puig",
    avatar: "https://i.pravatar.cc/150?img=7",
    badge: "Season Ticket",
  },
  {
    id: 4,
    nombre: "Laia Torres",
    avatar: "https://i.pravatar.cc/150?img=9",
    badge: "VIP Member",
  },
  {
    id: 5,
    nombre: "Jordi Sala",
    avatar: "https://i.pravatar.cc/150?img=11",
    badge: "F1 Fan",
  },
  {
    id: 6,
    nombre: "Neus Vidal",
    avatar: "https://i.pravatar.cc/150?img=20",
    badge: "Gold Member",
  },
  {
    id: 7,
    nombre: "Pau Ferrer",
    avatar: "https://i.pravatar.cc/150?img=15",
    badge: "Early Bird",
  },
  {
    id: 8,
    nombre: "Marta Gil",
    avatar: "https://i.pravatar.cc/150?img=32",
    badge: "F1 Fan",
  },
  {
    id: 9,
    nombre: "Arnau Costa",
    avatar: "https://i.pravatar.cc/150?img=18",
    badge: "Season Ticket",
  },
  {
    id: 10,
    nombre: "Elena Roca",
    avatar: "https://i.pravatar.cc/150?img=25",
    badge: "VIP Member",
  },
];

const MOCK_CURRENT_USER_ID = 1;

// Amigos iniciales del usuario actual (IDs)
const INITIAL_FRIENDS_IDS = [2, 3, 6, 8];
// ─────────────────────────────────────────────────────────

const FriendsContext = createContext(null);

export const FriendsProvider = ({ children }) => {
  const [friendIds, setFriendIds] = useState(INITIAL_FRIENDS_IDS);

  // Lista de todos los usuarios disponibles para buscar
  // (excluye al usuario actual)
  const allUsers = MOCK_USERS.filter((u) => u.id !== MOCK_CURRENT_USER_ID);

  // Lista de amigos actuales como objetos completos
  const friends = MOCK_USERS.filter((u) => friendIds.includes(u.id));

  // Usuarios que NO son amigos todavía (para el buscador)
  const suggestions = allUsers.filter((u) => !friendIds.includes(u.id));

  const addFriend = useCallback((userId) => {
    // TODO: llamar a POST /api/amigos con { id_usuario: userId }
    setFriendIds((prev) => [...prev, userId]);
  }, []);

  const removeFriend = useCallback((userId) => {
    // TODO: llamar a DELETE /api/amigos/:userId
    setFriendIds((prev) => prev.filter((id) => id !== userId));
  }, []);

  const isFriend = useCallback(
    (userId) => friendIds.includes(userId),
    [friendIds],
  );

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
