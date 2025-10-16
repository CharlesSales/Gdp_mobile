import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function AdminPage() {
  const { user, loading, logout  } = useAuth();
  const navigation = useNavigation<any>();
  const [isHydrated, setIsHydrated] = useState(false);

  const handleLogout = () => {
    logout(); // ✅ Função já implementada no AuthContext
    navigation.navigate('Login');
  };

  // ✅ Garantir hidratação
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // ✅ Redirecionar caso não autenticado
  useEffect(() => {
    if (isHydrated && !loading && !user) {
      navigation.navigate('Login');
    }
  }, [isHydrated, loading, user]);

  if (!isHydrated || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!user) return null;

  // ✅ Verificação de permissão
  if (!user.isAdmin && user.tipo !== 'restaurante') {
    return (
      <View style={styles.centered}>
        <Text style={styles.deniedIcon}>🚫</Text>
        <Text style={styles.deniedTitle}>Acesso Negado</Text>
        <Text style={styles.deniedText}>
          Você não tem permissão para acessar esta área.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('FuncionarioDashboard')}
        >
          <Text style={styles.backButtonText}>Voltar ao Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ Dashboard Administrativo
  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏪 Dashboard Administrativo</Text>
        <Text style={styles.headerSubtitle}>
          Olá,{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {user.dados?.nome || user.dados?.nome_restaurante}
          </Text>
          !
        </Text>
      </View>

      {/* MENU DE OPÇÕES */}
      <View style={styles.menuGrid}>
        {/* <MenuCard
          icon="📦"
          title="Gestão de Produtos"
          description="Gerenciar produtos do restaurante"
          onPress={() => navigation.navigate('GestaoProdutos')}
        /> */}
        <MenuCard
          icon="📋"
          title="Gerenciar Pedidos"
          description="Visualizar e atualizar status dos pedidos"
          onPress={() => navigation.navigate('PedidosGeral')}
        />
        {/* <MenuCard
          icon="👥"
          title="Funcionários"
          description="Gerenciar equipe e permissões"
          onPress={() => navigation.navigate('GestaoFuncionarios')}
        /> */}
        <MenuCard
          icon="📊"
          title="Relatórios"
          description="Análises de vendas e performance"
          onPress={() => navigation.navigate('Relatorios')}
        />
          <MenuCard
            icon="🍽️"
            title="Cardápio"
            description="Visualizar produtos públicos"
            onPress={() => navigation.navigate('Produtos')}
          />
        <MenuCard
          icon="⚙️"
          title="Configurações"
          description="Ajustes do sistema e restaurante"
          onPress={() => navigation.navigate('Configuracoes')}
        />
      </View>

      {/* INFORMAÇÕES DO USUÁRIO */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Informações da Sessão</Text>
        <Text style={styles.infoTitle}>ℹ Para gerenciar produtos e equipe acesse pelo PC</Text>

        <View style={styles.infoGrid}>
          <InfoItem
            label="Tipo de Usuário:"
            value={
              user.tipo === 'restaurante'
                ? '👑 Dono do Restaurante'
                : '👨‍💼 Funcionário Admin'
            }
          />
          <InfoItem
            label="Nome:"
            value={user.dados?.nome || user.dados?.nome_restaurante}
          />
          {user.dados?.cargo && (
            <InfoItem label="Cargo:" value={user.dados.cargo} />
          )}
          <InfoItem
            label="Restaurante:"
            value={user.dados?.restaurante?.nome_restaurante || 'N/A'}
          />
        </View>
      </View>
    </ScrollView>
  );
}

// ✅ Componente de cartão de menu
function MenuCard({
  icon,
  title,
  description,
  onPress,
}: {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuCard} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

// ✅ Componente de item de informação
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>{label}</Text>
      <Text style={{ color: '#666' }}>{value}</Text>
    </View>
  );
}

// ✅ Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  deniedIcon: {
    fontSize: 48,
  },
  deniedTitle: {
    fontSize: 22,
    color: '#dc3545',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  deniedText: {
    color: '#666',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    color: '#333',
  },
  headerSubtitle: {
    color: '#666',
    marginTop: 5,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '48%',
    marginBottom: 15,
    elevation: 2,
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 42,
    marginBottom: 10,
  },
  menuTitle: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  menuDescription: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    elevation: 2,
  },
  infoTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
