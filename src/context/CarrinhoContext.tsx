import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "react-native";

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

  const API_URL =  "https://gerenciadordepedidos.onrender.com";

  // Busca produtos
  useEffect(() => {
  fetch(`${API_URL}/produtos`)
    .then(res => res.json())
    .then(data => {
      const produtosNormalizados = (Array.isArray(data) ? data : data.produtos || []).map((p: any) => ({
        ...p,
        id_produto: p.id_produto ?? p.id, // garante que sempre existe id_produto
        preco: Number(p.preco)            // garante número
      }));
      setProdutos(produtosNormalizados);
    })
    .catch(err => Alert.alert("Erro ao buscar produtos", err.message));
}, []);

    


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
