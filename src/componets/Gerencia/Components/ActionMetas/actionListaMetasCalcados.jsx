import { Fragment, useRef, useState } from "react"
import { GrFormView } from "react-icons/gr";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import HeaderTable from "../../../Tables/headerTable";
import { get } from "../../../../api/funcRequest";
import { formatMoeda } from "../../../../utils/formatMoeda";


export const ActionListaMetasCalcados = ({ 
  dadosCalcados,
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();



  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Vendas Metas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Grupo', 'Data Início', 'Data Fim', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.DSSUBGRUPOEMPRESARIAL,
        item.DTMETAINICIOFORMAT,
        item.DTMETAFIMFORMAT,
        item.STSALVO == 'True' ? 'SALVO' : 'NÃO SALVO',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('marcas_vendas_metas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Grupo', 'Data Início', 'Data Fim', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 200, caption: 'Grupo' },
      { wpx: 150, caption: 'Data Início' },
      { wpx: 150, caption: 'Data Fim' },
      { wpx: 150, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Vendas Metas');
    XLSX.writeFile(workbook, 'marcas_vendas_metas.xlsx');
  };

  const dados = dadosCalcados?.map((item, index) => {
    let contador = index + 1;
    console.log(item?.vendasecaocalcados[0]?.['venda-calcados']?.VRTOTALLIQUIDOCALC, 'item')
    return {
      contador,
      IDMETASLOJA: item?.metasColaborador?.IDMETASLOJA,
      IDMETASCOLABORADOR: item?.metasColaborador?.IDMETASCOLABORADOR,
      IDFUNCIONARIO: item?.metasColaborador?.IDFUNCIONARIO,
      NOFUNCIONARIO: item?.metasColaborador?.NOFUNCIONARIO,
      NOSECAO: item?.metasColaborador?.NOSECAO,
      DSFUNCAO: item?.metasColaborador?.DSFUNCAO,
      VRMETACOLABORADOR: item?.metasColaborador?.VRMETACOLABORADOR,
      PERCMETACOLABORADOR: item?.metasColaborador?.PERCMETACOLABORADOR,
      VRTOTALLIQUIDOCALC: item?.vendasecaocalcados[0]?.['venda-calcados']?.VRTOTALLIQUIDOCALC
 
    };
  });

  const colunasVendas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Nome',
      body: row => <th>{row.NOFUNCIONARIO}</th>,
      sortable: true,

    },
    {
      field: 'IDFUNCIONARIO',
      header: 'Matrícula',
      body: row => <th>{row.IDFUNCIONARIO}</th>,
      sortable: true,
    },
    {
      field: 'DSFUNCAO',
      header: 'Função',
      body: row => <th>{row.DSFUNCAO}</th>,
      sortable: true,
    },
    {
      field: 'NOSECAO',
      header: 'Seção',
      body: row => <th>{row.NOSECAO}</th>,
      sortable: true,
    },
    {
      field: 'VRMETACOLABORADOR',
      header: 'Vr Meta',
      body: row => <th>{formatMoeda(row.VRMETACOLABORADOR)}</th>,
      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDOCALC',
      header: 'Vr Alcançado',
      body: row => <th>{formatMoeda(row.VRTOTALLIQUIDOCALC)}</th>,
      sortable: true,
    },
   
    {
      field: 'STSALVO',
      header: 'Opções',
      body: (
        (row) => (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div className="p-1">
              <ButtonTable
                titleButton={"Detalhar Metas"}
                onClickButton={() => handleClickDetalhe(row)}
                Icon={GrFormView}
                iconSize={25}
                iconColor={"#fff"}
                cor={"info"}
                width="30px"
                height="30px"
              />
            </div>
          </div>
        )
      ),
      sortable: true,
    },
  ]

  const handleDetalhe = async (empresa) => {
    try {
      const response = await get(`/detalhe-metas-loja?idMetaEmpresa=${empresa}`)
      const responseCalcados = await get(`/metas-colaborador?idMetaLoja=${empresa}&noSecaoMetaLoja=CALÇADOS`)
      const responseFeminino = await get(`/metas-colaborador?idMetaLoja=${empresa}&noSecaoMetaLoja=FEMININO`)
      const responseMasculino = await get(`/metas-colaborador?idMetaLoja=${empresa}&noSecaoMetaLoja=MASCULINO`)
      const responseInfantil = await get(`/metas-colaborador?idMetaLoja=${empresa}&noSecaoMetaLoja=INFANTIL`)
      const responseCmb = await get(`/metas-colaborador?idMetaLoja=${empresa}&noSecaoMetaLoja=CMB`)
      if (response.data && response.data.length > 0) {
        setDadosDetalheMeta(response.data)
        setDadosCalcados(responseCalcados.data)
        setDadosFeminino(responseFeminino.data)
        setDadosMasculino(responseMasculino.data)
        setDadosInfantil(responseInfantil.data)
        setDadosCMB(responseCmb.data)
        setTabelaVendaResumidaVisivel(true);
        setTabelaVisivel(false);
        setTabelaMetasVendasVisivel(false);
      }
    } catch (error) {
      console.error('Erro ao buscar metas resumidas: ', error);
    }
  };
  
  const handleClickDetalhe = (row) => {
    if (row && row.IDGRUPOEMPRESA) {
      handleDetalhe(row.IDGRUPOEMPRESA);
    }
  };



  return (

    <Fragment>
      <div className="panel" >
        <div className="panel-hdr">
          <h2>Metas Marcas Período aqui</h2>
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
            title="Vendas por Marcas e Período"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, dados.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
            cellMemo={false}
          >
            {colunasVendas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '1rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment>
  )
}

