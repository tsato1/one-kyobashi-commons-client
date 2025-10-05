/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";

import {
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MultiInputFieldProps {
  name: string;
  control: any;
  placeholder?: string;
  inputClassName?: string;
  buttonLabel?: string;
}

export const MultiInputField: React.FC<MultiInputFieldProps> = ({
  name,
  control,
  placeholder,
  inputClassName,
  buttonLabel,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start space-x-2">
          <FormField
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <div className="w-full space-y-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder={placeholder}
                    className={`flex-1 border-none p-4 ${inputClassName}`} />
                </FormControl>
                <FormMessage />
              </div>
            )} />
          <Button
            type="button"
            onClick={() => remove(index)}
            variant="ghost"
            size="icon"
            className="text-gray-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => append("")}
        variant="outline"
        size="sm"
        className="mt-2 text-gray-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        {buttonLabel ? buttonLabel : "Add Item"}
      </Button>
    </div>
  );
};
