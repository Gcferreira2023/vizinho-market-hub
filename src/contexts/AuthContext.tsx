import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";

// Verificação explícita das variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log de diagnóstico (remover em produção)
console.log('VITE_SUPABASE_URL disponível:', !!supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY disponível:', !!supabaseAnonKey);

// Inicialização condicional do cliente
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Verificação explícita da inicialização
if (!supabase) {
  console.error('⚠️ Cliente Supabase não inicializado! Verifique as variáveis de ambiente.');
}

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
    // Display warning if Supabase is not configured
    if (!supabase) {
      setLoading(false);
      toast({
        title: "Configuração Incompleta",
        description: "As variáveis de ambiente do Supabase não estão configuradas. A autenticação e recursos relacionados não funcionarão. Acesse as configurações do projeto para adicionar VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
        variant: "destructive",
        duration: 10000,
      });
      return;
    }

    // Configura o listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setLoading(false);
    });

    // Verifica se já existe uma sessão ativa
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error("Supabase não está configurado"), data: null };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, userData: any) => {
    if (!supabase) {
      return { error: new Error("Supabase não está configurado"), data: null };
    }
    return await supabase.auth.signUp({
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
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: new Error("Supabase não está configurado"), data: null };
    }
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/atualizar-senha`,
    });
  };

  const updateProfile = async (userData: any) => {
    if (!supabase || !user) {
      return { error: new Error("Usuário não autenticado ou Supabase não configurado"), data: null };
    }
    
    // Atualiza os metadados do usuário
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: userData.fullName,
        apartment: userData.apartment,
        block: userData.block,
        phone: userData.phone,
      }
    });

    if (updateError) return { error: updateError, data: null };
    
    return { error: null, data: { success: true } };
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
