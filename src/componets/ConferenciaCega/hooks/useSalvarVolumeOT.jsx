import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getDataAtual } from "../../../utils/dataAtual";
import { post, put } from "../../../api/funcRequest";
import axios from "axios";

export const useSalvarVolumeOT = (dadosSalvarVolume) => {
  const [descricao, setDescricao] = useState('')
  const [qtdVolume, setQtdVolume] = useState('')
  const [conferirItens, setConferirItens] = useState('')
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    getIPUsuario();
  }, [usuarioLogado]);

  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/')
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }


  const handleRadioChange = (event) => {
    const { id } = event.target;
    if (id === 'Sim') {
      setConferirItens('True');
    } else if (id === 'Nao') {
      setConferirItens('False');
    }
  };


  const onSalvarVolume = async () => {
    if(qtdVolume === '' || qtdVolume <= 0) {
      Swal.fire({
          icon: 'error',
          title:'Erro!',
          text: 'Necessário preencher a Quantidade!',
          customClass: {
              container: 'custom-swal',
          },
          timer: 3000,
      })
      return;
    }

    if(descricao === '') {
      Swal.fire({
          icon: 'error',
          title:'Erro!',
          text: 'Necessário preencher a Descrição!',
          customClass: {
              container: 'custom-swal',
          },
          timer: 3000,
      })
      return;
    }

    const putData = {
      IDSTATUSOT: parseInt(3),
      IDRESUMOT: dadosSalvarVolume.IDRESUMOT,
      IDEMPRESAORIGEM: usuarioLogado.IDEMPRESA,
      NUTOTALVOLUMES: qtdVolume,
      TPVOLUME: descricao,
      NOTAFISCAL: parseInt(0),
    };
    
    Swal.fire({
      icon: 'question',
      title: `Deseja Finalizar a OT?`,
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonColor: '#FD1381',
      confirmButtonColor: '#7352A5',
      confirmButtonText: 'Sim, quero Finalizar!',
      cancelButtonText: 'Não',
      customClass: {
        container: 'custom-swal',
      },
      timer: 3000,
      preConfirm: async () => {
        try {

          const response = await put('/listaOrdemTransferenciaConferenciaCega/:id', putData);
          
          
          const textDados = JSON.stringify(putData);
          let textoFuncao = 'CONFERENCIA CEGA / FINALIZAR OT';

          const createData = {
            IDFUNCIONARIO: usuarioLogado.id,
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario
          };

          const responsePost = await post('/log-web', createData)
            
          Swal.fire({
            title: 'Sucesso!',
            text: 'OT Finalizada com sucesso.',
            icon: 'success'
          });
          
        
          return responsePost.data;

        } catch (error) {
          Swal.fire('Erro!', 'Erro ao Finalizar OT.', 'error');
        }
      }
    });
  };

  return {
    descricao,
    setDescricao,
    qtdVolume,
    setQtdVolume,
    conferirItens,
    setConferirItens,
    usuarioLogado,
    setUsuarioLogado,
    onSalvarVolume,
  };
};