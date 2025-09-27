import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';

type Props = {
	quantidade: number;
	onPress: () => void;
};

export default function BtnCarrinho({ quantidade, onPress }: Props) {
	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			<MaterialCommunityIcons name="cart-outline" size={32} color="#fff" />
			{quantidade > 0 && (
				<View style={styles.badge}>
					<Text style={styles.badgeText}>{quantidade}</Text>
				</View>
			)}
		</TouchableOpacity>
	);
}
