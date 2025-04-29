
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useFormStore } from '@/store/formStore';
import FormSection from './FormSection';
import { FormField } from '@/types/form';

const DynamicForm = () => {
  const { formResponse, currentSectionIndex, setCurrentSectionIndex, formData, setIsSubmitted, user } = useFormStore();

  const [validationSchemas, setValidationSchemas] = useState<Record<number, z.ZodObject<any>>>({});
  
  useEffect(() => {
    if (formResponse) {
      // Create validation schema for each section
      const schemas: Record<number, z.ZodObject<any>> = {};
      
      formResponse.form.sections.forEach((section, index) => {
        const schemaObj: Record<string, z.ZodTypeAny> = {};
        
        section.fields.forEach((field) => {
          // Create the proper schema based on field type
          if (field.type === 'checkbox') {
            // For checkbox fields
            if (field.required) {
              // If checkbox is required, it must be true
              schemaObj[field.fieldId] = z.boolean().refine(val => val === true, {
                message: field.validation?.message || 'This field is required'
              });
            } else {
              // Optional checkbox
              schemaObj[field.fieldId] = z.boolean().optional();
            }
          } else {
            // For string-based fields (text, email, etc)
            let stringSchema = z.string();
            
            // Set up email validation
            if (field.type === 'email') {
              stringSchema = z.string().email(field.validation?.message || 'Invalid email');
            }
            
            // Apply required validation
            if (field.required) {
              stringSchema = stringSchema.min(1, field.validation?.message || 'This field is required');
              
              // Apply min length if specified
              if (field.minLength !== undefined) {
                stringSchema = stringSchema.min(field.minLength, `Minimum length is ${field.minLength}`);
              }
              
              // Apply max length if specified
              if (field.maxLength !== undefined) {
                stringSchema = stringSchema.max(field.maxLength, `Maximum length is ${field.maxLength}`);
              }
              
              schemaObj[field.fieldId] = stringSchema;
            } else {
              // Handle optional fields
              let optionalSchema = stringSchema.optional();
              schemaObj[field.fieldId] = optionalSchema;
            }
          }
        });
        
        schemas[index] = z.object(schemaObj);
      });
      
      setValidationSchemas(schemas);
    }
  }, [formResponse]);
  
  const handleNext = async () => {
    if (currentSectionIndex < (formResponse?.form.sections.length || 0) - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };
  
  const handleSubmit = () => {
    console.log('Form data submitted:', formData);
    setIsSubmitted(true);
    
    // Store in localStorage that this user has submitted the form
    if (user) {
      localStorage.setItem(`form-submitted-${user.rollNumber}`, 'true');
    }
  };
  
  if (!formResponse) {
    return <div className="text-center">Loading form...</div>;
  }
  
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === formResponse.form.sections.length - 1;
  
  const currentSection = formResponse.form.sections[currentSectionIndex];
  
  return (
    <div className="w-full max-w-3xl animate-fade-in">
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-education-primary to-education-secondary text-white rounded-t-lg">
          <CardTitle className="text-2xl">{formResponse.form.formTitle}</CardTitle>
          <CardDescription className="text-education-light">
            Section {currentSectionIndex + 1} of {formResponse.form.sections.length}: {currentSection.title}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {currentSection.description && (
            <p className="text-gray-500 mb-6">{currentSection.description}</p>
          )}
          
          <FormSection 
            section={currentSection}
            validationSchema={validationSchemas[currentSectionIndex]}
            onNext={handleNext}
            onPrev={handlePrev}
            onSubmit={handleSubmit}
            isFirst={isFirstSection}
            isLast={isLastSection}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicForm;
