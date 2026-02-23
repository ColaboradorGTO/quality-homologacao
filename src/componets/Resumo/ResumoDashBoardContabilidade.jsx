import { Fragment, useEffect, useState } from "react";
import { ResultadoResumo } from "../ResultadoResumo/ResultadoResumo";
import { ActionMain } from "../Actions/actionMain";
import { InputField } from "../Buttons/Input";
import { ButtonSearch } from "../Buttons/ButtonSearch";
import { dataFormatada } from "../../utils/dataFormatada";
import { get } from "../../api/funcRequest";
import { formatMoeda } from "../../utils/formatMoeda";
import { GrView } from "react-icons/gr";
import Modal from 'react-bootstrap/Modal';
import { ButtonTypeModal } from "../Buttons/ButtonTypeModal";
import { FooterModal } from "../Modais/FooterModal/footerModal";
import { HeaderModal } from "../Modais/HeaderModal/HeaderModal";

export const ResumoDashBoardContabilidade = ({ }) => {
  const [dadosExemplos, setDadosExemplos] = useState([]);
  const [dadosDetalheFechamento, setDadosDetalheFechamento] = useState([]);
  const [dadosResumoVendas, setDadosResumoVendas] = useState([]);
  const [dadosVendasPagamentos, setDadosVendasPagamentos] = useState([]);
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [resumoVendas, setResumoVendas] = useState([]);
  const [totalRecebido, setTotalRecebido] = useState(0);
  const [qtdClientes, setQtdClientes] = useState(0);
  const [totalTicketMedio, setTotalTicketMedio] = useState(0);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [dataPesq, setDataPesq] = useState('');
  const [clickContador, setClickContador] = useState(0);
  const [modalVisivel, setModalVisivel] = useState(false);

  const [dataAtual, setDataAtual] = useState(""); // Estado para armazenar a data atual

  useEffect(() => {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, "0"); 
    const dia = data.getDate().toString().padStart(2, "0"); 
    const dataFormatada = `${ano}-${mes}-${dia}`; 
    setDataAtual(dataFormatada);
  }, []);

  useEffect(() => {
    if(dataAtual) {
      
      getListaVendasLoja();
    }
    getResumoVendas();
    
  }, [dataAtual]);

  const getResumoVendas = async () => {

    try {

      // const dtURL = dataFormatada(dataConsulta)
      const dtURL = dataFormatada(dataPesq)
      const urlData = encodeURIComponent(dtURL)
      dataFormatada(dataPesq)
      const response = await get(`/resumoVendaFinanceiro?dataPesquisa=${dataAtual}`);

      if (response.data) {
        setResumoVendas(response.data);
      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar resumo das vendas: ', error);
    }
  };

  const calcularTotalRealizado = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);

    return (
      toFloat(item.VALORTOTALDINHEIRO) +
      toFloat(item.VALORTOTALCARTAO) +
      toFloat(item.VALORTOTALCONVENIO) +
      toFloat(item.VALORTOTALPOS) +
      toFloat(item.VALORTOTALFATURA) +
      toFloat(item.VALORTOTALDESPESA)
    );
  }
  const calcularTotalDespesasAdiantamento = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);

    return (

      toFloat(item.VALORTOTALDESPESA) +
      toFloat(item.VALORTOTALADIANTAMENTOSALARIAL)
    );
  }
  
  const dadosVendasResumo = resumoVendas.map((item, index) => {
    let contador = index + 1;

    const totalDespesasAdiantamento = calcularTotalDespesasAdiantamento(item);
    const totalRealizado = calcularTotalRealizado(item);
    // console.log(item, 'item')

    return {
      VALORTOTALADIANTAMENTOSALARIAL: parseFloat(item.VALORTOTALADIANTAMENTOSALARIAL),
      VALORTOTALCARTAO: item.VALORTOTALCARTAO,
      VALORTOTALCONVENIO: item.VALORTOTALCONVENIO,
      VALORTOTALDESPESA: item.VALORTOTALDESPESA,
      VALORTOTALDINHEIRO: parseFloat(item.VALORTOTALDINHEIRO),
      VALORTOTALFATURA: item.VALORTOTALFATURA,
      VALORTOTALPOS: item.VALORTOTALPOS,
      VALORTOTALVOUCHER: item.VALORTOTALVOUCHER,
      totalDespesasAdiantamento: formatMoeda(totalDespesasAdiantamento),
      totalRealizado: formatMoeda(totalRealizado),
      contador
    }
  });



  const calcularDespesasAdiantamento = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);

    return (
      toFloat(item.VALORTOTALDESPESA) +
      toFloat(item.VALORTOTALADIANTAMENTOSALARIAL)
    );
  }

  const calcularTotalDisponivel = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);

    return (
      toFloat(item.VALORTOTALDINHEIRO) +
      toFloat(item.VALORTOTALFATURA) -
      toFloat(item.VALORTOTALDESPESA) +
      toFloat(item.VALORTOTALADIANTAMENTOSALARIAL)
    )
  }
  
  const getListaVendasLoja = async () => {
    if(dataAtual ) {
      try {
        const response = await get(`/vendaTotalEmpresa?dataPesquisa=${dataAtual}`)
        if (response.data) {
          setDadosVendasPagamentos(response.data)
          // console.log(response.data, 'lista vendas loja')
        }
        return response.data;
  
      } catch (error) {
        console.log('Erro ao buscar empresas: ', error)
      }
      
    }

  }

  const dados = dadosVendasPagamentos.map((item, index) => {
    let contador = index + 1;
    const totalDespesasAdiantamento = calcularDespesasAdiantamento(item);
    const totalDisponivel = calcularTotalDisponivel(item);
   
    return {

      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      VALORTOTALDINHEIRO: item.VALORTOTALDINHEIRO,
      VALORTOTALCARTAO: item.VALORTOTALCARTAO,
      VALORTOTALPOS: item.VALORTOTALPOS,
      VALORTOTALFATURA: item.VALORTOTALFATURA,
      VALORTOTALDESPESA: item.VALORTOTALDESPESA,
      VALORTOTALADIANTAMENTOSALARIAL: item.VALORTOTALADIANTAMENTOSALARIAL,
      totalDespesasAdiantamento: formatMoeda(totalDespesasAdiantamento),
      totalDisponivel: totalDisponivel,
      dataAtual,
      contador
    }
  });
 
  

  const calcularTotalDinheiroInformado = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);
    let totalDinheiroInformado;
    if(item.VALORINFORMADO.DINHEIROAJUSTE > 0) {
      totalDinheiroInformado = toFloat(item.VALORINFORMADO.DINHEIROAJUSTE)
    } else {
      totalDinheiroInformado = toFloat(item.VALORINFORMADO.DINHEIRO)
    }

   return  (
     toFloat(totalDinheiroInformado)
   )
  }

 
  const calcularTotalQuebraCaixa = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);
    return (
      toFloat(item.totalDinheiroInformado) -
      toFloat(item.VALORTOTALDINHEIRO)
    )
  }

  const dadosFechamento = dadosDetalheFechamento.map((item, index) => {
    const totalDinheiroInformado = calcularTotalDinheiroInformado(item);
    const quebraCaixa = totalDinheiroInformado - item.VALORTOTALDINHEIRO;
    const totalQuebraCaixa = calcularTotalQuebraCaixa(item);
    return {

      DSCAIXA: item.DSCAIXA,
      IDCAIXAWEB: item.IDCAIXAWEB,
      IDEMPRESA: item.IDEMPRESA,
      IDMOVIMENTOCAIXAWEB: item.IDMOVIMENTOCAIXAWEB,
      NOFANTASIA: item.NOFANTASIA,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      DINHEIRO: item.VALORINFORMADO.DINHEIRO,
      DINHEIROAJUSTE: item.VALORINFORMADO.DINHEIROAJUSTE,
      CARTAO: item.VALORINFORMADO.CARTAO,
      POS: item.VALORINFORMADO.POS,
      FATURA: item.VALORINFORMADO.FATURA,
      
      VALORTOTALADIANTAMENTOSALARIAL: item.VALORTOTALADIANTAMENTOSALARIAL,
      VALORTOTALCARTAO: item.VALORTOTALCARTAO,
      VALORTOTALCONVENIO: item.VALORTOTALCONVENIO,
      VALORTOTALDESPESA: item.VALORTOTALDESPESA,
      VALORTOTALDINHEIRO: item.VALORTOTALDINHEIRO,
      VALORTOTALFATURA: item.VALORTOTALFATURA,
      VALORTOTALPOS: item.VALORTOTALPOS,
      VALORTOTALVOUCHER: item.VALORTOTALVOUCHER,
      totalQuebraCaixa: parseFloat(totalQuebraCaixa).toFixed(2),
      quebraCaixa: parseFloat(quebraCaixa).toFixed(2),
      totalDinheiroInformado: totalDinheiroInformado,

      VRDEPOSITO: item.DEPOSITOS[0].VRDEPOSITO,
      NUDOCDEPOSITO: item.DEPOSITOS[0].NUDOCDEPOSITO,
      DSHISTORIO: item.DEPOSITOS[0].DSHISTORIO,
    }
  });

  
  const handleEdit = async (IDEMPRESA) => {
    try {
      const response = await get(`/detalheFechamento?idEmpresa=${IDEMPRESA}&dataPesquisa=${dataAtual}`);

      if (response.data && response.data.length > 0) {
        setDadosDetalheFechamento(response.data);
        setModalVisivel(true);
        // console.log(response.data, 'detalhe fechamento')
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };


  const handleClickEdit = (row) => {
    if (row && row.IDEMPRESA) {
      handleEdit(row.IDEMPRESA);
    }
  };

  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);

    if (clickContador % 2 === 0) {
      getResumoVendas();
      getListaVendasLoja();
    } else {

    }
  }

  const handleCloseModal = () => {
    setModalVisivel(false);
  }

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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Função para alterar o número de linhas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Resetar a página para a primeira ao alterar o número de linhas por página
  };


  return (
    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Tela Principal"]}
        title="Tela Principal Dashboard Contabilidade"
        subTitle="Nome da Loja"

        InputFieldDTConsultaComponent={InputField}
        labelInputFieldDTConsulta={"Data Consulta"}
        // preciso trazer a data do dia atual preenchida neste inputFieldDTConsultaComponent
        valueDTCosulta={dataAtual}
        onChangeInputFieldDTConsulta={(e) => setDataAtual(e.target.value)}

        ButtonSearchComponent={ButtonSearch}
        linkNomeSearch={"Atualizar Dados"}
        onButtonClickSearch={handleClick}
      />
      

      <ResultadoResumo
        nomeVendas="Dinheiro"
        valorVendas={formatMoeda(dadosVendasResumo[0]?.VALORTOTALDINHEIRO)}

        nomeCartao="Cartão"
        valorCartao={formatMoeda(dadosVendasResumo[0]?.VALORTOTALCARTAO )}

        nomeClient="POS"
        numeroCliente={formatMoeda(dadosVendasResumo[0]?.VALORTOTALPOS)}

        nomeTicketMedio="Fatura"
        valorTicketMedio={formatMoeda(dadosVendasResumo[0]?.VALORTOTALFATURA)}

        nomeDespesas="Despesas"
        valorDespesas={dadosVendasResumo[0]?.totalDespesasAdiantamento}

        nomeEcommerce="Total Realizado"
        valorEcommerce={dadosVendasResumo[0]?.totalRealizado}

      />

      {/* <ResultadoResumo
        valorVendas={formatMoeda(totalRecebido)}
        valorTicketMedio={formatMoeda(totalTicketMedio)}
        valorDespesas="R$ 0,00"
        numeroCliente={`${qtdClientes}  0 `}
        nomeVendas="Vendas Loja"
        nomeClient="Clientes"
        nomeTicketMedio="Ticket Médio"
        nomeDespesas="Despesas"
        // valorEcommerce="R$ 0,00"
        // nomeEcommerce="Ecommerce"
        
        datapesq={dataPesq}
      /> */}

      <div id="resultadododia">
        <div className="panel p-4">
          <div className="panel-hdr mb-4">

            <h3>Lista de Vendas Por Loja</h3>
          </div>

          {/* <TableContainer component={Paper} sx={{ maxHeight: '100vh', overflow: 'auto' }}>
            <Table
              stickyHeader
            >
              <TableHead>

                <TableRow style={{ backgroundColor: "#7a59ad", color: "#fff", border: '1px solid #0000001a', }}>
                  <CustomTableHeader>Data</CustomTableHeader>
                  <CustomTableHeader>Loja</CustomTableHeader>
                  <CustomTableHeader>Dinheiro</CustomTableHeader>
                  <CustomTableHeader>Cartão</CustomTableHeader>
                  <CustomTableHeader>POS</CustomTableHeader>
                  <CustomTableHeader>Fatura</CustomTableHeader>
                  <CustomTableHeader>Despesa</CustomTableHeader>
                  <CustomTableHeader>Disponível</CustomTableHeader>
                  <CustomTableHeader >Opções</CustomTableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {dados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={row.ID}>

                    <CustomTableCell>{dataFormatada(row.dataAtual)}</CustomTableCell>
                    <CustomTableCell >{row.NOFANTASIA}</CustomTableCell>
                    <CustomTableCell>{formatMoeda(row.VALORTOTALDINHEIRO)}</CustomTableCell>
                    <CustomTableCell>{formatMoeda(row.VALORTOTALCARTAO)}</CustomTableCell>
                    <CustomTableCell>{formatMoeda(row.VALORTOTALPOS)}</CustomTableCell>
                    <CustomTableCell>{formatMoeda(row.VALORTOTALFATURA)}</CustomTableCell>
                    <CustomTableCell>{row.totalDespesasAdiantamento}</CustomTableCell>
                    <CustomTableCell>{formatMoeda(row.totalDisponivel)}</CustomTableCell>

                    <CustomTableCell>
                      <div className="p-1 "
                        style={{ justifyContent: "space-between", display: "flex" }}
                      >
                        <div className="p-1">
                          <ButtonTable
                            titleButton={"Detalhar Fechamento"}
                            cor={"success"}
                            Icon={GrView}
                            iconSize={18}
                            onClickButton={() => handleClickEdit(row)}
                          />
                        </div>

                      </div>
                    </CustomTableCell>
                  </TableRow>
                ))}


                {dados.length > 0 && (
                  <TableRow
                    sx={{
                      backgroundColor: '#f2f2f2',
                      color: '#333',
                      fontWeight: 'bold',
                      border: '1px solid #ccc',
                    }}
                  >

                    <CustomTableCellResultado colSpan={2} style={{ alignText: "center" }}>Total</CustomTableCellResultado>
                    <CustomTableCellResultado >
                      {formatMoeda(dados.reduce((acc, item) => acc + parseFloat(item.VALORTOTALDINHEIRO), 0))}
                    </CustomTableCellResultado>
                    <CustomTableCellResultado >
                      {formatMoeda(dados.reduce((acc, item) => acc + parseFloat(item.VALORTOTALCARTAO), 0))}
                    </CustomTableCellResultado>
                    <CustomTableCellResultado >
                      {formatMoeda(dados.reduce((acc, item) => acc + parseFloat(item.VALORTOTALPOS), 0))}
                    </CustomTableCellResultado>
                    <CustomTableCellResultado >
                      {formatMoeda(dados.reduce((acc, item) => acc + parseFloat(item.VALORTOTALFATURA), 0))}
                    </CustomTableCellResultado>
                    <CustomTableCellResultado >
                      {formatMoeda(dados.reduce((acc, item) => acc + parseFloat(item.VALORTOTALDESPESA) + parseFloat(item.VALORTOTALADIANTAMENTOSALARIAL), 0))}
                    </CustomTableCellResultado>
                    <CustomTableCellResultado >
                      {formatMoeda(dados.reduce((acc, item) => acc + parseFloat(item.totalDisponivel), 0))}
                    </CustomTableCellResultado>

                    <CustomTableCellResultado colSpan={1}></CustomTableCellResultado>

                  </TableRow>

                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            style={{
              backgroundColor: "#7a59ad", width: "100%", color: "#fff"
            }}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={dados.length} // Contagem dos itens em dadosCaixaMovimento
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={"Itens por página"}
          /> */}
        </div>
      </div>

      {modalVisivel && (

        <Modal
          show={modalVisivel}
          onHide={handleCloseModal}
          size="xl"
          className="modal fade"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"

        >


          <div style={{ padding: "10px" }}>

            <HeaderModal
              title={"Detalhe de Fechamento"}
              subTitle={"Relação de Recibimentos do Fechamento da Loja"}
              handleClose={handleCloseModal}
            />

            <Modal.Body>
            
              <Fragment>

                {/* <TableContainer component={Paper} sx={{ maxHeight: '100vh', overflow: 'auto' }}>
                  <Table stickyHeader >
                    <TableHead>

                      <TableRow style={{ backgroundColor: "#7a59ad", color: "#fff", border: '1px solid #0000001a', }}>
                        <CustomTableHeader>Caixa</CustomTableHeader>
                        <CustomTableHeader>Operador</CustomTableHeader>
                        <CustomTableHeader>Receb. DIN</CustomTableHeader>
                        <CustomTableHeader>Receb. CART</CustomTableHeader>
                        <CustomTableHeader>Receb. POS</CustomTableHeader>
                        <CustomTableHeader>Receb. FAT</CustomTableHeader>
                        <CustomTableHeader>Inf. DIN</CustomTableHeader>
                        <CustomTableHeader>Inf. CART</CustomTableHeader>
                        <CustomTableHeader>Inf. POS</CustomTableHeader>
                        <CustomTableHeader>Inf. FAT</CustomTableHeader>
                        <CustomTableHeader>Quebra</CustomTableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dadosFechamento.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                        <TableRow key={row.ID}>

                          <CustomTableCell>{row.DSCAIXA}</CustomTableCell> 
                          <CustomTableCell >{row.NOFUNCIONARIO}</CustomTableCell>
                          <CustomTableCell>{formatMoeda(row.VALORTOTALDINHEIRO)}</CustomTableCell>
                          <CustomTableCell>{formatMoeda(row.VALORTOTALCARTAO)}</CustomTableCell>
                          <CustomTableCell>{formatMoeda(row.VALORTOTALPOS)}</CustomTableCell>
                          <CustomTableCell>{formatMoeda(row.VALORTOTALFATURA)}</CustomTableCell>
                          <CustomTableCell>{formatMoeda(row.totalDinheiroInformado)}</CustomTableCell> 
                          <CustomTableCell>{formatMoeda(row.CARTAO)}</CustomTableCell>
                          <CustomTableCell>{formatMoeda(row.POS)}</CustomTableCell>
                          <CustomTableCell>{formatMoeda(row.FATURA)}</CustomTableCell>
                          <CustomTableCell>
                          {
                            <div style={{color: row.quebraCaixa > 0 ? 'blue' : 'red' }}>
                              {`${row.quebraCaixa > 0 ? ' + ' : ' - '}${row.quebraCaixa}`}
                            </div>
                          }
                          </CustomTableCell>

                        
                        </TableRow>
                      ))}


                      {dadosFechamento.length > 0 && (
                        <TableRow
                          sx={{
                            backgroundColor: '#f2f2f2',
                            color: '#333',
                            fontWeight: 'bold',
                            border: '1px solid #ccc',
                          }}
                        >

                          <CustomTableCellResultado colSpan={2} style={{ alignText: "center" }}>Total</CustomTableCellResultado>
                          <CustomTableCellResultado >
                            {formatMoeda(dadosFechamento.reduce((acc, item) => acc + parseFloat(item.VALORTOTALDINHEIRO), 0))}
                          </CustomTableCellResultado>
                          <CustomTableCellResultado >
                            {formatMoeda(dadosFechamento.reduce((acc, item) => acc + parseFloat(item.VALORTOTALCARTAO), 0))}
                          </CustomTableCellResultado>
                          <CustomTableCellResultado >
                            {formatMoeda(dadosFechamento.reduce((acc, item) => acc + parseFloat(item.VALORTOTALPOS), 0))}
                          </CustomTableCellResultado>
                          <CustomTableCellResultado >
                            {formatMoeda(dadosFechamento.reduce((acc, item) => acc + parseFloat(item.VALORTOTALFATURA), 0))}
                          </CustomTableCellResultado>
                          <CustomTableCellResultado >
                            {formatMoeda(dadosFechamento.reduce((acc, item) => acc +  parseFloat(item.totalDinheiroInformado), 0))}
                          </CustomTableCellResultado>
                          <CustomTableCellResultado >
                            {formatMoeda(dadosFechamento.reduce((acc, item) => acc + parseFloat(item.CARTAO), 0))}
                          </CustomTableCellResultado>
                          <CustomTableCellResultado >
                            {formatMoeda(dadosFechamento.reduce((acc, item) => acc + parseFloat(item.POS), 0))}
                          </CustomTableCellResultado>
                          <CustomTableCellResultado >
                            {formatMoeda(dadosFechamento.reduce((acc, item) => acc + parseFloat(item.FATURA), 0))}
                          </CustomTableCellResultado>

                          <CustomTableCellResultado >
                          
                          {
                            <div style={{color: dadosFechamento.quebraCaixa > 0 ? 'red' : 'blue'}}>
                              
                              {formatMoeda(dadosFechamento.reduce((acc, item) => acc + parseFloat(item.quebraCaixa), 0))}
                            </div>
                          }
                          
                          </CustomTableCellResultado>

                        </TableRow>
                      )}



                    </TableBody>
                  </Table>
                </TableContainer> */}
              </Fragment>

              {dadosFechamento.length > 0 && (
                <Fragment >
                  <div 
                    style={{
                      textAlign: "center",
                      marginTop: "20px",
                    }}>
                    <h2 style={{ fontWeight: 700}}>Relação de Depósitos</h2>
                  </div>
                  <div 
                   style={{
                      display: "flex",
                      textAlign: "center",
                      marginTop: "20px",
                      justifyContent: "space-around",
    
                      width: "100%",
                    }}>

                    <div className="col-sm-4 col-xl-2" >
                      <span style={{fontSize: "15px", fontWeight: 400}}>Valor Depositado (R$) </span>
                      <p style={{fontSize: "16px", fontWeight: 600}}>{formatMoeda(dadosFechamento[0].VRDEPOSITO)} </p>
                    </div>
                 
                    <div className="col-sm-4 col-xl-2">
                      <span style={{fontSize: "16px", fontWeight: 400}}>

                        Histórico
                      <p style={{fontSize: "16px", fontWeight: 600}}>

                      {dadosFechamento[0].DSHISTORIO}
                      </p>
                      </span>
                    </div>
              
                    <div className="col-sm-4 col-xl-2">
                      <span style={{fontSize: "16px", fontWeight: 400}}>

                        Documento:
                      </span>
                      <p style={{fontSize: "16px", fontWeight: 600}}>

                        {parseFloat(dadosFechamento[0].NUDOCDEPOSITO)}
                      </p>
                    </div>
                  
                  </div>

                </Fragment>
              )}
           

            </Modal.Body>


            <FooterModal

              ButtonTypeFechar={ButtonTypeModal}
              onClickButtonFechar={handleCloseModal}
              textButtonFechar={"Fechar"}
            />
          </div>
        </Modal>
      )}
    </Fragment>
  )
}