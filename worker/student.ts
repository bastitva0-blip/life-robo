import { z } from "zod";

// Fields the join form and event registration both ask for.

export const whatsapp = z
  .string()
  .trim()
  .regex(/^[0-9+\-\s()]{10,20}$/, "Enter a valid WhatsApp number");

export const studentFields = {
  phone: whatsapp,
  rollNo: z.string().trim().min(1, "Please enter your roll / enrolment number").max(40),
  department: z.string().trim().min(1, "Please pick your department").max(80),
  year: z.number().int().min(1, "Please pick your year").max(5),
};
