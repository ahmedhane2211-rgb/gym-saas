import { ImageIcon, Upload } from "lucide-react";
import React, { useContext } from "react";

const AssetSection = ({ logo, stamp, setLogo, setStamp, settingsData, t }) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 text-orange">
        <ImageIcon size={24} />
        <h2 className="text-xl font-black uppercase tracking-widest ">
          {t("assets")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">
            {t("company_logo")}
          </p>
          <div className="glass-card aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-orange/50 transition-all relative overflow-hidden group">
            {logo || settingsData?.data?.logo ? (
              <img
                src={
                  logo ? URL.createObjectURL(logo) : settingsData?.data?.logo
                }
                className="w-full h-full object-contain p-4"
                alt="Logo"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Upload size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {t("upload_logo")}
                </span>
              </div>
            )}
            <input
              type="file"
              onChange={(e) => setLogo(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">
            {t("company_stamp")}
          </p>
          <div className="glass-card aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-orange/50 transition-all relative overflow-hidden group">
            {stamp || settingsData?.data?.stamp ? (
              <img
                src={
                  stamp ? URL.createObjectURL(stamp) : settingsData?.data?.stamp
                }
                className="w-full h-full object-contain p-4"
                alt="Stamp"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Upload size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {t("upload_stamp")}
                </span>
              </div>
            )}
            <input
              type="file"
              onChange={(e) => setStamp(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssetSection;
