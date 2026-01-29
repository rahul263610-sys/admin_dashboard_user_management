"use client";

interface FormTextareaProps {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function FormTextarea({
  label,
  value,
  placeholder,
  required,
  onChange,
}: FormTextareaProps) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
