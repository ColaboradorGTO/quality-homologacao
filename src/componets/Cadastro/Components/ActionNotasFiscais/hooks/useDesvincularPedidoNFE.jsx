import { useEffect, useState } from "react"
import axios from "axios"
import Swal from 'sweetalert2'
import { post } from "../../../../../api/funcRequest"


export const useDesvincularPedidoNFE = ({
    handleClose,
    usuarioLogado,
    optionsModulos,
    handleClick,
    dadosPedidosVinculados
}) => {
    const [ipUsuario, setIpUsuario] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
            const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
            usuarioIP = ipWhoisData?.ip;
        } catch (error) {
            console.error("Erro ao buscar IP via ifconfig.me:", error);
        }

        if (!usuarioIP) {
            try {
                const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
                usuarioIP = ipifyData?.ip;
            } catch (error) {
                console.error("Erro ao buscar IP via ipify.org:", error);
            }
        }
        setIpUsuario(usuarioIP);
        return usuarioIP;
    };


  
    const onSubmit = async () => {
        if (optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                icon: 'error',
                title: 'Acesso Negado!',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para desvincular pedidos!`,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        if (!selectedItems || selectedItems.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Nenhum pedido selecionado',
                text: 'Selecione pelo menos um pedido para desvincular!',
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        // Extrair todos os IDPEDIDOs
        const idsPedidos = selectedItems.map(item => item.IDPEDIDO);

        let sucessos = [];
        let erros = [];

        // Mostrar loading
        Swal.fire({
            title: 'Desvinculando pedidos...',
            text: `Processando ${idsPedidos.length} pedido(s)`,
            customClass: {
                container: 'custom-swal',
            },
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });


        for (let index = 0; index < selectedItems.length; index++) {
            const item = selectedItems[index];
            
            const putData = {
                IDRESUMOPEDIDO: parseInt(item.IDPEDIDO),
                IDRESUMOENTRADA: parseInt(dadosPedidosVinculados.idNotaFiscal),
                STATIVO: 'False'
            };


            try {
                const response = await post('/desvincular-nf-pedido', putData);
        
                const textDados = JSON.stringify(putData);
                let textFuncao = 'CADASTRO / DESVINCULANDO PEDIDOS';
                const ipUsuario = await getIPUsuario();

                const createtLog = {
                    IDFUNCIONARIO: String(usuarioLogado.id),
                    PATHFUNCAO: textFuncao,
                    DADOS: textDados,
                    IP: ipUsuario || 'Indisponível'
                };

                await post('/log-web', createtLog);

                sucessos.push({
                    pedido: item.IDPEDIDO,
                    response: response.data
                });

            } catch (error) {
                const textDados = JSON.stringify(putData);
                let textFuncao = 'CADASTRO / ERRO AO DESVINCULAR PEDIDOS';
                const ipUsuario = await getIPUsuario();

                const createtLog = {
                    IDFUNCIONARIO: String(usuarioLogado.id),
                    PATHFUNCAO: textFuncao,
                    DADOS: textDados,
                    IP: ipUsuario || 'Indisponível'
                };

                await post('/log-web', createtLog);

                erros.push({
                    pedido: item.IDPEDIDO,
                    error: error.response?.data?.message || error.message
                });

                console.error(`❌ Detalhes do erro para pedido ${item.IDPEDIDO}:`, error);
            }
        }
        Swal.close();

        if (erros.length === 0) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Sucesso!',
                text: `${sucessos.length} pedido(s) desvinculado(s) com sucesso.`,
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
        } else if (sucessos.length === 0) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: `Falha ao desvincular todos os ${erros.length} pedido(s).`,
                footer: `Pedidos com erro: ${erros.map(e => e.pedido).join(', ')}`,
                customClass: {
                    container: 'custom-swal',
                }
            });
        } else {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Parcialmente concluído',
                html: `
                    <div style="text-align: left;">
                        <p><strong>✅ Sucessos (${sucessos.length}):</strong><br/>
                        ${sucessos.map(s => `Pedido ${s.pedido}`).join('<br/>')}</p>
                        
                        <p><strong>❌ Erros (${erros.length}):</strong><br/>
                        ${erros.map(e => `Pedido ${e.pedido}: ${e.error}`).join('<br/>')}</p>
                    </div>
                `,
                customClass: {
                    container: 'custom-swal',
                }
            });
        }

        handleClick();
        handleClose();
        return {
            sucessos,
            erros,
            total: selectedItems.length
        };
    }
    
    return {
        selectedItems,
        setSelectedItems,
        onSubmit,
    }
}



