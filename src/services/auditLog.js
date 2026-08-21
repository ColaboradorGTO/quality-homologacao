import { post } from '../api/funcRequest';
import { getIPUsuario } from './geoIp';

export const registrarLogAuditoria = async ({ idFuncionario, pathFuncao, dados }) => {
  const ipUsuario = await getIPUsuario();

  return post('/log-web', {
    IDFUNCIONARIO: String(idFuncionario),
    PATHFUNCAO: pathFuncao,
    DADOS: JSON.stringify(dados),
    IP: ipUsuario || 'INDISPONIVEL'
  });
};
