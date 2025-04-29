
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { FormField } from '@/types/form';

interface DynamicFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

const DynamicField: React.FC<DynamicFieldProps> = ({ field, value, onChange, error }) => {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'tel':
      case 'email':
        return (
          <Input
            id={field.fieldId}
            placeholder={field.placeholder || ''}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            data-testid={field.dataTestId}
            className="w-full"
          />
        );
        
      case 'textarea':
        return (
          <Textarea
            id={field.fieldId}
            placeholder={field.placeholder || ''}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            data-testid={field.dataTestId}
            className="w-full min-h-[100px]"
          />
        );
        
      case 'date':
        return (
          <Input
            id={field.fieldId}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            data-testid={field.dataTestId}
            className="w-full"
          />
        );
        
      case 'dropdown':
        return (
          <Select
            value={value || ''}
            onValueChange={onChange}
          >
            <SelectTrigger 
              id={field.fieldId} 
              data-testid={field.dataTestId}
              className="w-full"
            >
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  data-testid={option.dataTestId}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case 'radio':
        return (
          <RadioGroup 
            value={value || ''} 
            onValueChange={onChange}
            className="flex flex-col space-y-2"
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  id={`${field.fieldId}-${option.value}`} 
                  value={option.value} 
                  data-testid={option.dataTestId}
                />
                <Label htmlFor={`${field.fieldId}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
        
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={field.fieldId} 
              checked={!!value} 
              onCheckedChange={onChange} 
              data-testid={field.dataTestId}
            />
          </div>
        );
        
      default:
        return (
          <Input
            id={field.fieldId}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            data-testid={field.dataTestId}
            className="w-full"
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <Label 
          htmlFor={field.fieldId}
          className="font-medium text-gray-700"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      
      {renderField()}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default DynamicField;
