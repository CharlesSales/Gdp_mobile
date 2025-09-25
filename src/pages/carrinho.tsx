import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useCarrinho } from '../context/CarrinhoContext';
import { useNavigation } from '@react-navigation/native'; // Navegação

type ProdutoComQuantidade = {
  id_produto: number;
  nome: string;
  preco: number | string;
  quantidade: number;
};

export default function Carrinho() {
  const { carrinho, handleAdd, handleRemove, produtos } = useCarrinho();
  const navigation = useNavigation();

  // Adicione esta verificação logo após os hooks
  if (!produtos || produtos.length === 0) {
    return (
      <View style={styles.vazio}>
        <Text style={{ fontSize: 80 }}>🛒</Text>
        <Text style={{ fontSize: 24 }}>Carregando produtos...</Text>
      </View>
    );
  }
  // Lista de produtos no carrinho
  const produtosNoCarrinho: ProdutoComQuantidade[] = Object.keys(carrinho)
  .map(id => {
    // id é string, id_produto é number
    const produto = produtos.find(p => String(p.id_produto) === id);
    if (!produto) {
      console.warn(`Produto não encontrado para ID ${id}`);
      return null;
    }
    return { ...produto, quantidade: carrinho[Number(id)] };
  })
  .filter((p): p is ProdutoComQuantidade => p !== null);


  // Total do pedido
  const totalPedido = produtosNoCarrinho.reduce(
    (total, item) => total + Number(item.preco) * item.quantidade,
    0
  );

  if (produtosNoCarrinho.length === 0) {
    return (
      <View style={styles.vazio}>
        <Text style={{ fontSize: 80 }}>🛒</Text>
        <Text style={{ fontSize: 24 }}>Carrinho vazio</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={produtosNoCarrinho}
        keyExtractor={(item, index) => item?.id_produto?.toString() ?? `tmp-${index}`}
        renderItem={({ item }) => {
          if (!item) return null;
          return (
            <View style={styles.itemContainer}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.preco}>R$ {Number(item.preco).toFixed(2)}</Text>
              <View style={styles.controles}>
                <TouchableOpacity
                  onPress={() => handleRemove(item)}
                  style={[styles.botao, { backgroundColor: '#dc3545' }]}
                >
                  <Text style={styles.botaoTexto}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantidade}>{item.quantidade}</Text>
                <TouchableOpacity
                  onPress={() => handleAdd(item)}
                  style={[styles.botao, { backgroundColor: '#28a745' }]}
                >
                  <Text style={styles.botaoTexto}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />


      <View style={styles.total}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          Total: R$ {totalPedido.toFixed(2)}
        </Text>
      </View>

      {/* Botão para Confirmar Pedido */}
      <TouchableOpacity
        style={styles.confirmarBotao}
        onPress={() => navigation.navigate('Confirmacao')} // nome da tela de confirmação
      >
        <Text style={styles.botaoTexto}>📝 Confirmar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  itemContainer: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  nome: { fontSize: 16, fontWeight: 'bold' },
  preco: { fontSize: 14, marginVertical: 5 },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 120,
    marginTop: 5,
  },
  botao: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  quantidade: { fontSize: 16, marginHorizontal: 10 },
  total: { padding: 10, alignItems: 'center', borderTopWidth: 1, borderColor: '#ccc', marginTop: 10 },
  vazio: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  confirmarBotao: {
    marginTop: 15,
    backgroundColor: '#2d6a4f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
