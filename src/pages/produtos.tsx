// src/pages/produtos.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import ProdutoItem from "../components/produtoItem";
import { useCarrinho } from "../context/CarrinhoContext";
import { useNavigation } from "@react-navigation/native";



export default function Produtos() {
  const { produtos, handleAdd, handleRemove, carrinho } = useCarrinho();
  const navigation = useNavigation();
  const [filtro, setFiltro] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  // categorias únicas
  const categorias = [...new Set(produtos.map(p => p.categoria))];

  // produtos filtrados
  const produtosFiltrados = produtos.filter(produto => {
    const passaCategoria = categoriaSelecionada ? produto.categoria === categoriaSelecionada : true;
    const passaBusca = filtro ? produto.nome.toLowerCase().includes(filtro.toLowerCase()) : true;
    return passaCategoria && passaBusca;
  });

  // dividir produtos em duas linhas
  const terco = Math.ceil(produtosFiltrados.length / 3);
  const primeiraLinha = produtosFiltrados.slice(0, terco);
  const segundaLinha = produtosFiltrados.slice(terco, terco * 2);
  const terceiraLinha = produtosFiltrados.slice(terco * 2);
  const renderProduto = ({ item }: any) => (
    <ProdutoItem
      produto={{ ...item, quantidade: carrinho[item.id_produto] || 0 }}
      adicionarAoCarrinho={handleAdd}
      removeDoCarrinho={handleRemove}
    />
  );

  return (
    <View style={styles.container}>
      {/* Espaço antes da busca */}
      <View style={{ height: 40 }} />

      {/* Busca */}
      <TextInput
        placeholder="Buscar produto..."
        value={filtro}
        onChangeText={setFiltro}
        style={styles.inputBusca}
      />

      {/* Filtros */}
      <FlatList
        data={["Todos", ...categorias]}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, marginTop: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoriaBotao,
              categoriaSelecionada === item || (item === "Todos" && categoriaSelecionada === "")
                ? styles.categoriaSelecionada
                : {}
            ]}
            onPress={() => setCategoriaSelecionada(item === "Todos" ? "" : item)}
          >
            <Text style={[
              categoriaSelecionada === item || (item === "Todos" && categoriaSelecionada === "")
                ? styles.categoriaSelecionadaText
                : {}
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Primeira linha horizontal */}
      <Text style={styles.titulo}>Produtos</Text>
      <FlatList
        data={primeiraLinha}
        keyExtractor={(item) => item.id_produto.toString()}
        horizontal
        renderItem={renderProduto}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />

      {/* Segunda linha horizontal */}
      <FlatList
        data={segundaLinha}
        keyExtractor={(item) => item.id_produto.toString()}
        horizontal
        renderItem={renderProduto}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, marginTop: 10 }}
      />

      {/* Botão fixo do carrinho */}
      <TouchableOpacity
        style={styles.botaoCarrinho}
        onPress={() => navigation.navigate("Carrinho")}
      >
        <Text style={styles.botaoCarrinhoTexto}>🛒</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 10 },
  titulo: { fontSize: 22, fontWeight: "bold", marginLeft: 15, marginBottom: 10 },
  inputBusca: {
    marginHorizontal: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8
  },
  categoriaBotao: {
    height: 50,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center"
  },
  categoriaSelecionada: {
    backgroundColor: "#ff4d4d",
    borderColor: "#ff4d4d"
  },
  categoriaSelecionadaText: {
    color: "#fff",
    fontWeight: "bold"
  },
  botaoCarrinho: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#ff4d4d",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  botaoCarrinhoTexto: { color: "#fff", fontSize: 28 }
});
