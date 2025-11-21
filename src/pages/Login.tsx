import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

interface FormData {
  usuario: string;
  senha: string;
  cpf: string;
}

export default function LoginScreen() {
  const [formData, setFormData] = useState<FormData>({
    usuario: '',
    senha: '',
    cpf: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'usuario' | 'cpf'>('usuario');
  const [verSenha, setVerSenha] = useState(false); // 👁️ Estado para ver senha

  const { login, user } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (user) {
      console.log('👤 Usuário encontrado:', user);
      redirectUser(user);
    }
  }, [user]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const redirectUser = (userData: any) => {
    console.log('🔄 Redirecionando com base no tipo:', userData.tipo);
    setIsLoading(false);

    if (userData.tipo === 'cliente') {
      navigation.navigate('Cardapio');
    } else if (userData.tipo === 'restaurante' || userData.isAdmin) {
      navigation.navigate('Admin');
    } else if (userData.tipo === 'funcionario') {
      navigation.navigate('Funcionario');
    } else {
      Alert.alert('Erro', 'Tipo de usuário não reconhecido.');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (loginMode === 'usuario') {
        if (!formData.usuario || !formData.senha) {
          setError('Usuário e senha são obrigatórios');
          return;
        }

        console.log('Tentando login de funcionário/restaurante:', formData.usuario);
        let result = await login(formData.usuario, formData.senha, 'funcionario');

        if (!result.success) {
          console.log('Tentando como restaurante...');
          result = await login(formData.usuario, formData.senha, 'restaurante');
        }

        if (!result.success) {
          setError(result.error || 'Usuário ou senha inválidos');
        }
      } else {
        setError('Login de cliente ainda não implementado');
      }
    } catch (err) {
      console.error('❌ Erro no login:', err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCadastro = () => {
    navigation.navigate('CadastroRestaurante');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>🖥️</Text>
        <Text style={styles.title}>Sales Manager</Text>
        <Text style={styles.subtitle}>Sistema de Pedidos</Text>

        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              loginMode === 'usuario' && styles.activeButton,
            ]}
            onPress={() => {
              setLoginMode('usuario');
              setFormData({ usuario: '', senha: '', cpf: '' });
              setError('');
            }}
          >
            <Text
              style={[
                styles.switchText,
                loginMode === 'usuario' && styles.activeText,
              ]}
            >
              👨‍💼 Funcionário/Dono
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchButton,
              loginMode === 'cpf' && styles.activeButton,
            ]}
            onPress={() => {
              setLoginMode('cpf');
              setFormData({ usuario: '', senha: '', cpf: '' });
              setError('');
            }}
          >
            <Text
              style={[
                styles.switchText,
                loginMode === 'cpf' && styles.activeText,
              ]}
            >
              👤 Cliente
            </Text>
          </TouchableOpacity>
        </View>

        {loginMode === 'usuario' ? (
          <TextInput
            style={styles.input}
            placeholder="Usuário"
            value={formData.usuario}
            onChangeText={text => handleInputChange('usuario', text)}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="CPF (somente números)"
            value={formData.cpf}
            keyboardType="numeric"
            maxLength={11}
            onChangeText={text => handleInputChange('cpf', text)}
          />
        )}

        {/* Campo de senha com botão de ver senha */}
        <View style={styles.senhaContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Senha"
            secureTextEntry={!verSenha}
            value={formData.senha}
            onChangeText={text => handleInputChange('senha', text)}
          />
          <TouchableOpacity
            style={styles.verSenhaBtn}
            onPress={() => setVerSenha(v => !v)}
          >
            <Text style={styles.verSenhaText}>{verSenha ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>🚀 Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleCadastro}>
          <Text style={styles.secondaryText}>📝 Cadastrar Restaurante</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    alignItems: 'center',
  },
  logo: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#dc3545' },
  subtitle: { color: '#6c757d', marginBottom: 24 },
  switchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  activeButton: { backgroundColor: '#dc3545' },
  switchText: {
    textAlign: 'center',
    color: '#6c757d',
    fontWeight: '600',
  },
  activeText: { color: '#fff' },
  input: {
    width: '100%',
    borderColor: '#e9ecef',
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  verSenhaBtn: {
    padding: 8,
    marginLeft: 4,
  },
  verSenhaText: {
    fontSize: 20,
  },
  errorText: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: 8,
    borderRadius: 6,
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    width: '100%',
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#6c757d' },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 16,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
  },
  secondaryText: {
    color: '#6c757d',
    fontWeight: '600',
  },
});