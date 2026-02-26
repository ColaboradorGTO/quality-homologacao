import { useState } from "react";
import Swal from "sweetalert2";
import { put } from "../../../../../api/funcRequest";
import axios from "axios";


export const useAtualizarVendasContigencia = ({ dadosVendas, usuarioLogado, optionsModulos }) => {
    const [loading, setLoading] = useState(false);
    const [ipUsuario, setIpUsuario] = useState("");

    // Função para extrair cStat do XML da SEFAZ
    const extrairCStatDoXML = (xml) => {
        if (!xml) return null;
        try {
            const match = xml.match(/<cStat>(\d+)<\/cStat>/);
            return match ? match[1] : null;
        } catch (error) {
            console.error('Erro ao extrair cStat do XML:', error);
            return null;
        }
    };

    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
        const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
        usuarioIP = ipWhoisData?.ip;
        } catch (error) {
        console.error("Erro ao buscar IP via ipwho.is:", error);
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
        if (optionsModulos[0]?.CRIAR === 'False') {
            Swal.fire({
                icon: "error",
                title: "Atenção!",
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para validar vendas!`,
                confirmButtonText: 'OK',
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        try {
            const total = dadosVendas.length;
            Swal.fire({
                title: `Deseja confirmar o envio de ${total} Vendas?`,
                text: "Não será possível reverter essa ação!",
                icon: "info",
                buttonsStyling: false,
                showCancelButton: true,
                confirmButtonText: "Sim",
                cancelButtonText: "Não",
                customClass: {
                    confirmButton: "btn btn-primary btn-lg",
                    cancelButton: "btn btn-danger btn-lg",
                    loader: 'custom-loader'
                },
                loaderHtml: '<div class="spinner-border text-primary"></div>',
            }).then(async (result) => {
                        if (result.isConfirmed) {
                            try {
                                if (!dadosVendas || dadosVendas.length === 0) {
                                    Swal.fire({ icon: 'info', title: 'Nada para enviar', text: 'Não há vendas selecionadas.' });
                                    return;
                                }

                                const total = dadosVendas.length;
                                const ip = await getIPUsuario();

                                let success = 0;
                                let failed = 0;
                                const failedList = [];

        
                                for (let i = 0; i < dadosVendas.length; i++) {
                                    const item = dadosVendas[i];
                                    const IDVENDA = item.IDVENDA;
                                    
                                    // Extrair cStat do XML da SEFAZ
                                    const cStatSefaz = extrairCStatDoXML(item.XML);
                                    
                                    // Só atualiza se cStat da SEFAZ for diferente de 100 (não autorizado)
                                    if (cStatSefaz && cStatSefaz !== '100') {
                                        console.log(`IDVENDA: ${IDVENDA}, cStat SEFAZ: ${cStatSefaz} - Atualizando...`);
                                        
                                        const putData = { IDVENDA };

                                        try {
                                            // envia para a rota com o id no path
                                            await put(`/valida-venda-contingencia/:id`, putData);

                                      
                                        const textDados = JSON.stringify(putData);
                                        const textoFuncao = 'INFORMATICA / VALIDAR VENDAS CONTIGENCIA';
                                        const postData = {
                                            IDFUNCIONARIO: String(usuarioLogado.id),
                                            PATHFUNCAO: textoFuncao,
                                            DADOS: textDados,
                                            IP: ip || ipUsuario
                                        };
                                        // await post('/log-web', postData);

                                            success++;
                                        } catch (err) {
                                            console.error(`Erro ao enviar venda ${IDVENDA}:`, err);
                                            failed++;
                                            failedList.push(IDVENDA);

                                            // registra log de erro

                                            const textDados = JSON.stringify({ IDVENDA, error: err?.message || String(err) });
                                            const textoFuncao = 'INFORMATICA / ERRO AO VALIDAR VENDAS CONTIGENCIA';
                                            const postData = {
                                                IDFUNCIONARIO: String(usuarioLogado.id),
                                                PATHFUNCAO: textoFuncao,
                                                DADOS: textDados,
                                                IP: ip || ipUsuario
                                            };
                                            try { 
                                                // await post('/log-web', postData); 
                                            } catch(e){
                                             
                                                console.error('Erro ao registrar log de falha', e); 
                                            }
                                        }
                                    } else {
                                        // pula a atualização - NFe já autorizada (cStat 100) ou sem XML
                                        console.log(`IDVENDA: ${IDVENDA}, cStat SEFAZ: ${cStatSefaz || 'N/A'} - Pulando atualização (NFe autorizada ou sem XML)`);
                                        // não conta como success nem failed, apenas pula
                                    }

                                    // atualiza modal
                                    const sent = i + 1;
                                    try {
                                        Swal.update({ html: `${sent} de ${total} enviados<br/>Sucessos: ${success}<br/>Falhas: ${failed}` });
                                    } catch (e) { /* ignore */ }
                                }

                                // fecha loading e mostra resumo
                                Swal.close();
                                await Swal.fire({
                                    icon: failed === 0 ? 'success' : 'warning',
                                    title: 'Envio concluído',
                                    html: `Total: ${total}<br/>Sucessos: ${success}<br/>Falhas: ${failed}${failedList.length? `<br/>IDs com erro: ${failedList.join(', ')}`: ''}`
                                });

                                // atualizar lista se necessário
                                return { total, success, failed, failedList };
                            } catch (error) {
                                console.error('Erro no processo de envio:', error);
                                Swal.fire({ icon: 'error', title: 'Erro', text: 'Ocorreu um erro ao processar as vendas.' });
                                return null;
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

    }

    return {
        onSubmit,
        loading
    };
};
