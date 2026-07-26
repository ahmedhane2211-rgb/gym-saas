import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

const AppModal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-[650px]",
  headerContent,
  closeText = "Close",
  showCloseFooter = false,
}) => {
  const esc = useCallback(
    (event) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [isOpen, esc]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={`relative w-full ${maxWidth} max-h-[92vh] bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col`}
      >
        <div className="p-8 pb-4 flex items-center justify-between shrink-0">
          {headerContent || (
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white  uppercase tracking-widest">
                {title}
              </h2>
              <div className="w-12 h-1 bg-orange rounded-full" />
            </div>
          )}
          <button
            onClick={onClose}
            className="relative z-10 p-2 text-gray-500 hover:text-orange transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8 pt-4 space-y-8 overflow-y-auto">{children}</div>
        {(footer || showCloseFooter) && (
          <div className="p-8 pt-4 shrink-0 border-t border-gray-200 dark:border-white/5">
            {footer || (
              <button
                onClick={onClose}
                className="w-full py-4 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 dark:text-gray-400 font-black text-[12px] uppercase tracking-[0.3em] hover:bg-orange hover:text-black transition-all"
              >
                {closeText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppModal;
