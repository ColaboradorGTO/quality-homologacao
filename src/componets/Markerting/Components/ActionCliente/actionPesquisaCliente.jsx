import React, { Fragment, useEffect, useState, useRef } from "react"
import { ButtonType } from "../../../Buttons/ButtonType"
import { ActionMain } from "../../../Actions/actionMain"
import { get} from "../../../../api/funcRequest"
import Swal from 'sweetalert2'
import { MdAdd } from "react-icons/md"
import { useQuery } from "react-query"
import { ActionListaCliente } from "./actionListaCliente"
import { ActionCadastrarClienteModal } from "./ActionCadastrarCliente/actionCadastrarClienteModal"

export const ActionPesquisaCliente = ({usuarioLogado }) => {
  const [modalCadastrarCliente, setModalCadastrarCliente] = useState(false)
  const [cpf, setCPF] = useState('')
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

  
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

  const { data: dadosCampanha = [], error: errorCampanha, isLoading: isLoadingCampanha, refetch: refetchCampanha } = useQuery(
    'campanha',
    async () => {
      const response = await get(`/campanha`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000 }
  );

  const { data: dadosListaCampanhaCliente = [], error: errorCampanhaCliente, isLoading: isLoadingCampanhaCliente, refetch: refetchCampanhaCliente } = useQuery(
    ['campanha-cliente', cpf],
    async () => {
      const response = await get(`/campanha-cliente?cpf=${cpf}`);
      return response.data;
    },
    { enabled: false, staleTime: 60 * 60 * 1000 }
  );

  useEffect(() => {
    if (cpf > 10) {
      Swal.fire({
        title: 'Cliente já cadastrado!',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
    }
  }, [cpf]);

const handleCadastro  = () => {
  if(optionsModulos[0]?.CRIAR == 'True') {
    setModalCadastrarCliente(true);
  } else {
    Swal.fire({
      title: 'Atenção',
      text: 'Você não tem permissão para cadastrar clientes.',
      icon: 'warning',
      confirmButtonText: 'Ok'
    });
  }
}
  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Cadastro de Clientes"]}
        title="Cadastro de Clientes"

        ButtonTypeCadastro={ButtonType}
        onButtonClickCadastro={handleCadastro}
        linkNome={"Cadastrar Cliente"}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />

      <ActionListaCliente 
        dadosListaCampanhaCliente={dadosListaCampanhaCliente} 
        dadosCampanha={dadosCampanha} 
        optionsModulos={optionsModulos}  
      />

      <ActionCadastrarClienteModal
        show={modalCadastrarCliente}
        handleClose={() => setModalCadastrarCliente(false)}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />
    </Fragment >
  )
}

