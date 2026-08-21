import { get } from "../../../../../api/funcRequest";
import { buscarTodasPaginas } from "../../../../../services/paginatedFetch";

export const buscarMenusExcecao = async (idUsuario, idMenuFilho) => {
  const response = await get(`/menus-usuario-excecao?idUsuario=${idUsuario}&idMenuFilho=${idMenuFilho}`);

  return response.data;
};

export const buscarEmpresas = async () => {
  const response = await get(`/listaEmpresasIformatica`);

  return response.data;
};

export const buscarFuncionariosLoja = ({ idEmpresa, cpf, situacao }) => {
  const urlApi = `/funcionarios-loja?idEmpresa=${idEmpresa}&noFuncionarioCPF=${cpf}&situacao=${situacao}`;

  return buscarTodasPaginas(urlApi);
};
