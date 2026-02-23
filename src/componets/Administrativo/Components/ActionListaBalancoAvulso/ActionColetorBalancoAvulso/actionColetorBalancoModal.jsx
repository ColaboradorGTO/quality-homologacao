import { Fragment, useRef, useState } from "react"
import { Modal } from "react-bootstrap"
import { formatMoeda } from "../../../../../utils/formatMoeda"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../../ButtonsTabela/ButtonTable"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import HeaderTable from "../../../../Tables/headerTable"
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { get } from "../../../../../api/funcRequest";
import { GrAdd, GrFormView } from "react-icons/gr"
import { InputNumber } from 'primereact/inputnumber';
import { FaCheck, FaMinus } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { useAlterarQauntidadeProduto } from "./hook/useAlterarQuantidadeProduto";


export const ActionColetorBalancoModal = ({ 
  show, 
  handleClose, 
  dadosColetorBalanco, 
  usuarioLogado, 
  optionsModulos,
  empresaSelecionada,
}) => {
  const { register, handleSubmit, errors } = useForm();
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [globalFilterValueDetalhe, setGlobalFilterValueDetalhe] = useState('');
  const [detalhesBalanco, setDetalhesBalanco] = useState([]);
  const [tabelaDetalhe, setTabelaDetalhe] = useState(false);
  const [tabelaColetor, setTabelaColetor] = useState(true);
  const [quantidade, setQuantidade] = useState(0);
  const dataTableRef = useRef();
  
  const {
    handleAlterarQuantidade
  } = useAlterarQauntidadeProduto({ usuarioLogado, optionsModulos });


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Coletor Resumo Balanço',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Coletor', 'Qtd Itens', 'Total Custo', 'Total Venda']],
      body: dadosColetorModal.map(item => [

        item.DSCOLETOR,
        parseFloat(item.NUMEROCOLETOR),
        item.IDEMPRESA,
        item.NUMITENS,
        item.TOTALCUSTO,
        item.TOTALVENDA,
        item.IDRESUMOBALANCO,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('coletor_balanco.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosColetorModal);
    const workbook = XLSX.utils.book_new();
    const header = ['Coletor', 'Qtd Itens', 'Total Custo', 'Total Venda'];
    worksheet['!cols'] = [
      { wpx: 150, caption: 'Nº' }, 
      { wpx: 50, caption: 'Qtd Itens' },
      { wpx: 100, caption: 'Total Custo' },
      { wpx: 100, caption: 'Total Venda' },
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Coletor Resumo Balanço');
    XLSX.writeFile(workbook, 'coletor_balanco.xlsx');
  };


  const dadosColetorModal = dadosColetorBalanco.map((item) => {


    return {
      DSCOLETOR: item.DSCOLETOR,
      NUMEROCOLETOR: parseFloat(item.NUMEROCOLETOR),
      IDEMPRESA: item.IDEMPRESA,
      NUMITENS: item.NUMITENS,
      TOTALCUSTO: item.TOTALCUSTO,
      TOTALVENDA: item.TOTALVENDA,
      IDRESUMOBALANCO: item.IDRESUMOBALANCO,
      STCONSOLIDADO: item.STCONSOLIDADO,
    }
  });

  const colunasColetorModal = [

    {
      field: 'DSCOLETOR',
      header: 'Coletor',
      body: row => {
        if(row.DSCOLETOR != '') {
          return (
            <th style={{fontSize: '18px'}}>{row.NUMEROCOLETOR} - {row.DSCOLETOR}</th>
          )
        } else {
          return (
            <th style={{fontSize: '18px'}}>{row.NUMEROCOLETOR}</th>
          )
        }
      }, 
      
      sortable: true,
    },
    {
      field: 'NUMITENS',
      header: 'QTD Itens',
      body: row => <th style={{fontSize: '18px'}}>{row.NUMITENS}</th>,
      sortable: true,
    },
    {
      field: 'TOTALCUSTO',
      header: 'Total Custo',
      body: row => <th style={{fontSize: '18px'}}>{formatMoeda(row.TOTALCUSTO)}</th>,
      sortable: true,
    },
    {
      field: 'TOTALVENDA',
      header: 'Total Venda',
      body: row => <th style={{fontSize: '18px'}}>{formatMoeda(row.TOTALVENDA)}</th>,
      sortable: true,
    },

    {
      field: 'IDRESUMOBALANCO',
      header: 'Opções',
      body: row => (
        <div className="p-1 "
          style={{ justifyContent: "space-between", display: "flex" }}
        >
          
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar Balanço"}
              cor={"success"}
              Icon={GrFormView}
              iconSize={22}
              onClickButton={() => handleClickResumoBalanco(row)}
            />
          </div>
         
        </div>
      ),
      sortable: true,
    },   
  ]

  const handleEditResumoBalanco = async (IDRESUMOBALANCO, NUMEROCOLETOR) => {
    
    try {
      const response = await get(`/detalhe-balanco?idResumo=${IDRESUMOBALANCO}&numeroColetor=${NUMEROCOLETOR}`);
      if (response.data) {
        setDetalhesBalanco(response.data)
      }
      return response.data;
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleClickResumoBalanco = async (row) => {
    if (row.IDRESUMOBALANCO && row.NUMEROCOLETOR) {
      setTabelaDetalhe(true)
      setTabelaColetor(false)
      handleEditResumoBalanco(row.IDRESUMOBALANCO, row.NUMEROCOLETOR)
    }
  }

  const onGlobalFilterChangeDetalhe = (e) => {
    setGlobalFilterValueDetalhe(e.target.value);
  };

  const handlePrintDetalhe = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Detalhe Resumo Balanço',
  });

  const exportToPDFDetalhe = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID Detalhe', 'Código', 'Produto', 'Cod. Barras', 'Qtd Itens']],
      body: dadosDetalhe.map(item => [
        item.IDDETALHEBALANCO,
        item.IDPRODUTO,
        item.DSNOME,
        item.NUCODBARRAS,
        item.TOTALCONTAGEMGERAL,
        
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('coletor_balanco.pdf');
  };

  const exportToExcelDetalhe = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosDetalhe);
    const workbook = XLSX.utils.book_new();
    const header = ['ID Detalhe', 'Código', 'Produto', 'Cod. Barras', 'Qtd Itens'];
    worksheet['!cols'] = [
      { wpx: 150, caption: 'ID Detalhe' }, 
      { wpx: 100, caption: 'Código' },
      { wpx: 200, caption: 'Produto' },
      { wpx: 100, caption: 'Cod. Barras' },
      { wpx: 100, caption: 'Qtd Itens' },
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalhe Resumo Balanço');
    XLSX.writeFile(workbook, 'detalhe_balanco.xlsx');
  };

  const dadosDetalhe = detalhesBalanco.map((item) => {


    return {
      IDDETALHEBALANCO: item.IDDETALHEBALANCO,
      IDPRODUTO: item.IDPRODUTO,
      DSNOME: item.DSNOME,
      NUCODBARRAS: item.NUCODBARRAS,
      TOTALCONTAGEMGERAL: item.TOTALCONTAGEMGERAL,
      STCONSOLIDADO: item.STCONSOLIDADO,
      IDRESUMOBALANCO: item.IDRESUMOBALANCO,
      NUMEROCOLETOR: item.NUMEROCOLETOR,
    }
  });

  const colunasDetalhe = [
    {
      field: 'IDDETALHEBALANCO',
      header: 'ID Detalhe',
      body: row => <th style={{fontSize: '18px'}}>{row.IDDETALHEBALANCO}</th>,
      sortable: true,
    },
    {
      field: 'IDPRODUTO',
      header: 'Código',
      body: row => <th style={{fontSize: '18px'}}>{row.IDPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => <th style={{fontSize: '18px'}}>{row.DSNOME}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Código de Barras',
      body: row => <th style={{fontSize: '18px'}}>{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'TOTALCONTAGEMGERAL',
      header: 'QTD Itens',
      body: row => (
        <div className="" 
        style={{
           display: 'flex', 
           justifyContent: 'center', 
           alignContent: 'center'
        }}> 
          <InputNumber 
            inputId="horizontal-buttons"
            buttonLayout="vertical" 
            style={{ width: '3rem',  color: 'green', fontSize: '16px' }}
            decrementButtonClassName=""
            incrementButtonClassName=""
            incrementButtonIcon={GrAdd} 
            decrementButtonIcon={FaMinus}
            value={row.TOTALCONTAGEMGERAL} 
            onValueChange={(e) => setQuantidade(e.value)} 
            showButtons  
          />
          </div>
      ),
      sortable: true,
    },

    {
      field: 'IDRESUMOBALANCO',
      header: 'Opções',
      body: row => {
        const itemQuantidade = quantidade
        return (
          <div className=""
            style={{ justifyContent: "space-between", display: "flex" }}
          >
            
            <div >
              <ButtonTable
                titleButton={"Alterar Quantidade"}
                cor={"success"}
                Icon={FaCheck}
                iconSize={22}
                onClickButton={() => {
                  handleAlterarQuantidade(row.IDDETALHEBALANCO, itemQuantidade)
                  handleClickResumoBalanco(row)
                }}
              />
            </div>
            <div >
              <ButtonTable
                titleButton={"Excluir quantidade"}
                cor={"danger"}
                Icon={BsTrash3}
                iconSize={22}
                onClickButton={() => {
                  handleAlterarQuantidade(row.IDDETALHEBALANCO, 0);
                  handleClickResumoBalanco(row)
                }}
              />
            </div>
          </div>
        )
      },
      sortable: true,
    },   
  ]

  return (
    <Fragment>


      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <HeaderModal
          title={"Resumo do Balanço"}
          subTitle={"Relação dos Coletores"}
          handleClose={() => { handleClose(), setTabelaColetor(true) }}
        />
        <div className="mb-10" role="document">
            
          <Modal.Body>
            {tabelaColetor && (
              <Fragment>
                <div className="panel">
                  <div className="panel-hdr">
                    <h2>
                      Resumo do Balanço
                    </h2>

                  </div>
                  <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    <HeaderTable
                      globalFilterValue={globalFilterValue}
                      onGlobalFilterChange={onGlobalFilterChange}
                      handlePrint={handlePrint}
                      exportToExcel={exportToExcel}
                      exportToPDF={exportToPDF}
                    />

                  </div>
                  <div className="card" ref={dataTableRef}>
                    <DataTable
                      title="Vendas por Loja"
                      value={dadosColetorModal}
                      globalFilter={globalFilterValue}
                      size="small"
                      sortOrder={-1}
                      paginator={true}
                      rows={10}
                      // rowsPerPageOptions={[10, 20, 50, dadosColetorModal.length]}
                      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                      filterDisplay="menu"
                      showGridlines
                      stripedRows
                      emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                    >
                      {colunasColetorModal.map(coluna => (
                        <Column
                          key={coluna.field}
                          field={coluna.field}
                          header={coluna.header}

                          body={coluna.body}
                          footer={coluna.footer}
                          sortable={coluna.sortable}
                          headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                          footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                          bodyStyle={{ fontSize: '0.8rem' }}

                        />
                      ))}
                    </DataTable>
                  </div>
                </div>

              </Fragment>
            )}

            {tabelaDetalhe &&(
              <Fragment>
                <form onSubmit={handleSubmit(handleAlterarQuantidade)}>
                <div className="panel">
                  <div className="panel-hdr">
                    <h2>
                      Detalhe do Balanço Nº {detalhesBalanco[0]?.IDRESUMOBALANCO} - {detalhesBalanco[0]?.NOFANTASIA}
                    </h2>
                    <button 
                      className="btn btn-success "
                      onClick={() => { setTabelaDetalhe(false); setTabelaColetor(true) }}
                    >
                      <AiOutlineArrowLeft size={22}/>
                      VOLTAR
                    </button>
                  </div>

                  
                  <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    <HeaderTable
                      globalFilterValue={globalFilterValueDetalhe}
                      onGlobalFilterChange={onGlobalFilterChangeDetalhe}
                      handlePrint={handlePrintDetalhe}
                      exportToExcel={exportToExcelDetalhe}
                      exportToPDF={exportToPDFDetalhe}
                    />

                  </div>
                  <div className="card" ref={dataTableRef}>
                    <DataTable
                      title="Vendas por Loja"
                      value={dadosDetalhe}
                      globalFilter={globalFilterValueDetalhe}
                      size="small"
                      paginator={true}
                      rows={10}
                      rowsPerPageOptions={[10, 20, 50, 100, dadosDetalhe.length]}
                      showGridlines
                      stripedRows           
                      emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                    >
                      {colunasDetalhe.map(coluna => (
                        <Column
                          key={coluna.field}
                          field={coluna.field}
                          header={coluna.header}

                          body={coluna.body}
                          footer={coluna.footer}
                          sortable={coluna.sortable}
                          headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                          footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                          bodyStyle={{ fontSize: '0.8rem' }}

                        />
                      ))}
                    </DataTable>
                  </div>
                    
                </div>
                </form>
              </Fragment>
            )}
          </Modal.Body>
          
        </div>
        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar={"secondary"}
        />
      </Modal>

    </Fragment>
  )

}