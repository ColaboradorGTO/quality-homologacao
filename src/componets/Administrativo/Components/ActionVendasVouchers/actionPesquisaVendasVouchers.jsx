import React, { Fragment, useState, useEffect } from "react"
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { getDataAtual } from "../../../../utils/dataAtual";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionListaVendasVouchers } from "./actionListaVendasVouchers";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";


export const ActionPesquisaVendasVouchers = () => {
  const [tabelaPrincipal, setTabelaPrincipal] = useState(true);
  const [tabelaSecundaria, setTabelaSecundaria] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [numeroSerie, setNumeroSerie] = useState('');
  const [numeroNFCE, setNumeroNFCE] = useState('');
  const [cpfNumeroVenda, setCPFNumeroVenda] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [marcaSelecionada, setMarcaSelecionada] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [btnVisivel, setBtnVisivel] = useState(false);

  useEffect(() => {
    const dataInicial = getDataAtual()
    const dataFinal = getDataAtual()
    setDataPesquisaInicio(dataInicial)
    setDataPesquisaFim(dataFinal)

  }, []);


  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    {enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 30 * 60 * 1000  }
  );
  
  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    'listaEmpresaComercial',
    async () => {
      const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
      
      return response.data;
    },
    {enabled: false, staleTime: 5 * 60 * 1000, cacheTime: 30 * 60 * 1000 }
  );

  useEffect(() => {
    if (marcaSelecionada) {
      refetchEmpresas();
    }
    refetchMarcas()
  }, [marcaSelecionada, refetchEmpresas]);


  const fetchListaVendasVendedor = async ( ) => {
    
    const urlBase = `/lista-venda-cliente?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&cpfOUidVenda=${cpfNumeroVenda}&nff=${numeroNFCE}&serie=${numeroSerie}&idSubGrupoEmpresarial=${marcaSelecionada}&idEmpresa=${empresaSelecionada}`;    
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    try {
      animacaoCarregamento('Carregando dados...', true);
      
      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`);
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      let allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`);
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      console.error('Erro ao buscar dados da api:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };
   

  const { data: dadosVendasClientes = [], error: errorVendasVendedor, isLoading: isLoadingVendasVendedor, refetch: refetchListaVendasVendedor } = useQuery(
    ['lista-venda-cliente', ],
    () => fetchListaVendasVendedor(),
    { enabled: false, staleTime: 5 * 60 * 1000, cacheTime: 30 * 60 * 1000 }
  )

  const handleSelectGrupo = (e) => {
    setMarcaSelecionada(e.value);
  };

  const handleSelectEmpresa = (e) => {
    setEmpresaSelecionada(e.value)
  }

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaVendasVendedor()  
    // setTabelaVisivel(true)
    setTabelaPrincipal(true)
  }

  const handleClickReturn = () => {
    setTabelaPrincipal(true)
    setTabelaSecundaria(false)
    setBtnVisivel(false)
  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Vendas"]}
        title="Vendas - Vouchers"


        InputFieldDTInicioComponent={InputField}
        valueInputFieldDTInicio={dataPesquisaInicio}
        labelInputFieldDTInicio={"Data Início"}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Grupos"}
        optionsMarcas={[
          { value: '0', label: 'Selecionar Marca' },
            ...optionsMarcas.map((marca) => {
            return {
              
              value: marca.IDGRUPOEMPRESARIAL,
              label: marca.DSGRUPOEMPRESARIAL,
            }
          })
        ]}
        valueSelectMarca={marcaSelecionada}
        onChangeSelectMarcas={handleSelectGrupo}
   
        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Lojas"}
        optionsEmpresas={[
          {value: '', label: 'Todas'},
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleSelectEmpresa}

        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"CPF/CNPJ ou Nº Venda"}
        placeHolderInputFieldCodBarra={"Digite o CPF/CNPJ ou Nº Venda"}
        onChangeInputFieldCodBarra={(e) => setCPFNumeroVenda(e.target.value)}
        valueInputFieldCodBarra={cpfNumeroVenda}

        InputFieldComponent={InputField}
        labelInputField={"Série"}
        placeHolderInputFieldComponent={"Digite o número de série do voucher"}
        valueInputField={numeroSerie}
        onChangeInputField={(e) => setNumeroSerie(e.target.value)}

        InputFieldNumeroNFComponent={InputField}
        labelInputFieldNumeroNF={"Nº NFCE"}
        placeHolderInputFieldNumeroNF={"Digite o número da NFCE"}
        valueInputFieldNumeroNF={numeroNFCE}
        onChangeInputFieldNumeroNF={(e) => setNumeroNFCE(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Voltar"}
        onButtonClickCadastro={handleClickReturn}
        corCadastro={"danger"}
        IconCadastro={MdKeyboardDoubleArrowLeft}
        // IconCadastro={LuArrowBigLeft}
        styleCadastro={btnVisivel ? { display: 'block' } : { display: 'none' }}

      />

      <ActionListaVendasVouchers 
        dadosVendasClientes={dadosVendasClientes} 
        setTabelaPrincipal={setTabelaPrincipal}
        setTabelaSecundaria={setTabelaSecundaria}  
        tabelaPrincipal={tabelaPrincipal}
        tabelaSecundaria={tabelaSecundaria}
        setBtnVisivel={setBtnVisivel}

      />
    
      
    </Fragment>
  )
}