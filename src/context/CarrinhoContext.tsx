import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "react-native";
import { useAuth } from './AuthContext'
interface Produto {
  id_produto: number;
  nome: string;
  preco: string | number;
  categoria?: string;
  imagem?: string;
}

interface CarrinhoContextData {
  produtos: Produto[];
  acaraje: Produto[];
  carrinho: { [key: number]: number };
  handleAdd: (produto: Produto) => void;
  handleRemove: (produto: Produto) => void;
  handleClear: (produto: Produto) => void;
  handleClearCarrinho: (produto: Produto) => void
}

const CarrinhoContext = createContext<CarrinhoContextData | undefined>(undefined);

export const CarrinhoProvider = ({ children }: { children: ReactNode }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [acaraje, setAcaraje] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<{ [key: number]: number }>({});
  const { user, token, isAuthenticated } = useAuth();

  const API_URL =  "https://gerenciadordepedidos.onrender.com";
  //const API_URL =  "http://localhost:8080";

  

  // Busca produtos
  useEffect(() => {
    async function fetchProdutos() {
      if (!token || !isAuthenticated) {
        console.log("⏳ Aguardando autenticação...");
        return;
      }

      console.log('🔐 Token encontrado, carregando produtos do restaurante...');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      try {
        const res = await fetch(`${API_URL}/produtos`, {
          method: 'GET',
          headers,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        console.log('📦 Produtos retornados:', data);

        const produtosNormalizados = (Array.isArray(data)
          ? data
          : data.produtos || []
        ).map((p: any) => ({
          ...p,
          id_produto: p.id_produto ?? p.id,
          preco: Number(p.preco),
        }));

        setProdutos(produtosNormalizados);
      } catch (err: any) {
        Alert.alert("Erro ao buscar produtos", err.message);
        console.error("❌ Erro ao carregar produtos:", err);
      }
    }

    fetchProdutos();
  }, [token, isAuthenticated]);


  const handleAdd = (produto?: Produto) => {
    if (!produto?.id_produto) return; // protege contra undefined
    setCarrinho(prev => ({
        ...prev,
        [produto.id_produto]: (prev[produto.id_produto] || 0) + 1
    }));
    };

  const handleRemove = (produto?: Produto) => {
    if (!produto?.id_produto) return;
        setCarrinho(prev => {
            const quantidadeAtual = prev[produto.id_produto] || 0;
            if (quantidadeAtual > 1) {
                return { ...prev, [produto.id_produto]: quantidadeAtual - 1 };
            } else {
                const novo = { ...prev };
                delete novo[produto.id_produto]; // remove do carrinho se chegar a 0
                return novo;
            }
        });
    };

    const handleClear = (produto?: Produto) => {
        if (!produto?.id_produto) return;
        setCarrinho(prev => {
            const novo = { ...prev };
            delete novo[produto.id_produto];
            return novo;
        });
    };

  const handleClearCarrinho = () => {
    setCarrinho({});
};


  return (
    <CarrinhoContext.Provider value={{ produtos, acaraje, carrinho, handleAdd, handleRemove, handleClear, handleClearCarrinho }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho deve ser usado dentro de CarrinhoProvider");
  }
  return context;
};
