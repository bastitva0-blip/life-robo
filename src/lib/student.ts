// Roll number, department, year of study and WhatsApp number: asked on the join form and on event registration.

export interface StudentValues {
  rollNo: string;
  department: string;
  departmentOther: string;
  phone: string; // WhatsApp
  year: string;
}

export type StudentField = keyof StudentValues;
export type StudentErrors = Partial<Record<StudentField, string>>;

export const STUDENT_FIELDS: StudentField[] = ["rollNo", "department", "departmentOther", "phone", "year"];
export const EMPTY_STUDENT: StudentValues = { rollNo: "", department: "", departmentOther: "", phone: "", year: "" };

export function validateStudent(v: StudentValues): StudentErrors {
  const e: StudentErrors = {};
  if (!v.rollNo.trim()) e.rollNo = "Please enter your roll / enrolment number.";
  else if (v.rollNo.trim().length > 40) e.rollNo = "That looks too long.";
  if (!v.department) e.department = "Please pick your department.";
  else if (v.department === "Other" && !v.departmentOther.trim()) e.departmentOther = "Please write your department or course.";
  const digits = v.phone.replace(/\D/g, "");
  if (!v.phone.trim()) e.phone = "Please enter your WhatsApp number.";
  else if (!/^[0-9+\-\s()]*$/.test(v.phone) || digits.length < 10 || v.phone.trim().length > 20) e.phone = "Enter a valid WhatsApp number.";
  if (!v.year) e.year = "Please pick your year of study.";
  return e;
}

/** Body fields for the API. "Other" is sent as "Other: <what they typed>". */
export function studentPayload(v: StudentValues) {
  return {
    rollNo: v.rollNo.trim(),
    department: v.department === "Other" ? `Other: ${v.departmentOther.trim()}`.slice(0, 80) : v.department,
    phone: v.phone.trim(),
    year: Number(v.year),
  };
}

