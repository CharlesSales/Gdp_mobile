import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCarrinho } from '../context/CarrinhoContext';
import { useNavigation } from '@react-navigation/native';

export default function ConfirmarPedido() {
  const navigation = useNavigation();
  const {carrinho, produtos, handleClear } = useCarrinho();
  const [cliente, setCliente] = useState('');
  const [funcionario, setFuncionario] = useState('');
  const [casa, setCasa] = useState('');
  const [obs, setObs] = useState('')
  const [funcionarios, setFuncionarios] = useState([]);
  const [enviado, setEnviado] = useState(false);

  const API_URL =  'https://gerenciadordepedidos.onrender.com';
  //const API_URL =  'http://localhost:8080';

  // Prepara itens do carrinho para backend
  if (!produtos || produtos.length === 0) {
    return null; // ou um loader, enquanto produtos não chegam
    }

    const itensParaBackend = Object.entries(carrinho)
  .map(([produtoId, quantidade]) => {
    const produto = produtos.find(p => p?.id_produto?.toString() === produtoId);

    if (!produto) {
      console.warn(`Produto com id ${produtoId} não encontrado no carrinho.`);
      return null; // protege contra undefined
    }

    return {
      produto_id: Number(produto.id_produto),
      nome: produto.nome,
      quantidade,
      preco: Number(produto.preco || 0),
      cozinha: produto.cozinha || ''
    };
  })
  .filter((item): item is {
    produto_id: number;
    nome: string;
    quantidade: number;
    preco: number;
    cozinha: string;
  } => item !== null);



  const total = itensParaBackend.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  useEffect(() => {
    fetch(`${API_URL}/funcionarios`)
      .then(res => res.json())
      .then(data => setFuncionarios(data))
      .catch(err => console.error('Erro ao carregar funcionários:', err));
  }, []);

  const handleConfirmarPedido = async () => {
    if (!cliente || !funcionario || !casa || itensParaBackend.length === 0) {
      Alert.alert('Erro', 'Preencha todos os campos e adicione pelo menos um produto.');
      return;
    }

    try {
      const pedido = {
        cliente,
        funcionario,
        casa,
        itens: itensParaBackend,
        obs,
        total
      };

      await fetch(`${API_URL}/pedidosGeral`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });

      setEnviado(true);
      handleClear(); // limpa o carrinho
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível enviar o pedido');
    }
  };

  if (enviado) {
    return (
      <View style={styles.container}>
        <Text style={styles.sucesso}>🎉 Pedido enviado com sucesso!</Text>
        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.botaoTexto}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>✅ Confirmar Pedido</Text>

      <Text>👤 Nome do Cliente:</Text>
      <TextInput
        value={cliente}
        onChangeText={setCliente}
        style={styles.input}
        placeholder="Digite seu nome"
      />

      <Text>🧑‍🍳 Funcionário:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={funcionario}
          onValueChange={(itemValue) => setFuncionario(itemValue)}
        >
          <Picker.Item label="Selecione um funcionário" value="" />
          {funcionarios.map(f => (
            <Picker.Item
              key={f.id_funcionario}
              label={f.nome}
              value={f.id_funcionario.toString()}
            />
          ))}
        </Picker>
      </View>

      <Text>🏠 Número da casa:</Text>
      <TextInput
        value={casa}
        onChangeText={setCasa}
        style={styles.input}
        placeholder="Número da casa"
      />

      <Text>🏠 Detalhe do pedido:</Text>
      <TextInput
        value={obs}
        onChangeText={setObs}
        style={styles.input}
        placeholder="Detalhe do pedido"
      />

      <Text style={styles.subtitulo}>📋 Resumo do pedido:</Text>
      <FlatList
        data={itensParaBackend}
        keyExtractor={(item) => item.produto_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>
              {item.nome} — {item.quantidade}x R$ {item.preco.toFixed(2)} = R$ {(item.preco * item.quantidade).toFixed(2)}
            </Text>
          </View>
        )}
      />

      <Text style={styles.total}>💰 Total: R$ {total.toFixed(2)}</Text>

      <TouchableOpacity style={styles.botao} onPress={handleConfirmarPedido}>
        <Text style={styles.botaoTexto}>🚀 Enviar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#2d6a4f', textAlign: 'center' },
  subtitulo: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginVertical: 8 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginVertical: 8 },
  item: { paddingVertical: 5 },
  total: { fontWeight: 'bold', fontSize: 16, textAlign: 'right', marginTop: 10 },
  botao: { backgroundColor: '#2d6a4f', padding: 12, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sucesso: { fontSize: 22, color: '#2d6a4f', textAlign: 'center', marginVertical: 20 }
});
