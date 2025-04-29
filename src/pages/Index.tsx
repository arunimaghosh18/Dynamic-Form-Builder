
import React, { useEffect } from 'react';
import { useFormStore } from '@/store/formStore';
import { getForm } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import LoginForm from '@/components/LoginForm';
import DynamicForm from '@/components/DynamicForm';
import SubmittedForm from '@/components/SubmittedForm';

const Index = () => {
  const { user, formResponse, isSubmitted, setFormResponse, setIsSubmitted } = useFormStore();
  const { toast } = useToast();
  
  // Check if user exists and fetch form if form response doesn't exist
  useEffect(() => {
    const fetchForm = async () => {
      if (user && !formResponse && !isSubmitted) {
        try {
          const response = await getForm(user.rollNumber);
          setFormResponse(response);
          
          // Check if the user has already submitted the form
          const isFormSubmitted = localStorage.getItem(`form-submitted-${user.rollNumber}`);
          if (isFormSubmitted === 'true') {
            setIsSubmitted(true);
            toast({
              title: "Previously submitted",
              description: "You have already submitted this form."
            });
          }
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to load form data."
          });
        }
      }
    };
    
    fetchForm();
  }, [user, formResponse, isSubmitted, setFormResponse, setIsSubmitted, toast]);
  
  // Render based on application state
  const renderContent = () => {
    if (!user) {
      return <LoginForm />;
    }
    
    if (isSubmitted) {
      return <SubmittedForm />;
    }
    
    if (formResponse) {
      return <DynamicForm />;
    }
    
    // Loading state while fetching form
    return <div className="text-center p-10">Loading form data...</div>;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-education-dark mb-4">Student Form Portal</h1>
          <p className="text-gray-600 text-lg">Complete your registration process</p>
        </header>
        
        <main className="flex justify-center">
          {renderContent()}
        </main>
        
        <footer className="mt-16 text-center text-gray-500 text-sm border-t border-gray-200 pt-6">
          <p>© {new Date().getFullYear()} Student Form Portal. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
