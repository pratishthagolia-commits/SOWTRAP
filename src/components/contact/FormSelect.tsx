import Dropdown from "@/components/Dropdown";

export default function FormSelect({
  id,
  name,
  options,
  required,
  placeholder = "Select an option",
}: {
  id?: string;
  name: string;
  options: string[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <Dropdown
      id={id}
      name={name}
      options={options.map((o) => ({ value: o, label: o }))}
      required={required}
      placeholder={placeholder}
    />
  );
}
