import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { ActionListaStatusDivergencia } from "./actionListaStatusDivergencia";
import { ActionMain } from "../../../Actions/actionMain";
import { AiOutlineSearch } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { useQuery } from "react-query";
import { getDataAtual } from "../../../../utils/dataAtual";
import { ActionCadastrarStatusModal } from "./actionCadastrarStatusModal";

export const ActionPesquisaStatusDivergencia = () => {
  const { register, handleSubmit, errors } = useForm();
  const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
  const [modalCadastrarVisivel, setModalCadastrarVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [dadosExemplos, setDadosExemplos] = useState([]);
  const [dadosDetalheTransferencia, setDadosDetalheTransferencia] = useState([]);
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [statusSelecionada, setStatusSelecionada] = useState(null)
  const [dadosDivergencia, setDadosDivergencia] = useState([])
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [descricao, setDescricao] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataPesquisaInicio(dataAtual);
    setDataPesquisaFim(dataAtual);
  }, [])
  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);;
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);



  const { data: dadosStatus = [], error: errorStatus, isLoading: isLoadingStatus } = useQuery(
    'status-divergencia',
    async () => {
      const response = await get(`/status-divergencia`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );



  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);
    if (usuarioLogado && usuarioLogado.IDEMPRESA ) {
      setTabelaVisivel(true);
    } else {
      console.log('Usuário não possui informações válidas.');
    }
  }

  const showModal = () => {
    setModalCadastrarVisivel(true)
  }
  const handleClose = () => {
    setModalEditarVisivel(false)
    setModalCadastrarVisivel(false)
  }

  return (
    <Fragment> 

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Ordem de Transferência"]}
        title="Controle de Transferência"
        subTitle="Nome da Loja"
        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

    

        ButtonSearchComponent={ButtonType}
        onButtonClickSearch={handleClick}
        linkNomeSearch={"Pesquisar"}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={"Cadastrar"}
        linkNome={"Cadastrar"}
        onButtonClickCadastro={showModal}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />

      <ActionListaStatusDivergencia dadosStatus={dadosStatus} />

      <ActionCadastrarStatusModal show={modalCadastrarVisivel} handleClose={handleClose} />
    </Fragment>
  )
}
