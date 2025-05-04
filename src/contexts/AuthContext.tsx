
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null; data: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any | null; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any | null; data: any }>;
  updateProfile: (userData: any) => Promise<{ error: any | null; data: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Configura o listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setLoading(false);
    });

    // Verifica se já existe uma sessão ativa
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Got existing session:", currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Tentando login com:", email);
      const result = await supabase.auth.signInWithPassword({ email, password });
      
      if (result.error) {
        console.error("Erro no login:", result.error.message);
      } else {
        console.log("Login bem-sucedido:", result.data.user?.email);
      }
      
      return result;
    } catch (error) {
      console.error("Erro inesperado no login:", error);
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log("Tentando cadastro com:", email, userData);
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            apartment: userData.apartment,
            block: userData.block,
            phone: userData.phone,
          },
        },
      });
      
      if (result.error) {
        console.error("Erro no cadastro:", result.error.message);
      } else {
        console.log("Cadastro bem-sucedido:", result.data.user?.email);
        // Notificação atualizada para informar sobre a confirmação de email
        toast({
          title: "Conta criada com sucesso",
          description: "Verifique seu email para confirmar o cadastro antes de fazer login.",
        });
      }
      
      return result;
    } catch (error) {
      console.error("Erro inesperado no cadastro:", error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      console.log("Logout realizado");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log("Solicitando redefinição de senha para:", email);
      const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/atualizar-senha`,
      });
      
      if (result.error) {
        console.error("Erro ao solicitar redefinição de senha:", result.error.message);
      } else {
        console.log("Solicitação de redefinição de senha enviada");
      }
      
      return result;
    } catch (error) {
      console.error("Erro inesperado ao solicitar redefinição de senha:", error);
      return { error, data: null };
    }
  };

  const updateProfile = async (userData: any) => {
    if (!user) {
      return { error: new Error("Usuário não autenticado"), data: null };
    }
    
    try {
      console.log("Atualizando perfil para:", user.email, userData);
      // Atualiza os metadados do usuário
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: userData.fullName,
          apartment: userData.apartment,
          block: userData.block,
          phone: userData.phone,
        }
      });

      if (updateError) {
        console.error("Erro ao atualizar perfil:", updateError.message);
        return { error: updateError, data: null };
      }
      
      console.log("Perfil atualizado com sucesso");
      return { error: null, data: { success: true } };
    } catch (error) {
      console.error("Erro inesperado ao atualizar perfil:", error);
      return { error, data: null };
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
