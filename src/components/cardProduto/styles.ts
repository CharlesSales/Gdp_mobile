import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';

const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffffff',
        borderRadius: 5,
        elevation: 1,
        padding: 2,
        // width: screenWidth * .45,
        width: 170,
        // marginBottom: 8,
        // marginRight: 12, // Espaçamento entre os cards
        height: 320,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagem: {
        width: "95%",
        aspectRatio: 1,
        borderRadius: 5,
        // marginRight: 20,
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
        fontSize: 14, 
        color: colors.secondary, 
        textAlign: 'center', 
        marginBottom: 2 },
    preco: { 
        fontSize: 20, 
        color: colors.secondary, 
        fontWeight: 'bold', 
        marginBottom: 2, 
        textAlign: 'left' },
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
