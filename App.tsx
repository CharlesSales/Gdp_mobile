import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Alert, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from 'react-native-safe-area-context';

import io from "socket.io-client";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

import Login from "./src/pages/Login"
import Funcionario from './src/pages/Funcionario'
import Produtos from "./src/pages/produtos";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carrinho from "./src/pages/carrinho";
import Confirmacao from './src/pages/confirmacao';
import View from './src/pages/view';
import Home from './src/pages/Home';
import Admin from './src/pages/Admin'
import PedidosAcarajeScreen from "./src/pages/PedidosAcarajeScreen";
import PedidosGeral from './src/pages/Pedidos_geral';
import PedidosRestaurante from './src/pages/PedidosRestaurante';
import { CarrinhoProvider } from "./src/context/CarrinhoContext";
import { AuthProvider } from "./src/context/AuthContext";
import ListaProdutos from "./src/pages/ListaProdutos";
import CarrinhoDetalhe from "./src/pages/CarrinhoDetalhe";

const Stack = createNativeStackNavigator();
// Corrigir a URL do backend
const SOCKET_URL = "https://gerenciadordepedidos.onrender.com";
// const SOCKET_URL = "http://localhost:8080"; // Para desenvolvimento local

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
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // 1️⃣ Registrar token de push
    registerForPushNotificationsAsync().then(token => {
      console.log("Token registrado:", token);
      setExpoPushToken(token || "");
    });

    // 2️⃣ Conectar no Socket.IO
    socketRef.current = io(SOCKET_URL);

    // 3️⃣ Ouvir eventos de novos pedidos
    socketRef.current.on("connect", () => {
      console.log("✅ Conectado ao socket:", socketRef.current.id);
    });

    socketRef.current.on("novoPedido_geral", (pedido: any) => {
      console.log("🔔 Novo pedido recebido:", pedido);

      // Mostrar notificação local
      Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 Novo Pedido Geral!",
          body: `Cliente: ${pedido.nome_cliente || 'N/A'} - Total: R$ ${pedido.total || '0,00'}`,
          sound: 'default',
        },
        trigger: null, // Imediatamente
      });

      // Também mostrar alert
      Alert.alert(
        "Novo Pedido Geral!",
        `Cliente: ${pedido.nome_cliente || 'N/A'}\nTotal: R$ ${pedido.total || '0,00'}`
      );
    });

    socketRef.current.on("novoPedido_acaraje", (pedido: any) => {
      console.log("🥘 Novo pedido acarajé:", pedido);

      Notifications.scheduleNotificationAsync({
        content: {
          title: "🥘 Novo Pedido Acarajé!",
          body: `Cliente: ${pedido.nome_cliente || 'N/A'} - Total: R$ ${pedido.total || '0,00'}`,
          sound: 'default',
        },
        trigger: null,
      });
    });

    socketRef.current.on("novoPedido_restaurante", (pedido: any) => {
      console.log("🍽️ Novo pedido restaurante:", pedido);

      Notifications.scheduleNotificationAsync({
        content: {
          title: "🍽️ Novo Pedido Restaurante!",
          body: `Cliente: ${pedido.nome_cliente || 'N/A'} - Total: R$ ${pedido.total || '0,00'}`,
          sound: 'default',
        },
        trigger: null,
      });
    });

    // Listener para quando uma notificação é recebida
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notificação recebida:", notification);
    });

    // Listener para quando o usuário toca na notificação
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Usuário tocou na notificação:", response);
      // Aqui você pode navegar para a tela específica
    });

    return () => {
      socketRef.current?.disconnect();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 2 }}>
      <AuthProvider>
        <CarrinhoProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Login"
                screenOptions={{ headerShown: false }}>

                <Stack.Screen
                  name="Login"
                  component={Login}
                />
                <Stack.Screen
                  name="Home"
                  component={Home}
                />
                <Stack.Screen name="Admin"
                  component={Admin} />
                <Stack.Screen
                  name="Produtos"
                  component={ListaProdutos}
                />
                <Stack.Screen
                  name="Carrinho"
                  component={CarrinhoDetalhe}
                />
                <Stack.Screen
                  name="Funcionario"
                  component={Funcionario}
                />
                <Stack.Screen
                  name="Confirmacao"
                  component={Confirmacao}
                />
                <Stack.Screen
                  name="PedidosAcaraje"
                  component={PedidosAcarajeScreen}
                />
                <Stack.Screen
                  name="PedidosGeral"
                  component={PedidosGeral}
                />
                <Stack.Screen
                  name="PedidosRestaurante"
                  component={PedidosRestaurante}
                />
                <Stack.Screen name="View" component={View} />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </CarrinhoProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// Função para registrar token de push
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
      Alert.alert("Erro", "Falha ao obter permissão para notificações!");
      return;
    }

    try {
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;

      console.log("Expo Push Token:", token);

      // Enviar token para o backend
      try {
        await fetch(`${SOCKET_URL}/registrar-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        console.log("Token enviado para o backend");
      } catch (error) {
        console.log("Erro ao enviar token:", error);
        // Não é crítico se falhar
      }
    } catch (error) {
      console.log("Erro ao obter token:", error);
    }
  } else {
    Alert.alert("Aviso", "É necessário um dispositivo físico para receber notificações push.");
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