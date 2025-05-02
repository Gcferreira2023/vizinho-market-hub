
import { PasswordStrength, getPasswordStrengthColor } from "@/utils/passwordUtils";

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
}

const PasswordStrengthIndicator = ({ strength }: PasswordStrengthIndicatorProps) => {
  const color = getPasswordStrengthColor(strength);
  
  return (
    <div className="mt-1 mb-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} rounded-full transition-all duration-300`}
            style={{ 
              width: strength === "fraca" ? "33%" : strength === "média" ? "66%" : "100%" 
            }}
          />
        </div>
        <span className="text-xs font-medium capitalize text-gray-600">
          {strength}
        </span>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
