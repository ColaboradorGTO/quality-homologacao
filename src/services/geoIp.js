import axios from 'axios';

export const getIPUsuario = async () => {
  let usuarioIP = null;

  try {
    const { data } = await axios.get('https://ifconfig.me/ip');
    usuarioIP = data?.ip;
  } catch (error) {
    console.error('Erro ao buscar IP via ifconfig.me:', error);
  }

  if (!usuarioIP) {
    try {
      const { data } = await axios.get('https://api.ipify.org?format=json');
      usuarioIP = data?.ip;
    } catch (error) {
      console.error('Erro ao buscar IP via ipify.org:', error);
    }
  }

  return usuarioIP;
};
