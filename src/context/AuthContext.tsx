import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🧩 Tipos principais
interface UserData {
  dados?: {
    nome?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  loading: boolean;
  login: (
    usuario: string,
    senha: string,
    tipo: string
  ) => Promise<{ success: boolean; user?: UserData; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// 🧱 Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL =
    process.env.EXPO_PUBLIC_API_URL || 'https://gerenciadordepedidos.onrender.com';

  // ✅ Recuperar usuário/token salvos
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        const savedUser = await AsyncStorage.getItem('user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados do AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredData();
  }, []);

  // ✅ Função de login
  const login = async (
    usuario: string,
    senha: string,
    tipo: string
  ): Promise<{ success: boolean; user?: UserData; error?: string }> => {
    try {
      console.log('🔐 Fazendo login:', { tipo, usuario });

      const url =
        tipo === 'funcionario'
          ? `${API_URL}/auth/funcionario`
          : `${API_URL}/auth/restaurante`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Login bem-sucedido:', data.user?.dados?.nome);

        setUser(data.user);
        setToken(data.token);

        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        return { success: true, user: data.user };
      } else {
        console.error('❌ Erro no login:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Erro na requisição:', error);
      return { success: false, error: 'Erro de conexão com o servidor' };
    }
  };

  // ✅ Função de logout
  const logout = async (): Promise<void> => {
    console.log('🚪 Fazendo logout...');
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
    }
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 🔓 Hook de acesso ao contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
