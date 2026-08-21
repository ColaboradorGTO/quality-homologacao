import Swal from "sweetalert2";

const exibirAlerta = (title, text, icon) => Swal.fire({
  title,
  text,
  icon,
  timer: 3000,
  customClass: {
    container: 'custom-swal',
  }
});

export const validarPermissaoAlterarFuncionario = (optionsModulos, mensagem) => {
  if (optionsModulos[0]?.ALTERAR == 'False') {
    exibirAlerta('Acesso Negado', mensagem, 'error');
    return false;
  }
  return true;
};

export const validarEmpresaSelecionada = (empresaSelecionada) => {
  if (!empresaSelecionada.value) {
    exibirAlerta('Erro ao Cadastrar', 'Empresa não selecionada', 'error');
    return false;
  }
  return true;
};

export const validarCategoriaContratacao = (categoriaContratacao) => {
  if (!['CLT', 'PJ'].includes(categoriaContratacao)) {
    exibirAlerta('Erro ao Cadastrar', 'Categoria de Contratação nao selecionada', 'error');
    return false;
  }
  return true;
};

export const validarLimiteDesconto = (valorDesconto) => {
  if (parseFloat(valorDesconto) > 50) {
    exibirAlerta('Desconto maior que permitido', 'Valor Desconto maior que permitido', 'error');
    return false;
  }
  return true;
};

export const exibirSucessoAtualizacaoFuncionario = () => {
  exibirAlerta('Atualização', 'Atualizção Realizada com Sucesso', 'success');
};

export const exibirErroAtualizacaoFuncionario = () => {
  exibirAlerta('Erro ao Atualizar', 'Erro ao Tentar Atualizar', 'error');
};
