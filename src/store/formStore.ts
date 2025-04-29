
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FormResponse, FormData, User } from '@/types/form';

interface FormState {
  user: User | null;
  formResponse: FormResponse | null;
  formData: FormData;
  isSubmitted: boolean;
  currentSectionIndex: number;
  
  setUser: (user: User | null) => void;
  setFormResponse: (formResponse: FormResponse | null) => void;
  setFormData: (fieldId: string, value: string | string[] | boolean | undefined) => void;
  resetFormData: () => void;
  setIsSubmitted: (isSubmitted: boolean) => void;
  setCurrentSectionIndex: (index: number) => void;
  logout: () => void;
}

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      user: null,
      formResponse: null,
      formData: {},
      isSubmitted: false,
      currentSectionIndex: 0,
      
      setUser: (user) => set({ user }),
      setFormResponse: (formResponse) => set({ formResponse }),
      setFormData: (fieldId, value) => 
        set((state) => ({ 
          formData: { 
            ...state.formData, 
            [fieldId]: value 
          } 
        })),
      resetFormData: () => set({ formData: {} }),
      setIsSubmitted: (isSubmitted) => set({ isSubmitted }),
      setCurrentSectionIndex: (index) => set({ currentSectionIndex: index }),
      logout: () => set({ 
        user: null, 
        formResponse: null, 
        formData: {},
        isSubmitted: false,
        currentSectionIndex: 0
      }),
    }),
    {
      name: 'student-form-storage',
    }
  )
);
