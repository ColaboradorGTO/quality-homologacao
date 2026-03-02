import React, { Fragment,  useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { ActionColetorBalancoModal } from "./ActionColetorBalancoAvulso/actionColetorBalancoModal";
import { ActionListaBalancoAvulso } from "./actionListaBalancoAvulso";
import { AiOutlineSave, AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import Swal from "sweetalert2";
import { useConfirmarBalancoAvulso } from "./hooks/useConfirmarBalancoAvulso";
import { ActionModalProduto } from "./ActionModalProduto/actionModalProduto";

export const ActionPesquisaBalancoAvulso = ({usuarioLogado }) => {
  const [descricaoColetor, setDescricaoColetor] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [tabelaProduto, setTabelaProduto] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false)
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('')
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

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setDescricaoColetor('COLETOR WEB - ' + usuarioLogado.NOFUNCIONARIO)
    }, 2000);
    
    return () => clearTimeout(timer);
    
  }, [usuarioLogado])
  
  const { data: dadosEmpresa = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useQuery(
    'empresas',
    async () => {
      const response = await get(`/empresas`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000, }
  );
  
  const { data: dadosBalancoAvulso = [], error: errorBalanco, isLoading: isLoadingBalanco, refetch } = useQuery(
    [ 'detalheBalancoAvulso', empresaSelecionada, usuarioLogado?.id],
    async () => {
      const response = await get(`/detalheBalancoAvulso?idFilial=${empresaSelecionada}&coletor=${usuarioLogado.id}`);
      return response.data;
    },
    { enabled: Boolean(empresaSelecionada), staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000, }
  );
  
  const  { enviarConfirmacao, loading } = useConfirmarBalancoAvulso({ dadosBalancoAvulso, usuarioLogado, optionsModulos});
  const handleConfirmarBalanco = async () => {
    if(optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        icon: 'info',
        text: 'Você não tem permissão para confirmar o balanço avulso!',
        timer: 3000,
      });
      return;
    }
    await enviarConfirmacao();
  };

  const fetchListaProdutosBalanco = async () => {
    const urlBase = `/listaProdutos?idEmpresa=${empresaSelecionada}&dsProduto=${descricaoProduto}`;
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
  
  const { data: dadosColetorBalanco = [], refetch: refetchListaProdutosBalanco } = useQuery(
    ['listaProdutos', ],
    () => fetchListaProdutosBalanco(),
    { enabled: false }
  );
  

  const handleSelectEmpresa = (e) => {
    const empresa = dadosEmpresa.find((empresa) => empresa.IDEMPRESA === e.value);
    setEmpresaSelecionada(e.value);
    setEmpresaSelecionadaNome(empresa.NOFANTASIA);
    setTabelaVisivel(true)
  };

  const isDisabledEmpresa = empresaSelecionada ? true : false;


  const handleCloseModal = () => {
    setModalVisivel(false)
  }

  const handleClick = () => {   
    if(!empresaSelecionada || descricaoProduto.length < 5) {
     
      Swal.fire({
        icon: 'info',
        text: 'Digite a descrição do produto ou o código de barras!',
        timer: 3000,
      })
    } else {

      setTabelaVisivel(false)
      setTabelaProduto(true)
      refetchListaProdutosBalanco(empresaSelecionada, descricaoProduto)
    }
  }

   

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Balanço Avulso por Loja"]}
        title="Balanço Avulso por Loja"
        subTitle={empresaSelecionadaNome}

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: 0, label: 'Selecione uma loja' },
          ...dadosEmpresa.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          })),
        ]}

        labelSelectEmpresa={"Empresa"}
        isDisabledEmpresa={isDisabledEmpresa}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleSelectEmpresa}

        InputFieldDescricaoComponent={InputField}
        labelInputFieldDescricao={"Descrição"}
        onChangeInputFieldDescricao={e => setDescricaoColetor(e.target.value)}
        valueInputFieldDescricao={descricaoColetor}
        readOnlyDescricao={true}

        InputFieldQuantidadeComponent={InputField}
        labelInputFieldQuantidade={"Quantidade"}
        onChangeInputQuantidade={e => setQuantidade(e.target.value)}
        valueInputQuantidade={quantidade}

        InputFieldComponent={InputField}
        labelInputField={"Produto"}
        onChangeInputField={e => setDescricaoProduto(e.target.value)}
        valueInputField={descricaoProduto}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Confirmar"}
        onButtonClickCadastro={handleConfirmarBalanco}
        corCadastro={"success"}
        IconCadastro={AiOutlineSave}
      />
 
      <ActionListaBalancoAvulso 
        dadosBalancoAvulso={dadosBalancoAvulso} 
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}  
        refetch={refetch}
      />
       
      <ActionModalProduto
        dadosColetorBalanco={dadosColetorBalanco} 
        empresaSelecionada={empresaSelecionada} 
        quantidade={quantidade}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}  
        show={tabelaProduto}
        handleClose={() => setTabelaProduto(false)}
        refetch={refetch}
      />
       
      <ActionColetorBalancoModal 
        show={modalVisivel}
        handleClose={handleCloseModal}
        dadosColetorBalanco={dadosColetorBalanco}
        empresaSelecionada={empresaSelecionada}
        descricaoProduto={descricaoProduto}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
      />
    
    </Fragment>
  )
}
