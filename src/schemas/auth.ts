// import { z } from "zod";

// export const loginSchema = z.object({
//   email: z
//     .string()
//     .trim()
//     .min(3, "Email must be at least 3 characters")
//     .email("Invalid email address")
//     .max(255, "Email must be less than 255 characters"),
//   password: z
//     .string()
//     .min(1, "Password is required"),
// });

// export type LoginFormValues = z.infer<typeof loginSchema>;

// export const registerSchema = z
//   .object({
//     email: z
//       .string()
//       .trim()
//       .min(3, "Email must be at least 3 characters")
//       .email("Invalid email address")
//       .max(255, "Email must be less than 255 characters"),
//     password: z
//       .string()
//       .min(8, "Password must be at least 8 characters")
//       .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//       .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//       .regex(/[0-9]/, "Password must contain at least one number"),
//     passwordConfirmation: z.string(),
//   })
//   .refine((data) => data.password === data.passwordConfirmation, {
//     message: "Passwords do not match",
//     path: ["passwordConfirmation"],
//   });

// export type RegisterFormValues = z.infer<typeof registerSchema>;

// export const passwordResetRequestSchema = z.object({
//   email: z
//     .string()
//     .trim()
//     .min(3, "Email must be at least 3 characters")
//     .email("Invalid email address"),
// });

// export type PasswordResetRequestValues = z.infer<typeof passwordResetRequestSchema>;

// export const resetPasswordSchema = z
//   .object({
//     password: z
//       .string()
//       .min(8, "Password must be at least 8 characters")
//       .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//       .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//       .regex(/[0-9]/, "Password must contain at least one number"),
//     passwordConfirmation: z.string(),
//   })
//   .refine((data) => data.password === data.passwordConfirmation, {
//     message: "Passwords do not match",
//     path: ["passwordConfirmation"],
//   });

// export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
