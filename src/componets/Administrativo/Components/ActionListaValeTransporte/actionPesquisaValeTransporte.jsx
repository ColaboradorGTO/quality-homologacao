import React, { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda"
import Table from 'react-bootstrap/Table';
import { dataFormatada } from "../../../../utils/dataFormatada"
import { ActionListaValeTransporte } from "./actionListaValeTransporte"
import { MdAdd } from "react-icons/md"

export const ActionPesquisaValeTransporte = () => {
  const { register, handleSubmit, errors } = useForm();
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalImprimirVisivel, setModalImprimirVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [dadosExemplos, setDadosExemplos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([])
  const [dadosAdiantamentoValeLoja, setDadosAdiantamentoValeLoja] = useState([]);
  const [dadosDespesasLoja, setDadosDespesasLoja] = useState([]);
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null)
  const [categoriaReceitaDespesa, setCategoriaReceitaDespesa] = useState('')
  const [dadosReceitaDespesas, setDadosReceitaDespesa] = useState([])
  const [dsHistorio, setDsHistorio] = useState('')
  const [dsPagoa, setDsPagoa] = useState('')
  const [tpNota, setTpNota] = useState('')
  const [nuNotaFiscal, setNuNotaFiscal] = useState('')
  const [vrDespesa, setVrDespesa] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);;
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // console.log(usuarioLogado, 'usuario')
  }, [usuarioLogado]);

  useEffect(() => {
    getListValeTransporte(usuarioLogado && usuarioLogado.IDEMPRESA)
    getListaFuncionarios()
    getListaReceitaDespesas()
  }, [usuarioLogado && usuarioLogado.IDEMPRESA])

  const getListaFuncionarios = async () => {
    if (usuarioLogado && usuarioLogado.id) {

      try {
        const response = await get(`/listaFuncionariosEmpresa?idEmpresaLogin=${usuarioLogado.id}`)
        if (response.data) {
          setFuncionarios(response.data)
        }
        return response.data;

      } catch (error) {
        console.log('Erro ao buscar empresas: ', error)
      }
    }
  }

  const getListaReceitaDespesas = async () => {
    try {
      const response = await get(`/categoriaReceitaDespesa`)
      if (response.data) {
        setDadosReceitaDespesa(response.data)
      }
      return response.data;

    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
  }

  const getListValeTransporte = async () => {
    if (usuarioLogado && usuarioLogado.IDEMPRESA) {
      try {
        const response = await get(`/despesasLojaEmpresa?idEmpresa=${usuarioLogado.IDEMPRESA}`)
        // const response = await get(`/despesasLojaEmpresa?idEmpresa=${usuarioLogado.id}`)
        if (response.data) {
          setDadosDespesasLoja(response.data)
          
        }
        return response.data;

      } catch (error) {
        console.log('Erro ao buscar empresas: ', error)
      }

    }
  }


  const handleClickImprimir = async (row) => {
    if (row.IDDESPESASLOJA) {
      handleEditImprimir(row.IDDESPESASLOJA)
    }

  }

  const handleEditImprimir = async (IDDESPESASLOJA) => {
    // console.log(IDDESPESASLOJA, ' IDDESPESASLOJA')
    try {
      const response = await get(`/despesa-Loja-todos?idDespesas=${IDDESPESASLOJA}`)
      if (response.data) {
        setDadosAdiantamentoValeLoja(response.data)
        setModalImprimirVisivel(true)
        console.log(modalImprimirVisivel)
       
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }


  const filterTipoTroca = (inputValue) => {
    // console.log(funcionarios, "inputValue")
    return funcionarios.filter((item) =>
      item.NOFUNCIONARIO.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      const filteredOptions = filterTipoTroca(inputValue);
      const options = filteredOptions.map((item) => ({
        value: item.ID,
        label: `${item.IDFUNCIONARIO} - ${item.NOFUNCIONARIO}`,

      }));
      callback(options);
    }, 1000);
  };

  const handleChangeUsuario = (selectedOption) => {
    setUsuarioSelecionado(selectedOption);
  };

  const onSubmit = async (data) => {
    const postData = {
      IDEMPRESA: usuarioLogado.IDEMPRESA,
      IDUSR: usuarioLogado.id,
      DTDESPESA: usuarioLogado.DATA_HORA_SESSAO,
      IDCATEGORIARECEITADESPESA: categoriaReceitaDespesa,
      DSHISTORIO: dsHistorio,
      DSPAGOA: dsPagoa,
      IDFUNCIONARIO: usuarioSelecionado.value,
      TPNOTA: tpNota,
      NUNOTAFISCAL: nuNotaFiscal,
      VRDESPESA: vrDespesa,

    }

    const response = await post('/cadastrarDespesaLoja', postData)
      .then(response => {
        // Limpar os campos do formulário
        setCategoriaReceitaDespesa('')
        setDsHistorio('')
        setDsPagoa('')
        setUsuarioSelecionado('')
        setVrDespesa('')
        console.log(postData)
        console.log(response, 'Valor vale transporte cadastrado com sucesso!')
      })

    alert('Valor vale transporte cadastrado com sucesso!')

      .catch(error => {
        alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');

        console.log(error)
      })

  }

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  }

  const handleProximaPagina = () => {
    const totalPaginas = Math.ceil(dadosExemplos.length / itensPorPagina);
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
    }
  }

  const handlePaginaClicada = (pagina) => {
    setPaginaAtual(pagina);
  }

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = paginaAtual * itensPorPagina;
  const dadosPaginados = dadosExemplos.slice(indiceInicial, indiceFinal);

  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);
    if (usuarioLogado && usuarioLogado.id && usuarioLogado.IDEMPRESA && usuarioLogado.DATA_HORA_SESSAO) {
      setTabelaVisivel(true);
    } else {
      console.log('Usuário não possui informações válidas.');
    }
  }

  const handlShowModal = () => {
    setModalVisivel(true)
  }


  const handleCloseModal = () => {
    setModalVisivel(false);
    setModalImprimirVisivel(false);
  }


  const TAX_RATE = 0.07;

  function ccyFormat(num) {
    return `${num.toFixed(2)}`;
  }

  function priceRow(qty, unit) {
    return qty * unit;
  }

  function createRow(desc, qty, unit) {
    const price = priceRow(qty, unit);
    return { desc, qty, unit, price };
  }

  // function subtotal(items) {
  //   return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
  // }

  const rows = [
    createRow('Paperclips (Box)', 100, 1.15),
    createRow('Paper (Case)', 10, 45.99),
    createRow('Waste Basket', 2, 17.99),
  ];

  const invoiceSubtotal = subtotal(dadosDespesasLoja);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  function desformatarMoeda(valorFormatado) {
    return parseFloat(valorFormatado.replace(/[^0-9,-]/g, '').replace(',', '.'));
  }
 
  function subtotal(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
  }

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
        linkComponent={["Vale Transporte da Loja"]}
        title="Vale Transporte da Loja dos Últimos 30 dias"
        subTitle="Nome da Loja"


        ButtonTypeCadastro={ButtonType}
        linkNome="Cadastrar Vale Transporte"
        onButtonClickCadastro={handlShowModal}
        IconCadastro={MdAdd}
        corCadastro={"success"}
      />

      <ActionListaValeTransporte dadosDespesasLoja={dadosDespesasLoja} />

      {/* <TableContainer component={Paper} sx={{ maxHeight: '100vh', overflow: 'auto' }}>
        <Table
          stickyHeader
        >
          <TableHead>
         
            <TableRow style={{ backgroundColor: "#7a59ad", color: "#fff", border: '1px solid #0000001a', }}>
              <CustomTableHeader>*</CustomTableHeader>
              <CustomTableHeader>Data Mov.</CustomTableHeader>
              <CustomTableHeader>Descrição</CustomTableHeader>
              <CustomTableHeader >Valor</CustomTableHeader>
              <CustomTableHeader >Pago a</CustomTableHeader>
              <CustomTableHeader >Histórico</CustomTableHeader>
              <CustomTableHeader >Nota Fiscal</CustomTableHeader>
              <CustomTableHeader >Situação</CustomTableHeader>
              <CustomTableHeader >Opção</CustomTableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {dadosDespesasLoja.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={row.ID}>
                
                <CustomTableCell>{index + 1}</CustomTableCell>
                
                <CustomTableCell
                  sx={{
                    backgroundColor: '#f2f2f2',
                    color: '#333',
                    fontWeight: 'bold',
                    border: '1px solid #ccc',
                  }}
                >{dataFormatada(row.DTDESPESA)}</CustomTableCell>
                <CustomTableCell>{row.DSCATEGORIA}</CustomTableCell>
                <CustomTableCell>{formatMoeda(row.VRDESPESA)}</CustomTableCell>
                <CustomTableCell>{row.NOFUNCVALE}</CustomTableCell>
                <CustomTableCell>{row.DSHISTORIO }</CustomTableCell>
                <CustomTableCell>{row.NUNOTAFISCAL  }</CustomTableCell>
            
              
                <CustomTableCell>
                <div style={{ color: row.STCANCELADO === 'False' ? 'blue' : 'red' }}>
                  {row.STCANCELADO === 'False' ? 'Ativo' : 'Cancelado'}
                </div>
                </CustomTableCell>
            
                <CustomTableCell>
                  <div className="p-1 "
                    style={{ justifyContent: "space-between" }}
                  >
                    <div className="p-1">
                      <ButtonTable
                        titleButton={"Imprimir"}
                        cor={"primary"}
                        Icon={MdOutlineLocalPrintshop}
                        onClickButton={() => handleClickImprimir(row)}
                      />
                    </div>
                  </div>
                </CustomTableCell>
              </TableRow>
            ))}


            {dadosDespesasLoja.length > 0 && (
              <TableRow
                sx={{
                  backgroundColor: '#f2f2f2',
                  color: '#333',
                  fontWeight: 'bold',
                  border: '1px solid #ccc',
                }}
              >

                <TableCell
                  style={{
                    backgroundColor: '#f2f2f2',
                    color: '#333',
                    fontWeight: 'bold',
                    border: '1px solid #ccc',
                  }}
                  colSpan={3}>Total Lançamentos</TableCell>
                <TableCell
                  style={{
                    backgroundColor: '#f2f2f2',
                    color: '#333',
                    fontWeight: 'bold',
                    border: '1px solid #ccc',
                  }}
                  align="right"
                >
                  {formatMoeda(dadosDespesasLoja.reduce((acc, item) => acc + parseFloat(item.VRDESPESA), 0))}
                </TableCell>

                
                <TableCell colSpan={5}></TableCell>
              </TableRow>

            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        style={{
          backgroundColor: "#7a59ad", width: "100%"
        }}
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={dadosDespesasLoja.length} // Contagem dos itens em dadosCaixaMovimento
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={"Itens por página"}
      /> */}

      {modalImprimirVisivel && (
        <Modal
          show={modalImprimirVisivel}
          onHide={handleCloseModal}
          size="lg"
          className="modal fade"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"

        >

          <div style={{ padding: "10px" }}>

            <HeaderModal
              title={"Impressão de Recibos"}
              subTitle={"Imprimir Vale Transporte"}
              handleClose={handleCloseModal}
            />

            <Modal.Body>
              {dadosAdiantamentoValeLoja.map((item) => {
                
                return (
                  <Fragment>
                    <div style={{ justifyContent: "center", }}>
                      <div className="col-sm-12">
                        <h3 style={{ textAlign: "center", marginBottom: "30px" }}>VALE TRANSPORTE</h3>
                      </div>


                      <div className="col-sm-12" >
                        <p style={{ fontSize: "14px" }}>O(a)  <b> {item.NOFUNCIONARIO} </b>, CPF: {item.NUCPF}. Declara a empresa {item.NORAZAOSOCIAL}
                          CNPJ: {item.NUCNPJ} <b>  ({item.NOFANTASIA}) </b> - ter recebido a importância de R$ {item.VRDESPESA} (), referente ao VALE TRANSPORTE, pago(s) em espécie.,
                        </p>
                      </div>

                      <div className="col-sm-12" ><p style={{ fontSize: "14px" }}> Histórico: <b> {item.DSHISTORICO} </b> </p></div>

                      <div className="col-sm-12"><p style={{ fontSize: "14px" }}> Conforme Código Civil Lei nº 10.406, Art. 219, o recebimento dos créditos confirmam-se verdadeiras em relação ao Signatário. </p> </div>
                      <div className="col-sm-12"><p style={{ fontSize: "14px" }}> Brasília, {dataFormatada(item.DTDESPESAUPDATE)} . </p> </div>
                      <div style={{ textAlign: "center" }} >
                        <div className="col-sm-12" >--------------------------------------------------------------------------------------------------------------------</div>
                        <div className="col-sm-12" ><p style={{ fontSize: "14px" }}> {item.NOFUNCIONARIO} - CPF: {item.NUCPF}  </p> </div>

                        <div className="col-sm-12">--------------------------------------------------------------------------------------------------------------------</div>
                        <div className="col-sm-12" > <p style={{ fontSize: "14px" }}>{item.NOFANTASIA} - {item.NOMEGERENTE} </p></div>

                      </div>
                    </div>
                  </Fragment>
                )
              })}

            </Modal.Body>


            <FooterModal handleClose={handleCloseModal} />
          </div>
        </Modal>
      )}

      {modalVisivel && (
        <Modal
          show={modalVisivel}
          onHide={handleCloseModal}
          size="lg"
          className="modal fade"
          id="CadadiantamentoSalario"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >

          <HeaderModal
            title={"Dados do Vale Trasnporte da Loja"}
            subTitle={"Cadastrar Vale Trasnporte da Loja"}
            handleClose={handleCloseModal}
          />
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)} >

              <div class="form-group">
                <div class="row">

                  <div class="col-sm-6 col-xl-10">
                    <InputFieldModal
                      className="form-control input"
                      readOnly={true}
                      label="Empresa"
                      value={usuarioLogado.NOFANTASIA}
                    />

                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="row">

                  <div class="col-sm-6 col-xl-4">
                    <InputFieldModal
                      type="datetime"
                      className="form-control input"
                      readOnly={true}
                      label="Data do Vale"
                      value={usuarioLogado.DATA_HORA_SESSAO}
                    />
                  </div>
                  <div class="col-sm-6 col-xl-4">
                    <InputFieldModal
                      type="datetime"
                      className="form-control input"
                      readOnly={true}
                      label="Hora do Vale"
                      value={usuarioLogado.DATA_HORA_SESSAO}
                    />
                  </div>
                  <div class="col-sm-6 col-xl-4">
                    <InputFieldModal
                      type="text"
                      className="form-control input"
                      readOnly={true}
                      label="Despesa"
                      onChangeModal={(e) => setDsPagoa(e.target.value)}
                      value={`${dadosReceitaDespesas[2].IDCATEGORIARECDESP} - ${dadosReceitaDespesas[2].DSCATEGORIA}`}
                    />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <div class="row">
                  <div class="col-sm-6 col-xl-6">
                    <InputFieldModal
                      type="text"
                      className="form-control input"
                      readOnly={false}
                      value={dsHistorio}
                      onChangeModal={(e) => setDsHistorio(e.target.value)}
                      label="Histórico"
                    />

                  </div>

                  <div class="col-sm-6 col-xl-6">
                    <label className="form-label" htmlFor={""}>Funcionário</label>
                    <AsyncSelect
                      cacheOptions
                      loadOptions={loadOptions}
                      defaultOptions
                      value={usuarioSelecionado}
                      onChange={handleChangeUsuario}
                      isSearchable
                    />

                  </div>

                </div>
              </div>
              <div class="form-group">
                <div class="row">
                  <div class="col-sm-6 col-xl-6">
                    <InputFieldModal
                      type="text"
                      className="form-control input"
                      readOnly={false}
                      label="Valor do Vale Transporte"
                      value={vrDespesa}
                      onChangeModal={(e) => setVrDespesa(e.target.value)}
                      placeholder="R$ 0,00"
                    />

                  </div>
                </div>
              </div>
              <div class="form-group">
                <span
                  style={{ fontWeight: 600, color: "#ff0000", fontSize: "16px" }}
                >* Campos Obrigatórios *</span>

              </div>

              <FooterModal
                handleClick={onSubmit}
                handleClose={handleCloseModal}
              />
            </form>
          </Modal.Body>

        </Modal>
      )}

    </Fragment >
  )
}


