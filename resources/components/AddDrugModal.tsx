import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Drug {
  id?: string;
  drugClass: string;
  drugName: string;
  dose: string;
  formulation: string;
  frequency: string;
  duration: string;
}

interface Errors extends Partial<Drug> {
  general?: string;
}

interface AddDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDrug: (drug: Drug) => void;
}

const AddDrugModal: React.FC<AddDrugModalProps> = ({ isOpen, onClose, onAddDrug }) => {
  const initialDrugState: Drug = {
    drugClass: '',
    drugName: '',
    dose: '',
    formulation: '',
    frequency: '',
    duration: '',
  };

  const [drugDetails, setDrugDetails] = useState<Drug>(initialDrugState);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!drugDetails.drugClass.trim()) newErrors.drugClass = 'Drug Class is required';
    if (!drugDetails.drugName.trim()) newErrors.drugName = 'Drug Name is required';
    if (!drugDetails.dose.trim()) {
      newErrors.dose = 'Dose is required';
    } else if (!/^\d+(\.\d+)?(\s*(mg|g|ml|units))?$/i.test(drugDetails.dose)) {
      newErrors.dose = 'Dose must be a number with optional unit (e.g., 500 mg)';
    }
    if (!drugDetails.formulation.trim()) newErrors.formulation = 'Formulation is required';
    if (!drugDetails.frequency.trim()) newErrors.frequency = 'Frequency is required';
    if (!drugDetails.duration.trim()) {
      newErrors.duration = 'Duration is required';
    } else if (!/^\d+\s*(days|weeks|months)$/i.test(drugDetails.duration)) {
      newErrors.duration = 'Duration must be a number with unit (e.g., 7 days)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDrugDetails({ ...drugDetails, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleAddClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (!token) {
        setErrors({ general: 'CSRF token not found. Please refresh the page.' });
        return;
      }

      const response = await fetch('/drugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify(drugDetails),
      });

      if (response.ok) {
        const newDrug = await response.json();
        onAddDrug(newDrug);
        setDrugDetails(initialDrugState);
        onClose();
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.message || 'Failed to add drug' });
      }
    } catch (error) {
      setErrors({ general: 'Network error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements) return;

        const first = focusableElements[0] as HTMLElement;
        const last = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    if (isOpen) {
      firstFocusableRef.current?.focus();
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setDrugDetails(initialDrugState);
      setErrors({});
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-gradient-to-b from-gray-800/70 to-gray-600/50 flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={handleOverlayClick}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative p-8 w-full max-w-lg bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-95 animate-in"
      >
        <h3 id="modal-title" className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Add New Drug
        </h3>
        {errors.general && (
          <div className="text-red-400 text-sm mb-4 bg-red-50 p-3 rounded-md animate-slide-in">
            {errors.general}
          </div>
        )}
        <form onSubmit={handleAddClick} className="space-y-5 opacity-100 transition-opacity duration-200" style={{ opacity: isLoading ? 0.7 : 1 }}>
          <div className="relative">
            <input
              ref={firstFocusableRef}
              type="text"
              name="drugClass"
              placeholder="Drug Class (e.g., Antibiotic)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
              value={drugDetails.drugClass}
              onChange={handleInputChange}
              aria-label="Drug Class"
              disabled={isLoading}
            />
            {errors.drugClass && (
              <span className="text-red-400 text-sm mt-1 block animate-slide-in">{errors.drugClass}</span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="drugName"
              placeholder="Drug Name (e.g., Amoxicillin)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
              value={drugDetails.drugName}
              onChange={handleInputChange}
              aria-label="Drug Name"
              disabled={isLoading}
            />
            {errors.drugName && (
              <span className="text-red-400 text-sm mt-1 block animate-slide-in">{errors.drugName}</span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="dose"
              placeholder="Dose (e.g., 500 mg)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
              value={drugDetails.dose}
              onChange={handleInputChange}
              aria-label="Dose"
              disabled={isLoading}
            />
            {errors.dose && (
              <span className="text-red-400 text-sm mt-1 block animate-slide-in">{errors.dose}</span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="formulation"
              placeholder="Formulation (e.g., Capsule)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
              value={drugDetails.formulation}
              onChange={handleInputChange}
              aria-label="Formulation"
              disabled={isLoading}
            />
            {errors.formulation && (
              <span className="text-red-400 text-sm mt-1 block animate-slide-in">{errors.formulation}</span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="frequency"
              placeholder="Frequency (e.g., Twice daily)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
              value={drugDetails.frequency}
              onChange={handleInputChange}
              aria-label="Frequency"
              disabled={isLoading}
            />
            {errors.frequency && (
              <span className="text-red-400 text-sm mt-1 block animate-slide-in">{errors.frequency}</span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="duration"
              placeholder="Duration (e.g., 7 days)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
              value={drugDetails.duration}
              onChange={handleInputChange}
              aria-label="Duration"
              disabled={isLoading}
            />
            {errors.duration && (
              <span className="text-red-400 text-sm mt-1 block animate-slide-in">{errors.duration}</span>
            )}
          </div>
          <div className="mt-8 flex space-x-4">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-blue-300 flex items-center justify-center transition-transform duration-200 hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    />
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Drug'
              )}
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-100 transition-transform duration-200 hover:scale-105"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('modal-root') || document.body
  );
};

export default AddDrugModal;

// import React, { useState, useEffect, useRef } from 'react';
// import { createPortal } from 'react-dom';

// interface Drug {
//   id?: string;
//   drugClass: string;
//   drugName: string;
//   dose: string;
//   formulation: string;
//   frequency: string;
//   duration: string;
// }

// interface Errors extends Partial<Drug> {
//   general?: string;
// }

// interface AddDrugModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onAddDrug: (drug: Drug) => void;
// }

// const AddDrugModal: React.FC<AddDrugModalProps> = ({ isOpen, onClose, onAddDrug }) => {
//   const initialDrugState: Drug = {
//     drugClass: '',
//     drugName: '',
//     dose: '',
//     formulation: '',
//     frequency: '',
//     duration: '',
//   };

//   const [drugDetails, setDrugDetails] = useState<Drug>(initialDrugState);
//   const [errors, setErrors] = useState<Errors>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const modalRef = useRef<HTMLDivElement>(null);
//   const firstFocusableRef = useRef<HTMLInputElement>(null);

//   const validateForm = (): boolean => {
//     const newErrors: Errors = {};

//     if (!drugDetails.drugClass.trim()) newErrors.drugClass = 'Drug Class is required';
//     if (!drugDetails.drugName.trim()) newErrors.drugName = 'Drug Name is required';
//     if (!drugDetails.dose.trim()) {
//       newErrors.dose = 'Dose is required';
//     } else if (!/^\d+(\.\d+)?(\s*(mg|g|ml|units))?$/i.test(drugDetails.dose)) {
//       newErrors.dose = 'Dose must be a number with optional unit (e.g., 500 mg)';
//     }
//     if (!drugDetails.formulation.trim()) newErrors.formulation = 'Formulation is required';
//     if (!drugDetails.frequency.trim()) newErrors.frequency = 'Frequency is required';
//     if (!drugDetails.duration.trim()) {
//       newErrors.duration = 'Duration is required';
//     } else if (!/^\d+\s*(days|weeks|months)$/i.test(drugDetails.duration)) {
//       newErrors.duration = 'Duration must be a number with unit (e.g., 7 days)';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setDrugDetails({ ...drugDetails, [name]: value });
//     setErrors({ ...errors, [name]: '' });
//   };

//   const handleAddClick = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsLoading(true);
//     try {
//       const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
//       if (!token) {
//         setErrors({ general: 'CSRF token not found. Please refresh the page.' });
//         return;
//       }

//       const response = await fetch('/drugs', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRF-TOKEN': token,
//         },
//         body: JSON.stringify(drugDetails),
//       });

//       if (response.ok) {
//         const newDrug = await response.json();
//         onAddDrug(newDrug);
//         setDrugDetails(initialDrugState);
//         onClose();
//       } else {
//         const errorData = await response.json();
//         setErrors({ general: errorData.message || 'Failed to add drug' });
//       }
//     } catch (error) {
//       setErrors({ general: 'Network error occurred. Please try again.' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         onClose();
//         return;
//       }

//       if (e.key === 'Tab') {
//         const focusableElements = modalRef.current?.querySelectorAll(
//           'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
//         );
//         if (!focusableElements) return;

//         const first = focusableElements[0] as HTMLElement;
//         const last = focusableElements[focusableElements.length - 1] as HTMLElement;

//         if (e.shiftKey && document.activeElement === first) {
//           e.preventDefault();
//           last.focus();
//         } else if (!e.shiftKey && document.activeElement === last) {
//           e.preventDefault();
//           first.focus();
//         }
//       }
//     };

//     if (isOpen) {
//       firstFocusableRef.current?.focus();
//       window.addEventListener('keydown', handleKeyDown);
//     }

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [isOpen, onClose]);

//   useEffect(() => {
//     if (!isOpen) {
//       setDrugDetails(initialDrugState);
//       setErrors({});
//       setIsLoading(false);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return createPortal(
//     <div
//       className="fixed inset-0 bg-gradient-to-br from-blue-800/60 to-white/30 flex justify-center items-center z-50 transition-opacity duration-400"
//       onClick={handleOverlayClick}
//       role="dialog"
//       aria-labelledby="modal-title"
//       aria-modal="true"
//     >
//       <div
//         ref={modalRef}
//         tabIndex={-1}
//         className="relative p-8 w-full max-w-md bg-blue-50 rounded-3xl shadow-2xl transform transition-all duration-300 animate-slide-up"
//       >
//         <button
//           className="absolute top-4 right-4 p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
//           onClick={onClose}
//           aria-label="Close modal"
//         >
//           <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//         <h3 id="modal-title" className="text-3xl font-bold text-blue-900 mb-6 text-center">
//           Add New Drug
//         </h3>
//         {errors.general && (
//           <div className="text-red-500 text-sm mb-6 bg-red-50 p-3 rounded-lg animate-error-in">
//             {errors.general}
//           </div>
//         )}
//         <form onSubmit={handleAddClick} className="space-y-4" style={{ opacity: isLoading ? 0.6 : 1 }}>
//           <div className="relative bg-white p-4 rounded-lg shadow-sm">
//             <div className="flex items-center space-x-3">
//               <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-6 0H7m2-5h6" />
//               </svg>
//               <input
//                 ref={firstFocusableRef}
//                 type="text"
//                 name="drugClass"
//                 placeholder="Drug Class (e.g., Antibiotic)"
//                 className={`w-full px-4 py-2 border ${errors.drugClass ? 'border-red-500 animate-shake' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-all duration-200 disabled:bg-gray-100`}
//                 value={drugDetails.drugClass}
//                 onChange={handleInputChange}
//                 aria-label="Drug Class"
//                 disabled={isLoading}
//               />
//             </div>
//             {errors.drugClass && (
//               <span className="text-red-500 text-xs mt-1 block animate-error-in">{errors.drugClass}</span>
//             )}
//           </div>
//           <div className="relative bg-white p-4 rounded-lg shadow-sm">
//             <div className="flex items-center space-x-3">
//               <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path stroke="currentColor" strokeWidth="2" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
//               </svg>
//               <input
//                 type="text"
//                 name="drugName"
//                 placeholder="Drug Name (e.g., Amoxicillin)"
//                 className={`w-full px-4 py-2 border ${errors.drugName ? 'border-red-500 animate-shake' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-all duration-200 disabled:bg-gray-100`}
//                 value={drugDetails.drugName}
//                 onChange={handleInputChange}
//                 aria-label="Drug Name"
//                 disabled={isLoading}
//               />
//             </div>
//             {errors.drugName && (
//               <span className="text-red-500 text-xs mt-1 block animate-error-in">{errors.drugName}</span>
//             )}
//           </div>
//           <div className="relative bg-white p-4 rounded-lg shadow-sm">
//             <div className="flex items-center space-x-3">
//               <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path stroke="currentColor" strokeWidth="2" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
//               </svg>
//               <input
//                 type="text"
//                 name="dose"
//                 placeholder="Dose (e.g., 500 mg)"
//                 className={`w-full px-4 py-2 border ${errors.dose ? 'border-red-500 animate-shake' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-all duration-200 disabled:bg-gray-100`}
//                 value={drugDetails.dose}
//                 onChange={handleInputChange}
//                 aria-label="Dose"
//                 disabled={isLoading}
//               />
//             </div>
//             {errors.dose && (
//               <span className="text-red-500 text-xs mt-1 block animate-error-in">{errors.dose}</span>
//             )}
//           </div>
//           <div className="relative bg-white p-4 rounded-lg shadow-sm">
//             <div className="flex items-center space-x-3">
//               <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path stroke="currentColor" strokeWidth="2" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
//               </svg>
//               <input
//                 type="text"
//                 name="formulation"
//                 placeholder="Formulation (e.g., Capsule)"
//                 className={`w-full px-4 py-2 border ${errors.formulation ? 'border-red-500 animate-shake' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-all duration-200 disabled:bg-gray-100`}
//                 value={drugDetails.formulation}
//                 onChange={handleInputChange}
//                 aria-label="Formulation"
//                 disabled={isLoading}
//               />
//             </div>
//             {errors.formulation && (
//               <span className="text-red-500 text-xs mt-1 block animate-error-in">{errors.formulation}</span>
//             )}
//           </div>
//           <div className="relative bg-white p-4 rounded-lg shadow-sm">
//             <div className="flex items-center space-x-3">
//               <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path stroke="currentColor" strokeWidth="2" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
//               </svg>
//               <input
//                 type="text"
//                 name="frequency"
//                 placeholder="Frequency (e.g., Twice daily)"
//                 className={`w-full px-4 py-2 border ${errors.frequency ? 'border-red-500 animate-shake' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-all duration-200 disabled:bg-gray-100`}
//                 value={drugDetails.frequency}
//                 onChange={handleInputChange}
//                 aria-label="Frequency"
//                 disabled={isLoading}
//               />
//             </div>
//             {errors.frequency && (
//               <span className="text-red-500 text-xs mt-1 block animate-error-in">{errors.frequency}</span>
//             )}
//           </div>
//           <div className="relative bg-white p-4 rounded-lg shadow-sm">
//             <div className="flex items-center space-x-3">
//               <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path stroke="currentColor" strokeWidth="2" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
//               </svg>
//               <input
//                 type="text"
//                 name="duration"
//                 placeholder="Duration (e.g., 7 days)"
//                 className={`w-full px-4 py-2 border ${errors.duration ? 'border-red-500 animate-shake' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-all duration-200 disabled:bg-gray-100`}
//                 value={drugDetails.duration}
//                 onChange={handleInputChange}
//                 aria-label="Duration"
//                 disabled={isLoading}
//               />
//             </div>
//             {errors.duration && (
//               <span className="text-red-500 text-xs mt-1 block animate-error-in">{errors.duration}</span>
//             )}
//           </div>
//           <div className="mt-8 flex space-x-4">
//             <button
//               type="submit"
//               className="relative flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 flex items-center justify-center transition-all duration-200 hover:scale-105 overflow-hidden"
//               disabled={isLoading}
//             >
//               <span className="absolute inset-0 bg-blue-800 opacity-0 hover:opacity-20 transition-opacity duration-200"></span>
//               {isLoading ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 mr-2 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
//                     />
//                   </svg>
//                   Adding...
//                 </>
//               ) : (
//                 'Add Drug'
//               )}
//             </button>
//             <button
//               type="button"
//               className="relative flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-100 transition-all duration-200 hover:scale-105 overflow-hidden"
//               onClick={onClose}
//               disabled={isLoading}
//             >
//               <span className="absolute inset-0 bg-gray-400 opacity-0 hover:opacity-20 transition-opacity duration-200"></span>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>,
//     document.getElementById('modal-root') || document.body
//   );
// };

// export default AddDrugModal;