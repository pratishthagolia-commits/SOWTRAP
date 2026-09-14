import Dropdown from "@/components/Dropdown";
import { COUNTRY_CODES } from "./countryCodes";

// country-code (with flag) dropdown paired with the phone number field —
// India is the default since SowTrap/ScienceOnWheels is India-based.
export default function PhoneInput({
  id,
  name,
  required,
}: {
  id: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div className="phone-input">
      <div className="phone-input-code">
        <Dropdown
          name={`${name}Code`}
          defaultValue="India"
          listWidth={320}
          options={COUNTRY_CODES.map((c) => ({
            value: c.name,
            label: `${c.flag} ${c.name} (${c.code})`,
            shortLabel: `${c.flag} ${c.code}`,
          }))}
        />
      </div>
      <input id={id} name={name} type="tel" className="phone-input-number" required={required} />
    </div>
  );
}
