import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";

const AVATAR_OPTIONS = [
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?img=15",
  "https://i.pravatar.cc/150?img=22",
  "https://i.pravatar.cc/150?img=33",
  "https://i.pravatar.cc/150?img=47",
  "https://i.pravatar.cc/150?img=56",
];

const EditProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form state — in a real app these would come from a global store / API
  const [name, setName] = useState("Alex Rodriguez");
  const [bio, setBio] = useState("F1 Enthusiast & Gold Member");
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/150?img=12");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = t("editProfile.errorName");
    if (name.trim().length > 40)
      newErrors.name = t("editProfile.errorNameLong");
    if (bio.length > 100) newErrors.bio = t("editProfile.errorBioLong");
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    // TODO: persist to API
    setSaved(true);
    setTimeout(() => {
      navigate("/profile");
    }, 900);
  };

  return (
    <div className="relative h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display overflow-hidden select-none flex flex-col transition-colors duration-300 overscroll-none">
      {/* Header */}
      <div className="w-full pt-6 px-5 pb-4 bg-gray-50 dark:bg-slate-950 z-20 transition-colors duration-300 touch-none shrink-0">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/profile")}
            className="bg-white dark:bg-slate-900 p-2 rounded-full text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 active:bg-slate-100 dark:active:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl block">
              arrow_back
            </span>
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">
            {t("editProfile.title")}
          </h1>
          <button
            onClick={handleSave}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-primary text-white active:scale-95"
            }`}
          >
            {saved ? (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">
                  check
                </span>
                {t("editProfile.saved")}
              </span>
            ) : (
              t("editProfile.save")
            )}
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto pb-32 px-5 space-y-6 pt-2">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden">
              <img
                src={avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-base">
                photo_camera
              </span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            {t("editProfile.changeAvatar")}
          </p>

          {/* Avatar Picker */}
          {showAvatarPicker && (
            <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t("editProfile.chooseAvatar")}
              </p>
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_OPTIONS.map((url) => (
                  <button
                    key={url}
                    onClick={() => {
                      setAvatar(url);
                      setShowAvatarPicker(false);
                    }}
                    className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
                      avatar === url
                        ? "border-primary scale-110 shadow-md"
                        : "border-transparent opacity-70"
                    }`}
                  >
                    <img
                      src={url}
                      alt="avatar option"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              {t("editProfile.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder={t("editProfile.namePlaceholder")}
              className={`w-full bg-white dark:bg-slate-900 border rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                errors.name
                  ? "border-red-400 focus:ring-red-400"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>
            )}
            <p className="text-[10px] text-slate-400 text-right mt-1">
              {name.trim().length}/40
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              {t("editProfile.bio")}
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={100}
              rows={3}
              placeholder={t("editProfile.bioPlaceholder")}
              className={`w-full bg-white dark:bg-slate-900 border rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none ${
                errors.bio
                  ? "border-red-400 focus:ring-red-400"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />
            {errors.bio && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.bio}</p>
            )}
            <p className="text-[10px] text-slate-400 text-right mt-1">
              {bio.length}/100
            </p>
          </div>

          {/* Info card */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4 flex gap-3 items-start">
            <span className="material-symbols-outlined text-blue-400 text-lg mt-0.5">
              info
            </span>
            <p className="text-xs text-blue-600 dark:text-blue-300 leading-relaxed">
              {t("editProfile.infoNote")}
            </p>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default EditProfile;
