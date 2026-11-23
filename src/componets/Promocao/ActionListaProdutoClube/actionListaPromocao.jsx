import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../Tables/headerTable";
import { ButtonTable } from "../../ButtonsTabela/ButtonTable";
import Swal from "sweetalert2";
import { get } from "../../../api/funcRequest";
import { MdEdit } from "react-icons/md";


export const ActionListaPromocao = ({ 
  dadosPromocao,
  optionsModulos,
  usuarioLogado,
  setActionEditarVisivel,
  setActionCriarVisivel,
  setDetalhePromocao 
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [modalVisualizar, setModalVisualizar] = useState(true)
  const dataTableRef = useRef();


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Promoção',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', , 'Descrição', 'Situação']],
      body: dados.map(item => [
        item.IDRESUMOPROMO,
        item.DSPROMO,
        item.STATIVO === 'True' ? 'Ativo' : 'Inativo',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('promocao.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['ID', 'Descrição', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'ID Produto' },
      { wpx: 200, caption: 'Descrição' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Promoção');
    XLSX.writeFile(workbook, 'promocao.xlsx');
  };



  const dados = dadosPromocao?.map((item) => {

    return {
      IDPROMOCAO: item.IDPROMOCAO,
      DSPROMOCAO: item.DSPROMOCAO,
      STATIVO: item.STATIVO,
      DSGRUPOEMPRESARIAL: item.DSGRUPOEMPRESARIAL,
      IDSUBGRUPOEMPRESARIAL: item.IDSUBGRUPOEMPRESARIAL
    }
  });

  const colunasListaPromocao = [
    {
      field: 'IDPROMOCAO',
      header: 'ID',
      body: row => <th style={{ color: 'blue' }} >{row.IDPROMOCAO}</th>,
      sortable: true,
    },
    {
      field: 'DSPROMOCAO',
      header: 'Descrição',
      body: row => <th style={{ color: 'blue' }} >{row.DSPROMOCAO}</th>,
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => (
        <th style={{ color: row.STATIVO == 'True' ? 'blue' : 'red' }}>
          {row.STATIVO === 'True' ? 'Ativa' : 'Inativa'}
        </th>

      ),
      sortable: true,
    },
    {
      field: 'DSGRUPOEMPRESARIAL',
      header: 'Marca',
      body: row => (
        <th style={{ color: 'bue' }}>
          {row.DSGRUPOEMPRESARIAL}
        </th>

      ),
      sortable: true,
    },
    {
      field: 'Detalhar',
      header: 'Detalhar',
      body: (row) => {
        if(row.STATIVO == 'True') {
          return (
            <div className="p-1">
              <ButtonTable
                titleButton={"Editar Promoção"}
                cor={"primary"}
                Icon={MdEdit}
                iconSize={20}
                width="35px"
                height="35px"
                onClickButton={() => handleClickVisualizar(row)}
              />
            </div>
          )
        }
      },
      sortable: true,
    },
  ]

   const handleVisualizar = async (IDPROMOCAO) => {
      try {
        const response = await get(`/detalhe-promocao-produto-clube?idPromocao=${IDPROMOCAO}`);
  
        if (response.data && response.data.length > 0) {
          setDetalhePromocao(response.data);
          setActionEditarVisivel(true);
          setActionCriarVisivel(false)
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Detalhes não encontrados.',
            customClass: {
              container: 'custom-swal',
            }
          });
          return;
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes: ', error);
        Swal.fire({
          icon: 'info',
          title: 'Não existe dados nesta solicitação'
        })
      }
    };
    const handleClickVisualizar = (row) => {
      console.log(row)
      if (row && row.IDPROMOCAO) {
        handleVisualizar(row.IDPROMOCAO);
      }
      // if (optionsModulos[0]?.ALTERAR == 'True') {
  
      // } else {
      //   // Swal.fire({
      //   //   position: 'center',
      //   //   icon: 'error',
      //   //   title: 'Acesso Negado!',
      //   //   html: `${usuarioLogado?.NOFUNCIONARIO} <br> Você não tem permissão.`,
      //   //   showConfirmButton: true,
      //   //   timer: 30000,
      //   //   customClass: {
      //   //     container: 'custom-swal',
      //   //   }
      //   // })
      // }
    };

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr mb-4">
          <h2>Lista de Promoções</h2>
          
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
        <div className="card" ref={dataTableRef}>
          <DataTable
            title="Lista de Promoções"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={
              <div className="dataTables_empty">Nenhum resultado encontrado</div>
            }
          >
            {colunasListaPromocao.map((coluna) => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{
                  color: "white",
                  backgroundColor: "#7a59ad",
                  border: "1px solid #e9e9e9",
                  fontSize: "1rem",
                }}
                footerStyle={{
                  color: "#212529",
                  backgroundColor: "#e9e9e9",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
                bodyStyle={{
                  fontSize: "1rem",
                  border: "1px solid #e9e9e9",
                }}
              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment>
  );
}
