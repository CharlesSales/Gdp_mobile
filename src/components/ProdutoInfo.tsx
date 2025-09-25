// components/ProdutoInfo.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface ProdutoInfoProps {
  nome: string;
  preco: number | string;
  imagem?: string;
  pequeno?: boolean;
}

export default function ProdutoInfo({ nome, preco, imagem, pequeno = false }: ProdutoInfoProps) {
  const precoNumero = Number(preco);

  return (
    <View style={styles.container}>
      {imagem && (
        <Image
          source={{ uri: imagem }}
          style={{
            width: pequeno ? 100 : 120,
            height: pequeno ? 100 : 120,
            borderRadius: 8,
            marginBottom: 6,
          }}
          resizeMode="cover"
        />
      )}
      <Text style={{ fontSize: pequeno ? 14 : 16, marginBottom: 4, textAlign: "center" }}>{nome}</Text>
      <Text style={{ fontSize: pequeno ? 12 : 14, color: "#333", textAlign: "center" }}>
        R$ {precoNumero.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
