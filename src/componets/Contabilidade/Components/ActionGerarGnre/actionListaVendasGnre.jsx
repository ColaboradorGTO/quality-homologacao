import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { get } from "../../../../api/funcRequest";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { GrView } from "react-icons/gr";
import { TbFileTypeXml } from "react-icons/tb";
import Swal from "sweetalert2";
import { Row } from "primereact/row";
import { ColumnGroup } from "primereact/columngroup";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FiSend } from "react-icons/fi";
import { ActionVendasGnreModal } from "./actionVendasGnreModal";

export const ActionListaVendasGnre = ({
  dadosVendasGnre,
  usuarioLogado,
  optionsModulos,
}) => {
  const [dadosDetalheVendas, setDadosDetalheVendas] = useState([]);
  const [rowSelection, setRowSelection] = useState(null);
  const [dadosDetalhePagamento, setDadosDetalhePagamento] = useState([]);
  const [detalheVendaXMLModal, setDetalheVendaXMLModal] = useState(false);
  const [dadosDetalhesVendas, setDadosDetalhesVendas] = useState([]);
  const [modalVendas, setModalVendas] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Contigência',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['#', 'Empresa', 'Venda', 'Série', 'NFCE', 'Chave NF', 'Situação', 'Motivo']],
      body: dados.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.IDVENDA,
        item.SERIE,
        item.NF,
        item.CHAVENFE,
        item.STCONTINGENCIA == 'True' ? 'Contigência' : 'Sem Contigência',
        formatMoeda(item.VRTOTALPAGO),
        item.PROTNFE_INFPROT_XMOTIVO ? item.PROTNFE_INFPROT_XMOTIVO : 'Sem Motivo',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_contigencia.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['#', 'Empresa', 'Venda', 'Série', 'NFCE', 'Chave NF', 'Situação', 'Motivo'];
    worksheet['!cols'] = [
      { wpx: 100, caption: '#' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 100, caption: 'Venda' },
      { wpx: 100, caption: 'Série' },
      { wpx: 100, caption: 'NFCE' },
      { wpx: 100, caption: 'Chave NF' },
      { wpx: 100, caption: 'Situação' },
      { wpx: 250, caption: 'Motivo' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Contigência');
    XLSX.writeFile(workbook, 'vendas_contigencia.xlsx');
  };


  const dados = dadosVendasGnre.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      DocEntry: item.DocEntry,
      nNF: item.nNF,
      TaxIdNum: item.TaxIdNum,
      xNome: item.xNome,
      State: item.State,
      xLgr: item.xLgr,
      xMun: item.xMun,
      municipioEmitente: item.municipioEmitente,
      CEP: item.CEP,
      fone: item.fone,

      UF: item.UF,
      xNomeDestinatario: item.xNomeDestinatario,
      CPFCNPJDest: item.CPFCNPJDest,
      xMunDest: item.xMunDest,
      municipioDestinatario: item.municipioDestinatario,
      CodItem: item.CodItem,
      Descricao: item.Descricao,
      vProd: item.vProd,
      vNF: item.vNF,
    }

  })

  const headerGrupo = (
    <ColumnGroup  >
      <Row>
        <Column  
          colSpan="6" 
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#7a59ad", color: 'white' }} 
          headerClassName="grupo-meta-geral"
          header="Dados do Emitente" 
    
        />
        <Column  
          colSpan="6" 
          headerStyle={{ fontSize: '1rem', textAlign: 'center', justifyContent: 'center', backgroundColor: "#FFDB8E", color: 'black' }} 
          headerClassName="grupo-meta-geral"
          header="Dados do Destinatário" 
            
        />

      </Row>
     

      <Row>
        <Column 
          field="contador" 
          header="#" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}   
        />
        <Column 
          field="DocEntry" 
          header="DocEntry" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column 
          field="xNome" 
          header="Empresa Emitente" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="State" 
          header="Estado" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column 
          field="xMun" 
          header="Município " 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />
        <Column 
          field="municipioEmitente" 
          header="Nº Município" 
          sortable={true} 
          style={{color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}  
        />

        <Column 
          field="CPFCNPJDest" 
          header="CPF/CNPJ" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column 
          field="xNomeDestinatario" 
          header="Destinatário" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column 
          field="xMunDest" 
          header="Município" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column 
          field="municipioDestinatario" 
          header="Nº Município" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
        <Column 
          field="vNF" 
          header="Valor NF" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />

        <Column 
          field="vNF" 
          header="Ações" 
          sortable={true} 
          style={{color: 'black', backgroundColor: "#ffca5b", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
        />
      </Row>
    </ColumnGroup>
  )

    const handleEdit = async (DocEntry) => {
      try {
        const response = await get(`/vendas-gnre?doctEntry=${DocEntry}`);
        if (response.data && response.data.length > 0) {

          setDadosDetalhesVendas(response.data)
          setModalVendas(true);
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Sem Detalhes',
            html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Não foi possível encontrar os detalhes para esta venda.`,
            customClass: {
            }
          })
        }
  
      } catch (error) {
        console.error('Erro ao buscar detalhes da venda: ', error);
      }
    };
  
  
    const handleClickEdit = (row) => {
      if (row && row.DocEntry) {
        handleEdit(row.DocEntry);
      }
    };
  
  return (

    <Fragment>
      <div className="panel" >
        <div className="panel-hdr mb-4">

          <h2>Vendas Para Gerar GNRE</h2>
        </div>
        <div style={{ marginBottom: "1rem" }}>
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
            title="Vendas Para Gerar GNRE"
            value={dados}
            size="small"
            headerColumnGroup={headerGrupo}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode={"single"}
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            <Column field="contador" header="#" body={row => <th style={{ fontSize: '0.8rem' }}>{row.contador}</th>} sortable={true} />
            <Column field="DocEntry" header="DocEntry" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.DocEntry}</th>} sortable={true} />
            <Column field="xNome" header="Empresa" body={row => <p style={{ width: '200px', margin: '0px', fontSize: '0.8rem', fontWeight: 600 }}>{row.xNome}</p>} sortable={true} />
            <Column field="State" header="Estado" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.State}</th>} sortable={true} />
            <Column field="xMun" header="Município" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.xMun}</th>} sortable={true} />
            <Column field="municipioEmitente" header="Município Emitente" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.municipioEmitente}</th>} sortable={true} />
            {/* <Column field="CEP" header="CEP" body={row => <th style={{ margin: '0px' }}>{row.CEP}</th>} sortable={true} /> */}
        
            <Column field="CPFCNPJDest" header="CPF/CNPJ" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.CPFCNPJDest}</th>} sortable={true} />
            <Column field="xNomeDestinatario" header="Destinatário" body={row => <p style={{ width: '200px', margin: '0px', fontSize: '0.8rem', fontWeight: 600 }}>{row.xNomeDestinatario}</p>} sortable={true} />
            <Column field="xMunDest" header="Município" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.xMunDest}</th>} sortable={true} />
            <Column field="municipioDestinatario" header="Nº Município" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{row.municipioDestinatario}</th>} sortable={true} />
            <Column field="vNF" header="Valor NF" body={row => <th style={{ margin: '0px', fontSize: '0.8rem' }}>{formatMoeda(row.vNF)}</th>} sortable={true} />
            <Column header="Ações" body={(row) => (
              <div style={{ justifyContent: "space-between", display: "flex" }}>
                <div className="p-1">
                  <ButtonTable
                    titleButton={"Gerar GNRE"}
                    onClickButton={() => handleClickEdit(row)}
                    Icon={FiSend}
                    iconSize={20}
                    iconColor={"#fff"}
                    cor={"success"}
                    width="30px"
                    height="30px"
                  />
                </div>
                <div className="p-1">
                  <ButtonTable
                    titleButton={"Visualizar XML"}
                    onClickButton={() => handleClickEdit(row)}
                    Icon={GrView}
                    iconSize={20}
                    iconColor={"#fff"}
                    cor={"primary"}
                    width="30px"
                    height="30px"
                  />
                </div>

              </div>
            )} 
        
          />  
          </DataTable>
        </div>
      </div>
      <ActionVendasGnreModal 
        show={modalVendas}
        handleClose={() => setModalVendas(false)}
        dadosDetalheVendas={dadosDetalhesVendas}
      />
    </Fragment>
  )
}