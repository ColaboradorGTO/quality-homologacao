import Swal from "sweetalert2";
import { get, post,put } from "../../../../../api/funcRequest";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { useQuery } from "react-query";


export const useImportarCSVBI = ({optionsModulos, handleClose}) => {
  const [relatorioSelecionadoTabela, setRelatorioSelecionadoTabela] = useState(null);
  const [linkRelatorioBI, setLinkRelatorioBI] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const [file, setFile] = useState(null);
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

  const { data: dadosBI = [], error: errorListaBI, isLoading: isLoadingBI, refetch } = useQuery(
    'relatorioInformaticaBI?status=True',
    async () => {
      const response = await get(`/relatorioInformaticaBI?status=True`);
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000
    }
  );


    const processFile = async (file) => {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
            let data = [];
            if (file.name.endsWith('.csv')) {
                const content = e.target.result;
                const lines = content.split('\n');
                for (let line of lines) {
                const [link] = line.split(',');
                if (link && link.trim()) data.push(link.trim());
                }
            } else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
                const workbook = XLSX.read(e.target.result, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                for (let row of rows) {
                if (row[0] && row[0].toString().trim()) data.push(row[0].toString().trim());
                }
            }
            resolve(data);
            } catch (err) {
            reject(err);
            }
        };
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
        });
    };

    const onSubmitArquivo = async (e) => {
       // e.preventDefault();
        if(optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                icon: 'warning',
                title: 'Acesso Negado',
                text: 'Você não tem permissão para criar novos relatórios.',
            });
            return;
        }

        if (!file) {
            Swal.fire({ icon: 'warning', title: 'Selecione um arquivo CSV ou XLSX!' });
            return;
        }

        try {
            const links = await processFile(file);
            if (!links.length) {
                Swal.fire({ icon: 'warning', title: 'Arquivo vazio ou inválido!' });
                return;
            }
            for (const link of links) {
                const postData = {
                IDRELATORIOBI: relatorioSelecionadoTabela?.IDRELATORIOBI,
                IDEMPRESA: relatorioSelecionadoTabela?.IDEMPRESA,
                LINK: link,
                STATIVO: 'True',
                };
                await put('/criarlinkRelatorioBI', postData);
            }


            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Relatórios atualizados com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
            handleClose();
        } catch (err) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro ao importar arquivo!',
                showConfirmButton: false,
                timer: 1500
            });
            console.error(err);
        }
    };



    return {
        linkRelatorioBI,
        setLinkRelatorioBI,
        dadosBI,
        file,
        setFile,
        onSubmitArquivo,
    };
}