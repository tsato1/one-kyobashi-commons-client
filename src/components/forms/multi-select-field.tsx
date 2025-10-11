/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface MultiSelectFieldProps {
  name: string;
  control: any;
  items: { value: string, label: string }[];
  disabled?: boolean;
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  name,
  control,
  items,
  disabled,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="space-y-1">
          {items.map((item, index) => (
            <FormControl key={`${name}-${item.value}-${index}`}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${name}-${item.value}`}
                  checked={field.value?.includes(item.value) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(field.value) ? field.value : [];
                    const newValues = checked
                      ? [...currentValues, item.value]
                      : currentValues.filter((value: string) => value !== item.value)
                    field.onChange(newValues.sort());
                  }}
                  disabled={disabled} />
                <FormLabel htmlFor={`${name}-${item.value}`}>
                  {item.label}
                </FormLabel>
              </div>
            </FormControl>
          ))}
        </div>
      )} />
  );
};
