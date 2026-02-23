import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Modal from 'react-bootstrap/Modal';
import { FaCheck, FaMinus, FaRegSave, FaRegTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { put } from "../../../../api/funcRequest";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";

export const ActionEditarOTModal = ({
  show,
  handleClose,
  dadosDetalheTransferencia,

}) => {
  const { register, handleSubmit, errors } = useForm();
  const [ajusteQuantidade, setAjusteQuantidade] = useState(0)
  // const [dadosDetalheTransferencia, setDadosDetalheTransferencia] = useState(dadosDetalheTransferencia)
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [size] = useState('small')
  const dataTableRef = useRef();
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Controle de Transferência',
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Produto', 'Cód. Barras', 'Descrição', 'R$ Venda', 'QTD'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Produto' },
      { wpx: 100, caption: 'Cód. Barras' },
      { wpx: 100, caption: 'Descrição' },
      { wpx: 100, caption: 'R$ Venda' },
      { wpx: 100, caption: 'QTD' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Controle de Transferência');
    XLSX.writeFile(workbook, 'controle_transferencia.xlsx');
  };
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Produto', 'Cód. Barras', 'Descrição', 'R$ Venda', 'QTD']],
      body: dados.map(item => [
        item.IDPRODUTO,
        item.NUCODBARRAS,
        item.DSNOME,
        item.VLRUNITVENDA,
        item.QTDEXPEDICAO,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('controle_transferencia.pdf');
  };


  const dados = dadosDetalheTransferencia.map((item, index) => {
    let contador = index + 1;

    return {
      IDRESUMOOT: item.IDRESUMOOT,
      IDPRODUTO: item.IDPRODUTO,
      IDEMPRESAORIGEM: item.IDEMPRESAORIGEM,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      VLRUNITVENDA: item.VLRUNITVENDA,
      VLRUNITCUSTO: item.VLRUNITCUSTO,
      QTDEXPEDICAO: parseInt(item.QTDEXPEDICAO),
      QTDRECEPCAO: parseInt(item.QTDRECEPCAO),
      QTDDIFERENCA: parseInt(item.QTDDIFERENCA),
      QTDAJUSTE: parseInt(item.QTDAJUSTE),
      IDEMPRESADESTINO: item.IDEMPRESADESTINO,
      QTDCONFERENCIA: parseInt(item.QTDCONFERENCIA),
      IDSTATUSOT: parseInt(item.IDSTATUSOT),
      contador
    }
  });
  const colunasDetalheTransferencia = [
    {
      field: 'IDPRODUTO',
      header: 'Produto',
      body: row => <th>{row.IDPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód. Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => <th>{row.DSNOME}</th>,
      sortable: true,
    },
    {
      field: 'VLRUNITVENDA',
      header: 'R$ Venda',
      body: row => <th>{row.VLRUNITVENDA}</th>,
      sortable: true,
    },
    {
      field: 'QTDEXPEDICAO',
      header: 'QTD',
      body: row => <th>{row.QTDEXPEDICAO}</th>,
      sortable: true,
    },
    {
      field: 'IDSTATUSOT',
      header: 'Opções',
      button: true,
      body: (row) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%"
            }}
          >
            <div className="mr-2">

              <ButtonTable
                titleButton={"Diminuir Quantidade"}
                onClickButton={() => handleClickEdit(row)}
                Icon={FaMinus}
                iconSize={16}
                iconColor={"#fff"}
                cor={"info"}
                id={row.NUCODBARRAS && row.QTDEXPEDICAO && row.IDRESUMOOT && row.IDPRODUTO}
                disabledBTN={row.IDSTATUSOT === 6}
              />
            </div>

            <div>

              <ButtonTable
                titleButton={"Excluir Produto"}
                onClickButton={() => handleClickEdit(row)}
                Icon={FaRegTrashAlt}
                iconSize={16}
                iconColor={"#fff"}
                cor={"danger"}
                id={row.NUCODBARRAS && row.QTDEXPEDICAO && row.IDRESUMOOT && row.IDPRODUTO}
                disabledBTN={row.IDSTATUSOT === 6}
              />
            </div>
          </div>

        )
      }
    }
  ]

  const handleChangeAjuste = (e, row) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      const updateRow = { ...row, QTDAJUSTE: value };
      const updateData = dados.map((item => (item.IDPRODUTO === row.IDPRODUTO ? updateRow : item)));
      setDadosDetalheTransferencia(updateData);
      setAjusteQuantidade(value);

    }
  }

  const salvarOT = async (data) => {
    let postData = {
      // IDPRODUTO,
      // QTDEXPEDICAO: QTDEXPEDICAO,
      // QTDRECEPCAO: QTDRECEPCAO,
      // QTDDIFERENCA: QTDDIFERENCA,
      // VLRUNITVENDA: VLRUNITVENDA,
      // VLRUNITCUSTO: VLRUNITCUSTO,
      // STFALTA: STFALTA,
      // STSOBRA: STSOBRA,
      // IDSTATUSOT: IDSTATUSOT,
      // IDRESUMOT: IDRESUMOT,
      QTDAJUSTE: ajusteQuantidade,
    }


    const response = await put('/updateOrdemTransferencia', postData)
      .then(response => {



        console.log(response, 'despesa cadastrada com sucesso front end!')
      })

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Ordem de Transferência atualizada com sucesso!',
      showConfirmButton: false,
      timer: 1500
    })

      .catch(error => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao atualizar Ordem de Transferência!',
          showConfirmButton: false,
          timer: 1500
        });

        console.log(error)
      })

  }

  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"

      >
        <div className="modal-content">

          <HeaderModal
            title="Controle Ordem de Transferência"
            subtitle="Nome da Loja"
            handleClose={handleClose}
          />
          <div className="modal-body" id="resultadoot">


            <form onSubmit={handleSubmit(salvarOT)}>
              <div className="row" data-select2-id="736">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Loja Origem"}
                    type="text"
                    // id="IDContaBanco"
                    readOnly={true}
                    value={dadosDetalheTransferencia[0]?.EMPRESAORIGEM}
                  />
                </div>
                <div className="col-sm-6 col-xl-6" data-select2-id="735">
                  <InputFieldModal
                    label={"Loja Destino"}
                    type="select"
                    value={dadosDetalheTransferencia[0]?.EMPRESADESTINO}
                    readOnly={true}
                  />
                </div>
              </div>


              <div className="row mt-4">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Produto"}
                    type="text"
                    // id="IDContaBanco"
                    readOnly={true}
                  />
                </div>
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Data Entrega"}
                    type="text"
                    // id="IDContaBanco"
                    readOnly={true}
                    value={dadosDetalheTransferencia[0]?.DATAEXPEDICAOFORMATADA}
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Quantidade"}
                    type="text"
                    // id="IDContaBanco"
                    readOnly={true}
                  />
                </div>
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Observação"}
                    type="text"
                    // id="IDContaBanco"
                    readOnly={true}
                    value={dadosDetalheTransferencia[0]?.DSOBSERVACAO}
                  />
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-sm-8 col-xl-8">

                  <ButtonTypeModal
                    Icon={FaRegSave}
                    textButton={"Salvar"}
                    cor={"info"}
                    className={"mr-4"}
                    onClickButtonType={salvarOT}

                  />
                </div>
                <div className="col-sm-8 col-xl-8 mt-4">
                  <label className="form-label" style={{ color: "red" }}>Para confirmar as Alterações e Inclusões dos Produtos, favor clicar no botão Salvar!</label>
                </div>
              </div>
            </form>



            <div className="panel">
              <div className="panel-hdr">
                <h2>
                  Lista de Ordem de Transferência
                </h2>
              </div>
              <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <HeaderTable
                  globalFilterValue={globalFilterValue}
                  onGlobalFilterChange={onGlobalFilterChange}
                  handlePrint={handlePrint}
                  exportToExcel={exportToExcel}
                  exportToPDF={exportToPDF}
                />
              </div>
            <div className="card" ref={dataTableRef}></div>
                <DataTable
                  title="Vendas por Loja"
                  value={dados}
                  sortField="VRTOTALPAGO"
                  sortOrder={-1}
                  paginator={true}
                  rows={10}
                  showGridlines
                  stripedRows
                  emptyMessage="Sem Registros para Exibir"
                >
                  {colunasDetalheTransferencia.map(coluna => (
                    <Column
                      key={coluna.field}
                      field={coluna.field}
                      header={coluna.header}

                      body={coluna.body}
                      footer={coluna.footer}
                      sortable={coluna.sortable}
                      headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                      footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                      bodyStyle={{ fontSize: '0.8rem' }}

                    />
                  ))}
                </DataTable>
              </div>
          </div>

          <FooterModal handleClose={handleClose} />
        </div>
      </Modal>
    </Fragment>
  )
}
