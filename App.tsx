// App.tsx
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Alert, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import io from "socket.io-client";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import Produtos from "./src/pages/produtos";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carrinho from "./src/pages/carrinho";
import Confirmacao from './src/pages/confirmacao';
import View from './src/pages/view';
import Home from './src/pages/Home';
import PedidosAcarajeScreen from "./src/pages/PedidosAcarajeScreen";
import PedidosGeral from './src/pages/Pedidos_geral';
import PedidosRestaurante from './src/pages/PedidosRestaurante';
import { CarrinhoProvider } from "./src/context/CarrinhoContext";
import ListaProdutos from "./src/pages/ListaProdutos";
import CarrinhoDetalhe from "./src/pages/CarrinhoDetalhe";

const Stack = createNativeStackNavigator();
const SOCKET_URL = "http://SEU_BACKEND_URL"; // Substitua pelo backend

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // 1️⃣ Registrar token de push
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // 2️⃣ Conectar no Socket.IO
    socketRef.current = io(SOCKET_URL);

    // 3️⃣ Ouvir evento de novo pedido
    socketRef.current.on("novoPedido_geral", (pedido: any) => {
      Alert.alert("Novo Pedido!", `Pedido de ${pedido.nome_cliente} no valor de R$ ${pedido.total}`);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CarrinhoProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Produtos" component={ListaProdutos} />
            <Stack.Screen name="Carrinho" component={CarrinhoDetalhe} />
            <Stack.Screen name="Confirmacao" component={Confirmacao} />
            <Stack.Screen name="PedidosAcaraje" component={PedidosAcarajeScreen} />
            <Stack.Screen name="PedidosGeral" component={PedidosGeral} />
            <Stack.Screen name="PedidosRestaurante" component={PedidosRestaurante} />
            <Stack.Screen name="View" component={View} />
          </Stack.Navigator>
        </NavigationContainer>
      </CarrinhoProvider>
    </GestureHandlerRootView>
  );
}

// Registrar token de push
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Falha ao obter permissão para notificações!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);

    // Aqui você pode enviar o token para seu backend
    await fetch(`${SOCKET_URL}/registrar-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } else {
    alert("É necessário um dispositivo físico para receber notificações push.");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
