import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { get, post, put } from "../../../../api/funcRequest";
import { AiOutlineCheck } from "react-icons/ai";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import axios from "axios";

export const ActionPesquisaPrimeiroBalanco = ({usuarioLogado }) => {
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [ipUsuario, setIpUsuario] = useState('');
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

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
    const menuSalvo = localStorage.getItem('menuFilhoSelecionado');
    if (menuSalvo) {
      const menuParsed = JSON.parse(menuSalvo);
      setMenuFilhoAtual(menuParsed);
    }
  }, []);
  
  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    ['menus-usuario-excecao', menuFilhoAtual?.ID],
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${menuFilhoAtual?.ID}`);
      
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );

  const { data: optionsEmpresa = [], error: errorFornecedor, isLoading: isLoadingFornecedor, refetch: refetchFornecedor } = useQuery(
    'preparar-primeiro-balanco-loja',
    async () => {
      const response = await get(`/preparar-primeiro-balanco-loja`);
      return response.data;
    },
    {enabled: true, staleTime: 5 * 60 * 1000, }
  );

  const handleSelectMarca = (e) => {
    setEmpresaSelecionada(e.value);
  };
  
  const onSubmit = async () => {
    if(optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Você não tem permissão para realizar essa ação.',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    } 

    if(empresaSelecionada === '' || empresaSelecionada === null || empresaSelecionada === '0'){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Por favor, selecione uma empresa para prosseguir.',
        showConfirmButton: false,
        timer: 1500
      });
      
    } 

    const putData = {
      IDEMPRESA: empresaSelecionada, 
    }
  
    try {
      const response = await put('/preparar-primeiro-balanco-loja/:id', putData)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Prepração balanço realizado com sucesso!',
        showConfirmButton: false,
        timer: 1500
      })
        const textDados = JSON.stringify(putData)
        let textoFuncao = 'ADMINISTRATIVO/PREPARAR PRIMEIRO BALANÇO POR LOJA';
        const ipUsuario = await getIPUsuario();
        const postData = {  
          IDFUNCIONARIO: String(usuarioLogado.id),
          PATHFUNCAO:  textoFuncao,
          DADOS: textDados,
          IP: ipUsuario || 'IP não disponível'
        }

        await post('/log-web', postData)

        return response.data;
    } catch (error) {
      
      let textoFuncao = 'ADMINISTRATIVO/ERRO AO PREPARAR PRIMEIRO BALANÇO POR LOJA';
      const ipUsuario = await getIPUsuario();
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO:  textoFuncao,
        DADOS: JSON.stringify(putData),
        IP: ipUsuario || 'IP não disponível'
      }

      const response = await post('/log-web', postData)
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
        showConfirmButton: false,
        timer: 1500 
      });
      
   
      return response.data;
    } 
  }



  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Preparar Primeiro Balanço por Loja "]}
        title="Preparar Primeiro Balanço por Loja"
        subTitle="Nome da Loja"

        InputSelectMarcasComponent={InputSelectAction}
        optionsMarcas={optionsEmpresa.map((empresa) => ({
          value: empresa.IDEMPRESA,
          label: empresa.NOFANTASIA,
        }))}
        labelSelectMarcas={"Empresas"}
        valueSelectMarca={empresaSelecionada}
        onChangeSelectMarcas={handleSelectMarca}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Preparar"}
        onButtonClickSearch={onSubmit}
        corSearch={"success"}
        IconSearch={AiOutlineCheck}

      />

    </Fragment>
  )
}