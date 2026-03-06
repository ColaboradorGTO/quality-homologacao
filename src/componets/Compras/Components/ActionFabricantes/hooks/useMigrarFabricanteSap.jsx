import { useState } from "react";
import Swal from "sweetalert2";
import { post } from "../../../../../api/funcRequest";
import axios from "axios";

export const useMigrarFabricanteSap = ({usuarioLogado, optionsModulos, handleClick}) => {
    const [loading, setLoading] = useState(false);
    const [ipUsuario, setIpUsuario] = useState("");

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

    const migrarFabricanteSap = async (row) => {
        if(optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                icon: 'error',
                title: 'Acesso Negado!',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para migrar o Fabricante!`,
                customClass: {
                    container: 'custom-swal'
                }
            });
            return;
        }
       

        try {
            const confirmacao = await Swal.fire({
                title: "Certeza que Deseja Migrar esse Fabricante?",
                text: "Você não poderá reverter esta ação!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sim, Enviar",
                cancelButtonText: "Cancelar",
                customClass: {
                    confirmButton: "btn btn-primary btn-lg",
                    cancelButton: "btn btn-danger btn-lg",
                },
            });
           
            const dados = {
                IDFABRICANTE: parseInt(row?.IDFABRICANTE)
            };

            // const response = await post(`/migrar-fabricante?IDFABRICANTE=${row?.IDFABRICANTE}`,);
            const response = await post(`/migrar-fabricante?codFabricante=${row?.IDFABRICANTE}`,);
            const ipUsuario = await getIPUsuario();
            const postData  = {
                IDFUNCIONARIO: String(usuarioLogado?.id), 
                PATHFUNCAO: "COMPRAS/MIGRAR FABRICANTE SAP",
                DADOS: JSON.stringify(dados),
                IP: ipUsuario || 'Indisponível'
            }
    
            await post("/log-web", postData);
            handleClick();
            await Swal.fire({
                icon: "success",
                title: "Fabricante Migrado!",
                text: "O fabricante foi migrado com sucesso.",
                showCancelButton: false,
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "btn btn-success btn-lg",
                },
            });
           response.data;
        } catch (error) {
             const dados = {
                IDFABRICANTE: parseInt(row?.IDFABRICANTE)
            };
            const ipUsuario = await getIPUsuario();
            const postData  = {
                IDFUNCIONARIO: String(usuarioLogado?.id), 
                PATHFUNCAO: "COMPRAS/ERRO AO MIGRAR FABRICANTE SAP",
                DADOS: JSON.stringify(dados),
                IP: ipUsuario || 'Indisponível'
            }
            const response = await post("/log-web", postData);
            Swal.fire({
                icon: "error",
                title: "Erro ao Migrar Fabricante",
                text: "Não Foi Possível Migrar o Fabricante, TENTE NOVAMENTE OU ENTRE EM CONTATO COM O SUPORTE!.",
                 showCancelButton: false,
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "btn btn-danger btn-lg",
                },
            });
            response.data;
        } finally {
            setLoading(false);
        }
    };

    return { migrarFabricanteSap, loading };
};
