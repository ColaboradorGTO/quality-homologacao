import Swal from "sweetalert2"
import { useEffect, useState } from "react"
import axios from "axios"
import { get, put, post } from "../../../../../api/funcRequest"
import { situacao } from "../../../../../../parceiro.json"
import { useQuery } from "react-query"


export const useEditarListaPrecos = ({optionsModulos, usuarioLogado, dadosListaLoja }) => {
  const [descricao, setDescricao] = useState('')
  const [statusSelecionado, setStatusSelecionado] = useState([])
  const [ipUsuario, setIpUsuario] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [nomeListaPreco, setNomeListaPreco] = useState('');

  const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    ['empresas'],
    async () => {
      const response = await get(`/empresas`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, }
  );

  const getIPUsuario = async () => {
    let usuarioIP = null;

    try {
      const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
      usuarioIP = ipWhoisData?.ip;
    } catch (error) {
      console.error("Erro ao buscar IP via ifconfig.me:", error);
    }

    if (!usuarioIP) {
      try {
        const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
        usuarioIP = ipifyData?.ip;
      } catch (error) {
        console.error("Erro ao buscar IP via ipify.org:", error);
      }
    }
    setIpUsuario(usuarioIP);
    return usuarioIP;
  };

  useEffect(() => {
    if (dadosListaLoja && dadosListaLoja.length > 0) { 
      setStatusSelecionado({ value: dadosListaLoja[0]?.listaPreco.STATIVO == 'True' ? 'True' : 'False', label: dadosListaLoja[0]?.listaPreco.STATIVO == 'True' ? 'ATIVO' : 'INATIVO' })
      setNomeListaPreco(dadosListaLoja[0]?.listaPreco.NOMELISTA)
    }
  }, [dadosListaLoja])

  console.log(empresaSelecionada, 'empresaSelecionada')
  const onSubmit = async () => {

    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        icon: 'info',
        title: 'Acesso Negado!',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para alterar Lista de Preços!`,
        timer: 5000,
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    }

    const postData = {
      IDDETALHELISTAPRECO: Number(dadosDetalheCores[0]?.ID_COR),
      IDRESUMOLISTAPRECO: grupoCorSelecionado.value,
      IDGRUPOEMPRESARIAL: descricao,
      IDEMPRESA: empresaSelecionada?.value,
      STATIVO: statusSelecionado.value,
      lojas: empresaSelecionada?.map(item => item.value) 
    }

    try {

      const response = await put('/lista-de-preco/:id', postData)

      const textDados = JSON.stringify(postData)
      let textFuncao = 'COMPRAS / ALTERAÇÃO DE COR';
      const ipUsuario = await getIPUsuario();
      const createtLog = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'Indisponível'
      }

      await post('/log-web', createtLog)


      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Atualizado com sucesso!',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      handleClose();
      refetchListaCores();
      return response.data;
    } catch (error) {
      const textDados = JSON.stringify(postData)
      let textFuncao = 'COMPRAS / ERRO AO ALTERAR COR';
      const ipUsuario = await getIPUsuario();
      const createtLog = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'Indisponível'
      }

      const responseLog = await post('/log-web', createtLog)

      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        },
      });
      console.error('Erro ao alterar a Cor:', error);

      return responseLog.data;
    }
  }


  return {
    descricao,
    setDescricao,
    statusSelecionado,
    setStatusSelecionado,
    empresaSelecionada,
    setEmpresaSelecionada,
    nomeListaPreco,
    setNomeListaPreco,
    situacao,
    dadosEmpresas,
    onSubmit,
  }
}