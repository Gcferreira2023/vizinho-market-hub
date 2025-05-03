
import { useAuth } from "@/contexts/AuthContext";

const CallToActionDescription = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
      {isLoggedIn 
        ? "Comece a anunciar seus produtos e serviços para os moradores do seu condomínio."
        : "Cadastre-se agora e comece a anunciar seus produtos e serviços para os moradores do seu condomínio."
      }
    </p>
  );
};

export default CallToActionDescription;
