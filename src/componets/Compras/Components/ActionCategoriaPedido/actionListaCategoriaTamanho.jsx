import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { put } from "../../../../api/funcRequest";
import { BsTrash3 } from "react-icons/bs";
import Swal from "sweetalert2";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


export const ActionListaCategoriaTamanho = ({ dadosCategoriaTamanhos, usuarioLogado, optionsModulos }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Categoria Tamanhos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Categoria', 'Tipo Categoria', 'Tamanho']],
      body: dados.map(item => [
        item.contador,
        item.DSCATEGORIAPEDIDO,
        item.TIPOPEDIDO,
        item.DSTAMANHO
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('categoria_tamanhos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Categoria', 'Tipo Categoria', 'Tamanho'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Categoria' },
      { wpx: 100, caption: 'Tipo Categoria' },
      { wpx: 70, caption: 'Tamanho' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Categoria Tamanhos');
    XLSX.writeFile(workbook, 'categoria_tamanhos.xlsx');
  };

  const dados = dadosCategoriaTamanhos.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      DSCATEGORIAPEDIDO: item.DSCATEGORIAPEDIDO,
      TIPOPEDIDO: item.TIPOPEDIDO,
      DSTAMANHO: item.DSTAMANHO,
      IDCATPEDIDOTAMANHO: item.IDCATPEDIDOTAMANHO,
    }
  })

  const colunasCategoriaPedido = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DSCATEGORIAPEDIDO',
      header: 'Categoria',
      body: row => <th>{row.DSCATEGORIAPEDIDO}</th>,
      sortable: true,
    },
    {
      field: 'TIPOPEDIDO',
      header: 'Tipo Categoria',
      body: row => <th>{row.TIPOPEDIDO}</th>,
      sortable: true,
    },
    {
      field: 'DSTAMANHO',
      header: 'Tamanho',
      body: row => {
        return (
          <th>{row.DSTAMANHO}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'IDCATPEDIDOTAMANHO',
      header: 'Opções',
      body: row => {
        return (
          <div>
            <ButtonTable
              titleButton={"Excluir Vínculo Categoria/Tamanho"}
              onClickButton={() => handleExcluir(row)}
              cor={"danger"}
              Icon={BsTrash3}
              iconSize={25}
              width="30px"
              height="30px"
            />
          </div>
        )
      },
      sortable: true,
    }
  ]


  const handleExcluir = async (IDCATPEDIDOTAMANHO) => {
    Swal.fire({
      title: `Certeza que Deseja Excluir o Vínculo da Categoria?`,
      text: 'Você não poderá reverter a ação!',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger',
        loader: 'custom-loader'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const putData = {
            IDCATPEDIDOTAMANHO: IDCATPEDIDOTAMANHO,
          }
          const response = await put(`/deletar-vinculo-tamanho-categoria?IDCATPEDIDOTAMANHO=${IDCATPEDIDOTAMANHO}`, putData)
          const textDados = JSON.stringify(putData)
          let textoFuncao = 'COMPRAS/EXCLUSÃO VINCULO CATEGORIA-TAMANHO'

          const postData = {
            IDFUNCIONARIO: String(usuarioLogado.id),
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario
          }

          const responsePost = await post('/log-web', postData)

          return responsePost.data;
        } catch (error) {
          const textDados = JSON.stringify(putData)
          let textoFuncao = 'COMPRAS/ERRO AO EXCLUIR VINCULO CATEGORIA-TAMANHO'

          const postData = {
            IDFUNCIONARIO: String(usuarioLogado.id),
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario
          }

          const responsePost = await post('/log-web', postData)
          Swal.fire({
            title: 'Erro!',
            text: `Erro ao excluir o Vínculo da Categoria: ${error}`,
            icon: 'success'
          });
          return responsePost.data;
        }
      }
    })
  }



  return (
    <Fragment>
      <div className="panel" style={{ marginTop: "4rem" }}>
        <div className="panel-hdr">
          <h2>Relatório Categorias de Tamanhos</h2>
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
        <div className="card mb-4" ref={dataTableRef}>

          <DataTable
            title="Vendas por Loja"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, 500, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasCategoriaPedido.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                bodyStyle={{ fontSize: '1rem', textAlign: 'center' }}

              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment>
  )
}