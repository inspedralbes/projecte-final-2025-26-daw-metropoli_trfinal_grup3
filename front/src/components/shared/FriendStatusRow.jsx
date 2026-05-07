import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserAvatar from "../UserAvatar";

/**
 * FriendStatusRow - A horizontal scrollable list of friends with online status indicators.
 * Used in Home and Community screens.
 * 
 * @param {Array} friends - List of friend objects
 * @param {Function} onFriendClick - Callback when the status dot is clicked (optional)
 * @param {String} title - Optional title for the section
 */
const FriendStatusRow = ({ friends = [], onFriendClick, title }) => {
  const { t } = useTranslation();

  if (!friends || !Array.isArray(friends) || friends.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">
        {title || t("profile.friendsList", "Amics Online")}
      </h3>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {friends.map((friend) => (
          <div
            key={friend.id_usuario}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div className="relative">
              <Link to={`/profile/${friend.id_usuario}`}>
                <UserAvatar user={friend} className="w-14 h-14" borderColor="border-primary" />
              </Link>
              <button
                onClick={() => onFriendClick && onFriendClick(friend)}
                className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full cursor-pointer hover:scale-110 transition-transform"
                title={t("community.chatWith", "Xateja amb ") + friend.nombre}
              ></button>
            </div>
            <Link to={`/profile/${friend.id_usuario}`}>
              <span className="text-[10px] font-bold text-slate-500 max-w-[64px] truncate hover:text-primary transition-colors">
                {friend.nombre}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendStatusRow;
