import React, { Fragment, useEffect, useState } from "react"
import { ButtonType } from "../Buttons/ButtonType";
import { InputSelectAction } from "../Inputs/InputSelectAction";
import { ActionMain } from "../Actions/actionMain";
import { InformaticaActionCdastrarEmpresaModal } from "./informaticaActionCadastrarEmpresaModal";
import { InputField } from "../Buttons/Input";
import { get } from "../../api/funcRequest";
import { CiSearch } from "react-icons/ci";
import { AiOutlineUpload } from "react-icons/ai";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Modal from 'react-bootstrap/Modal';
import { ButtonTypeModal } from "../Buttons/ButtonTypeModal";
import { FooterModal } from "../Modais/FooterModal/footerModal";
import { InputFieldModal } from "../Buttons/InputFieldModal";
import { HeaderModal } from "../Modais/HeaderModal/HeaderModal";
import { GrView } from "react-icons/gr";
import { ButtonTable } from "../ButtonsTabela/ButtonTable";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { dataFormatada } from "../../utils/dataFormatada";
import { formatMoeda } from "../../utils/formatMoeda";
import { MdOutlineAttachMoney } from "react-icons/md";


export const InformaticaActionExportDataCSVCredSystem = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalPagamentoVisivel, setModalPagamentoVisivel] = useState(false);
  const [modalDetalheVendasVisivel, setModalDetalheVendasVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [dadosExemplos, setDadosExemplos] = useState([]);
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [dadosEmpresas, setDadosEmpresas] = useState([]);
  const [dadosVendasLoja, setDadosVendasLoja] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [totalVRTOTALPAGO, setTotalVRTOTALPAGO] = useState(0);
  const [dadosDetalheVenda, setDadosDetalheVenda] = useState([]);
  const [dadosPagamentoModal, setDadosPagamentoModal] = useState([]);

  useEffect(() => {
    getListaEmpresas();
  }, []);

  const getListaEmpresas = async () => {
    try {
        const response = await get(`/listaEmpresasIformatica`);
        if (response.data && response.data.length > 0) {
          setDadosEmpresas(response.data);
         
        }
        return response.data;
      
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, lista Vendas vendedor");
    }

  }

  const animatedComponents = makeAnimated();

  const getListaVendasLoja = async (empresaSelecionada) => {
    try {
        const response = await get(`/vendasLojaInformatica?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataInicio}&dataPesquiaFim=${dataFim}`);
        if (response.data && response.data.length > 0) {
          setDadosVendasLoja(response.data);
        //  console.log("response.data", response.data)
        }
        return response.data;
      
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, lista Vendas vendedor");
    }

  }
  
  const dadosListaVendas = dadosVendasLoja.map((item, index) => {
    let contador = index + 1;
    return {
      IDCAIXAWEB: item.IDCAIXAWEB,
      DSCAIXA: item.DSCAIXA,
      VSSISTEMA: item.VSSISTEMA,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      STCONFERIDO: item.STCONFERIDO,
      VRTOTALPAGO: item.VRTOTALPAGO,
      STCONTINGENCIA: item.STCONTINGENCIA,
      
      contador
    };
  });
  
  useEffect(() => {
    const totalVendas = calcularTotalVendas();
    setTotalVRTOTALPAGO(totalVendas);
  }, [dadosListaVendas]); 

  const calcularTotalVendas = () => {
    let total = 0;
    for (let venda of dadosListaVendas) {
      total += parseFloat(venda.VRTOTALPAGO);
    }
    // console.log("total", total)
    return total;
  }
  
  const colunasVendas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => row.contador,
      sortable: true,
      
    },
    {
      field: 'IDCAIXAWEB',
      header: 'Caixa',
      body: row => row.IDCAIXAWEB && row.DSCAIXA,
      sortable: true,
  
    },
    {
      field: 'VSSISTEMA',
      header: 'Versão',
      body: row => row.VSSISTEMA,
      sortable: true,
   
    },
    {
      field: 'IDVENDA',
      header: 'Nº Venda',
      body: row => row.IDVENDA,
      sortable: true,
   
    },
    {
      field: 'NFE_INFNFE_IDE_NNF',
      header: 'NFC-e',
      body: row => parseFloat(row.NFE_INFNFE_IDE_NNF),
      sortable: true,

    },
    {
      field: 'DTHORAFECHAMENTO',
      header: 'Abertura',
      body: row => dataFormatada(row.DTHORAFECHAMENTO),
      sortable: true,
  
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Operador',
      body: row => row.NOFUNCIONARIO,
      sortable: true,
      footer: 'Total Vendas Ativas'
    },
    {
      field: 'VRTOTALPAGO',
      header: 'Valor',
      body: row => formatMoeda(row.VRTOTALPAGO),
      sortable: true,
      footer: formatMoeda(calcularTotalVendas()),
    },
    {
      field: 'STCONTINGENCIA',
      header: 'Nota',
      body: (
        (row) => (
        <div style={{color: row.STCONTINGENCIA == 'False' ? 'red' : 'blue'}}>
          {row.STCONTINGENCIA == 'False' ? 'Contigência' : 'Emitida'}

        </div>
        )
      ),
      sortable: true,
    },
    {
      field: 'STCONFERIDO',
      header: 'Migrado Sap',
      body: (
        (row) => (
        <div style={{color: row.STCONFERIDO == 1 ? 'blue' : 'red'}}>
          {row.STCONFERIDO == 1 ? 'Sim' : 'Não'}

        </div>
        )
      ),
      sortable: true,
    },
    {
      field: 'STCONFERIDO',
      header: 'Opções',
      body: (
        (row) => (
          <div style={{display: "flex", justifyContent: "space-around"}}>
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar "}
              onClickButton={() => handleClickDetalhar(row)}
              Icon={GrView}
              iconSize={18}
              iconColor={"#fff"}
              cor={"primary"} 

            />
            
          </div>
          <div className="p-1">
            <ButtonTable
              titleButton={"Recebimento"}
              onClickButton={() => handleClickPagamento(row)}
              Icon={MdOutlineAttachMoney}
              iconSize={18}
              iconColor={"#fff"}
              cor={"info"}
            />

          </div>

        </div>
        )
       
     ),
      sortable: true,
    },
  ]

  const handleDetalha = async  (IDVENDA) => {
    try {
      const response = await get(`/detalheVenda?idVenda=${IDVENDA}`);
      if(response.data) {
        setDadosDetalheVenda(response.data);
        setModalDetalheVendasVisivel(true);
      }
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, detalhe Venda");
    }
  }

  const handleClickDetalhar = (row) => {
    if(row && row.IDVENDA) {
      handleDetalha(row);
    }
  }

  const handleEditPagamento = async (IDVENDA) => {
    try {
      const response = await get(`/recebimentos?idVenda=${IDVENDA}`)
      if(response.data) {
        setDadosPagamentoModal(response.data)
        setModalPagamentoVisivel(true)
        console.log(response.data, 'dados pagamento')
      }
    } catch (error) {
      console.log(error, 'não foi possivel pegar os dados da tabela')
    }
  }
  const handleClickPagamento = (row) => {
    if(row.IDVENDA) {
      handleEditPagamento(row.IDVENDA)
    }
  }

  const dadosPagamentos = dadosPagamentoModal.map((item) => {

    return {
      IDVENDA: item.venda.IDVENDA,
      VRDINHEIRO: item.venda.VRDINHEIRO,
      VRRECCARTAO: item.venda.VRRECCARTAO,
      VRRECPOSVENDA: item.venda.VRRECPOSVENDA,
      VRRECPOS: item.venda.VRRECPOS,
      VRRECPIX: item.venda.VRRECPIX,
      VRRECMOOVPAY: item.venda.VRRECMOOVPAY,
      VRRECCONVENIO: item.venda.VRRECCONVENIO,
      VRRECVOUCHER: item.venda.VRRECVOUCHER,

      IDEMPRESA: item.venda.IDEMPRESA,
      IDCAIXAWEB: item.venda.IDCAIXAWEB,
      IDOPERADOR: item.venda.IDOPERADOR,
      VRTOTALVENDA: item.venda.VRTOTALVENDA,
      ULTNITEM: item.venda.ULTNITEM,

      DSTIPOPAGAMENTO: item.vendaPagamento[0].pag.DSTIPOPAGAMENTO,
      NPARCELAS: item.vendaPagamento[0].pag.NPARCELAS,
      NUOPERACAO: item.vendaPagamento[0].pag.NUOPERACAO,
      NSUAUTORIZADORA: item.vendaPagamento[0].pag.NSUAUTORIZADORA,
      VALORRECEBIDO: item.vendaPagamento[0].pag.VALORRECEBIDO
    }
  });

  const colunasPagamento = [
    {
      field: 'VRDINHEIRO',
      header: 'VR. Dinheiro',
      body: row => formatMoeda(row.VRDINHEIRO),
      sortable: true,
    },
    {
      field: 'VRRECCARTAO',
      header: 'Vr. Cartão',
      body: row => formatMoeda(row.VRRECCARTAO),
      sortable: true,

    },
    {
      field: 'VRRECPOS',
      header: 'Vr. POS',
      body: row => formatMoeda(row.VRRECPOS),
      sortable: true,

    },
    {
      field: 'VRRECPIX',
      header: 'Vr. PIX',
      body: row => formatMoeda(row.VRRECPIX),
      sortable: true,

    },
    {
      field: 'VRRECMOOVPAY',
      header: 'Vr. MP',
      body: row => formatMoeda(row.VRRECMOOVPAY),
      sortable: true,

    },
    {
      field: 'VRRECCONVENIO',
      header: 'Vr. Convênio',
      body: row => formatMoeda(row.VRRECCONVENIO),
      sortable: true,

    },
    {
      field: 'VRRECVOUCHER',
      header: 'Vr. Voucher',
      body: row => formatMoeda(row.VRRECVOUCHER),
      sortable: true,

    },
    
  ]

  const colunasPagPos = [
    {
      field: 'DSTIPOPAGAMENTO',
      header: 'Pagamento',
      body: row => row.DSTIPOPAGAMENTO,
      sortable: true,
    },
    {
      field: 'NPARCELAS',
      header: 'Parcelas',
      body: row => parseFloat(row.NPARCELAS),
      sortable: true,

    },
    {
      field: 'NUOPERACAO',
      header: 'NSU_CTF',
      body: row => parseFloat(row.NUOPERACAO),
      sortable: true,

    },
    {
      field: 'NSUAUTORIZADORA',
      header: 'Autorização',
      body: row => row.NSUAUTORIZADORA,
      sortable: true,

    },
    {
      field: 'VALORRECEBIDO',
      header: 'Vr. Recebido',
      body: row => formatMoeda(row.VALORRECEBIDO),
      sortable: true,

    },

    
  ]

  const handleChangeEmpresa = (e) => {
    const selecteId = e.target.value;
    if(!isNaN(selecteId)){
      setEmpresaSelecionada(selecteId);
    }
  }


  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);

    if (clickContador % 2 === 0) {
      setTabelaVisivel(true)
      getListaVendasLoja(empresaSelecionada)
    }

  }

  const handleModalVisivel = () => {
    setModalVisivel(true)
  }
  const handleCloseModal = () => {
    setModalVisivel(false)
    setModalDetalheVendasVisivel(false)
    setModalPagamentoVisivel(false)
  }

  const optionsEmpresasF = [
    { value: 0, label: "Todas" },
    { value: 1, label: "Free Center" },
    { value: 2, label: "Tesoura" },
    { value: 3, label: "Magazine" },
  ]

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Exportar Dados"]}
        title="Exportar Dados para CSV"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataInicio}
        onChangeInputFieldDTInicio={(e) => setDataInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataFim}
        onChangeInputFieldDTFim={(e) => setDataFim(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Empresa"}
        optionsEmpresas={[
          {value: '', label: 'Selecione a Empresa'},
          ...dadosEmpresas.map((item) => ({
            value: item.IDEMPRESA,
            label: item.NOFANTASIA
          }))
        ]}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleChangeEmpresa}



        ButtonTypeVendasEstrutura={ButtonType}
        linkNomeVendasEstrutura={"Pesquisar"}
        onButtonClickVendasEstrutura={handleClick}
        iconVendasEstrutura={CiSearch}

        ButtonTypeVendasVendedor={ButtonType}
        linkNomeVendasVendedor={"Cadastro Clientes"}
        onButtonClickVendasVendedor
        iconVendasVendedor={AiOutlineUpload}

        ButtonTypeProdutoVendidos={ButtonType}
        linkNomeProdutoVendido={"Meio Pagamento"}
        onButtonClickProdutoVendido
        iconProdutoVendido={AiOutlineUpload}

        ButtonTypeVendasResumida={ButtonType}
        linkNomeVendasResumido={"Parceria"}
        onButtonClickVendasResumido
        iconVendasResumida={AiOutlineUpload}

      />

      {tabelaVisivel && (

        <div className="card">
          <DataTable
            value={dadosListaVendas}
            sortField="VRTOTALPAGO"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
            showGridlines
          >
            {colunasVendas.map(coluna => (

              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9' }}
              />
            ))}
          </DataTable>
        </div>
      )}

 

      <Fragment>
        <Modal
          show={modalDetalheVendasVisivel}
          onHide={handleCloseModal}
          size="xl"
          className="modal fade"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
    
          <HeaderModal
            title={"Detalhe da Venda"}
            subTitle={"Relação de Produtos da Venda"}
            handleClose={handleCloseModal}
          />
  
          <Modal.Body>
            <form >
              <div className="form-group">
                <div className="row">
                  <div className="col-sm-6 col-xl-6">

                    <InputFieldModal
                      label={"Empresa"}
                      type="text"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>
                  <div className="col-sm-6 col-xl-4">
                    <InputFieldModal
                      label={"Nº Mov.Caixa"}
                      type="text"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>
                  <div className="col-sm-6 col-xl-2">
                    <InputFieldModal
                      label={"Nota Nº "}
                      type="text"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>          
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-sm-6 col-xl-3">

                    <InputFieldModal
                      label={"Data Abertura"}
                      type="date"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>
                  <div className="col-sm-6 col-xl-3">
                    <InputFieldModal
                      label={"Data Fechamento"}
                      type="date"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>
                  <div className="col-sm-6 col-xl-6">
                    <InputFieldModal
                      label={"Chave da Nota"}
                      type="text"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>          
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-sm-6 col-xl-3">

                    <InputFieldModal
                      label={"Valor Venda"}
                      type="text"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>
                  <div className="col-sm-6 col-xl-3">
                    <InputFieldModal
                      label={"Valor Bruto Nota"}
                      type="text"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>
                  <div className="col-sm-6 col-xl-3">
                    <InputFieldModal
                      label={"Valor Desc Nota"}
                      type="text"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>          
                  <div className="col-sm-6 col-xl-3">
                    <InputFieldModal
                      label={"Valor Nota"}
                      type="text"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>          
                </div>
              </div>
    
              <div className="form-group">
                <div className="row">
                  <div className="col-sm-6 col-xl-3">

                    <InputFieldModal
                      label={"Nº Cupom"}
                      type="text"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>
                  <div className="col-sm-6 col-xl-3">
                    <InputFieldModal
                      label={"Venda Origem"}
                      type="text"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>
                  <div className="col-sm-6 col-xl-3">
                    <InputFieldModal
                      label={"Venda Destino"}
                      type="text"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>          
                  <div className="col-sm-6 col-xl-3">
                    <InputFieldModal
                      label={"Valor Desconto"}
                      type="text"
                      id={""}
                      readOnly={true}
                      value={''}
                      
                    />
                  </div>          
                </div>
              </div>
    
            </form>
          </Modal.Body>
          
          <FooterModal
            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleCloseModal}
            corFechar="secondary"
          />
        </Modal>
      </Fragment>

      <Fragment>
        <Modal
          show={modalPagamentoVisivel}
          onHide={handleCloseModal}
          size="xl"
          className="modal fade"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
    
          <HeaderModal
            title={"Detalhe da Venda"}
            subTitle={"Relação de Produtos da Venda"}
            handleClose={handleCloseModal}
          />
  
          <Modal.Body>
          <div className="card">
            <DataTable
              value={dadosPagamentos}
              sortField="VRTOTALPAGO"
              sortOrder={-1}
              // paginator={true}
              // rows={10}
              // rowsPerPageOptions={[5, 10, 20, 50]}
              showGridlines
            >
              {colunasPagamento.map(coluna => (

                <Column
                  key={coluna.field}
                  field={coluna.field}
                  header={coluna.header}
                  body={coluna.body}
                  footer={coluna.footer}
                  sortable={coluna.sortable}
                  headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9' }}
                />
              ))}
            </DataTable>
          </div>

          <div className="card mt-4">
            <DataTable
              value={dadosPagamentos}
              sortField="VRTOTALPAGO"
              sortOrder={-1}
              // paginator={true}
              // rows={10}
              // rowsPerPageOptions={[5, 10, 20, 50]}
              showGridlines
            >
              {colunasPagPos.map(coluna => (

                <Column
                  key={coluna.field}
                  field={coluna.field}
                  header={coluna.header}
                  body={coluna.body}
                  footer={coluna.footer}
                  sortable={coluna.sortable}
                  headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9' }}
                />
              ))}
            </DataTable>
          </div>
          </Modal.Body>
          
          <FooterModal
            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleCloseModal}
            corFechar="secondary"
          />
        </Modal>
      </Fragment>

      <InformaticaActionCdastrarEmpresaModal show={modalVisivel} handleClose={handleCloseModal} />
   
    </Fragment>
  )
}
