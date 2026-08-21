import { useState } from "react";
import { get } from "../../../../../api/funcRequest";

export const useFuncionarioModal = () => {
  const [dados, setDados] = useState([]);
  const [visivel, setVisivel] = useState(false);

  const abrir = async (id) => {
    try {
      const response = await get(`/funcionarios-loja?byId=${id}`);
      if (response.data) {
        setDados(response.data);
        setVisivel(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do funcionário: ', error);
    }
  };

  const fechar = () => setVisivel(false);

  return { dados, visivel, abrir, fechar };
};
