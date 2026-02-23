import { Fragment, useState } from "react"
import { get } from "../../../../api/funcRequest";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { ActionMain } from "../../../Actions/actionMain";
import { AiOutlineSearch } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { ActionListaTipoTecidos } from "./actionListaTipoTecidos";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { ActionCriarTipoTecidosModal } from "./ActionCadastrar/actionCriarTipoTecidosModal";
import Swal from "sweetalert2";


export const ActionPesquisaTiposTecidos = ({ usuarioLogado, ID }) => {
  const [descricao, setDescricao] = useState('');
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [tecidoSelecionado, setTecidoSelecionado] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const fetchListaTecidos = async () => {
    const urlBase = `/tipoTecidos?idTecido=${tecidoSelecionado}&descricao=${descricao}`;
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

  const { data: dadosTecidos = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch } = useQuery(
    ['tipoTecidos', tecidoSelecionado, descricao, currentPage, pageSize],
    () => fetchListaTecidos(tecidoSelecionado, descricao, currentPage, pageSize),
    { enabled: true }
  )


  const handleChangeTecido = (e) => {
    setTecidoSelecionado(e.value)
  }

  const abreModalCadastro = () => {
    if(optionsModulos[0]?.CRIAR === 'True') {
      setModalVisivel(true)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: `${usuarioLogado?.NOFUNCIONARIO} Você não tem permissão para cadastrar um novo tipo de tecido.`,
      });
      return;
    }
  }

  const handlePesquisar = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetch()
    setTabelaVisivel(true)
  }


  return (

    <Fragment>
      <ActionMain
        title="Relatórios - Tipos de Tecidos"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Tipos de Tecidos"]}

        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        InputSelectSubGrupoComponent={InputSelectAction}
        optionsSubGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosTecidos.map((item) => {
            return {
              value: item.IDTPTECIDO,
              label: `${item.DSTIPOTECIDO}`
            }
          })
        ]}
        labelSelectSubGrupo={"Por Tipo de Tecido"}
        valueSelectSubGrupo={tecidoSelecionado}
        onChangeSelectSubGrupo={handleChangeTecido}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Tipos de Tecidos"}
        onButtonClickSearch={handlePesquisar}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Tipo de Tecido"}
        onButtonClickCadastro={abreModalCadastro}
        IconCadastro={MdAdd}
        corCadastro={"success"}

      />

      {tabelaVisivel && (
        <ActionListaTipoTecidos
          dadosTecidos={dadosTecidos}
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}
        />
      )}

      <ActionCriarTipoTecidosModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
      />
    </Fragment>
  )
}

