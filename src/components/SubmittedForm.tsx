
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, LogIn } from 'lucide-react';
import { useFormStore } from '@/store/formStore';
import { useNavigate } from 'react-router-dom';

const SubmittedForm = () => {
  const { logout, user } = useFormStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    // Force navigation to the root path after logout
    navigate('/', { replace: true });
  };
  
  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg text-center py-8">
        <CardTitle className="text-2xl flex justify-center flex-col items-center gap-6">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <Check size={40} className="text-green-600" />
          </div>
          Form Submitted Successfully
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 text-center">
        <p className="text-gray-700 mb-4 text-lg font-medium">
          Thank you, <span className="text-green-600 font-semibold">{user?.name}</span>!
        </p>
        <p className="text-gray-600 mb-6">
          Your form has been successfully submitted and recorded in our system.
        </p>
        <p className="text-sm text-gray-500 italic border-t border-b border-gray-100 py-4 px-4">
          You've already completed the required submission process. There's no need to submit the form again.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center pt-4 pb-8">
        <Button
          onClick={handleLogout}
          className="bg-gradient-to-r from-education-primary to-education-secondary hover:from-education-dark hover:to-education-primary transition-all duration-300 text-white font-medium shadow-md flex items-center gap-2 py-2"
          data-testid="logout-button"
        >
          <LogIn size={18} className="mr-1" /> Logout & Login as another student
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubmittedForm;
