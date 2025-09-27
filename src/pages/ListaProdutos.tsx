// src/pages/produtos.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  SectionList,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import CardProduto from "../components/cardProduto";
import { useCarrinho } from "../context/CarrinhoContext";
import { useNavigation } from "@react-navigation/native";
import { colors } from '../theme/colors';

export default function ListaProdutos() {
  const { produtos, handleAdd, handleRemove, carrinho } = useCarrinho();
  const navigation = useNavigation();
  const [filtro, setFiltro] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  // categorias únicas
  const categorias = [...new Set(produtos.map((p: any) => p.categoria.categoria_nome))];

  // Agrupar produtos por categoria
  const produtosFiltrados = produtos.filter((produto: any) => {
    const passaCategoria = categoriaSelecionada ? produto.categoria.categoria_nome === categoriaSelecionada : true;
    const passaBusca = filtro ? produto.nome.toLowerCase().includes(filtro.toLowerCase()) : true;
    return passaCategoria && passaBusca;
  });


  // Gera um array de sections para SectionList
  const sections = categorias
    .filter(cat => cat && cat !== "")
    .map(cat => ({
      title: cat,
      data: produtosFiltrados.filter((p: any) => p.categoria.categoria_nome === cat)
    }))
    .filter(section => section.data.length > 0);

  // Se categoria selecionada, só mostra a respectiva section
  const sectionsParaExibir = categoriaSelecionada
    ? sections.filter(s => s.title === categoriaSelecionada)
    : sections;


  // Função utilitária para agrupar em pares
  function agruparEmPares(arr: any[]) {
    const pares = [];
    for (let i = 0; i < arr.length; i += 2) {
      pares.push(arr.slice(i, i + 2));
    }
    return pares;
  }

  // Novo renderItem para SectionList: cada item é um par de produtos
  const CARD_WIDTH = 170;
  const CARD_MARGIN = 6;
  const renderRow = ({ item: row }: { item: any[] }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
      {row.map((item, idx) => (
        <View key={item.id_produto} style={{ width: CARD_WIDTH, marginHorizontal: CARD_MARGIN }}>
          <CardProduto
            item={{
              image: item.imagem || item.image || '',
              produto: item.nome || item.produto || '',
              preco: Number(item.preco),
              quantidade: carrinho[item.id_produto] || 0
            }}
            onAdd={() => handleAdd(item)}
            onRemove={() => handleRemove(item)}
          />
        </View>
      ))}
      {row.length === 1 && <View style={{ width: CARD_WIDTH, marginHorizontal: CARD_MARGIN }} />}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Espaço antes da busca */}
      <View style={{ height: 15 }} />

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
        keyExtractor={(item: string) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, marginTop: 10, marginBottom: 35 }}
        renderItem={({ item }: { item: string }) => (
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
                : { color: '#f6a700' }
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Produtos agrupados por categoria usando SectionList */}
      <SectionList
        sections={sectionsParaExibir.map(sec => ({
          ...sec,
          data: agruparEmPares(sec.data)
        }))}
        keyExtractor={(row, idx) => row.map((item: any) => item.id_produto).join('-') + '-' + idx}
        renderItem={renderRow}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.titulo, { marginBottom: 25, marginTop: 10, textAlign: 'left', alignSelf: 'center', width: '100%' }]}>
            {title.toUpperCase()}
          </Text>
        )}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 80, alignSelf: 'center' }}
        showsVerticalScrollIndicator={false}
      />

      {/* Botão fixo do carrinho */}
      <TouchableOpacity
        style={styles.botaoCarrinho}
        onPress={() => navigation.navigate && navigation.navigate("Carrinho" as never)}
      >
        <Text style={styles.botaoCarrinhoTexto}>Finalizar Pedido 🛒</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignContent: 'center',
    justifyContent: 'center',
    // paddingTop: 5
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginLeft: 15, 
    marginBottom: 10,
    color: colors.secondary
  },

  inputBusca: {
    marginHorizontal: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  categoriaBotao: {
    height: 35,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#f6a700",
    marginRight: 5,
    // color: "#f6a700",
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    alignItems: "center"
  },
  categoriaSelecionada: {
    backgroundColor: "#f6a700",
    borderColor: "#f6a700"
  },
  categoriaSelecionadaText: {
    color: "#fff",
    fontWeight: "bold"
  },
  botaoCarrinho: {
    position: "absolute",
    bottom: 20,
    backgroundColor: colors.primary,
    width: "90%",
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center',
    // shadowColor: "#000",
  },
  botaoCarrinhoTexto: { color: colors.background, fontSize: 15, fontWeight: "bold" }
});
