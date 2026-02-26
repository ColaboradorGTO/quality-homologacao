import { Fragment, useState, useEffect } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { ActionMain } from "../../../Actions/actionMain";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaExtratoMovimentoBonificacao } from "./actionListaExtratoMovimentoBonificacao";
import { get } from "../../../../api/funcRequest";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";

export const ActionPesquisaExtratoMovimentoBonificacao = ({usuarioLogado}) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('');
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
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const fetchListaFuntionarios = async () => {
    const urlBase = `/todos-funcionario?`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    try {
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
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: optionsFuncionarios = [], error: errorFuncionario, isLoading: isLoadingFuncionario, refetch } = useQuery(
    ['todos-funcionario'],
    () => fetchListaFuntionarios(),
    { enabled: true, staleTime: 60 * 60 * 1000 }
  );


  const fetchDadosExtratoBoniFicacao = async () => {
    const urlBase = `/movimento-saldo-bonificacao?idFuncionario=${funcionarioSelecionado}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    try {
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
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosExtratoBonificacao = [], error: errorDescontoVendas, isLoading: isLoadingDescontoVendas, refetch: refetchDadosExtratoBoniFicacao } = useQuery(
    ['movimento-saldo-bonificacao'],
    () => fetchDadosExtratoBoniFicacao(),
    { enabled: false, staleTime: 60 * 60 * 1000 }
  );

  const handleClick = () => {
    setTabelaVisivel(true)
    refetchDadosExtratoBoniFicacao()
  }


  
  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Extrato de Contas Correntes das Lojas"]}
        title="Extrato de Bonificações Funcionários"
        // subTitle="Nome da Loja"

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: '0', label: 'Selecione...' },
          ...optionsFuncionarios.map((empresa) => ({
            value: empresa.ID,
            label: ` ${empresa.ID} - ${empresa.NOFUNCIONARIO}`,
          }))
        ]}
        labelSelectEmpresa={"Funcionário"}
        valueSelectEmpresa={funcionarioSelecionado} 
        onChangeSelectEmpresa={(e) => setFuncionarioSelecionado(e.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

      {tabelaVisivel && (

        <div className="card">
          
          <ActionListaExtratoMovimentoBonificacao 
            dadosExtratoBonificacao={dadosExtratoBonificacao} 
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            funcionarioSelecionado={funcionarioSelecionado}  
            setFuncionarioSelecionado={setFuncionarioSelecionado}
            optionsFuncionarios={optionsFuncionarios}
          />
        </div>
      )}
    </Fragment>
  )
}
