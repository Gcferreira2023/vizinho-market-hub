
import { z } from "zod";

// Defining separate schemas for each step to avoid the refine/pick issue
export const step1Schema = z.object({
  fullName: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  email: z.string()
    .email("Email com formato inválido"),
  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/\d/, "Senha deve incluir pelo menos 1 número")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Senha deve incluir pelo menos 1 caractere especial"),
  confirmPassword: z.string()
});

// Add the refine check to step1Schema separately
export const step1SchemaWithValidation = step1Schema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  }
);

// Define step 2 schema separately with location added
export const step2Schema = z.object({
  apartment: z.string()
    .min(1, "Número do apartamento é obrigatório")
    .regex(/^\d+$/, "Apartamento deve ser um número"),
  block: z.string()
    .min(1, "Bloco/Torre é obrigatório"),
  phone: z.string()
    .min(14, "Telefone incompleto"),
  stateId: z.string()
    .min(1, "Selecione um estado"),
  cityId: z.string()
    .min(1, "Selecione uma cidade"),
  condominiumId: z.string()
    .min(1, "Selecione um condomínio"),
  terms: z.boolean()
    .refine(value => value === true, {
      message: "Você precisa concordar com os Termos de Uso e Política de Privacidade",
    })
});

// We can still define the full schema for type inference if needed
export const registerSchema = step1Schema.merge(step2Schema).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  }
);

export type RegisterFormData = z.infer<typeof registerSchema>;
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
