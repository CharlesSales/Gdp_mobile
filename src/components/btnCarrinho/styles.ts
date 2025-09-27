import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: '#ff4d4d',
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
		shadowColor: '#000',
		shadowOpacity: 0.3,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 2 },
	},
	badge: {
		position: 'absolute',
		top: 8,
		right: 8,
		backgroundColor: '#fff',
		borderRadius: 10,
		minWidth: 20,
		height: 20,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 5,
		zIndex: 2,
	},
	badgeText: {
		color: '#ff4d4d',
		fontWeight: 'bold',
		fontSize: 13,
	},
});
