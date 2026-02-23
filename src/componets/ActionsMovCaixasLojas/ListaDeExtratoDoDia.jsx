import { Fragment, useEffect, useState } from "react"
import Accordion from 'react-bootstrap/Accordion';
import TabelaPrincipal from "../Tables/TabelaMain";
import axios from "axios";
import { get } from "../../api/funcRequest";


export const ListaDeExtratoDoDia = () => {
  const [dadosExemplos, setDadosExemplos] = useState([]);
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dadosExtratoLojaPeriodo, setDadosExtratoLojaPeriodo] = useState([])
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')

   // Extrato da Loja
   useEffect(() => {
    getExtatoDaLoja(idEmpresa, datapesq)
    
  },[idEmpresa, datapesq])


  const getExtatoDaLoja = async () => {
    if(empresaUsuario.length > 0) {
      const idEmpresa = Number(empresaUsuario[0].IDEMPRESA)
      try {
         dataFormatada(dataPesquisaInicio, dataPesquisaFim)
        const response = await get(`/extratoDaLojaPeriodo?idEmpresa=${idEmpresa}&dataPesquisInicio=${dataPesquisaInicio}&${dataPesquisaFim}=dataPesquisaFim`) 
        if(response.data && response.data.length > 0) {
          setDadosExtratoLojaPeriodo(response.data)
        }
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }

  }

  const colunasExtradoDoDia = [
    'Dt. Lanç.',
    'Histórico',
    'Pago A',
    'Despesa',
    'Débito',
    'Crédito',
    'Saldo',
    'Situação',
    'Opções'
  ];

  // Fim Extrato da Loja

  const colunasExemplo = [
    'Dt. Lanç.',
    'Histórico',
    'Pago A',
    'Despesa',
    'Débito',
    'Crédito',
    'Saldo',
    'Situação',
    'Opções'
  ];



  const handleEdit = (item) => {
    // Lógica para manipular a edição do item
    
    if (item.editando) {
      return;
    }
    console.log(`Editando item: ${item.id}`);
  };

  const handleSave = (item) => {
    // Lógica para salvar o item editado
    console.log(`Salvando item: ${item.id}`);
  };

  const handleCancel = (item) => {
    // Lógica para excluir item
  

    console.log(`Cancelando edição do item: ${item.id}`);
  };

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  const handleProximaPagina = () => {
    const totalPaginas = Math.ceil(dadosExemplos.length / itensPorPagina);
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  const handlePaginaClicada = (pagina) => {
    setPaginaAtual(pagina);
  };

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = paginaAtual * itensPorPagina;
  const dadosPaginados = dadosExemplos.slice(indiceInicial, indiceFinal);


  return (

    <Fragment>
      <div className="row" >
        <Accordion defaultActiveKey="0" className="col-xl-12" >
          <Accordion.Item eventKey="0" id="panel-1" className="panel" >
            <Accordion.Header className="panel-hdr tituloListVendasCaixa" >
              <h2 id="TituloLoja" >
                Lista de Extrato do Dia
              </h2>
            </Accordion.Header>
            <Accordion.Body className="panel-container show">
            
              <div id="resultadododia">
                         
              </div>
    
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </Fragment>
  )
}

