import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import { buscarEmpresas, buscarFuncionariosLoja, buscarMenusExcecao } from "../services/funcionarioService";

export const usePesquisaFuncionarios = ({ usuarioLogado, ID }) => {
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
  const [cpfInput, setCpfInput] = useState('');
  const [cpfFiltro, setCpfFiltro] = useState('');
  const [situacaoSelecionada, setSituacaoSelecionada] = useState('');
  const [modalCadastro, setModalCadastro] = useState(false);
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

  useEffect(() => {
    const menuSalvo = localStorage.getItem('menuFilhoSelecionado');
    if (menuSalvo) {
      setMenuFilhoAtual(JSON.parse(menuSalvo));
    }
  }, []);

  const { data: optionsModulos = [] } = useQuery(
    ['menus-usuario-excecao', menuFilhoAtual?.ID],
    () => buscarMenusExcecao(usuarioLogado?.id, ID),
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000 }
  );

  const { data: optionsEmpresas = [] } = useQuery(
    'listaEmpresasIformatica',
    buscarEmpresas,
    { staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const { data: dadosFuncionarios = [], refetch } = useQuery(
    ['funcionarios-loja'],
    () => buscarFuncionariosLoja({ idEmpresa: empresaSelecionada, cpf: cpfFiltro, situacao: situacaoSelecionada }),
    { enabled: true, staleTime: 60 * 60 * 1000 }
  );

  const handleChangeEmpresa = (e) => {
    if (e.value === '') {
      setEmpresaSelecionada('');
      return;
    }

    const selectedEmpresa = optionsEmpresas.find(empresa => empresa.IDEMPRESA === e.value);
    setEmpresaSelecionadaNome(selectedEmpresa.NOFANTASIA);
    setEmpresaSelecionada(e.value);
  };

  const handleCadastro = () => {
    if (optionsModulos[0]?.CRIAR == 'True') {
      setModalCadastro(true);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'Você não tem permissão para cadastrar funcionários.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleClick = () => {
    setCpfFiltro(cpfInput);
    refetch();
  };

  return {
    empresaSelecionada,
    empresaSelecionadaNome,
    cpfInput,
    setCpfInput,
    situacaoSelecionada,
    setSituacaoSelecionada,
    modalCadastro,
    setModalCadastro,
    optionsModulos,
    optionsEmpresas,
    dadosFuncionarios,
    handleChangeEmpresa,
    handleCadastro,
    handleClick,
    refetch,
  };
};
