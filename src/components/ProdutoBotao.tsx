// components/ProdutoBotao.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ProdutoBotaoProps {
  estaNoCarrinho: boolean;
  onAdicionar: () => void;
  onRemover: () => void;
}

export default function ProdutoBotao({ estaNoCarrinho, onAdicionar, onRemover }: ProdutoBotaoProps) {
  return (
    <TouchableOpacity
      style={[styles.botao, { backgroundColor: estaNoCarrinho ? "#dc3545" : "#28a745" }]}
      onPress={estaNoCarrinho ? onRemover : onAdicionar}
    >
      <Text style={styles.texto}>
        {estaNoCarrinho ? "Remover do carrinho" : "Adicionar ao carrinho"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  texto: {
    color: "#fff",
    fontWeight: "bold",
  },
});
