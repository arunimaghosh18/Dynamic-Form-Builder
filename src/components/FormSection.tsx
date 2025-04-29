
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useFormStore } from '@/store/formStore';
import { FormSection as FormSectionType } from '@/types/form';
import DynamicField from './DynamicField';

interface FormSectionProps {
  section: FormSectionType;
  validationSchema: z.ZodObject<any>;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  validationSchema,
  onNext,
  onPrev,
  onSubmit,
  isFirst,
  isLast,
}) => {
  const { formData, setFormData } = useFormStore();
  
  // Create a type based on our validation schema
  type FormValues = z.infer<typeof validationSchema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: section.fields.reduce((acc, field) => {
      acc[field.fieldId] = formData[field.fieldId] as any || '';
      return acc;
    }, {} as Record<string, any>),
    mode: 'onBlur',
  });
  
  // Update the form values when formData changes
  useEffect(() => {
    section.fields.forEach((field) => {
      const value = formData[field.fieldId];
      if (value !== undefined) {
        form.setValue(field.fieldId as any, value as any);
      }
    });
  }, [formData]);
  
  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const formValues = form.getValues();
      
      // Save form data to store
      Object.keys(formValues).forEach((key) => {
        setFormData(key, formValues[key]);
      });
      
      onNext();
    }
  };
  
  const handlePrev = () => {
    // Save current form values even if invalid
    const formValues = form.getValues();
    
    // Save form data to store
    Object.keys(formValues).forEach((key) => {
      setFormData(key, formValues[key]);
    });
    
    onPrev();
  };
  
  const handleFormSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const formValues = form.getValues();
      
      // Save form data to store
      Object.keys(formValues).forEach((key) => {
        setFormData(key, formValues[key]);
      });
      
      onSubmit();
    }
  };
  
  // Handler for field changes
  const handleFieldChange = (fieldId: string, value: any) => {
    form.setValue(fieldId as any, value);
    setFormData(fieldId, value);
  };
  
  return (
    <div className="space-y-6">
      {section.fields.map((field) => (
        <DynamicField
          key={field.fieldId}
          field={field}
          value={formData[field.fieldId] || ''}
          onChange={(value) => handleFieldChange(field.fieldId, value)}
          error={form.formState.errors[field.fieldId as any]?.message as string}
        />
      ))}
      
      <div className="flex justify-between mt-6 pt-4 border-t">
        {!isFirst ? (
          <Button 
            type="button" 
            variant="outline"
            onClick={handlePrev}
            className="border-education-primary text-education-primary"
            data-testid="prev-button"
          >
            Previous
          </Button>
        ) : (
          <div></div>
        )}
        
        {isLast ? (
          <Button 
            type="button"
            onClick={handleFormSubmit}
            className="bg-education-primary hover:bg-education-dark"
            data-testid="submit-button"
          >
            Submit
          </Button>
        ) : (
          <Button 
            type="button"
            onClick={handleNext}
            className="bg-education-primary hover:bg-education-dark"
            data-testid="next-button"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormSection;
