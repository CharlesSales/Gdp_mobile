import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, TextInput } from 'react-native';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext'

export default function PedidosAcarajeScreen() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtroData, setFiltroData] = useState(() => {
    const hoje = new Date();
    return hoje.toISOString().slice(0, 10);
  });

  const API_URL = "https://gerenciadordepedidos.onrender.com";
  //const API_URL = "http://localhost:8080";

  useEffect(() => {
     if (!token || !isAuthenticated) {
      console.log("⏳ Aguardando autenticação antes de carregar pedidos...");
      return;
    }
    const socket = io(API_URL);

    socket.on("novoPedido_geral", (pedido) => {
      setPedidos(prev => {
        const jaExiste = prev.some(p => p.id_pedido === pedido.id_pedido);
        return jaExiste ? prev : [pedido, ...prev];
      });
    });

    socket.on("statusAtualizado", ({ id, novoStatus }) => {
      setPedidos(prev =>
        prev.map(p => 
          p.id_pedido === Number(id) ? { ...p, pag: novoStatus } : p
        )
      );
    });
    

    const fetchPedidos = async () => {
      try {
        const res = await fetch(`${API_URL}/pedidosRestaurante`, {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
        const data = await res.json();
        setPedidos(Array.isArray(data) ? data : []);
      } catch (err) {
        setErro("Não foi possível carregar os pedidos.");
      } finally {
        setLoading(false);
      }
    };
      fetchPedidos();
    return () => socket.disconnect();
  }, [token, isAuthenticated]); // 🔥 agora depende do token


 async function handleChangeStatus(id: number) {
    try {
      const response = await fetch(`${API_URL}/pedidosGeral/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        const text = await response.text();
        setErro(`Erro ao atualizar status: ${text}`);
        console.error('Erro ao atualizar status:', text);
        return;
      }
      const result = await response.json();
      setPedidos(prev =>
        prev.map(p => p.id_pedido === id ? { ...p, pag: result.pedido.pag } : p)
      );
      setErro(null); // limpa erro se sucesso
    } catch (err) {
      setErro('Erro inesperado ao atualizar status.');
      console.error('Erro inesperado:', err);
    }
  }

  const formatarData = (dataHora: string) => {
    if (!dataHora) return "Sem data";
    const data = new Date(dataHora);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
  if (!filtroData) return true;
  if (!pedido.data_hora) return false;

  const dataPedido = new Date(pedido.data_hora);
  const ano = dataPedido.getFullYear();
  const mes = String(dataPedido.getMonth() + 1).padStart(2, "0");
  const dia = String(dataPedido.getDate()).padStart(2, "0");

  const dataFormatada = `${ano}-${mes}-${dia}`; // YYYY-MM-DD local
  return dataFormatada === filtroData;
});



  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (erro) return <Text style={{ color: "red", padding: 16 }}>{erro}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Pedidos</Text>
      <View style={{ marginBottom: 20 }}>
        <Text>Filtrar por dia:</Text>
        <TextInput
          style={styles.input}
          value={filtroData}
          onChangeText={setFiltroData}
          placeholder="YYYY-MM-DD"
        />
      </View>
      {pedidosFiltrados.length === 0 ? (
        <Text>Nenhum pedido encontrado.</Text>
      ) : (
        <FlatList
          data={pedidosFiltrados}
          keyExtractor={item => item.id_pedido?.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                { backgroundColor: item.pag === "pago" ? "#d4edda" : "#f8d7da" }
              ]}
            >
              <Text>id: {item.id_pedido}</Text>
              <Text>Cliente: {item.nome_cliente}</Text>
              <Text>Casa: {item.casa}</Text>
              <Text>Total: R$ {item.total}</Text>
              <Text>Data: {formatarData(item.data_hora)}</Text>
               <Text>Itens:</Text>
              {(() => {
                let itens = [];
                if (Array.isArray(item.pedidos)) {
                  itens = item.pedidos;
                } else if (typeof item.pedidos === "string" && item.pedidos.trim()) {
                  try {
                    itens = JSON.parse(item.pedidos);
                  } catch {
                    itens = [];
                  }
                }
                return itens.length > 0 ? (
                  itens.map((it, idx) => (
                    <Text key={idx}>- {it.nome} ({it.quantidade})</Text>
                  ))
                ) : (
                  <Text>Nenhum item</Text>
                );
              })()}

              <Text>Detalhe: {item.detalhe}</Text>
              <Button
                title={item.pag === "pago" ? "Pago" : "Marcar como Pago"}
                onPress={() => handleChangeStatus(item.id_pedido)}
                color={item.pag === "pago" ? "#2d6a4f" : "#888"}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: { padding: 12, marginBottom: 12, backgroundColor: '#eee', borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 8, marginBottom: 8 }
});