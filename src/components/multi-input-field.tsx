/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";

import {
  FormControl,
  FormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MultiInputFieldProps {
  name: string;
  control: any;
  placeholder?: string;
  inputClassName?: string;
}

export const MultiInputField: React.FC<MultiInputFieldProps> = ({
  name,
  control,
  placeholder,
  inputClassName,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2">
          <FormField
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  className={`flex-1 border-none p-4 ${inputClassName}`} />
              </FormControl>
            )} />
          <Button
            type="button"
            onClick={() => remove(index)}
            variant="ghost"
            size="icon"
            className="text-customgreys-dirtyGrey"
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
        className="mt-2 text-customgreys-dirtyGrey"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
};
