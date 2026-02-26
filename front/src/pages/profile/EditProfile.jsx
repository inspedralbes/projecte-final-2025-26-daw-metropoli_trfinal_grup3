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
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display select-none transition-colors duration-300 md:pl-16">
      {/* Top Bar */}
      <div className="w-full pt-6 px-5 pb-4 bg-gray-50 dark:bg-slate-950 z-20 transition-colors duration-300 touch-none md:max-w-3xl md:mx-auto">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/profile")}
            className="bg-white dark:bg-slate-900 p-2 rounded-full text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl block">
              arrow_back
            </span>
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">
            {t("editProfile.title")}
          </h1>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
              saved
                ? "bg-emerald-500 text-white shadow-emerald-500/30"
                : "bg-primary text-white hover:bg-primary/90 shadow-primary/30"
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
      <div className="overflow-y-auto no-scrollbar pb-24 md:pb-10 pt-4 px-5 space-y-8 md:max-w-3xl md:mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors border-2 border-white dark:border-slate-900"
              >
                <span className="material-symbols-outlined text-xl">
                  photo_camera
                </span>
              </button>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {t("editProfile.changeAvatar")}
            </p>

            {/* Avatar Picker */}
            {showAvatarPicker && (
              <div className="w-full max-w-sm mt-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 animate-fade-in">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
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
                      className={`relative aspect-square rounded-full overflow-hidden transition-all duration-300 ${
                        avatar === url
                          ? "ring-4 ring-primary ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-800 scale-95"
                          : "hover:scale-105 hover:shadow-md opacity-80 hover:opacity-100"
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

          <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-8"></div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">
                  person
                </span>
                {t("editProfile.name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder={t("editProfile.namePlaceholder")}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-2xl px-4 py-3.5 text-base text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                  errors.name
                    ? "border-red-400 focus:ring-red-400"
                    : "border-slate-200 dark:border-slate-800 focus:border-primary"
                }`}
              />
              <div className="flex justify-between items-center mt-1.5 px-1">
                <p className="text-red-500 text-xs font-medium">
                  {errors.name}
                </p>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider">
                  {name.trim().length}/40
                </p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">
                  description
                </span>
                {t("editProfile.bio")}
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={100}
                rows={3}
                placeholder={t("editProfile.bioPlaceholder")}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-2xl px-4 py-3.5 text-base text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none ${
                  errors.bio
                    ? "border-red-400 focus:ring-red-400"
                    : "border-slate-200 dark:border-slate-800 focus:border-primary"
                }`}
              />
              <div className="flex justify-between items-center mt-1.5 px-1">
                <p className="text-red-500 text-xs font-medium">{errors.bio}</p>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider">
                  {bio.length}/100
                </p>
              </div>
            </div>

            {/* Info card */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-4 flex gap-3 items-start">
              <span className="material-symbols-outlined text-blue-500 text-xl mt-0.5">
                info
              </span>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                {t(
                  "editProfile.infoNote",
                  "Your profile information is visible to other fans in the community. Changes to your avatar will update across all your posts and comments.",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default EditProfile;
