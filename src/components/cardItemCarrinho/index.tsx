import React, { useRef } from "react";
import { View, Image } from "react-native";
import { Text, Icon } from "react-native-paper";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { styles } from "./styles";
import { colors } from "../../theme/colors";


type Props = {
  item: {
    image: string;
    produto: string;
    preco: number;
    quantidade: number;
  };
  onDelete: () => void;
  onAdd: () => void;
  onRemove: () => void;
};

export default function CardItemCarrinho({ item, onDelete, onAdd, onRemove }: Props) {
  const hasImage = !!item.image;
  const swipeRef = useRef<Swipeable>(null);


  // Formata o preço para o padrão BRL
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  };


  const renderRightActions = () => (
    <RectButton style={styles.swipeDelete} onPress={onDelete}>
      <Icon source="trash-can-outline" size={28} color="#fff" />
      <Text style={styles.swipeDeleteText}>Excluir</Text>
    </RectButton>
  );



  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => {
        onDelete();
        swipeRef.current?.close();
      }}
    >
      <View style={styles.card}>
        {hasImage ? (
          <Image source={{ uri: item.image }} style={styles.imagem} />
        ) : (
          <View style={styles.imagem}>
            <Icon source="image-off-outline" size={30} color="#888" />
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.tipo}>{item.produto.toUpperCase()}</Text>
          <Text style={styles.texto}>Valor unitário: {formatPrice(item.preco)}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <RectButton onPress={onRemove} style={{ backgroundColor: colors.secondary, padding: 4, marginRight: 8 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>-</Text>
            </RectButton>
            <Text style={{ fontSize: 16, marginHorizontal: 4 }}>{item.quantidade}</Text>
            <RectButton onPress={onAdd} style={{ backgroundColor: colors.secondary, padding: 4, marginLeft: 8 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>+</Text>
            </RectButton>
          </View>
          <Text style={[styles.texto, { marginTop: 4, fontWeight: 'bold' }]}>Total: {formatPrice(item.preco * item.quantidade)}</Text>
        </View>
      </View>
    </Swipeable>
  );

}
