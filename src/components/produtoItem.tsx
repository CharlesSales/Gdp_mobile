// components/produtoItem.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useCarrinho } from '../context/CarrinhoContext';

type Produto = {
  id_produto: number | string;
  nome: string;
  preco: string | number;
  imagem: string;
  quantidade?: number;
};

type Props = {
  produto: Produto;
  adicionarAoCarrinho: (produto: Produto) => void;
  removeDoCarrinho: (produto: Produto) => void;
};

export default function ProdutoItem({ produto, adicionarAoCarrinho, removeDoCarrinho }: Props) {
  const { carrinho } = useCarrinho();
  const estaNoCarrinho = carrinho[Number(produto.id_produto)] > 0;

  return (
    <View style={styles.container}>
      <Image source={{ uri: produto.imagem }} style={styles.imagem} />
      <Text style={styles.nome}>{produto.nome}</Text>
      <Text style={styles.preco}>R$ {Number(produto.preco).toFixed(2)}</Text>

      <TouchableOpacity
        onPress={() => (estaNoCarrinho ? removeDoCarrinho(produto) : adicionarAoCarrinho(produto))}
        style={[styles.botao, { backgroundColor: estaNoCarrinho ? '#dc3545' : '#28a745' }]}
      >
        <Text style={styles.botaoTexto}>{estaNoCarrinho ? 'Remover' : 'Adicionar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imagem: { width: 120, height: 120, borderRadius: 8, marginBottom: 6 },
  nome: { fontSize: 16, fontWeight: 'bold' },
  preco: { fontSize: 14, color: '#333', marginBottom: 6 },
  botao: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4 },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});

