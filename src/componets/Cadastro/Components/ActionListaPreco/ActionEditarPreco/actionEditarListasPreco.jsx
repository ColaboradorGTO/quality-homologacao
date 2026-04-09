import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEditarListaPrecos } from "../../../hooks/useEditarListaPrecos";
import HeaderTable from "../../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


export const ActionEditarListasPrecos = ({ show, handleClose, dadosListaLoja }) => {
  const {
    dadosEmpresas,
    rowClick,
    setRowClick,
    empresaSelecionada,
    setEmpresaSelecionada,
  } = useEditarListaPrecos()
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Preço',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'ID Lista', 'Nome Loja', 'Status']],
      body: dados.map(item => [
        item.contador,
        item.IDRESUMOLISTAPRECO,
        item.NOMELISTA,
        item.detalheLista,
        item.DATACRIACAO,
        item.DATAALTERACAO,
        item.STATIVO == 'True' ? 'ATIVA' : 'INATIVA'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_preco.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'ID Lista', 'Nome Loja', 'Status']
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'ID Lista' },
      { wpx: 300, caption: 'Nome Loja' },
      { wpx: 100, caption: 'Status' },
  
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Preço');
    XLSX.writeFile(workbook, 'lista_preco.xlsx');
  };

  const dados = dadosEmpresas.map((item, index) => {
    let contador = index + 1;
    return {

      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      STATIVO: item.STATIVO,
      contador

    }
  })

  const colunasEmpresas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDEMPRESA',
      header: 'ID Loja',
      body: row => <th>{row.IDEMPRESA}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Nome Loja',
      body: row => {
        return (
          <th>{row.NOFANTASIA}</th>
        )

      },
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => {
        return (
          <th style={{ color: row.STATIVO == 'True' ? 'blue' : 'red' }} >{row.STATIVO == 'True' ? 'ATIVA' : 'INATIVA'}</th>
        )
      },
      sortable: true,
    },
    {
      header: 'Selecione',
      selectionMode: 'multiple',
      selection: empresaSelecionada,
      width: '10px',
      sortable: true,
    },

  ]

  return (

    <Fragment>

      <div className="panel">

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
            selectionMode={rowClick ? null : 'checkbox'}
            selection={empresaSelecionada}
            onSelectionChange={e => setEmpresaSelecionada(e.value)}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasEmpresas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                selectionMode={coluna.selectionMode}
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
  )
}


