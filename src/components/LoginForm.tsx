
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { createUser, getForm } from '@/services/api';
import { useFormStore } from '@/store/formStore';
import { User } from '@/types/form';
import { LogIn, UserCircle } from 'lucide-react';

const formSchema = z.object({
  rollNumber: z.string().min(1, { message: 'Roll number is required' }),
  name: z.string().min(1, { message: 'Name is required' })
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { setUser, setFormResponse, setIsSubmitted } = useFormStore();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rollNumber: '',
      name: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      const user: User = {
        rollNumber: values.rollNumber,
        name: values.name
      };
      
      // Check if the user has already submitted the form before even trying to register
      const isFormSubmitted = localStorage.getItem(`form-submitted-${values.rollNumber}`);
      if (isFormSubmitted === 'true') {
        // If already submitted, set isSubmitted to true
        setUser(user);
        setIsSubmitted(true);
        
        toast({
          title: "Form already submitted",
          description: "You have already submitted the form. Redirecting to the submission page."
        });
        
        setIsLoading(false);
        return;
      }
      
      // Try to register the user
      try {
        await createUser(user);
      } catch (error: any) {
        // If the error contains a message about duplicate user, we allow login but don't create
        if (error.message && error.message.includes('already exists')) {
          toast({
            title: "User already exists",
            description: "Logging in with existing credentials."
          });
        } else {
          // For other errors, we throw to the outer catch block
          throw error;
        }
      }
      
      // Fetch the form data
      const formResponse = await getForm(values.rollNumber);
      
      // Check if this roll number has already submitted a form
      const isUserSubmitted = localStorage.getItem(`form-submitted-${values.rollNumber}`);
      
      // Set user and form data
      setUser(user);
      setFormResponse(formResponse);
      
      if (isUserSubmitted === 'true') {
        setIsSubmitted(true);
        toast({
          title: "Welcome back",
          description: "You have already submitted your form."
        });
      } else {
        toast({
          title: "Login successful",
          description: "Please complete your form submission."
        });
      }
      
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Failed to login. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in rounded-xl overflow-hidden">
      <CardHeader className="space-y-1 bg-gradient-to-r from-education-primary to-education-secondary text-white rounded-t-lg pb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-full p-4 shadow-md">
            <UserCircle size={48} className="text-education-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Student Portal</CardTitle>
        <CardDescription className="text-education-light text-center">Enter your details to access the form</CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rollNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Roll Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your roll number" 
                      {...field} 
                      data-testid="roll-number-input"
                      className="focus:ring-2 focus:ring-education-primary focus:border-education-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your full name" 
                      {...field} 
                      data-testid="name-input"
                      className="focus:ring-2 focus:ring-education-primary focus:border-education-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="flex justify-end px-0 pt-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-education-primary to-education-secondary hover:from-education-dark hover:to-education-primary transition-all duration-300 text-white font-medium py-2 shadow-md"
                disabled={isLoading}
                data-testid="login-button"
              >
                {isLoading ? "Authenticating..." : (
                  <>
                    Login <LogIn size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
