import Swal from "sweetalert2";
import { put, post } from "../../../../../api/funcRequest";
import axios from "axios";
import { useState } from "react";

export const useHandleDetalhar = ({ optionsModulos, usuarioLogado, handleClickVendasPix }) => {
  const [ipUsuario, setIpUsuario] = useState('');

  const getIPUsuario = async () => {
    try {
      const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
      let usuarioIP = ipWhoisData?.ip;

      if (!usuarioIP) {
      const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
      usuarioIP = ipifyData?.ip;
      }

      setIpUsuario(usuarioIP);
      return usuarioIP;
    } catch (error) {
      console.error("Erro ao buscar IP:", error);
      return null;
    }
  };

  const handleDetalhar = async (IDVENDA) => {
    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Erro!',
        text: 'Você não tem permissão para realizar esta ação.',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 4000
      });
      return
    }

    try {
      if (typeof IDVENDA === 'string') {
        IDVENDA = [IDVENDA];
      }

      Swal.fire({
        title: 'Informe a Data de Compensação',
        html: '<input type="date" id="dtcompensacao" name="DTCompensacao" class="form-control" value="" >',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const dtCompensacao = document.getElementById('dtcompensacao').value;

          const dados = IDVENDA.map(id => ({
            "IDVENDA": id,
            "STCONFERIDO": 'True',
            "DATA_COMPENSACAO": dtCompensacao
          }));

          await put("/venda-pix-status-conferido", dados);

          const textdados = JSON.stringify(dados);
          const textoFuncao = 'FINANCEIRO/CONFIRMADA CONFERENCIA DA VENDA';
          const ipUsuario = await getIPUsuario();
          const dadosConfirmaDep = [{
            "IDFUNCIONARIO": usuarioLogado.IDFUNCIONARIO,
            "PATHFUNCAO": textoFuncao,
            "DADOS": textdados,
            "IP": ipUsuario
          }];

          await post("/log-web", dadosConfirmaDep);
          handleClickVendasPix()
          Swal.fire('Sucesso!', 'Venda detalhada com sucesso.', 'success');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log('Ação cancelada pelo usuário.');
        }
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  return { handleDetalhar };
};
