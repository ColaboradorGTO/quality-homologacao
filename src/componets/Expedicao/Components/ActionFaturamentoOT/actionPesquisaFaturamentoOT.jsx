import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { get } from "../../../../api/funcRequest";
import { getDataAtual } from "../../../../utils/dataAtual";
import { ActionListaFaturasOT } from "./ActionListaFaturasOT";
import { MdFormatListBulleted } from "react-icons/md";
import { FcProcess } from "react-icons/fc";
import { GrDocumentDownload } from "react-icons/gr";
import { FaTruckFast } from "react-icons/fa6";
import Swal from "sweetalert2";
import { useQuery } from "react-query";


export const ActionPesquisaFaturamentoOT = () => {
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [dataPesquisaInicioA, setDataPesquisaInicioA] = useState('');
  const [dataPesquisaFimA, setDataPesquisaFimA] = useState('');
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  // const [dadosEmpresas, setDadosEmpresas] = useState([])
  const [dadosStatusOT, setDadosStatusOT] = useState([])
  const [empresaDestino, setEmpresaDestino] = useState('')
  const [empresaOrigem, setEmpresaOrigem] = useState('')
  const [statusSelecionado, setStatusSelecionado] = useState('')
  const [dadosFaturaOT, setDadosFaturaOT] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  useEffect(() => {
    const dataInicial = getDataAtual();
    // setDataPesquisaInicio(dataInicial);
    // setDataPesquisaFim(dataInicial);
  
    getListaFaturasOT()
    getListaStatusOT()
  }, [])

  const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    'listaEmpresaComercial',
    async () => {
      const response = await get(`/listaEmpresaComercial`);
      
      return response.data;
    },
    {enabled: true, staleTime: 5 * 60 * 1000, }
  );


  const fetchVendasAtiva = async () => {
    try {
      
      const urlApi = `/faturasOT?idtipofiltro=1&idLojaOrigem=${empresaOrigem}&idLojaDestino=${empresaDestino}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idStatusOt=${statusSelecionado}&dataInicioFatura=${dataPesquisaInicioA}&dataFimFatura=${dataPesquisaFimA}`;
      const response = await get(urlApi);
      
      if (response.data.length && response.data.length === pageSize) {
        let allData = [...response.data];
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);
  
        async function fetchNextPage(page) {
          try {
            page++;
            const responseNextPage = await get(`${urlApi}&page=${page}`);
            if (responseNextPage.data.length) {
              allData.push(...responseNextPage.data);
              return fetchNextPage(page);
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
   
  const { data: dadosVendasAtivas = [], error: errorVendasMarca, isLoading: isLoadingVendasMarca, refetch: refetchVendasAtiva } = useQuery(
    ['faturasOT', empresaDestino, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
    () => fetchVendasAtiva(empresaDestino, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    {
      enabled: Boolean(empresaDestino && dataPesquisaInicio && dataPesquisaFim), 
      staleTime: 5 * 60 * 1000,
    }
  );




  const getListaStatusOT = async () => {
    try {
      const response = await get(`/statusOrdemTransferencia`)
      if (response.data) {
        setDadosStatusOT(response.data)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }


  const getListaFaturasOT = async () => {
    try {
      const response = await get(`/faturasOT?idtipofiltro=1&idLojaOrigem=${empresaOrigem}&idLojaDestino=${empresaDestino}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idStatusOt=${statusSelecionado}&dataInicioFatura=${dataPesquisaInicioA}&dataFimFatura=${dataPesquisaFimA}`)
      if (response.data) {
        setDadosFaturaOT(response.data)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleEmpresaDestino = (e) => {
    setEmpresaDestino(e.value)
  }

  const handleEmpresaOrigem = (e) => {
    setEmpresaOrigem(e.value)
  }

  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);

    if (clickContador % 2 === 0) {
      setTabelaVisivel(true)
      getListaFaturasOT()
    } 
  }





  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Faturamento O. T"]}
        title="Faturamento Ordem de Transferência"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Inicial das Notas Faturadas"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Final das Notas Faturadas"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        InputFieldDTInicioAComponent={InputField}
        labelInputDTInicioA={"Data Início"}
        onChangeInputFieldDTInicioA={(e) => setDataPesquisaInicioA(e.target.value)}
        valueInputFieldDTInicioA={dataPesquisaInicioA}

        InputFieldDTFimAComponent={InputField}
        labelInputDTFimA={"Data Fim"}
        onChangeInputFieldDTFimA={(e) => setDataPesquisaFimA(e.target.value)}
        valueInputFieldDTFimA={dataPesquisaFimA}

        InputSelectGrupoComponent={InputSelectAction}
        labelSelectGrupo={"Loja Origem"}
        optionsGrupos={[
          ...dadosEmpresas.map((empresa) => {
            return {
              value: empresa.IDEMPRESA,
              label: empresa.NOFANTASIA
            }
          })
        ]}
        valueSelectGrupo={empresaOrigem}
        onChangeSelectGrupo={handleEmpresaOrigem}


        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Loja Destino"}
        optionsEmpresas={[
          ...dadosEmpresas.map((empresa) => {
            return {
              value: empresa.IDEMPRESA,
              label: empresa.NOFANTASIA
            }
          })
        ]}
        valueSelectEmpresa={empresaDestino}
        onChangeSelectEmpresa={handleEmpresaDestino}


        InputSelectSubGrupoComponent={InputSelectAction}
        labelSelectSubGrupo={"Status"}
        optionsSubGrupos={[
          ...dadosStatusOT.map((status) => {
            return {
              value: status.IDSTATUSOT,
              label: status.DESCRICAOOT
            }
          })
        ]}
        valueSelectSubGrupo={statusSelecionado}
        onChangeSelectSubGrupo={(e) => setStatusSelecionado(e.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        
      />
       {/* <div className="row mb-4 " style={{marginTop: '10rem'}}>

        <ButtonType
          Icon={MdFormatListBulleted}
          iconSize="16px"
          textButton="Selecionar Registros"
          cor="primary"
          tipo="button"
          onClickButtonType={""}
        />
        <ButtonType
          Icon={FcProcess}
          iconSize="16px"
          textButton="Processar Faturamento"
          cor="warning"
          tipo="button"
          onClickButtonType={""}
        />
        <ButtonType
          Icon={FcProcess}
          iconSize="16px"
          textButton="Processar SEFAZ"
          cor="info"
          tipo="button"
          onClickButtonType={""}
        />
        <ButtonType
          Icon={GrDocumentDownload}
          iconSize="16px"
          textButton="Download Notas"
          cor="danger"
          tipo="button"
          onClickButtonType={""}
        />
        <ButtonType
          Icon={FaTruckFast}
          iconSize="16px"
          textButton="Conhecimento Entrega"
          cor="danger"
          tipo="button"
          onClickButtonType={""}
        />
        </div> */}
      {tabelaVisivel && (
        <div className="card">
          
        <ActionListaFaturasOT dadosFaturaOT={dadosFaturaOT} />
        </div>

      )}
    </Fragment>
  )
}
