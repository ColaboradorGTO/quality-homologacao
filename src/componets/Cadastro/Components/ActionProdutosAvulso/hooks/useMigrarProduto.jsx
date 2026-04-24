import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";


export const useMigrarProduto = ({ usuarioLogado, optionsModulos, handleClick }) => {
    const [ipUsuario, setIpUsuario] = useState('');

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

    const handleMigrarProduto = async (row) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                icon: "error",
                title: "Permissão Negada!",
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão.`,
            });
            return;
        }

        const data = [{
            IDDETALHEPRODUTOPEDIDO: row.IDDETALHEPRODUTOPEDIDO,
        }];

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
                    if(result.isConfirmed) {
                        const response = await post(`/migrar-produto-avulso`, data);
                    
                        const ipUsuario = await getIPUsuario();
                        const textDados = JSON.stringify(data);
                        const textFuncao = 'CADASTRO/PRODUTO AVULSO - MIGRANDO PARA SAP';
                        const createtLog = {
                            IDFUNCIONARIO: String(usuarioLogado.id),
                            PATHFUNCAO: textFuncao,
                            DADOS: textDados,
                            IP: ipUsuario || 'Indisponível'
                        }
    
                        await post('/log-web', createtLog)
    
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Produto Avulso migrado para SAP com sucesso.',
                        });
                        
                        handleClick();
    
                        return response.data;

                    }
                });
        } catch (error) {
            const ipUsuario = await getIPUsuario();
            const textDados = JSON.stringify(data);
            const textFuncao = 'CADASTRO/PRODUTO AVULSO - ERRO AO MIGRAR PARA SAP';
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            await post('/log-web', createtLog)

            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: 'Ocorreu um erro ao migrar o Produto Avulso para SAP.',
            });
        }
    }

    return { handleMigrarProduto };
}