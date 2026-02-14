/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';

const EditMemberModal = ({ isOpen, onClose, onSubmit, member, t }) => {
  const [formData, setFormData] = useState({
    fullName: member?.fullName || '',
    phone: member?.phone || '',
    email: member?.email || '',
    barcode: member?.barcode || '',
    photoUrl: member?.photoUrl || '',
    idNumber: member?.idNumber || '',
    dateOfBirth: member?.dateOfBirth || '',
    gender: member?.gender || 'male',
    isActive: member?.isActive || true,
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (member && isOpen) {
      setFormData(member);
      setPhotoPreview(member?.photoUrl || null);
    }
  }, [member, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          photoUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t('editMember') || 'Edit Member'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload */}
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl text-slate-400">
                  👤
                </div>
              )}
            </div>
            <label className="cursor-pointer rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500">
              {t("change_photo")}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('fullName') || 'Full Name'} *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900"
              placeholder="Enter full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('email') || 'Email'} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900"
              placeholder="Enter email address"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('phone') || 'Phone'} *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900"
              placeholder="Enter phone number"
            />
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('idNumber') || 'ID Number'} *
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900"
              placeholder="Enter ID number"
            />
          </div>

          {/* Barcode */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('barCode') || 'Barcode'}
            </label>
            <input
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900"
              placeholder="Enter barcode"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('dateOfBirth') || 'Date of Birth'}
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-900"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('gender') || 'Gender'}
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-900"
            >
              <option value="male">{t('male') || 'Male'}</option>
              <option value="female">{t('female') || 'Female'}</option>
            </select>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-5 w-5 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800"
            />
            <label htmlFor="isActive" className="ml-3 cursor-pointer select-none text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('isActive') || 'Active Member'}
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {t('cancel') || 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {t('save') || 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberModal;

//           {/* Full Name */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
//               {t?.('fullName') || 'Full Name'} *
//             </label>
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900"
//               placeholder="Enter full name"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
//               {t?.('email') || 'Email'} *
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900"
//               placeholder="Enter email address"
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
//               {t?.('phone') || 'Phone'} *
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900"
//               placeholder="Enter phone number"
//             />
//           </div>

//           {/* ID Number */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
//               {t?.('idNumber') || 'ID Number'} *
//             </label>
//             <input
//               type="text"
//               name="idNumber"
//               value={formData.idNumber}
//               onChange={handleChange}
//               required
//               className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900"
//               placeholder="Enter ID number"
//             />
//           </div>

//           {/* Barcode */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
//               {t?.('barcode') || 'Barcode'}
//             </label>
//             <input
//               type="text"
//               name="barcode"
//               value={formData.barcode}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900"
//               placeholder="Enter barcode"
//             />
//           </div>

//           {/* Date of Birth */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
//               {t?.('dateOfBirth') || 'Date of Birth'}
//             </label>
//             <input
//               type="date"
//               name="dateOfBirth"
//               value={formData.dateOfBirth}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-900"
//             />
//           </div>

//           {/* Gender */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
//               {t?.('gender') || 'Gender'}
//             </label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-900"
//             >
//               <option value="male">{t?.('members.gender.male') || 'Male'}</option>
//               <option value="female">{t?.('members.gender.female') || 'Female'}</option>
//               <option value="other">{t?.('members.gender.other') || 'Other'}</option>
//             </select>
//           </div>

//           {/* Active Status */}
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               name="isActive"
//               id="isActive"
//               checked={formData.isActive}
//               onChange={handleChange}
//               className="h-5 w-5 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800"
//             />
//             <label htmlFor="isActive" className="ml-3 cursor-pointer select-none text-sm font-medium text-slate-700 dark:text-slate-300">
//               {t?.('isActive') || 'Active Member'}
//             </label>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
//             >
//               {t?.('actions.cancel') || 'Cancel'}
//             </button>
//             <button
//               type="submit"
//               className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
//             >
//               {t?.('actions.save') || 'Save Changes'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditMemberModal;