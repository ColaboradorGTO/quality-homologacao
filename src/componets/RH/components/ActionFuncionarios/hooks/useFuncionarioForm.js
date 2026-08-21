import Swal from "sweetalert2";
import { get, post, put } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { registrarLogAuditoria } from "../../../../../services/auditLog";
import { Funcoes } from '../../../../../../tipoFuncao.json';
import { Parceiro, situacao, localizacao, Departamentos } from '../../../../../../parceiro.json';
import { removerMascaraCPF } from "../../../../../utils/formatCPF";
import { removerFormatacaoMoeda } from "../../../../../utils/formatMoeda";
import { removerMascaraTelefone } from "../../../../../utils/mascaraTelefone";
import { useFuncionarioFormFields } from "./useFuncionarioFormFields";
import { criarHandleRadioChangeCategoria, criarLoginConfirmacao } from "../services/funcionarioFormHandlers";
import {
  validarPermissaoAlterarFuncionario,
  validarEmpresaSelecionada,
  validarCategoriaContratacao,
  validarLimiteDesconto,
  exibirSucessoAtualizacaoFuncionario,
  exibirErroAtualizacaoFuncionario,
} from "../services/funcionarioValidacao";
import { buscarEmpresas } from "../services/funcionarioService";

export const useFuncionarioForm = ({
  modo,
  handleClose,
  usuarioLogado,
  optionsModulos,
  refetch,
  dadosAtualizarFuncionarios,
  handleClick,
}) => {
  const isCriar = modo === 'criar';

  const {
    empresaSelecionada, setEmpresaSelecionada,
    subGrupoEmpresarialSelecionado, setSubGrupoEmpresarialSelecionado,
    funcaoSelecionada, setFuncaoSelecionada,
    cpfFuncionario, setCPFFuncionario,
    nomeFuncionario, setNomeFuncionario,
    localizacaoSelcionada, setLocalizacaoSelecionada,
    categoriaContratacao, setCategoriaContratacao,
    dataAdmissao, setDataAdmissao,
    valorSalario, setValorSalario,
    valorDesconto, setValorDesconto,
    situacaoSelecionada, setSituacaoSelecionada,
    tipoSelecionado, setTipoSelecionado,
    isChecked, setIsChecked,
    cpf, setCPF,
    excecao, setExcecao,
    isLoggedIn, setIsLoggedIn,
    formularioVisivelLogin, setFormularioVisivelLogin,
    formularioVisivel, setFormularioVisivel,
    usuario, setUsuario,
    senhaLogin, setSenhaLogin,
    senha, setSenha,
    repitaSenha, setRepitaSenha,
    noLogin, setNoLogin,
    telefone, setTelefone,
    departamentoSelecionado, setDepartamentoSelecionado,
  } = useFuncionarioFormFields({ valorSalarioInicial: isCriar ? 0 : '' });

  const [idFuncionario, setIdFuncionario] = useState(null);
  const [idPerfil, setIdPerfil] = useState('');

  const storedModule = localStorage.getItem('moduloselecionado');
  const selectedModule = JSON.parse(storedModule);

 
  const { data: optionsEmpresas = [] } = useQuery(
    'listaEmpresasIformatica',
    
    buscarEmpresas,
    { staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );
 

  useEffect(() => {
    if (!isCriar) return;
    setDataAdmissao(getDataAtual());
  }, [isCriar]);

  const { data: optionsCPF = [], error: errorCPF, isLoading: isLoadingCPF } = useQuery(
    ['funcionarios-loja', cpfFuncionario],
    async () => {
      const response = await get(`/funcionarios-loja?cpf=${removerMascaraCPF(cpfFuncionario)}`);

      return response.data;
    },
    { enabled: isCriar && cpfFuncionario.length > 10 }
  );

  useEffect(() => {
    if (!isCriar || optionsCPF.length === 0) return;

    const funcionarioExistente = optionsCPF[0];
    setIdFuncionario(funcionarioExistente?.IDFUNCIONARIO);
    setEmpresaSelecionada({ value: funcionarioExistente?.IDEMPRESA, label: funcionarioExistente?.NOFANTASIA });
    setSubGrupoEmpresarialSelecionado(funcionarioExistente?.IDSUBGRUPOEMPRESARIAL);
    setFuncaoSelecionada({ value: funcionarioExistente?.DSFUNCAO, label: funcionarioExistente?.DSFUNCAO });
    setNomeFuncionario(funcionarioExistente?.NOFUNCIONARIO);
    setLocalizacaoSelecionada({ value: funcionarioExistente?.STLOJA == 'True' ? 'True' : 'False', label: funcionarioExistente?.STLOJA == 'True' ? 'Loja' : 'Escritório' });
    setCategoriaContratacao(funcionarioExistente.DSTIPO);
    setDataAdmissao(funcionarioExistente.DATA_ADMISSAO);
    setValorSalario(funcionarioExistente.VALORSALARIO);
    setValorDesconto(funcionarioExistente.PERC);
    setSituacaoSelecionada({ value: funcionarioExistente?.STATIVO == 'True' ? 'True' : 'False', label: funcionarioExistente?.STATIVO == 'True' ? 'Ativo' : 'Inativo' });
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
  }, [isCriar, optionsCPF]);

  useEffect(() => {
    if (!isCriar) return;

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
  }, [isCriar, optionsCPF]);

  useEffect(() => {
    if (isCriar || !dadosAtualizarFuncionarios?.[0]) return;

    setEmpresaSelecionada({ value: dadosAtualizarFuncionarios[0]?.IDEMPRESA, label: dadosAtualizarFuncionarios[0]?.NOFANTASIA });
    setSubGrupoEmpresarialSelecionado(dadosAtualizarFuncionarios[0]?.IDSUBGRUPOEMPRESARIAL);
    setFuncaoSelecionada({ value: dadosAtualizarFuncionarios[0]?.DSFUNCAO, label: dadosAtualizarFuncionarios[0]?.DSFUNCAO });
    setNomeFuncionario(dadosAtualizarFuncionarios[0]?.NOFUNCIONARIO);
    setLocalizacaoSelecionada({ value: dadosAtualizarFuncionarios[0]?.STLOJA == 'True' ? 'True' : 'False', label: dadosAtualizarFuncionarios[0]?.STLOJA == 'True' ? 'Loja' : 'Escritório' });
    setCategoriaContratacao(dadosAtualizarFuncionarios[0].DSTIPO);
    if (dadosAtualizarFuncionarios[0]?.DATA_ADMISSAO) {
      const dataFormatada = dadosAtualizarFuncionarios[0]?.DATA_ADMISSAO.split('T')[0];
      setDataAdmissao(dataFormatada);
    }
    setValorSalario(dadosAtualizarFuncionarios[0].VALORSALARIO);
    setValorDesconto(dadosAtualizarFuncionarios[0].PERC);
    setSituacaoSelecionada({ value: dadosAtualizarFuncionarios[0]?.STATIVO == 'True' ? 'True' : 'False', label: dadosAtualizarFuncionarios[0]?.STATIVO == 'True' ? 'Ativo' : 'Inativo' });
    setTipoSelecionado({ value: dadosAtualizarFuncionarios[0]?.DSTIPO, label: dadosAtualizarFuncionarios[0]?.DSTIPO });
    if (dadosAtualizarFuncionarios[0].STCONVENIO == 'True' && dadosAtualizarFuncionarios[0].STDESCONTOFOLHA == 'True') {
      setIsChecked(true);
      setCategoriaContratacao('CLT');
    } else if (dadosAtualizarFuncionarios[0].STCONVENIO == 'False' && dadosAtualizarFuncionarios[0].STDESCONTOFOLHA == 'False') {
      setIsChecked(false);
      setCategoriaContratacao('PJ');
    }
    setSenha(dadosAtualizarFuncionarios[0].PWSENHA);
    setRepitaSenha(dadosAtualizarFuncionarios[0].PWSENHA);
    setCPF(dadosAtualizarFuncionarios[0].NUCPF);
    setTelefone(dadosAtualizarFuncionarios[0].TELEFONE);
    setDepartamentoSelecionado({ value: dadosAtualizarFuncionarios[0].DEPARTAMENTO, label: dadosAtualizarFuncionarios[0].DEPARTAMENTO });
  }, [isCriar, dadosAtualizarFuncionarios]);

  const handleRadioChange = criarHandleRadioChangeCategoria(setCategoriaContratacao);

  const loginConfirmacao = criarLoginConfirmacao({
    usuario,
    senhaLogin,
    selectedModule,
    usuarioLogado,
    setFormularioVisivelLogin,
    setFormularioVisivel,
  });

  const onSubmitCriar = async () => {
    const cpfSemMascara = removerMascaraCPF(cpfFuncionario);

    if (!validarPermissaoAlterarFuncionario(optionsModulos, 'Usuário não tem permissão para Cadastrar Funcionários')) {
      return;
    }

    if (!validarEmpresaSelecionada(empresaSelecionada)) {
      return;
    }

    if (!validarCategoriaContratacao(categoriaContratacao)) {
      return;
    }

    if (!validarLimiteDesconto(valorDesconto)) {
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
      STLOJA: localizacaoSelcionada?.value,
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
      STATIVO: situacaoSelecionada.value,
      STLOJA: localizacaoSelcionada.value,
      TELEFONE: removerMascaraTelefone(telefone),
      DEPARTAMENTO: departamentoSelecionado?.value
    }

    try {
      let response;

      if (isUpdate) {
        response = await put('/funcionarioLojaRH/:id', putData);
      } else {
        response = await post('/criarFuncionariosLojaRH', postData);
      }

      setEmpresaSelecionada('');
      setNomeFuncionario('');
      setCPFFuncionario('');
      setValorSalario('');
      setValorDesconto(0);
      setTipoSelecionado('');
      setLocalizacaoSelecionada('');

      exibirSucessoAtualizacaoFuncionario();

      const responsePost = await registrarLogAuditoria({
        idFuncionario: usuarioLogado.id,
        pathFuncao: 'RH/UPDATE DE FUNCIONARIOS',
        dados: putData
      });

      handleClose();
      return responsePost.data;
    } catch (error) {
      const responsePost = await registrarLogAuditoria({
        idFuncionario: usuarioLogado.id,
        pathFuncao: 'RH/ERRO AO CRIAR OU ATUALIZAR FUNCIONARIO',
        dados: putData
      });

      exibirErroAtualizacaoFuncionario();
      return responsePost.data;
    }
  };

  const onSubmitEditar = async () => {
    const cpfSemMascara = removerMascaraCPF(cpf);

    if (!validarPermissaoAlterarFuncionario(optionsModulos, `${usuarioLogado?.NOFUNCIONARIO} não tem permissão para Atualizar Funcionários`)) {
      return;
    }

    if (!validarCategoriaContratacao(categoriaContratacao)) {
      return;
    }

    if (!validarLimiteDesconto(valorDesconto)) {
      return;
    }

    const putData = {
      ID: Number(dadosAtualizarFuncionarios[0]?.ID),
      DATA_ADMISSAO: dataAdmissao,
      NOFUNCIONARIO: String(nomeFuncionario),
      NUCPF: cpfSemMascara,
      NOLOGIN: dadosAtualizarFuncionarios[0]?.NOLOGIN,
      PWSENHA: senha,
      IDEMPRESA: parseInt(empresaSelecionada.value),
      IDSUBGRUPOEMPRESARIAL: Number(subGrupoEmpresarialSelecionado),
      IDFUNCIONARIO: dadosAtualizarFuncionarios[0]?.IDFUNCIONARIO,
      DSTIPO: tipoSelecionado.value,
      PERC: parseFloat(valorDesconto),
      VALORSALARIO: removerFormatacaoMoeda(valorSalario),
      VALORDISPONIVEL: parseFloat(0),
      IDPERFIL: Number(dadosAtualizarFuncionarios[0]?.IDPERFIL),
      DSFUNCAO: funcaoSelecionada.value,
      STCONVENIO: categoriaContratacao === 'CLT' ? 'True' : 'False',
      STDESCONTOFOLHA: categoriaContratacao === 'CLT' ? 'True' : 'False',
      STATIVO: situacaoSelecionada.value,
      STLOJA: localizacaoSelcionada.value,
      IDFUNCIONARIOULTALTERACAO: usuarioLogado.id,
      MOTIVODESC: '',
      TELEFONE: removerMascaraTelefone(telefone) || '',
      DEPARTAMENTO: departamentoSelecionado?.value || ''
    }

    try {

      const response = await put('/funcionarioLojaRH/:id', putData);

      await registrarLogAuditoria({
        idFuncionario: usuarioLogado.id,
        pathFuncao: 'RH/ATUALIZAÇÃO DE FUNCIONARIO',
        dados: putData
      });

      exibirSucessoAtualizacaoFuncionario();
      refetch();
      handleClose();
      return response.data;
    } catch (error) {
      handleClick()

      const responsePost = await registrarLogAuditoria({
        idFuncionario: usuarioLogado.id,
        pathFuncao: 'RH/ERRO AO ATUALIZAR FUNCIONARIO',
        dados: putData
      });

      exibirErroAtualizacaoFuncionario();
      return responsePost.data;

    }
  };

  const onSubmit = isCriar ? onSubmitCriar : onSubmitEditar;

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
    setDepartamentoSelecionado,
  }
}
