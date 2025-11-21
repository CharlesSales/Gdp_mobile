import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={styles.page}>
      <View style={styles.main}>
        <Text style={styles.title}>Bem-vindo ao Restaurante!</Text>
        <Text style={styles.subtitle}>Escolha uma opção para começar:</Text>

        <View style={styles.ctas}>
          <TouchableOpacity
            style={styles.primary}
            onPress={() => navigation.navigate('Produtos')}
          >
            <Text style={styles.primaryText}>FAZER PEDIDO</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.primary}
            onPress={() => navigation.navigate('View')}
          >
            <Text style={styles.primaryText}>ACOMPANHAR PEDIDOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Sales Manager</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff', justifyContent: 'space-between' },
  main: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 30 },
  ctas: { 
    flexDirection: 'column',
    gap: 16,
    width: '60%',
  },
  primary: {
    backgroundColor: '#2d6a4f',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footer: { alignItems: 'center', padding: 16, borderTopWidth: 1, borderColor: '#eee' },
  footerText: { color: '#888' },
});