import Swal from "sweetalert2";
import { get, post, put } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { getDataAtual } from "../../../../../utils/dataAtual";
import axios from 'axios';
import { Funcoes } from '../../../../../../tipoFuncao.json';
import { Parceiro, situacao, localizacao, Departamentos } from '../../../../../../parceiro.json';
import { removerMascaraCPF } from "../../../../../utils/formatCPF";
import { removerFormatacaoMoeda } from "../../../../../utils/formatMoeda";
import { removerMascaraTelefone } from "../../../../../utils/mascaraTelefone";

export const useCriarFuncionario = ({ handleClose, usuarioLogado, optionsModulos, refetch }) => {
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [subGrupoEmpresarialSelecionado, setSubGrupoEmpresarialSelecionado] = useState('');
  const [funcaoSelecionada, setFuncaoSelecionada] = useState('');
  const [cpfFuncionario, setCPFFuncionario] = useState('');
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [localizacaoSelcionada, setLocalizacaoSelecionada] = useState('');
  const [categoriaContratacao, setCategoriaContratacao] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [valorSalario, setValorSalario] = useState(0);
  const [valorDesconto, setValorDesconto] = useState(0);
  const [situacaoSelecionada, setSituacaoSelecionada] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [isChecked, setIsChecked] = useState(false);;
  const [cpf, setCPF] = useState('');
  const [ipUsuario, setIpUsuario] = useState('');
  const [excecao, setExcecao] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [idFuncionario, setIdFuncionario] = useState(null);
  const [formularioVisivelLogin, setFormularioVisivelLogin] = useState(false);
  const [formularioVisivel, setFormularioVisivel] = useState(true);
  const [usuario, setUsuario] = useState('')
  const [senhaLogin, setSenhaLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [repitaSenha, setRepitaSenha] = useState('')
  const [noLogin, setNoLogin] = useState('')
  const [idPerfil, setIdPerfil] = useState('')
  const [telefone, setTelefone] = useState('')
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState('')
  const storedModule = localStorage.getItem('moduloselecionado');
  const selectedModule = JSON.parse(storedModule);

  useEffect(() => {
    const dataAtual = getDataAtual()
    setDataAdmissao(dataAtual)
  }, [])

  const getIPUsuario = async () => {
    let usuarioIP = null;

    try {
      const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
      usuarioIP = ipWhoisData?.ip;
    } catch (error) {
      console.error("Erro ao buscar IP via ipwho.is:", error);
    }

    if (!usuarioIP) {
      try {
        const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
        usuarioIP = ipifyData?.ip;
      } catch (error) {
        console.error("Erro ao buscar IP via ipify.org:", error);
      }
    }
    setIpUsuario(usuarioIP);
    return usuarioIP;
  };

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresa } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);
      
      return response.data;
    },
    {enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const { data: optionsCPF = [], error: errorCPF, isLoading: isLoadingCPF } = useQuery(
    ['funcionarios-loja', cpfFuncionario],
    async () => {
      const response = await get(`/funcionarios-loja?cpf=${removerMascaraCPF(cpfFuncionario)}`);

      return response.data;
    },
    { enabled: cpfFuncionario.length > 10 }
  );

  useEffect(() => {
    if (optionsCPF.length > 0) {
      const funcionarioExistente = optionsCPF[0];
      setIdFuncionario(funcionarioExistente?.IDFUNCIONARIO);
      setEmpresaSelecionada({ value: funcionarioExistente?.IDEMPRESA, label: funcionarioExistente?.NOFANTASIA });
      setSubGrupoEmpresarialSelecionado(funcionarioExistente?.IDSUBGRUPOEMPRESARIAL);
      setFuncaoSelecionada({ value: funcionarioExistente?.DSFUNCAO, label: funcionarioExistente?.DSFUNCAO });
      setNomeFuncionario(funcionarioExistente?.NOFUNCIONARIO);
      setLocalizacaoSelecionada({ value: funcionarioExistente?.STLOJA == 'True' ? 'Loja' : 'Escritório', label: funcionarioExistente?.STLOJA == 'True' ? 'Loja' : 'Escritório' });
      setCategoriaContratacao(funcionarioExistente.DSTIPO);
      setDataAdmissao(funcionarioExistente.DATA_ADMISSAO);
      setValorSalario(funcionarioExistente.VALORSALARIO);
      setValorDesconto(funcionarioExistente.PERC);
      setSituacaoSelecionada({ value: funcionarioExistente?.STATIVO == 'True' ? 'Ativo' : 'Inativo', label: funcionarioExistente?.STATIVO == 'True' ? 'Ativo' : 'Inativo' });
      setTipoSelecionado({ value: funcionarioExistente?.DSTIPO, label: funcionarioExistente?.DSTIPO });
      setNoLogin(funcionarioExistente.NOLOGIN);
      setIdPerfil(funcionarioExistente.IDPERFIL);
      if (funcionarioExistente.STCONVENIO == 'True' && funcionarioExistente.STDESCONTOFOLHA == 'True') {
        setIsChecked(true);
        
        setCategoriaContratacao('CLT');
      } else if (funcionarioExistente.STCONVENIO == 'False' && funcionarioExistente.STDESCONTOFOLHA == 'False') {
        setIsChecked(false);
        setCategoriaContratacao('PJ');
      }
  
      setSenha(funcionarioExistente.PWSENHA);
      setCPF(funcionarioExistente.NUCPF);
      setTelefone(funcionarioExistente.TELEFONE);
      setDepartamentoSelecionado({ value: funcionarioExistente.DEPARTAMENTO, label: funcionarioExistente.DEPARTAMENTO });
    }                            

  }, [optionsCPF]);

  useEffect(() => {
    if (optionsCPF && optionsCPF.length > 0) {
      Swal.fire({
        title: 'Funcionário já cadastrado!',
        icon: 'warning',
        confirmButtonText: 'Ok',
        customClass: {
          container: 'custom-swal',
        }
      });
    }
  }, [optionsCPF]);

  const handleRadioChange = (event) => {
    const { id } = event.target;
    if (id === 'radioCLT') {
      setCategoriaContratacao('CLT');
    } else if (id === 'radioPJ') {
      setCategoriaContratacao('PJ');
    }
  };

  const loginConfirmacao = async () => {
    setFormularioVisivelLogin(true);
    setFormularioVisivel(false);

    const postData = {
      usuario: usuario,
      senha: senhaLogin,
      modulo: selectedModule?.nome
    }
    try {
      const response = await post('/login', postData);

      const textDados = JSON.stringify(postData)
      const textoFuncao = 'RH/AUTORIZAÇÃO DESCONTO FOLHA FUNCIONARIO';
      const ipUsuario = await getIPUsuario();
      const createLog = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createLog)

      setFormularioVisivelLogin(false);
      setFormularioVisivel(true);
      setIsLoading(true);
      return responsePost.data;
    } catch (error) {
      Swal.showValidationMessage(`Erro ao autenticar: ${error.message}`);
    }

  };

  
  const onSubmit = async (e) => {
    let maximoDesconto = 0;
    let dataBase = new Date('2024-08-01')
    let diferencaDias = Math.ceil((dataBase - new Date()) / (1000 * 60 * 60 * 24));

    if (diferencaDias < 90) {
      maximoDesconto = 10;
    } else if (diferencaDias >= 90 && diferencaDias < 365) {
      maximoDesconto = 15;
    } else if (diferencaDias >= 365 && diferencaDias < 730) {
      maximoDesconto = 20;
    }

    const cpfSemMascara = removerMascaraCPF(cpfFuncionario);

    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        title: 'Acesso Negado',
        text: 'Usuário não tem permissão para Cadastrar Funcionários',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if (!empresaSelecionada.value) {
      Swal.fire({
        title: 'Erro ao Cadastrar',
        text: 'Empresa não selecionada',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;

    }


    if (!['CLT', 'PJ'].includes(categoriaContratacao)) {
      Swal.fire({
        title: 'Erro ao Cadastrar',
        text: 'Categoria de Contratação nao selecionada',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if (parseFloat(valorDesconto) > 50) {
      Swal.fire({
        title: 'Desconto maior que permitido',
        text: 'Valor Desconto maior que permitido',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    const isUpdate = optionsCPF.length > 0 && idFuncionario;

    
    const postData = {
      IDFUNCIONARIO: usuarioLogado.id,
      IDSUBGRUPOEMPRESARIAL: Number(subGrupoEmpresarialSelecionado),
      IDEMPRESA: Number(empresaSelecionada.value),
      NOFUNCIONARIO: String(nomeFuncionario),
      NUCPF: String(cpfSemMascara),
      PWSENHA: String(cpfSemMascara.substring(0, 5)),
      DSFUNCAO: String(funcaoSelecionada.value),
      VALORSALARIO: removerFormatacaoMoeda(valorSalario),
      PERC: parseFloat(valorDesconto) || parseFloat(0),
      STATIVO: 'True',
      DSTIPO: String(tipoSelecionado.value),
      VALORDISPONIVEL: 0,
      STCONVENIO: String(categoriaContratacao) === 'CLT' ? "True" : "False",
      STDESCONTOFOLHA: String(categoriaContratacao) === 'CLT' ? "True" : "False",
      STLOJA: localizacaoSelcionada?.value == 'Loja' ? "True" : "False",
      DATA_ADMISSAO: String(dataAdmissao),
      TELEFONE: removerMascaraTelefone(telefone),
      DEPARTAMENTO: departamentoSelecionado?.value

    }

    const putData = {
      ID: idFuncionario,
      DATA_ADMISSAO: dataAdmissao,
      IDFUNCIONARIOULTALTERACAO: usuarioLogado.id,
      NOFUNCIONARIO: nomeFuncionario,
      NUCPF: cpfSemMascara,
      NOLOGIN: noLogin,
      PWSENHA: cpfSemMascara.substring(0, 5),
      IDEMPRESA: empresaSelecionada.value,
      IDSUBGRUPOEMPRESARIAL: subGrupoEmpresarialSelecionado,
      DSFUNCAO: funcaoSelecionada.value,
      IDFUNCIONARIO: idFuncionario,
      DSTIPO: tipoSelecionado.value,
      PERC: parseFloat(valorDesconto),
      VALORSALARIO: removerFormatacaoMoeda(valorSalario),
      VALORDISPONIVEL: 0,
      IDPERFIL: idPerfil,
      STCONVENIO: String(categoriaContratacao) === 'CLT' ? "True" : "False",
      STDESCONTOFOLHA: String(categoriaContratacao) === 'CLT' ? "True" : "False",
      STATIVO: situacaoSelecionada.value == 'Ativo' ? "True" : "False",
      STLOJA: localizacaoSelcionada.value == 'Loja' ? "True" : "False",
      TELEFONE: removerMascaraTelefone(telefone),
      DEPARTAMENTO: departamentoSelecionado?.value
    }

    try {
      let response;

      if (isUpdate) {
        response = await put('/funcionarios-loja/:id', putData);
      } else {
        response = await post('/criar-funcionarios-loja', postData);
      }

      setEmpresaSelecionada('');
      setNomeFuncionario('');
      setCPFFuncionario('');
      setValorSalario('');
      setValorDesconto(0);
      setTipoSelecionado('');
      setLocalizacaoSelecionada('');

      Swal.fire({
        title: 'Atualização',
        text: 'Atualizção Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      const textDados = JSON.stringify(putData)
      const textoFuncao = 'RH/UPDATE DE FUNCIONARIOS';

      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)

      handleClose();
      return responsePost.data;
    } catch (error) {


      const textDados = JSON.stringify(putData)
      const textoFuncao = 'RH/ERRO AO CRIAR OU ATUALIZAR FUNCIONARIO';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)

      Swal.fire({
        title: 'Erro ao Atualizar',
        text: 'Erro ao Tentar Atualizar',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return responsePost.data;
    }
  }

  const handleChangeEmpresa = (selected) => {
    setEmpresaSelecionada(selected);
    const empresa = optionsEmpresas.find((item) => item.IDEMPRESA === selected);
    setSubGrupoEmpresarialSelecionado(empresa.IDSUBGRUPOEMPRESARIAL);
  }

  return {
    empresaSelecionada,
    setEmpresaSelecionada,
    subGrupoEmpresarialSelecionado,
    setSubGrupoEmpresarialSelecionado,
    funcaoSelecionada,
    setFuncaoSelecionada,
    cpfFuncionario,
    setCPFFuncionario,
    nomeFuncionario,
    setNomeFuncionario,
    localizacaoSelcionada,
    setLocalizacaoSelecionada,
    categoriaContratacao,
    setCategoriaContratacao,
    dataAdmissao,
    setDataAdmissao,
    valorSalario,
    setValorSalario,
    valorDesconto,
    setValorDesconto,
    situacaoSelecionada,
    setSituacaoSelecionada,
    tipoSelecionado,
    setTipoSelecionado,
    isChecked,
    setIsChecked,
    senha,
    setSenha,
    repitaSenha,
    setRepitaSenha,
    cpf,
    setCPF,
    ipUsuario,
    setIpUsuario,
    excecao,
    setExcecao,
    formularioVisivelLogin,
    setFormularioVisivelLogin,
    formularioVisivel,
    setFormularioVisivel,
    usuario,
    setUsuario,
    optionsEmpresas,
    optionsCPF,
    handleRadioChange,
    handleChangeEmpresa,
    Funcoes,
    localizacao,
    situacao,
    Parceiro,
    Departamentos,
    onSubmit,
    loginConfirmacao,
    senhaLogin,
    setSenhaLogin,
    isLoggedIn,
    setIsLoggedIn,
    telefone,
    setTelefone,
    departamentoSelecionado,
    setDepartamentoSelecionado
  }
}
