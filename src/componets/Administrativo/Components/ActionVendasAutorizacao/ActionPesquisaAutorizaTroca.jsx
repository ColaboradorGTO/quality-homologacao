import React, { Fragment, useState, useEffect } from "react"
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { getDataAtual } from "../../../../utils/dataAtual";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { ActionListaVendasAutorizarTroca } from "./actionListaVendasAutorizarTroca";
import { CiEdit } from "react-icons/ci";
import { useAutorizarTroca } from "./hooks/useAutorizarTroca";
import Swal from "sweetalert2";



export const ActionPesquisaAutorizaTroca = ({ usuarioLogado }) => {
  const [tabelaPrincipal, setTabelaPrincipal] = useState(true);
  const [tabelaSecundaria, setTabelaSecundaria] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [numeroSerie, setNumeroSerie] = useState('');
  const [numeroNFCE, setNumeroNFCE] = useState('');
  const [cpfNumeroVenda, setCPFNumeroVenda] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [marcaSelecionada, setMarcaSelecionada] = useState('')
  const [btnVisivel, setBtnVisivel] = useState(false);
  const [btnAlterarVisivel, setBtnAlterarVisivel] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

  useEffect(() => {
    const dataInicial = getDataAtual()
    const dataFinal = getDataAtual()
    setDataPesquisaInicio(dataInicial)
    setDataPesquisaFim(dataFinal)

  }, []);

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

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    'empresas',
    async () => {
      const response = await get(`/empresas`);
      
      return response.data;
    },
    {enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 30 * 60 * 1000 }
  );

  const fetchListaVendasPrazoExcedido = async ( ) => {
    
    const urlBase = `/vendas-prazo-excedido?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&cpfOUidVenda=${cpfNumeroVenda}&nff=${numeroNFCE}&serie=${numeroSerie}&idSubGrupoEmpresarial=${marcaSelecionada}&idEmpresa=${empresaSelecionada}`;    
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
   

  const { data: dadosVendasPrazoExcedido = [], error: errorVendasPrazoExcedido, isLoading: isLoadingVendasPrazoExcedido, refetch: refetchListaVendasPrazoExcedido } = useQuery(
    ['vendas-prazo-excedido', ],
    () => fetchListaVendasPrazoExcedido(),
    { enabled: false, staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000 }
  )

  const handleSelectEmpresa = (e) => {
    setEmpresaSelecionada(e.value)
  }

  const handleClick = () => {
    refetchListaVendasPrazoExcedido()  
    setTabelaPrincipal(true)
    setTabelaSecundaria(false)
  }

  const handleClickReturn = () => {
    setTabelaPrincipal(true)
    setTabelaSecundaria(false)
    setBtnVisivel(false)
  }

    const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleAutorizarExcecao = () => {

    if(optionsModulos[0]?.ALTERAR == 'False') {
        Swal.fire({
        icon: 'warning',
        title: 'Acesso Negado!',
        html: `${usuarioLogado?.NOFUNCIONARIO} </br> Você não tem permissão para autorizar exceção.`,
        confirmButtonText: 'OK',
        customClass: {
            container: 'custom-swal',
        },
        });
        return;
    } else {
      onAuthFuncionario()
    }
  }
  const {
    onAuthFuncionario
  } = useAutorizarTroca({
    selectedRows,
    setSelectedRows,
    handleClick
})
  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Vendas"]}
        title="Vendas Vouchers"


        InputFieldDTInicioComponent={InputField}
        valueInputFieldDTInicio={dataPesquisaInicio}
        labelInputFieldDTInicio={"Data Início"}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}
        onKeyDownInputFieldDTInicio={handleKeyPress}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}
        onKeyDownInputFieldDTFim={handleKeyPress}
   
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
        onKeyDownInputFieldCodBarra={handleKeyPress}

        InputFieldComponent={InputField}
        labelInputField={"Série"}
        placeHolderInputFieldComponent={"Digite o número de série do voucher"}
        valueInputField={numeroSerie}
        onChangeInputField={(e) => setNumeroSerie(e.target.value)}
        onKeyDownInputField={handleKeyPress}

        InputFieldNumeroNFComponent={InputField}
        labelInputFieldNumeroNF={"Nº NFCE"}
        placeHolderInputFieldNumeroNF={"Digite o número da NFCE"}
        valueInputFieldNumeroNF={numeroNFCE}
        onChangeInputFieldNumeroNF={(e) => setNumeroNFCE(e.target.value)}
        onKeyDownInputFieldNumeroNF={handleKeyPress}

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
        styleCadastro={btnVisivel ? { display: 'block' } : { display: 'none' }}

        ButtonTypeVendasEstrutura={ButtonType}
        linkNomeVendasEstrutura={"Autorizar Exceção"}
        corVendasEstrutura={"info"}
        onButtonClickVendasEstrutura={handleAutorizarExcecao}
        iconVendasEstrutura={CiEdit}
        styleVendasEstrutura={btnAlterarVisivel ? { display: 'block' } : { display: 'none' }}

      />

      <ActionListaVendasAutorizarTroca 
        dadosVendasPrazoExcedido={dadosVendasPrazoExcedido} 
        setTabelaPrincipal={setTabelaPrincipal}
        setTabelaSecundaria={setTabelaSecundaria}  
        tabelaPrincipal={tabelaPrincipal}
        tabelaSecundaria={tabelaSecundaria}
        setBtnVisivel={setBtnVisivel}
        setBtnAlterarVisivel={setBtnAlterarVisivel}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    
      
    </Fragment>
  )
}