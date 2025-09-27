import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';

const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
        padding: 8,
        width: screenWidth * 0.9,
        marginBottom: 8,
        alignItems: 'center',
        height: 130,
    },
    imagem: {
        width: "35%",
        aspectRatio: 1,
        borderRadius: 8,
        marginRight: 8,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },

    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    tipo: {
        fontWeight: 'bold',
        fontSize: 15,
        color: colors.secondary,
        marginBottom: 4,
    },
    texto: {
        fontSize: 14,
        color: '#333',
        marginBottom: 2,
    },
    deleteButton: {
        marginTop: 6,
        alignSelf: 'flex-start',
    },
    swipeDelete: {
        backgroundColor: '#ff4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        borderRadius: 10,
        marginVertical: 8,
    },
    swipeDeleteText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 4,
    },
});
