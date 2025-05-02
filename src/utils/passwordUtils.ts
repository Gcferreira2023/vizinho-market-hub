
export type PasswordStrength = "fraca" | "média" | "forte";

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return "fraca";
  
  // Verifica critérios de força
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  
  // Calcula pontuação
  let score = 0;
  if (hasMinLength) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;
  if (hasUppercase) score++;
  
  // Determina a força baseada na pontuação
  if (score <= 1) return "fraca";
  if (score <= 3) return "média";
  return "forte";
};

export const getPasswordStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case "fraca": return "bg-red-500";
    case "média": return "bg-yellow-500";
    case "forte": return "bg-green-500";
    default: return "bg-gray-300";
  }
};
