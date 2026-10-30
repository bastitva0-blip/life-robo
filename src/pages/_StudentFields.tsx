import { DEPARTMENTS, STUDY_YEARS } from "@shared/types";
import { cx } from "@/lib/format";
import type { StudentErrors, StudentField, StudentValues } from "@/lib/student";

// Each input's `name` matches its key so forms can focus the first error.

export function StudentFields({
  uid,
  values,
  errors,
  onChange,
  disabled,
  inputCls,
}: {
  uid: string;
  values: StudentValues;
  errors: StudentErrors;
  onChange: (field: StudentField, value: string) => void;
  disabled?: boolean;
  inputCls: string;
}) {
  const id = (f: StudentField) => `${uid}-${f}`;
  const props = (f: StudentField) => ({
    id: id(f),
    name: f,
    value: values[f],
    disabled,
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `${id(f)}-error` : undefined,
    className: cx(inputCls, errors[f] ? "border-danger" : "border-line-strong"),
  });
  const label = (f: StudentField, text: string) => (
    <label htmlFor={id(f)} className="mb-2 block text-[15px] font-medium text-fg">
      {text}
    </label>
  );
  const err = (f: StudentField) =>
    errors[f] ? (
      <p id={`${id(f)}-error`} className="mt-2 text-[14px] text-danger">
        {errors[f]}
      </p>
    ) : null;

  return (
    <>
      <div>
        {label("rollNo", "Roll / enrolment no.")}
        <input type="text" autoComplete="off" maxLength={40} {...props("rollNo")} onChange={(e) => onChange("rollNo", e.target.value)} />
        {err("rollNo")}
      </div>
      <div>
        {label("phone", "WhatsApp number")}
        <input type="tel" autoComplete="tel" inputMode="tel" maxLength={20} placeholder="+91 98765 43210" {...props("phone")} onChange={(e) => onChange("phone", e.target.value)} />
        {err("phone")}
      </div>
      <div>
        {label("department", "Department")}
        <select {...props("department")} className={cx(props("department").className, "appearance-auto")} onChange={(e) => onChange("department", e.target.value)}>
          <option value="" disabled>
            Select department
          </option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {err("department")}
      </div>
      <div>
        {label("year", "Year of study")}
        <select {...props("year")} className={cx(props("year").className, "appearance-auto")} onChange={(e) => onChange("year", e.target.value)}>
          <option value="" disabled>
            Select year
          </option>
          {STUDY_YEARS.map((y) => (
            <option key={y} value={String(y)}>
              {y}
              {["st", "nd", "rd", "th", "th"][y - 1]} year
            </option>
          ))}
        </select>
        {err("year")}
      </div>
      {values.department === "Other" && (
        <div className="sm:col-span-2">
          {label("departmentOther", "Your department / course")}
          <input type="text" maxLength={70} placeholder="e.g. B.Sc Physics" {...props("departmentOther")} onChange={(e) => onChange("departmentOther", e.target.value)} />
          {err("departmentOther")}
        </div>
      )}
    </>
  );
}
