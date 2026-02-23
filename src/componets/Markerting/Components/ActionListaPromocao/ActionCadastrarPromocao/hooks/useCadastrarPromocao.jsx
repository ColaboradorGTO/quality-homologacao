import Swal from "sweetalert2"
import { get, post } from "../../../../../../api/funcRequest"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { getDataAtual } from "../../../../../../utils/dataAtual"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Papa from "papaparse";

export const useCadastrarPromocao = (refetchPromocao) => {
  const [descricao, setDescricao] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [marcaSelecionada, setMarcaSelecionada] = useState('')
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [percentDesconto, setPercentDesconto] = useState(0)
  const [qtdApartir, setQtdApartir] = useState(0)
  const [qtdLimite, setQtdLimite] = useState(0)
  const [vrDescPromo, setVrDescPromo] = useState(0)
  const [vrApartir, setVrApartir] = useState(0)
  const [vrLimite, setVrLimite] = useState(0)
  const [produtoPromocao, setProdutoPromocao] = useState('')
  const [ipUsuario, setIpUsuario] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);


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
    const response = await axios.get('http://ipwho.is/');
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  };


  useEffect(() => {
    const dataInicial = getDataAtual()
    const dataFinal = getDataAtual()
    setDataInicio(dataInicial)
    setDataFim(dataFinal)

  }, [])

  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    ['listaEmpresaComercial', marcaSelecionada],
    async () => {
      if (marcaSelecionada) {
        const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
        return response.data;
      } else {
        return [];
      }
    },
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );


  useEffect(() => {
    if (marcaSelecionada) {
      refetchEmpresas();
    }
    refetchMarcas()
  }, [marcaSelecionada, refetchEmpresas]);



  const handleCSVUpload = async (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const csvData = results.data.map(item => ({
          DSPROMO: item.DSPROMO,
          DTINICIOPROMO: item.DTINICIOPROMO,
          DTFIMPROMO: item.DTFIMPROMO,
          QTDAPARTIRDE: parseFloat(item.QTDAPARTIRDE),
          QTDLIMITEDE: parseFloat(item.QTDLIMITEDE),
          VRPRECODESCONTO: parseFloat(item.VRPRECODESCONTO),
          VRPERCDESCONTO: parseFloat(item.VRPERCDESCONTO),
          VRAPARTIRDE: parseFloat(item.VRAPARTIRDE),
          VRLIMITEDE: parseFloat(item.VRLIMITEDE),
          STATIVO: item.STATIVO,
          IDGRUPO: parseInt(item.IDGRUPO),
          PRODUTOS: item.PRODUTOS || '',
          EMPRESAS: parseInt(item.EMPRESAS)
        }));

        try {
          const response = await post('/cadastrar-produto-promocao', csvData);
          console.log('CSV data sent successfully:', response.data);
          Swal.fire({
            icon: 'success',
            title: 'Promoções cadastradas via CSV com sucesso!',
            timer: 2000,
            showConfirmButton: false,
          });

          if(refetchPromocao) {
            await refetchPromocao();
          }
          // log da ação
          const createData = {
            IDFUNCIONARIO: usuarioLogado.id,
            PATHFUNCAO: 'MARKETING/CADASTRO PROMOÇÃO CSV',
            DADOS: JSON.stringify(csvData),
            IP: ipUsuario,
          };
          await post('/log-web', createData);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar promoções via CSV!',
            timer: 2000,
            showConfirmButton: false,
          });

          await post('/log-web', {
            IDFUNCIONARIO: usuarioLogado.id,
            PATHFUNCAO: 'MARKETING/ERRO AO CADASTRAR PROMOÇÃO CSV',
            DADOS: '',
            IP: ipUsuario,
          });
        }
      },
    });
  };


  const handleXLSUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const xlsData = jsonData.map(item => ({
        DSPROMO: item.DSPROMO,
        DTINICIOPROMO: item.DTINICIOPROMO,
        DTFIMPROMO: item.DTFIMPROMO,
        QTDAPARTIRDE: parseFloat(item.QTDAPARTIRDE),
        QTDLIMITEDE: parseFloat(item.QTDLIMITEDE),
        VRPRECODESCONTO: parseFloat(item.VRPRECODESCONTO),
        VRPERCDESCONTO: parseFloat(item.VRPERCDESCONTO),
        VRAPARTIRDE: parseFloat(item.VRAPARTIRDE),
        VRLIMITEDE: parseFloat(item.VRLIMITEDE),
        STATIVO: item.STATIVO,
        IDGRUPO: parseInt(item.IDGRUPO),
        PRODUTOS: item.PRODUTOS || '',
        EMPRESAS: parseInt(item.EMPRESAS)
      }));

      try {
        const response = await post('/cadastrar-produto-promocao', xlsData);
        Swal.fire({
          icon: 'success',
          title: 'Promoções cadastradas via XLS com sucesso!',
          timer: 2000,
          showConfirmButton: false,
        });

        if (refetchPromocao) {
          await refetchPromocao();
        }

        const createData = {
          IDFUNCIONARIO: usuarioLogado.id,
          PATHFUNCAO: 'MARKETING/CADASTRO PROMOÇÃO XLS',
          DADOS: JSON.stringify(xlsData),
          IP: ipUsuario,
        };
        await post('/log-web', createData);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao cadastrar promoções via XLS!',
          timer: 2000,
          showConfirmButton: false,
        });

        await post('/log-web', {
          IDFUNCIONARIO: usuarioLogado.id,
          PATHFUNCAO: 'MARKETING/ERRO AO CADASTRAR PROMOÇÃO XLS',
          DADOS: '',
          IP: ipUsuario,
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };


  const onSubmit = async (data) => {
    if (!descricao || !percentDesconto || !empresaSelecionada) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Preencha os campos! Descrição e Desconto e Empresa são obrigatórios!`,
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    const postData = [{
      DSPROMO: descricao,
      DTINICIOPROMO: dataInicio,
      DTFIMPROMO: dataFim,
      QTDAPARTIRDE: parseFloat(qtdApartir),
      QTDLIMITEDE: parseFloat(qtdLimite),
      VRPRECODESCONTO: parseFloat(vrDescPromo),
      VRPERCDESCONTO: parseFloat(percentDesconto),
      VRAPARTIRDE: parseFloat(vrApartir),
      VRLIMITEDE: parseFloat(vrLimite),
      STATIVO: 'True',
      IDGRUPO: parseInt(marcaSelecionada),
      PRODUTOS: '',
      EMPRESAS: empresaSelecionada,
    }];

    try {
      const response = await post('/cadastrar-produto-promocao', postData);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Cadastro realizado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });

      const textDados = JSON.stringify(postData);
      let textoFuncao = 'MARKETING/CADASTRO PROMOÇÃO';

      const createData = {
        IDFUNCIONARIO: usuarioLogado.id,
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario,
      };

      const responsePost = await post('/log-web', createData);
      // handleClose();
      return responsePost.data;
    } catch (error) {


      let textoFuncao = 'MARKETING/ERRO AO CADASTRAR PROMOÇÃO';

      const createData = {
        IDFUNCIONARIO: usuarioLogado.id,
        PATHFUNCAO: textoFuncao,
        DADOS: '',
        IP: ipUsuario,
      };

      const responsePost = await post('/log-web', createData);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Erro ao Cadastrar Promoção!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });

      return responsePost.data;
    }
  };

  return {
    descricao,
    setDescricao,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    marcaSelecionada,
    setMarcaSelecionada,
    empresaSelecionada,
    setEmpresaSelecionada,
    percentDesconto,
    setPercentDesconto,
    qtdApartir,
    setQtdApartir,
    qtdLimite,
    setQtdLimite,
    vrDescPromo,
    setVrDescPromo,
    vrApartir,
    setVrApartir,
    vrLimite,
    setVrLimite,
    produtoPromocao,
    setProdutoPromocao,
    optionsMarcas,
    optionsEmpresas,
    errorMarcas,
    errorEmpresas,
    isLoadingMarcas,
    isLoadingEmpresas,
    refetchMarcas,
    refetchEmpresas,
    handleCSVUpload,
    onSubmit
  }
}