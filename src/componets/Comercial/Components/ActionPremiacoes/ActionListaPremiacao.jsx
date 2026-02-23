import { Fragment } from "react"
import { GrFormView } from "react-icons/gr";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { dataFormatada } from "../../../../utils/dataFormatada";



export const ActionListaPremiacoes = ({dadosListaPremiacoes}) => {
  const [rowSelection, setRowSelection] = useState(null);

  const dados = dadosListaPremiacoes.map((item, index) => {
    let contador = index + 1;

    return {

      IDSUBGRUPOEMPRESARIAL: item.IDSUBGRUPOEMPRESARIAL,
      DTPREMIOINICIOFORMAT: item.DTPREMIOINICIOFORMAT,
      DTPREMIOFIMFORMAT: item.DTPREMIOFIMFORMAT,
      DTPREMIOINICIO: item.DTPREMIOINICIO,
      NOFANTASIA: item.NOFANTASIA,
      DTPREMIOFIM: item.DTPREMIOFIM,
      DSSUBGRUPOEMPRESARIAL: item.DSSUBGRUPOEMPRESARIAL,
      STATIVO: item.STATIVO,

      contador
    };
  });

  const colunasVendas = [
    {
      field: 'contador',
      header: '#',
      body: row => row.contador,
      sortable: true,
    },
    {
      field: 'DSSUBGRUPOEMPRESARIAL',
      header: 'Grupo Empresarial',
      body: row => row.DSSUBGRUPOEMPRESARIAL,
      sortable: true,

    },
    {
      field: 'DTPREMIOINICIOFORMAT',
      header: 'Data Início',
      body: row => dataFormatada(row.DTPREMIOINICIOFORMAT),
      sortable: true,

    },
    {
      field: 'DTPREMIOFIMFORMAT',
      header: 'DataFim',
      body: row => dataFormatada(row.DTPREMIOFIMFORMAT),
      sortable: true,

    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: (
        (row) => (
          <div style={{ color: row.STATIVO == 'True' ? 'blue' : 'red' }}>
            {row.STSALVO == 'True' ? 'ATIVO' : 'INATIVO'}

          </div>
        )
      ),
      sortable: true,
    },
    {
      field: '',
      header: 'Situação',
      body: (
        (row) => (
          <div style={{ display: "flex", justifyContent: "space-around" }}>

            <div className="p-1">
              <ButtonTable
                titleButton={"Detalhar Premiação"}
                onClickButton
                Icon={GrFormView}
                iconSize={18}
                iconColor={"#fff"}
                cor={"success"}

              />

            </div>
          </div>
        )
      ),
      sortable: true,
    },
  ]


  return (

    <Fragment>

      <div className="card">
        <DataTable
          title="Vendas por Loja"
          value={dados}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator={true}
          rows={10}
          selectionMode="single"
          selection={rowSelection}
          onSelectionChange={(e) => setRowSelection(e.value)}
          rowsPerPageOptions={[5, 10, 20, 50]}
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}

        >
          {colunasVendas.map(coluna => (
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

    </Fragment>
  )
}

