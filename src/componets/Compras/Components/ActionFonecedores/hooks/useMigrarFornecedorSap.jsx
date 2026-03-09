import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios";


export const useMigrarFornecedorSAP = ({usuarioLogado, optionsModulos, handleClick}) => {
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
     

    const handleMigrarSAP = async (IDFORNECEDOR) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                icon: 'warning',
                title: 'Acesso Negado!',
                text: `${usuarioLogado?.NOFUNCIONARIO} Você não tem permissão para migrar fornecedores SAP.`,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;

        }

        Swal.fire({
            title: `Certeza que Deseja Migrar esse Fornecedor?`,
            text: 'Você não poderá reverter a ação!',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton: 'btn btn-danger',
              loader: 'custom-loader'
            },
            buttonsStyling: false
        }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                
                const putData = {
                    IDFORNECEDOR: IDFORNECEDOR,
                }

                const response = await put(`/migrar-fornecedor-sap?IDFORNECEDOR=${IDFORNECEDOR}`, putData)
                const textDados = JSON.stringify(putData)
                let textoFuncao = 'COMPRAS/MIGRAR FORNECEDOR SAP'
                const ipUsuario = await getIPUsuario();

                const postData = {
                    IDFUNCIONARIO: String(usuarioLogado.id),
                    PATHFUNCAO: textoFuncao,
                    DADOS: textDados,
                    IP: ipUsuario || 'Indisponível'
                }
        
                await post('/log-web', postData)
                
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: `Fornecedor migrado com sucesso.`,
                    customClass: {
                        container: 'custom-swal',
                    },
                })

                handleClick();
                return response.data;
            } catch (error) {
                const putData = {
                    IDFORNECEDOR: IDFORNECEDOR,
                }
               
                const textDados = JSON.stringify(putData)
                let textoFuncao = 'COMPRAS/ERRO AO MIGRAR FORNECEDOR SAP'
                const ipUsuario = await getIPUsuario();
                const postData = {
                    IDFUNCIONARIO: String(usuarioLogado.id),
                    PATHFUNCAO: textoFuncao,
                    DADOS: textDados,
                    IP: ipUsuario || 'Indisponível'
                }
        
                await post('/log-web', postData)

                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: `Erro ao migrar o Fornecedor: ${error}`,
                    customClass: {
                        container: 'custom-swal',
                    },
                });
            }
        }
        })
    }
    

    return {
        handleMigrarSAP
    }
}