import { localGovernmentAreas } from "@/assets/data/lga";
import { statesData } from "@/assets/data/statesdata";
import { z } from "zod";

const stateNames = statesData.map((stateObj) => stateObj.state.name);

export const bioDataSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name must be at least 3 characters long")
    .regex(/^[A-Za-z]+$/, "First name must contain only letters"),
  lastName: z
    .string()
    .min(3, "Last name must be at least 3 characters long")
    .regex(/^[A-Za-z]+$/, "Last name must contain only letters"),
otherNames: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 3 && /^[A-Za-z]*$/.test(val)), {
      message:
        "Other names must be at least 3 characters long and contain only letters",
    }),
  
  dateOfBirth: z.string().refine((value) => {
    const today = new Date();
    const birthDate = new Date(value);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18;
  }, "Must be at least 18 years old"),

  stateOfOrigin: z
    .string()
    .nonempty("State of origin is required")
    .refine((value) => stateNames.includes(value), {
      message: "Invalid state of origin",
    }),

  lga: z.string().nonempty("Local government area is required"),
  ward: z.string().nonempty("Ward is required"),

  address: z
    .string()
    .nonempty("Address is required")
    .min(5, "Address is too short")
    .max(100, "Address is too long")
    .regex(/^[a-zA-Z0-9\s,.'-]+$/, "Invalid address format")
    .regex(/[a-zA-Z]/, "Address must include letters")
    .regex(/^(?!.*\s{2,}).*$/, "Address cannot have consecutive spaces"),

  contact: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^((\+234|234|0)[789][01]\d{8})$/, "Invalid phone number"),

  passportPhoto: z
    .string()
    .nonempty("Passport photo is required")
    .regex(/^data:image\/(jpeg|png|gif);base64,/, "Invalid image format"),

  // votersCard: z.string().nonempty("Voter's card number is required").max(20, "Voters card ID not more than 20"),
   votersCard: z
   .string()
   .nonempty("Voter's card is required")
   .max(23, "Voter's card must not exceed 19 characters")
   .regex(/^[A-Za-z0-9-]+$/, "Voter's card format is invalid")
   .refine((value) => {
     const cleanValue = value.replace(/-/g, ""); 
     return cleanValue.length === 19; 
   }, {
     message: "Voter's card number must be exactly 19 characters",
   }),

  nin: z
    .string()
    .optional()
    .refine((val) => !val || (/^\d{11}$/.test(val) && val.length === 11), {
      message: "NIN must be exactly 11 digits and contain only digits",
    }),

  email: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === "" ||
        z.string().email().safeParse(val).success,
      {
        message: "Invalid email format",
      }
    ),
  gender: z.string().nonempty("Gender is required"),

  selectedSkillCategory: z
    .string()
    .optional(),

  selectedSkill: z
    .string()
    .optional(),

  meansOfIdentification: z
    .string()
    .nonempty("Means of identification is required"),

  IdCardPhoto: z
    .string()
    .nonempty("ID Card photo is required")
    .regex(/^data:image\/(jpeg|png|gif);base64,/, "Invalid image format"),
});