'00425381G',
'00425381GG',
'00425381M',
'00425381P',
'90436',
'90437',
'90435',
'90434',
'90432',
'90433',
'90431',
'90430',
'90424',
'90425',
'90423',
'90422',
'90440',
'90441',
'90439',
'90438',
'90428',
'90429',
'90427',
'90426',
'90408',
'90409',
'90407',
'90406',
'90420',
'90421',
'90419',
'90418',
'90416',
'90417',
'90415',
'90414',
'90413',
'90412',
'90411',
'90410',
'90404',
'90405',
'90403',
'90402',
'94121',
'94122',
'94120',
'94119',
'59380',
'59386',
'0004574142',
'0004574144',
'0004574146',
'0004574148',
'0004574150',
'0004574246',
'0004574248',
'0004574250',
'0004563144',
'0004563146',
'0004563150',
'0004563242',
'0004563244',
'0004563246',
'0004563248',
'0004576146',
'0004576244',
'0004576246',
'0004564248',
'0004564250',
'0004565150',
'0004565250',
'10423',
'10422',
'10421',
'10420',
'10316',
'10315',
'10314',
'00372831G',
'00372831M',
'00372831P',
'00372851G',
'00372851M',
'00372851P',
'00381971M',
'00382821P',
'9958',
'9964',
'00382001G',
'9969',
'9949',
'9948',
'10286',
'10285',
'10284',
'10283',
'9953',
'10447',
'10446',
'10445',
'10444',
'10411',
'10410',
'10409',
'10439',
'10438',
'10437',
'10436',
'10270',
'10269',
'10268',
'10267',
'70464',
'70463',
'70465',
'70462',
'70424',
'70423',
'70425',
'70422',
'70428',
'70468',
'70427',
'70467',
'70429',
'70469',
'70426',
'70466',
'136885',
'136886',
'136884',
'136883',
'35006',
'93573',
'93574',
'93572',
'93571',
'93554',
'93555',
'93553',
'93552',
'00051662G',
'102646',
'0042718142',
'0042718144',
'0042718146',
'0042718148',
'0043449142',
'0043449144',
'0043449146',
'0043449148',
'0043450142',
'0043450144',
'0043450146',
'0043450148',
'00382281G',
'00382281M',
'00382281P',
'003827640',
'003827642',
'003827644',
'0038261142',
'0038261144',
'0038261146',
'0038262142',
'0038262144',
'0038262146',
'0038262148',
'003827742',
'003827744',
'003827746',
'0038264142',
'0038264144',
'0038264146',
'0038264148',
'0038278140',
'0038278142',
'0038278144',
'003823140',
'003823142',
'003823144',
'003827944',
'0038265140',
'0038265142',
'0038265144',
'0038265146',
'00363911G',
'00363911GG',
'00363911M',
'00363911P',
'00381831G',
'00381831GG',
'00381831M',
'00381831P',
'00381891G',
'00381891GG',
'00381891M',
'00381891P',
'00381731G',
'00381731GG',
'00381731M',
'00381731P',
'0038190140',
'0038190142',
'0038190144',
'0038190146',
'0043451142',
'0043451144',
'0043451146',
'0043451148',
'004345342',
'004345344',
'004345346',
'004345348',
'0038003G',
'0038003GG',
'0038003M',
'0038003P',
'00380051G',
'00380051GG',
'00380051M',
'00380051P',
'00379871G',
'00379871GG',
'00379871M',
'00379871P',
'0037991G',
'0037991GG',
'0037991M',
'0037991P',
'35010',
'0007646242',
'0007646142',
'0007646144',
'0007646146', 
'0007647146',
'2_390153941',
'2_390153942',
'2_390153940',
'2_390153945',
'2_390153946',
'2_390153944',
'2_390153943',
'0011575142',
'0011575144',
'0011575146',
'0011575244',
'0011575248',
'1_330279560',
'1_330279570',
'1_330279571',
'1_330279569',
'00106751G',
'00106751GG',
'00106751M',
'00106751P',
'00298011G',
'00298011GG',
'00298011M',
'00298011P',
'00105551M',
'1_330234348',
'00377321G',
'00377321GG',
'00377321M',
'00377321P',
'1_330214123',
'00297791G',
'00297791GG',
'00297791M',
'00297791P',
'1_330214119',
'1_330214115',
'1_330214116',
'00377361G',
'00377361GG',
'00377361M',
'00377361P',
'00298021G',
'00298021GG',
'00298021M',
'00298021P',
'00297801G',
'00297801GG',
'00297801M',
'00297801P',
'00377501G',
'00377501GG',
'00377501M',
'00377501P',
'1_330214236',
'1_330264135',
'1_330264136',
'1_330264134',
'1_330264133',
'002584801G',
'002584801M',
'1_330234360',
'1_330214234',
'00297811G',
'00297811GG',
'00297811M',
'00297811P',
'00298031G',
'00298031GG',
'00298031M',
'00298031P',
'00106811GG',
'00106811P',
'2_390153697',
'00297821G',
'00297821GG',
'00297821M',
'00297821P',
'1_330214247',
'1_330234369',
'1_330234370',
'1_330263858',
'1_330263859',
'00105721GG',
'002980601G',
'002980601GG',
'002980601M',
'002980601P',
'1_330281066',
'1_330281064',
'1_330281069',
'1_330281070',
'1_330281068',
'00122901G',
'00122901GG',
'00122911M',
'00122912GG',
'00122912P',
'001229703G',
'001229703M',
'001229703P',
'001229702G',
'001229702GG',
'001229702M',
'001229702P',
'2_390156015',
'2_390156026',
'2_390156023',
'2_390156051',
'2_390154005',
'2_390154006',
'2_390154004',
'2_390154003',
'2_390154009',
'2_390154010',
'2_390154008',
'2_390154007',
'2_390155925',
'2_390153957',
'2_390153958',
'2_390153956',
'2_390153955',
'2_390153965',
'2_390153966',
'2_390153964',
'2_390153963',
'2_390153973',
'2_390153974',
'2_390153972',
'2_390153971',
'2_390154021',
'2_390154022',
'2_390154020',
'2_390154019',
'2_390153977',
'2_390153978',
'2_390153976',
'2_390153975',
'2_390153981',
'2_390153982',
'2_390153980',
'2_390153979',
'2_390140515',
'1_330247888',
'2_390140519',
'2_390140520',
'1_330247904',
'2_390147214',
'2_390147215',
'2_390147218',
'2_390147219',
'00108111G',
'2_390147226',
'2_390147227',
'00108141GG',
'00108161GG',
'00150231GG',
'00150241GG',
'00150241M',
'00150242GG',
'00108191GG',
'00108211GG',
'00108281GG',
'00150271G',
'00150271GG',
'10428',
'10429',
'10430',
'10431',
'11585',
'11586',
'11587',
'11653',
'11654',
'11655',
'11656',
'0038266148',
'0038266150',
'0038266152',
'0038267148',
'0038267152',
'003801046',
'003801048',
'003797546',
'003797548',
'003797550',
'003797552',
'00076692GG',
'0010695146',
'0010695252'
