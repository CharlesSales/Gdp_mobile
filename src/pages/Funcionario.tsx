import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

interface UserDados {
  nome?: string;
  nome_restaurante?: string;
}

interface User {
  tipo?: string;
  isAdmin?: boolean;
  dados?: UserDados;
}

export default function FuncionarioPage() {
  const { user, logout, loading } = useAuth() as {
    user: User | null;
    logout: () => void;
    loading: boolean;
  };
  const navigation = useNavigation();

  // Redirecionamento se não for funcionário ou admin
  useEffect(() => {
    if (user && user.tipo !== 'funcionario' && !user.isAdmin) {
      navigation.navigate('Login'); // ajuste para o nome da sua rota de login
    }
  }, [user, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏪 Dashboard Funcionarios</Text>
        <Text style={styles.headerSubtitle}>
          Olá, <Text style={{ fontWeight: 'bold' }}>{user.dados?.nome || user.dados?.nome_restaurante}</Text>!
        </Text>
      </View>

      {/* CARDS */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Produtos')}
        >
          <Text style={styles.cardEmoji}>🍽️</Text>
          <Text style={styles.cardTitle}>Produtos</Text>
          <Text style={styles.cardSubtitle}>Gerenciar cardápio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('View')}
        >
          <Text style={styles.cardEmoji}>📋</Text>
          <Text style={styles.cardTitle}>Pedidos</Text>
          <Text style={styles.cardSubtitle}>Visualizar pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('pedidos_geral')} // ou rota de configurações
        >
          <Text style={styles.cardEmoji}>⚙️</Text>
          <Text style={styles.cardTitle}>Configurações</Text>
          <Text style={styles.cardSubtitle}>Ajustes do sistema e restaurante</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    color: '#333',
  },
  headerSubtitle: {
    marginTop: 8,
    color: '#666',
    fontSize: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});
