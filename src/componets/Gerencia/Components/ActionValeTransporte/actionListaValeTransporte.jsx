import React, { Fragment, useEffect, useRef, useState } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { get } from "../../../../api/funcRequest";
import { getDataAtual } from "../../../../utils/dataAtual";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { ActionImprimirValeTransporte } from "./actionImprimirValeTransporte";
import { BsTrash3 } from "react-icons/bs";
import { CiPower } from "react-icons/ci";
import HeaderTable from "../../../Tables/headerTable";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import { useEditarDespesa } from "./hooks/useEditarDespesa";
import Swal from "sweetalert2";

export const ActionListaValeTransporte = ({ dadosDespesasLoja, optionsModulos, usuarioLogado, refetchDadosLoja }) => {
  const [dadosDetalheDespesas, setDadosDetalheDespesas] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dataHoje, setDataHoje] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();
  const { onSubmit } = useEditarDespesa(usuarioLogado, optionsModulos, refetchDadosLoja, refetchDadosLoja);

  useEffect(() => {
    const data = getDataAtual()
    setDataHoje(data);
  }, [])

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Despesas da Loja',
  });


  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Data Mov', 'Descrição.', 'Valor', 'Pago A', 'Histórico', 'Situação']],
      body: dadosExcel.map(item => [
        item.contador,
        item.DTDESPESA,
        item.DSCATEGORIA,
        item.VRDESPESA,
        item.NOFUNCVALE,
        item.DSHISTORIO,
        item.STCANCELADO == 'False' && item.IDCATEGORIARECDESP == 248 ? 'ATIVO' : 'CANCELADO'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('despesas_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Data Mov', 'Descrição.', 'Valor', 'Pago A', 'Histórico', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Data Mov' },
      { wpx: 200, caption: 'Descrição' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 200, caption: 'Pago A' },
      { wpx: 200, caption: 'Histórico' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Despesas da Loja');
    XLSX.writeFile(workbook, 'despesas_loja.xlsx');
  };

  const dadosExcel = dadosDespesasLoja
    .filter(item => item.IDCATEGORIARECDESP == 248)
    .map((item, index) => {
      let contador = index + 1;
      let data = dataHoje;
      return {
        DTDESPESA: item.DTDESPESA,
        DSCATEGORIA: item.DSCATEGORIA,
        VRDESPESA: item.VRDESPESA,
        NOFUNCVALE: item.NOFUNCVALE,
        DSHISTORIO: item.DSHISTORIO,
        STCANCELADO: item.STCANCELADO,
      };
    });
   
  const dados = dadosDespesasLoja
    .filter(item => item.IDCATEGORIARECDESP == 248)
    .map((item, index) => {
      let contador = index + 1;

      return {
        IDCATEGORIARECDESP: item?.IDCATEGORIARECDESP,
        IDDESPESASLOJA: item?.IDDESPESASLOJA,
        DTDESPESA: item?.DTDESPESA,
        DSCATEGORIA: item?.DSCATEGORIA,
        VRDESPESA: item?.VRDESPESA,
        NOFUNCVALE: item?.NOFUNCVALE,
        DSHISTORIO: item?.DSHISTORIO,
        STATIVO: item?.STATIVO,
        STCANCELADO: item?.STCANCELADO,
        NUNOTAFISCAL: item?.NUNOTAFISCAL,
        DSPAGOA: item?.DSPAGOA,
        DTDESPESA: item?.DTDESPESA,
        contador
      };
    });
    
  const calcularValor = () => {
    let total = 0;
    for (let dados of dadosDespesasLoja) {
      if (dados.STCANCELADO == 'False' && dados.IDCATEGORIARECDESP == 248) {
        total += parseFloat(dados.VRDESPESA);

      }
    }
    return total;
  }

  const colunasVouchers = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: 'blue' }} >{row.contador}</th>,
    },
    {
      field: 'DTDESPESA',
      header: 'Data Mov.',
      body: row => <th style={{ color: 'blue' }} >{row?.DTDESPESA}</th>,
      sortable: true,
    },
    {
      field: 'DSCATEGORIA',
      header: 'Descrição',
      body: row => <th style={{ color: 'blue' }} >{row?.DSCATEGORIA}</th>,
      footer: 'Total Lançamentos',
      sortable: true,
    },
    {
      field: 'VRDESPESA',
      header: 'Valor',
      body: row => <th style={{ color: 'blue' }} >  {formatMoeda(row?.VRDESPESA)}</th>,
      footer: formatMoeda(calcularValor()),
      sortable: true,
    },
    {
      field: 'NOFUNCVALE',
      header: 'Pago a',
      body: row => <th style={{ color: 'blue' }} >{row?.NOFUNCVALE}</th>,
      sortable: true,
    },
    {
      field: 'DSHISTORIO',
      header: 'Histórico',
      body: row => <th style={{ color: 'blue' }} >{row.DSHISTORIO}</th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => {
        return (
          <th style={{ color: row?.STCANCELADO == 'False' ? 'blue' : 'red' }}>
            {row?.STCANCELADO == 'False' ? 'ATIVO' : 'CANCELADO'}
          </th>
        )
      },
      sortable: true,
    },
    {
      field: 'Opções',
      header: 'Opções',
      body: (row) => {

        if (row?.DTDESPESA === dataHoje) {
          if (row?.STCANCELADO == 'False') {
            return (
              <div style={{ display: 'flex', justifyContent: 'space-around' }}  >

                <div>
                  <ButtonTable
                    titleButton={"Cancelar Vale Transporte"}
                    onClickButton={() => onSubmit(row, true)}
                    cor={"danger"}
                    Icon={BsTrash3}
                    iconSize={25}
                    width="35px"
                    height="35px"
                  />
                </div>
                <div>
                  <ButtonTable
                    titleButton={"Imprimir Vale Transporte"}
                    onClickButton={() => handleClickImprimir(row)}
                    cor={"primary"}
                    Icon={MdOutlineLocalPrintshop}
                    iconSize={25}
                    width="35px"
                    height="35px"
                  />
                </div>
              </div>
            )

          } else {

            return (

              <div>
                <ButtonTable
                  titleButton={"Ativar Vale Transporte"}
                  onClickButton={() => onSubmit(row, false)}
                  cor={"success"}
                  Icon={CiPower}
                  iconSize={25}
                  width="35px"
                  height="35px"
                />
              </div>
            )
          }
        } else {
          if (row.STCANCELADO == 'False') {
            return (
              <div>
                <ButtonTable
                  titleButton={"Imprimir Vale Transporte"}
                  onClickButton={() => handleClickImprimir(row)}
                  cor={"primary"}
                  Icon={MdOutlineLocalPrintshop}
                  iconSize={25}
                  width="35px"
                  height="35px"
                />
              </div>
            )
          }
        }
      },
    }
  ]

  const handleImprimir = async (IDDESPESASLOJA) => {
    try {
      const response = await get(`/despesa-Loja-todos?idDespesas=${IDDESPESASLOJA}`);
      if (response.data && response.data.length > 0) {
        setDadosDetalheDespesas(response.data);
        setModalVisivel(true);
      } else{
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Detalhes da despesa não encontrados.',
          confirmButtonText: 'OK'
        })
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickImprimir = (row) => {
    if (row && row.IDDESPESASLOJA) {
      handleImprimir(row.IDDESPESASLOJA);
    }
  };

  return (

    <Fragment>
      <div className="panel">
        <panel className="panel-hdr">
          <h3 className="hdr-title">Lista
            Vale Transporte da Loja dos Últimos 30 dias</h3>
        </panel>
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
            title="Vendas por Loja"
            value={dados}
            size='small'
            globalFilter={globalFilterValue}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            showGridlines
            stripedRows
            response
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVouchers.map(coluna => (
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

      <ActionImprimirValeTransporte
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        dadosDetalheDespesas={dadosDetalheDespesas}
      />
    </Fragment>
  )
}

