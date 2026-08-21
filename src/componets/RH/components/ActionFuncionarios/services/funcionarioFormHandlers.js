import Swal from "sweetalert2";
import { post } from "../../../../../api/funcRequest";
import { registrarLogAuditoria } from "../../../../../services/auditLog";

export const criarHandleRadioChangeCategoria = (setCategoriaContratacao) => (event) => {
  const { id } = event.target;
  if (id === 'radioCLT') {
    setCategoriaContratacao('CLT');
  } else if (id === 'radioPJ') {
    setCategoriaContratacao('PJ');
  }
};

export const criarLoginConfirmacao = ({
  usuario,
  senhaLogin,
  selectedModule,
  usuarioLogado,
  setFormularioVisivelLogin,
  setFormularioVisivel,
  pathFuncao = 'RH/AUTORIZAÇÃO DESCONTO FOLHA FUNCIONARIO',
}) => async () => {
  setFormularioVisivelLogin(true);
  setFormularioVisivel(false);

  const postData = {
    usuario: usuario,
    senha: senhaLogin,
    modulo: selectedModule?.nome
  };

  try {
    const response = await post('/login', postData);

    await registrarLogAuditoria({
      idFuncionario: usuarioLogado.id,
      pathFuncao,
      dados: postData
    });

    setFormularioVisivelLogin(false);
    setFormularioVisivel(true);
    return response.data;
  } catch (error) {
    Swal.showValidationMessage(`Erro ao autenticar: ${error.message}`);
  }
};
