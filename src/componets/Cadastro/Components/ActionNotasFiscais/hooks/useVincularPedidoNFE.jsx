import { useEffect, useState } from "react"
import axios from "axios"
import Swal from 'sweetalert2'
import { post } from "../../../../../api/funcRequest"


export const useVincularPedidoNFE = ({
    handleClose,
    usuarioLogado,
    optionsModulos,
    handleClick,
    selectedIds,
    setSelectedIds,
    dadosListaPedidosSemVinculoNFE
}) => {
    const [ipUsuario, setIpUsuario] = useState('');

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


    const onSubmit = async (selectedItems) => {
        if (optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                icon: 'error',
                title: 'Acesso Negado!',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para vincular pedidos!`,
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
                text: 'Selecione pelo menos um pedido para vincular!',
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        // Extrair todos os IDPEDIDOs
        const idsPedidos = selectedItems.map(item => item.IDPEDIDO);
        console.log('IDs dos pedidos a serem vinculados:', idsPedidos);

        let sucessos = [];
        let erros = [];

        // Mostrar loading
        Swal.fire({
            title: 'Vinculando pedidos...',
            text: `Processando ${idsPedidos.length} pedido(s)`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Processar cada IDPEDIDO individualmente
        for (const item of selectedItems) {
            const putData = {
                IDRESUMOPEDIDO: item.IDPEDIDO,
                IDRESUMOENTRADA: item.idNotaFiscal || dadosListaPedidosSemVinculoNFE.idNotaFiscal
            };

            try {
                console.log(`Vinculando pedido ${item.IDPEDIDO}...`);

                const response = await post('/vincular-nf-pedido', putData);

                // Log de sucesso
                const textDados = JSON.stringify(putData);
                let textFuncao = 'CADASTRO / VINCULANDO PEDIDOS';
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

                console.log(`✅ Pedido ${item.IDPEDIDO} vinculado com sucesso`);

            } catch (error) {
                // Log de erro
                const textDados = JSON.stringify(putData);
                let textFuncao = 'CADASTRO / ERRO AO VINCULAR PEDIDOS';
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

                console.error(`❌ Erro ao vincular pedido ${item.IDPEDIDO}:`, error);
            }
        }

        // Fechar loading
        Swal.close();

        // Mostrar resultado final
        if (erros.length === 0) {
            // Todos os pedidos foram vinculados com sucesso
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Sucesso!',
                text: `${sucessos.length} pedido(s) vinculado(s) com sucesso.`,
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
        } else if (sucessos.length === 0) {
            // Todos falharam
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: `Falha ao vincular todos os ${erros.length} pedido(s).`,
                footer: `Pedidos com erro: ${erros.map(e => e.pedido).join(', ')}`,
                customClass: {
                    container: 'custom-swal',
                }
            });
        } else {
            // Parcialmente sucesso
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

        return {
            sucessos,
            erros,
            total: selectedItems.length
        };
    }
    
    return {
        onSubmit,
    }
}



