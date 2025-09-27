import React, { useRef } from "react";
import { View, Image } from "react-native";
import { Text, Icon, Button } from "react-native-paper";
import { styles } from "./styles";
import { colors } from "../../theme/colors";

type Props = {
  item: {
    image: string;
    produto: string;
    preco: number;
    quantidade: number;
  };
  onAdd: () => void;
  onRemove: () => void;
};

export default function CardProduto({ item, onAdd, onRemove }: Props) {
  const hasImage = !!item.image;

  // Formata o preço para o padrão BRL
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.card}> 
      {hasImage ? (
        <Image source={{ uri: item.image }} style={styles.imagem} />
      ) : (
        <View style={styles.imagem}>
          <Icon source="image-off-outline" size={36} color="#888" />
        </View>
      )}
      <View style={{ alignItems: 'center', width: '100%', marginTop: 8, marginBottom: 4 }}>
        <Text style={styles.tipo} numberOfLines={2}>
          {item.produto.toUpperCase()}
        </Text>
        <Text style={styles.preco}>
          {formatPrice(item.preco)}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Button mode="contained" onPress={onRemove} style={{ marginHorizontal: 8, minWidth: 36, backgroundColor: colors.secondary }} compact>-</Button>
        <Text style={{ fontSize: 18, minWidth: 32, textAlign: 'center' }}>{item.quantidade}</Text>
        <Button mode="contained" onPress={onAdd} style={{ marginHorizontal: 8, minWidth: 36, backgroundColor: colors.secondary }} compact>+</Button>
      </View>
    </View>
  );
}
