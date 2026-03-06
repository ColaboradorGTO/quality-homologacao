import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from '../../../ButtonsTabela/ButtonTable';
import { CiEdit } from 'react-icons/ci';
import { SiSap } from "react-icons/si";
import { BsTrash3 } from "react-icons/bs";
import { get } from "../../../../api/funcRequest";
import { ActionVincularFabricanteFornecedorModal } from "./ActionEditarVinculoFabricante/actionEditarVincularFabricanterModal";
import { ActionEditarFabricanteModal } from "./ActionEditar/actionEditarFabricanteModal";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useMigrarFabricanteSap } from "./hooks/useMigrarFabricanteSap";
import Swal from "sweetalert2";

export const ActionListaFabricantes = ({ dadosFabricantesFornecedo, dadosFornecedores, usuarioLogado, optionsModulos, handleClick }) => {
  const [dadosDetalheFornecedorFabricante, setDadosDetalheFornecedorFabricante] = useState([]);
  const [dadosDetalheFabricante, setDadosDetalheFabricante] = useState([]);
  const [modalEditarFabricante, setModalEditarFabricante] = useState(false);
  const [modalEditarVinculo, setModalEditarVinculo] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const {
    migrarFabricanteSap
  } = useMigrarFabricanteSap({usuarioLogado, optionsModulos, handleClick})

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Relatório Fabricantes',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Fabricante', 'Fornecedor', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.NUCNPJ,
        item.NORAZAOSOCIAL,
        item.NOFANTASIA,
        item.NUTELEFONE1,
        item.ECIDADE,
        item.SGUF,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('relatorio_fabricantes.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Fabricante', 'Fornecedor', 'Situação']
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Fabricante' },
      { wpx: 200, caption: 'Fornecedor' },
      { wpx: 200, caption: 'Situação' },

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório Fabricantes');
    XLSX.writeFile(workbook, 'relatorio_fabricantes.xlsx');
  };
  
  
  const dadosListaFornecedoresFabricantes = dadosFabricantesFornecedo.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      DSFABRICANTE: item.DSFABRICANTE,
      IDFABSAP: item.IDFABSAP,
      NOFANTFORN: item.NOFANTFORN,
      STATIVO: item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO',

      IDFORNECEDOR: item.IDFORNECEDOR,
      IDFABRICANTE: item.IDFABRICANTE,
      IDFABRICANTEFORN: item.IDFABRICANTEFORN,
      LOGFABSAP: item.LOGFABSAP,
    }
  })

  const colunasFornecedores = [
    {
      field: 'IDFABRICANTE',
      header: 'Nº',
      body: row => <th>{row.IDFABRICANTE}</th>,
      sortable: true
    },
    {
      field: 'DSFABRICANTE',
      header: 'Fabricante',
      body: row => <th>{row.DSFABRICANTE}</th>,
      sortable: true
    },
    {
      field: 'IDFABSAP',
      header: 'St. SAP',
      body: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 700,  color: !row.IDFABSAP ? '#fd3995' : '#2196F3'  }} title={row.LOGFABSAP || `Motivo: ${row.LOGFABSAP}` } >
              {!row.IDFABSAP ? 'NÃO MIGRADO' : 'MIGRADO'}
            </p>
          </div>
        )
      }
    },
    {
      field: 'NOFANTFORN',
      header: 'Fornecedor Vinculado',
      body: row => {
        return (
          <p style={{ fontWeight: 700,   color: row.NOFANTFORN ? '' : '#fd3995'}}>
            {row.NOFANTFORN || <span style={{color: 'red'}}>SEM VINCULO</span>}
          </p>
        )
      },
      sortable: true
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: (row) => {
        return (
          <p style={{ color: row.STATIVO == 'ATIVO' ? '#2196F3' : '#fd3995', fontWeight: 700 }}>{row.STATIVO}</p>
        )
      },
      sortable: true
    },
   {
  field: 'IDFORNECEDOR',
  header: 'Opções',
  body: (row) => {
   
    const btnEditarFabricante = (
      <div className="p-1">
        <ButtonTable
          Icon={CiEdit}
          cor={"success"}  
          iconColor={"white"}
          onClickButton={() => clickEditarFabricante(row)}
          titleButton={"Editar Fabricante"}
          iconSize={25}
          width="30px"
          height="30px"
        />
      </div>
    );

    const btnMigrarSap = !row.IDFABSAP ? ( 
      <div className="p-1">
        <ButtonTable
          Icon={SiSap}
          cor={"primary"}  
          iconColor={"white"}
          onClickButton={() => migrarFabricanteSap(row)}
          titleButton={"Migrar Fabricante SAP"}
          iconSize={25}
          width="30px"
          height="30px"
        />
      </div>
    ) : null;

    if (row.IDFORNECEDOR > 0) {
   
      return (
        <div className="p-1" style={{ justifyContent: "space-between", width: "150px", display: "flex" }}>
          {btnEditarFabricante}
          
          <div className="p-1">
            <ButtonTable
              Icon={CiEdit}
              cor={"warning"} 
              iconColor={"white"}
              onClickButton={() => clickVinculoFonecedorFabricante(row)}
              titleButton={"Editar Vínculo Fabricante/Fornecedor"}
              iconSize={25}
              width="30px"
              height="30px"
            />
          </div>
          
          <div className="p-1">
            <ButtonTable
              Icon={BsTrash3}
              cor={"danger"} 
              iconColor={"white"}
              onClickButton={() => excluirVinculoFabricante(row)}
              titleButton={"Excluir Vínculo Fabricante/Fornecedor"}
              iconSize={25}
              width="30px"
              height="30px"
            />
          </div>
          
          {btnMigrarSap}  
        </div>
      )
    } else {
     
      return (
        <div style={{ display: "flex" }}>
          {btnEditarFabricante}
          {btnMigrarSap}  
        </div>
      )
    }
  }
}
  ]

  const editarFabricante = async (IDFABRICANTE) => {
    try {
      const response = await get(`/fabricantes?idFabricante=${IDFABRICANTE}`);

      if (response.data && response.data.length > 0) {
        setDadosDetalheFabricante(response.data)
        setModalEditarFabricante(true);
       
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Detalhes do fabricante não encontrados.',
          customClass: {
            container: 'custom-swal',
          }
        })
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da despesa: ', error);
    }
  };


  const clickEditarFabricante = (row) => {
    if (row && row.IDFABRICANTE) {
      editarFabricante(row.IDFABRICANTE);
    }
  };

  const editarVinculoFornecedorFabricante = async (IDFABRICANTEFORN) => {
    try {
      const response = await get(`/vincularFabricanteFornecedor?idFabricanteFornecedor=${IDFABRICANTEFORN}`);

      if (response.data && response.data.length > 0) {
        setDadosDetalheFornecedorFabricante(response.data)
        setModalEditarVinculo(true);

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Detalhes do vínculo fabricante/fornecedor não encontrados.',
          customClass: {
            container: 'custom-swal',
          }
        })
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da despesa: ', error);
    }
  };

  const clickVinculoFonecedorFabricante = (row) => {
    if (row && row.IDFABRICANTEFORN) {
      editarVinculoFornecedorFabricante(row.IDFABRICANTEFORN);
    }
  };

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Relatório Transportadoras </h2>
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
        <div className="card " ref={dataTableRef}>

          <DataTable
            title="Vendas por Loja"
            value={dadosListaFornecedoresFabricantes}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50, 100, dadosListaFornecedoresFabricantes.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasFornecedores.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                bodyStyle={{ fontSize: '1rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>

      <ActionEditarFabricanteModal
        show={modalEditarFabricante}
        handleClose={() => setModalEditarFabricante(false)}
        dadosDetalheFabricante={dadosDetalheFabricante}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}   
      />

      <ActionVincularFabricanteFornecedorModal
        show={modalEditarVinculo}
        handleClose={() => setModalEditarVinculo(false)}
        dadosDetalheFornecedorFabricante={dadosDetalheFornecedorFabricante}
        dadosFornecedores={dadosFornecedores}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick} 
      />
    </Fragment>
  )
}