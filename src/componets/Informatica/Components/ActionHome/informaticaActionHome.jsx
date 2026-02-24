import React, { Fragment, useEffect, useState } from "react"
import { get, post, put } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { GoDownload } from "react-icons/go";
import { ActionListaEmpresas } from "./actionListaEmpresas";
import { useQuery } from "react-query";
import Swal from "sweetalert2";

import axios from "axios";

export const InformaticaActionHome = ({ usuarioLogado, ID }) => {
  const [clickContador, setClickContador] = useState(0);
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [actionVisivel, setActionVisivel] = useState(true);
  const [ipUsuario, setIpUsuario] = useState('');


  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );


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

  const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const atualizarDiariaEmpresa = async () => {
    if (optionsModulos[0]?.ALTERAR === 'False') {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Você não tem permissão!',
        text: 'Acesso Negado para Atualizar Caixas',
        showConfirmButton: true,
        timer: 3000
      })
      return;
    }
    try {

      const putData = {
        STATUALIZA: 'True',
      }

      const response = await put('/atualizar-todos-caixa', putData)
      const textDados = JSON.stringify(putData);
      let textFuncao = 'INFORMATICA/ATUALIZAR TODOS OS CAIXA';

      const ipUsuario = await getIPUsuario();
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responseLog = await post('/log-web', postData)

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Caixas atualizado com sucesso!',
        showConfirmButton: false,
        timer: 1500
      })

      return responseLog.data;

    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Erro ao atualizar Caixas!',
        showConfirmButton: false,
        timer: 1500
      });

      console.error('Erro na atualização:', error);
      return null;

    }

  }

  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);

    if (clickContador % 2 === 0) {
      setTabelaVisivel(true)
      refetch();
    }
  }

  return (

    <Fragment>

      {actionVisivel && (
        <>
          <ActionMain
            linkComponentAnterior={["Home"]}
            linkComponent={["Tela Principal"]}
            title="Tela Principal Dashboard Informática"
            subTitle

            ButtonSearchComponent={ButtonType}
            linkNomeSearch={"Listar Caixas"}
            onButtonClickSearch={handleClick}
            corSearch={"primary"}
            IconSearch={AiOutlineSearch}

            ButtonTypeCadastro={ButtonType}
            linkNome={"Atualizar Todos os Caixas"}
            onButtonClickCadastro={atualizarDiariaEmpresa}
            corCadastro={"success"}
            IconCadastro={AiOutlineSearch}

            ButtonTypeCancelar={ButtonType}
            linkCancelar={"Exportar Caixas XLS"}
            onButtonClickCancelar
            corCancelar={"danger"}
            IconCancelar={GoDownload}

          />

        </>
      )}

      <ActionListaEmpresas
        dadosEmpresas={dadosEmpresas}
        setActionVisivel={setActionVisivel}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />
    </Fragment>
  )
}


