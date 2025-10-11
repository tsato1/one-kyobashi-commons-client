
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { Locale, parseISO } from "date-fns";
import { Edit } from "lucide-react";
import { registerPlugin } from "filepond";
import { FilePond } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateAndTimePicker } from "./date-and-time-picker";
import { MultiInputField } from "./multi-input-field";
import { MultiSelectField } from "./multi-select-field";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

interface FormFieldProps {
  name: string;
  label: string;
  subLabel?: string;
  type?:
  | "text"
  | "email"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "switch"
  | "password"
  | "file"
  | "datetime"
  | "multi-input"
  | "multi-select";
  placeholder?: string;
  options?: { value: string; label: string }[];
  accept?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  buttonLabel?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  isIcon?: boolean;
  initialValue?: string | number | boolean | string[];
  locale?: Locale;
}

export const CustomFormField: React.FC<FormFieldProps> = ({
  name,
  label,
  subLabel,
  type = "text",
  placeholder,
  options,
  accept,
  className,
  inputClassName,
  labelClassName,
  buttonLabel,
  disabled = false,
  required = false,
  multiple = false,
  isIcon = false,
  initialValue,
  locale,
}) => {
  const { control } = useFormContext();

  const renderFormControl = (
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            {...field}
            rows={3}
            disabled={disabled}
            className={`border-gray-200 p-4 ${inputClassName}`} />
        );
      case "select":
        return (
          <Select
            value={field.value || (initialValue as string)}
            defaultValue={field.value || (initialValue as string)}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={`min-w-[160px] w-fit p-4 ${inputClassName}`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="w-full border-gray-200 shadow">
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={`cursor-pointer`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="flex items-center gap-3">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange} />
            <FormLabel htmlFor={name} className={labelClassName}>
              {label}
            </FormLabel>
          </div>
        )
      case "switch":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              id={name}
              className={`text-gray-500 ${inputClassName}`} />
            <FormLabel htmlFor={name} className={labelClassName}>
              {label}
            </FormLabel>
          </div>
        );
      case "file":
        return (
          <FilePond
            className={`${inputClassName}`}
            onupdatefiles={(fileItems) => {
              const files = fileItems.map((fileItem) => fileItem.file);
              field.onChange(files);
            }}
            allowMultiple={true}
            labelIdle={`Drag & Drop your images or <span class="filepond--label-action">Browse</span>`}
            credits={false} />
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder={placeholder}
            {...field}
            className={`border-gray-200 p-4 ${inputClassName}`}
            disabled={disabled} />
        );
      case "datetime":
        return (
          <DateAndTimePicker
            value={field.value ? parseISO(field.value) : undefined}
            onChange={(newDate) => field.onChange(newDate ? newDate.toISOString() : undefined)}
            name={name}
            control={control}
            placeholder={placeholder}
            locale={locale as Locale}
            required={required}
            disabled={disabled}
            className={`border-gray-200 ${inputClassName}`} />
        );
      case "multi-input":
        return (
          <MultiInputField
            name={name}
            control={control}
            placeholder={placeholder}
            inputClassName={inputClassName}
            buttonLabel={buttonLabel}
            disabled={disabled} />
        );
      case "multi-select":
        return (
          <MultiSelectField
            name={name}
            control={control}
            items={options || []}
            disabled={disabled} />
        );
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            className={`border-gray-200 p-4 ${inputClassName}`}
            disabled={disabled} />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={initialValue}
      render={({ field }) => (
        <FormItem
          className={`${type !== "switch" && "rounded-md"} relative ${className}`}
        >
          {(type !== "checkbox" && type !== "switch") && (
            <div className="flex justify-between items-center">
              <FormLabel className={labelClassName}>
                {label}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>

              {!disabled &&
                isIcon &&
                type !== "file" &&
                type !== "multi-input" && (
                  <Edit className="size-4 text-gray-500" />
                )}
            </div>
          )}
          <FormControl>
            {renderFormControl({
              ...field,
              value: field.value !== undefined ? field.value : initialValue,
            })}
          </FormControl>
          <p className="text-sm">{subLabel}</p>
          <FormMessage className="text-red-400" />
        </FormItem>
      )} />
  );
};
