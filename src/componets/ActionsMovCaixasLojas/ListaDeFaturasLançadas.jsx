import React, { Fragment, useState, useEffect } from "react"
import Accordion from 'react-bootstrap/Accordion';
import TabelaPrincipal from "../Tables/TabelaMain";
import axios from "axios";
import { get } from "../../api/funcRequest";

  export const ListaDeFaturasLançadas = ({empresaUsuario, dataConsulta}) => {
  const [dadosExemplos, setDadosExemplos] = useState([]);
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    getTabelas(empresaUsuario, dataConsulta)
  }, [empresaUsuario, dataConsulta])


  const getTabelas = async () => {
    if(empresaUsuario.length > 0) {
      const idEmpresa = Number(empresaUsuario[0].IDEMPRESA)

      try {
        const response = await axios.get("http://localhost:3001/allTabelas")
        // const response = await get(`/?idEmpresa=${idEmpresa}&dataConsulta=${dataConsulta}`)
        if (response.data && response.data.length > 0) {
          setDadosExemplos(response.data)
        }
        console.log(response.data, "faturas lançadas")
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }

  }

  const colunasExemplo = [
    'Data Recebimento',
    'Nº Movimento',
    'Caixa',
    'Cod. Autorização',
    'Valor',
    'Recebedor',
    'Situação',
  ]

  const handleEdit = (item) => {
    // Lógica para manipular a edição do item
    console.log(`Editando item: ${item.id}`);
  };

  const handleSave = (item) => {
    // Lógica para salvar o item editado
    console.log(`Salvando item: ${item.id}`);
  };

  const handleCancel = (item) => {
    // Lógica para cancelar a edição do item
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
              {/* <h2>
                Lista de Faturas Lançadas  <span className="fw-300"><i><?= $NOFANTASIA; ?></i></span>
              </h2> */}

              <h2>
                Lista de Faturas Lançadas
              </h2>
            </Accordion.Header>
            <Accordion.Body className="panel-container show">

              <TabelaPrincipal
                colunas={colunasExemplo}
                data={dadosPaginados}
                onEditar={handleEdit}
                onSalvar={handleSave}
                onCancelar={handleCancel}
                itensPorPagina={itensPorPagina}
                paginaAtual={paginaAtual}
                handlePaginaAnterior={handlePaginaAnterior}
                handleProximaPagina={handleProximaPagina}
                handlePaginaClicada={handlePaginaClicada}

              />

            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </Fragment>
  )
}

