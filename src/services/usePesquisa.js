import { get } from "../api/funcRequest";

export const buscarMenusExcecao = async (idUsuario, idMenuFilho) => {
  const response = await get(`/menus-usuario-excecao?idUsuario=${idUsuario}&idMenuFilho=${idMenuFilho}`);

  return response.data;
};

export const buscarEmpresasMarca = async (idMarca) => {
  const response = await get(`/listaEmpresaComercial?idMarca=${idMarca}`);

  return response.data;
};

export const buscarMarca = async () => {
  const response = await get(`/marcasLista`);

  return response.data;
};

export const buscarFornecedor = async () => {
  const response = await get(`/fornecedores`);

  return response.data;
};

export const buscarComprador = async () => {
  const response = await get(`/compradores`);

  return response.data;
};

export const buscarFabricante = async () => {
  const response = await get(`/fabricantes`);

  return response.data;
};