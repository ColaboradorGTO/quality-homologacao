import Swal from "sweetalert2"
import { post, put } from "../../../../../api/funcRequest"
import { useEffect, useState } from "react"
import axios from "axios"

export const useEditarFatura = ({ dadosDetalheFatura, usuarioLogado, optionsModulos, handleClose, handleClick, refetchListaFaturas  }) => {
  const [empresa, setEmpresa] = useState('')
  const [codAutorizacao, setCodAutorizacao] = useState('')
  const [valorFatura, setValorFatura] = useState(0)
  const [valorFaturaAntigo, setValorFaturaAntigo] = useState(0)
  const [numeroMovimento, setNumeroMovimento] = useState('')
  const [ipUsuario, setIpUsuario] = useState('')

  const getIPUsuario = async () => {
    let usuarioIP = null;

    try {
      const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
      usuarioIP = ipWhoisData?.ip;
    } catch (error) {
      console.error("Erro ao buscar IP via ipwho.is:", error);
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
    if (dadosDetalheFatura && dadosDetalheFatura.length > 0) {
      setCodAutorizacao(dadosDetalheFatura[0]?.NUCODAUTORIZACAO)
      // setValorFatura(dadosDetalheFatura[0]?.VRRECEBIDO)
      setValorFaturaAntigo(dadosDetalheFatura[0]?.VRRECEBIDO)
      setEmpresa(usuarioLogado?.IDEMPRESA)
      setNumeroMovimento(`${dadosDetalheFatura[0]?.IDDETALHEFATURA} - ${dadosDetalheFatura[0]?.DSCAIXA} - ${dadosDetalheFatura[0]?.NUCODAUTORIZACAO}`)
    }
  
  }, [dadosDetalheFatura])


  const onSubmit = async () => {
    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        title: 'Atenção',
        text: 'Você não tem permissão para alterar faturas',
        icon: 'warning',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    const putData = {
      IDDETALHEFATURA: parseInt(dadosDetalheFatura[0]?.IDDETALHEFATURA),
      NUCODAUTORIZACAO: codAutorizacao,
      VRRECEBIDO: parseFloat(String(valorFatura).replace(/\./g, "").replace(",", ".")),
    }

    try {
      const response = await put('/fatura-loja-atualizar', putData);

      
      const textDados = JSON.stringify(putData)
      let textoFuncao = 'GERENCIA/ATUALIZAR FATURA';
      const ipUsuario = await getIPUsuario();
      
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }
      
      await post('/log-web', postData)
      
      Swal.fire({
        title: 'Atualização',
        text: 'Atualização Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });

      handleClick();
      handleClose();
      refetchListaFaturas()
      return response.data;
    } catch (error) {
      const textDados = JSON.stringify(putData)
      const ipUsuario = await getIPUsuario();
      let textoFuncao = 'GERENCIA/ERRO AO ATUALIZAR FATURA';
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', postData)


      Swal.fire({
        title: 'Erro!',
        text: 'Erro ao atualizar fatura',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });

      console.log(error);
      return responsePost.data;
    }
  }

  return {
    empresa,
    setEmpresa,
    codAutorizacao,
    setCodAutorizacao,
    valorFatura,
    setValorFatura,
    valorFaturaAntigo,
    setValorFaturaAntigo,
    numeroMovimento,
    setNumeroMovimento,
    onSubmit
  }
}