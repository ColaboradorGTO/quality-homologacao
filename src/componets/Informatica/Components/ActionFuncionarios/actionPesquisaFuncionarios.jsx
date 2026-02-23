import React, { Fragment, useState } from "react"
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get, put } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaFuncionarios } from "./actionListaFuncionarios";
import { ActionCadastrarFuncionarioModal } from "./ActionCadastrar/actionCadastrarFuncionario";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { IoIosAdd } from "react-icons/io";
import Swal from "sweetalert2";


export const ActionPesquisaFuncionarios = ({usuarioLogado, ID}) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
  const [cpf, setCpf] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [modalCadastro, setModalCadastro] = useState(false);

 
  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
        const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);
        return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);
     
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 
    }
  );

  
  const fetchListaFuncionarios = async () => {
    const urlBase = `/funcionarios-loja?idEmpresa=${empresaSelecionada}&noFuncionarioCPF=${cpf}`;
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

  const { data: dadosFuncionarios = [], error: errorFuncionario, isLoading: isLoadingFuncionario, refetch } = useQuery(
    ['funcionarios-loja',],
    () => fetchListaFuncionarios(),
    {
      enabled: true, staleTime: 60 * 60 * 1000, 
    }
  );
  
  
  const handlChangeEmpresa = (e) => {
    if(e.value === '') {
      setEmpresaSelecionada('');
    }else{
      const selectedEmpresa = optionsEmpresas.find(empresa => empresa.IDEMPRESA === e.value);
      setEmpresaSelecionadaNome(selectedEmpresa.NOFANTASIA);
      setEmpresaSelecionada(e.value);
      }
  }

  
  const handleCadastro = () => {
    if(optionsModulos[0]?.CRIAR == 'True') {
      setModalCadastro(true);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'Você não tem permissão para cadastrar funcionários.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      })
    } 
  }

  const handleClick = () => {

    refetch();
    setTabelaVisivel(true);
  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Funcionários das Lojas"]}
        title="  Lista dos funcionários das Lojas"
        subTitle={empresaSelecionadaNome}

        InputFieldVendaCPFCNPJComponent={InputField}
        labelInputFieldVendaCPFCNPJ={"Nome / CPF"}
        valueInputFieldVendaCPFCNPJ={cpf}
        onChangeInputFieldVendaCPFCNPJ={(e) => setCpf(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: '', label: 'Selecione a Empresa' },
          ...optionsEmpresas.map((item) => ({
            value: item.IDEMPRESA,
            label: item.NOFANTASIA
          }))
        ]}
        labelSelectEmpresa={"Empresas"}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handlChangeEmpresa}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar "}
        onButtonClickCadastro={handleCadastro}
        corCadastro={"success"}
        IconCadastro={IoIosAdd}
      />


      <ActionListaFuncionarios 
        dadosFuncionarios={dadosFuncionarios} 
        optionsModulos={optionsModulos}  
        usuarioLogado={usuarioLogado}
        handleClick={handleClick}
      />
      

      <ActionCadastrarFuncionarioModal 
        show={modalCadastro}
        handleClose={() => setModalCadastro(false)}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        refetch={refetch}
      />
    </Fragment>
  )
}

