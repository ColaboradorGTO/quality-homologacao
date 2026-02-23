import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { AiOutlineSearch } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { getDataAtual } from "../../../../utils/dataAtual";
import { get } from "../../../../api/funcRequest";
import { ActionListaOrdemTransferencia } from "./ActionListaOrdemTransferencia";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { ActionIncluirOTModal } from "./ActionIncluirModalOT/actionIncluirOTModal";


export const ActionPesquisaOT = () => {
  const { register, handleSubmit, errors } = useForm();
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [dadosDetalheTransferencia, setDadosDetalheTransferencia] = useState([]);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataInicioEntrega, setDataInicioEntrega] = useState('')
  const [dataFimEntrega, setDataFimEntrega] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null)
  const [valueLojaOrigem, setValueLojaOrigem] = useState('')
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [ajusteQuantidade, setAjusteQuantidade] = useState(0)
  const [rotinaSelecionada, setRotinaSelecionada] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  const navigate = useNavigate();

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataPesquisaInicio(dataAtual);
    setDataPesquisaFim(dataAtual);
    // setDataInicioEntrega(dataAtual);
    // setDataFimEntrega(dataAtual);
  }, []);
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


  useEffect(() => {
    const timer = setTimeout(() => {
      if (usuarioLogado && usuarioLogado.NOFANTASIA) {
        // console.log(usuarioLogado.NOFANTASIA)
        setValueLojaOrigem(usuarioLogado.NOFANTASIA);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [usuarioLogado]);



  const { data: dadosEmpresa = [], error: errorMarcas, isLoading: isLoadingMarcas } = useQuery(
    'empresas',
    async () => {
      const response = await get(`/empresas`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );
  const { data: dadosMovimentacao = [], error: errorMovimentacao, isLoading: isLoadingMovimentacao } = useQuery(
    'rotinaMovimentacao',
    async () => {
      const response = await get(`/rotinaMovimentacao`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

  const fetchListaConferencia = async () => {
    try {
      const urlApi = `/otTransferencia?idTipoFiltro=2&idEmpresaOrigem=${usuarioLogado.IDEMPRESA}&idEmpresaDestino=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&dataPesquisaInicio=${dataInicioEntrega}&dataPesquisaFim=${dataFimEntrega}`;
      const response = await get(urlApi);
      
      if (response.data.length && response.data.length === pageSize) {
        let allData = [...response.data];
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);
  
        async function fetchNextPage(currentPage) {
          try {
            currentPage++;
            const responseNextPage = await get(`${urlApi}&page=${currentPage}`);
            if (responseNextPage.length) {
              allData.push(...responseNextPage.data);
              return fetchNextPage(currentPage);
            } else {
              return allData;
            }
          } catch (error) {
            console.error('Erro ao buscar próxima página:', error);
            throw error;
          }
        }
  
        await fetchNextPage(currentPage);
        return allData;
      } else {
       
        return response.data;
      }
  
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };
   
  const { data: dadosConferencia = [], error: errorVouchers, isLoading: isLoadingVouchers, refetch: refetchListaConferencia } = useQuery(
    ['otTransferencia', usuarioLogado?.IDEMPRESA, empresaSelecionada, dataPesquisaInicio, dataPesquisaFim, rotinaSelecionada, dataInicioEntrega, dataFimEntrega, currentPage, pageSize],
    () => fetchListaConferencia(usuarioLogado?.IDEMPRESA, empresaSelecionada, dataPesquisaInicio, dataPesquisaFim, rotinaSelecionada, dataInicioEntrega, dataFimEntrega, currentPage, pageSize),
    {
      enabled: Boolean(usuarioLogado?.IDEMPRESA && empresaSelecionada), 
    }
  );


  const handleSelectEmpresa = (e) => {
    setEmpresaSelecionada(e.value);
  }

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaConferencia()
    setTabelaVisivel(true);
  
  }

  const showModal = () => {
    setModalVisivel(true)
  }


  return (
    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Ordem de Transferência"]}
        title="Controle de Ordem de Transferência"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Inicial Entrega"}
        valueInputFieldDTInicio={dataInicioEntrega}
        onChangeInputFieldDTInicio={e => setDataInicioEntrega(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Final Entrega"}
        valueInputFieldDTFim={dataFimEntrega}
        onChangeInputFieldDTFim={e => setDataFimEntrega(e.target.value)}

        InputFieldDTInicioAComponent={InputField}
        labelInputDTInicioA={"Data Início"}
        onChangeInputFieldDTInicioA={(e) => setDataPesquisaInicio(e.target.value)}
        valueInputFieldDTInicioA={dataPesquisaInicio}

        InputFieldDTFimAComponent={InputField}
        labelInputDTFimA={"Data Fim"}
        onChangeInputFieldDTFimA={(e) => setDataPesquisaFim(e.target.value)}
        valueInputFieldDTFimA={dataPesquisaFim}
       
        
        InputFieldLojaOrigemComponent={InputField}
        labelInputFieldLojaOrigem={"Loja Origem"}
        optionsFieldLojaOrigemComponent
        valueInputFieldLojaOrigem={usuarioLogado && usuarioLogado.NOFANTASIA}
        onChangeInputFieldLojaOrigem

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={dadosEmpresa.map((empresa) => ({
          value: empresa.IDEMPRESA,
          label: empresa.NOFANTASIA,
        }))}
        labelSelectEmpresa={"Loja Destino"}
        onChangeSelectEmpresa={handleSelectEmpresa}
        valueSelectEmpresa={empresaSelecionada}

        InputSelectGrupoComponent={InputSelectAction}
        labelSelectGrupo={"Rotina"}    
        optionsGrupos={[
          {value: '', label: 'Selecione a Rotina'},
          ...dadosMovimentacao.map((item) => {
            return {
              value: item.IDROTINA,
              label: item.DESCROTINA
            }
          })
        ]}
        valueSelectGrupo={rotinaSelecionada}
        onChangeSelectGrupo={e => setRotinaSelecionada(e.value)}

        ButtonSearchComponent={ButtonType}
        onButtonClickSearch={handleClick}
        linkNomeSearch={"Pesquisar"}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={"Nova OT"}
        linkNome={"Nova OT"}
        onButtonClickCadastro={showModal}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />


      {tabelaVisivel && (

        <div className="card">
          <ActionListaOrdemTransferencia dadosConferencia={dadosConferencia} />
        </div>
      )}


      <ActionIncluirOTModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        
      />

    </Fragment>
  )
}