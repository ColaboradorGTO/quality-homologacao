import { useEffect, useState } from "react"
import { put } from "../../../../api/funcRequest"
import { getUmdiaAntes } from "../../../../utils/dataAtual"
import { useNavigate } from "react-router-dom"
import axios from "axios";
export const useUpdatePromocaoAtivaStatus = ({ dadosListaPromocao }) => {
  const [ipUsuario, setIpUsuario] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  // useEffect(() => {
  //   getIPUsuario();

  // }, [usuarioLogado]);

  // const getIPUsuario = async () => {
  //   let usuarioIP = null;

  //   try {
  //     const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
  //     usuarioIP = ipWhoisData?.ip;
  //   } catch (error) {
  //     console.error("Erro ao buscar IP via ifconfig.me:", error);
  //   }

  //   if (!usuarioIP) {
  //     try {
  //       const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
  //       usuarioIP = ipifyData?.ip;
  //     } catch (error) {
  //       console.error("Erro ao buscar IP via ipify.org:", error);
  //     }
  //   }
  //     setIpUsuario(usuarioIP);
  //   return usuarioIP;
  // };

  const verificarPromocaoExpirada = async () => {
    if (!dadosListaPromocao || dadosListaPromocao.length === 0) return

    const promocoesExpiradas = [];
    const dataAtual = new Date();

    const dataAtualSemHora = new Date(
      dataAtual.getFullYear(),
      dataAtual.getMonth(),
      dataAtual.getDate()
    );

    dadosListaPromocao.forEach(promocao => {
      if (promocao?.DTHORAFIM && promocao?.STATIVO === 'True') {
        const dataFimPromocao = new Date(promocao.DTHORAFIM);
        const dataFimPromocaoSemHora = new Date(
          dataFimPromocao.getFullYear(),
          dataFimPromocao.getMonth(),
          dataFimPromocao.getDate()
        );

        if (dataFimPromocaoSemHora.getTime() <= dataAtualSemHora.getTime()) {
          promocoesExpiradas.push(promocao);
        }
      }
    });

    if (promocoesExpiradas.length > 0) {

      for (const promocao of promocoesExpiradas) {
        try {
          await desativarPromocao(promocao.IDRESUMOPROMOCAOMARKETING);
        } catch (error) {
          console.error(`Erro ao desativar promoção ${promocao.IDRESUMOPROMOCAOMARKETING}:`, error);
        }
      }
    }
  }

  const desativarPromocao = async (idPromocao) => {

    try {
      const putData = {
        STATIVO: 'False',
        IDRESUMOPROMOCAOMARKETING: idPromocao,
      };

      const response = await put('/desativar-status-promocao', putData);

      return response.data;
    } catch (error) {
      console.error('Erro ao Atualizar promoção:', error);
      return null;
    }
  };

  useEffect(() => {
    if (dadosListaPromocao && dadosListaPromocao.length > 0) {
      verificarPromocaoExpirada();
    }
  }, [dadosListaPromocao]);

  return {
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    verificarPromocaoExpirada,
    desativarPromocao
  }
}