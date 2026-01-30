"use client";

interface FormInputProps {
  label?: string;
  name?: string
  type?: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  label="",
  name="",
  type = "text",
  value,
  placeholder,
  required,
  onChange,
  className="",
}: FormInputProps) {
  return (
    <div className="form-group">
      <label>{label ? label: ""}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={className}
      />
    </div>
  );
}
