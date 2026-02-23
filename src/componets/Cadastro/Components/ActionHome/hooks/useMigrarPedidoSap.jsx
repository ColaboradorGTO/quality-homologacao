import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useMigrarPedidoSap = (dadosDetalheProdutoPedido) => {
  const [loading, setLoading] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);;
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


  const migrarPedidoSap = async (IDRESUMOPEDIDIO) => {
  
    if(dadosDetalheProdutoPedido.data.length >  0) {
      Swal.fire({
        title: `Existe Produtos do Pedido: ${dadosDetalheProdutoPedido[0]?.IDPEDIDO} que não foram Migrados para o SAP`,
        icon: "warning",
        showConfirmButton: true,
        timer: 3000
      });

    } 

    try {
      Swal.fire({
        title: `Certeza que Deseja Migrar esse Pedido?`,
        text: "Você não poderá reverter esta ação!",
        icon: "info",
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: "Sim, Enviar",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary btn-lg",
          cancelButton: "btn btn-danger btn-lg",
          loader: 'custom-loader'
        },
        loaderHtml: '<div class="spinner-border text-primary"></div>',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const putData = {  
              IDRESUMOPEDIDIO: parseInt(IDRESUMOPEDIDIO),
            }

            const response = await post(`/pedido-compra/:id`, putData);

            const textDados = JSON.stringify(putData)
            let textoFuncao = 'CADASTRO/MIGRAR PEDIDO SAP';
          
            const postData = {  
              IDFUNCIONARIO: usuarioLogado.id,
              PATHFUNCAO:  textoFuncao,
              DADOS: textDados,
              IP: ipUsuario
            }
    
            const responsePost = await post('/log-web', postData)
        
            Swal.fire({
              title: 'Sucesso', 
              text: 'Pedido Migrado com Sucesso', 
              icon: 'success'
            })
  
            return responsePost;
          } catch(error) {
            let textoFuncao = 'CADASTRO/ERRO AO MIGRAR PEDIDO SAP';
          
            const postData = {  
              IDFUNCIONARIO: usuarioLogado.id,
              PATHFUNCAO:  textoFuncao,
              DADOS: 'ERRO AO MIGRAR PEDIDO SAP',
              IP: ipUsuario
            }
  
            const responsePost = await post('/log-web', postData)

            return responsePost.data;
          }

        }
      })
        
      
    } catch (error) {
      Swal.fire({
          icon: "error",
          title: "Erro ao Enviar Pedido para o SAP!",
          text: "Erro ao subir o pedido para o SAP, tente novamente!",
      });
    }
    // try {
        
        
        
    //   const response = await post(`/incluir-atualizar-produto-pedido?codProdutoPedido=${dadosDetalheProdutoPedido[0]?.IDPEDIDO}`);

    //   const postData  = {
    //       IDFUNCIONARIO: usuarioLogado?.id, 
    //       PATHFUNCAO: "CADASTRO/ENVIAR PEDIDO PARA COMPRAS",
    //       DADOS: 'Pedido: ' + dadosDetalheProdutoPedido[0]?.IDPEDIDO + ' - ' + motivo,
    //       IP: ipUsuario
    //   }
    //   // Registra o log da ação
    //   const responsePost = await post("/log-web", postData);
      
    //   await Swal.fire({
    //       icon: "success",
    //       title: "Pedido Enviado!",
    //       text: "O pedido Migrado com sucesso.",
    //   });
      
    //   return responsePost.data;
    // } catch (error) {
    //     Swal.fire({
    //         icon: "error",
    //         title: "Erro ao Enviar Pedido para o SAP!",
    //         text: "Erro ao subir o pedido para o SAP, tente novamente!",
    //     });
    // } 
  };

  return { migrarPedidoSap, loading };
};
