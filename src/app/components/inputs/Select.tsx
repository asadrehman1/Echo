"use client";
import ReactSelect from "react-select";
interface SelectProps {
  options: Record<string, unknown>[];
  value?: Record<string, unknown>;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: Record<string, any>) => void;
  disabled?: boolean;
}
const Select = ({ options, value, label, onChange, disabled }: SelectProps) => {
  return (
    <div className="z-[100]">
      <label className="block text-sm font-medium text-gray-900 leading-6">
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          classNames={{
            control: () => "text-sm",
          }}
        />
      </div>
    </div>
  );
};

export default Select;
