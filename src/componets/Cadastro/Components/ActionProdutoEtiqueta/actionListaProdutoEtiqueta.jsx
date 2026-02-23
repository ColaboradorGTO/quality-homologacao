import { Fragment, useEffect, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

// 1070561136301

export const ActionListaProdutoEtiqueta = ({ dadosListaPrecosSap }) => {
  const [qtdProduto, setQtdProduto] = useState(1);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [rowClick, setRowClick] = useState(true);

  const dados = dadosListaPrecosSap.map((item, index) => {
    let contador = index + 1;

    return {
      IDPRODUTO: item.IDPRODUTO,
      DSNOME: item.DSNOME,
    
 
      NUCODBARRAS: item.NUCODBARRAS,
      MARCA: item.MARCA,
      // TAMANHO: item.TAMANHO,  (dsProd.split(' ')).pop()).toUpperCase().replace(/[^\w\s]/gi, '')
      TAMANHO: item.TAMANHO,
      PRECOVENDA: item.PRECOVENDA,
      IDGRUPOEMPRESARIAL: item.IDGRUPOEMPRESARIAL,
      IDEMPRESA: item.IDEMPRESA,
      DSLISTAPRECO: item.DSLISTAPRECO,
      NOFANTASIA: item.NOFANTASIA,
      

      // ----------------------
      
      DSPRODUTO: item.DSPRODUTO,
      SUBGRUPO: item.SUBGRUPO,
      DSESTILO: item.DSESTILO,
      DSTAMANHO: item.DSTAMANHO,
      CODBARRAS: item.CODBARRAS,
      VRUNITLIQDETALHEPEDIDO: item.VRUNITLIQDETALHEPEDIDO,
      IDSUBGRUPOEMPRESARIAL: item.IDSUBGRUPOEMPRESARIAL,
      DSLOCALEXPOSICAO: item.DSLOCALEXPOSICAO,
      contador
    }
  });

  const colunasListaProdEtiquetas = [
    {
      field: 'contador',
      header: 'Nº',
      body: (row) => row.contador,
      sortable: true
    },
    {
      field: 'DSLOCALEXPOSICAO',
      header: 'Opções',
      selectionMode: "multiple",
      body: (row) => {
        return (
          <div style={{ background: '', }}>
            <TriStateCheckbox variant="filled" value={produtoSelecionado} onChange={(e) => setProdutoSelecionado(e.value)} />
          </div>
        )
      }
    },
    {
      field: 'IDPRODUTO',
      header: 'Quantidade',
      body: (row) => {
        return (
          <div style={{ background: '', }}>
            <InputNumber
              value={qtdProduto}
              onValueChange={(e) => row.IDPRODUTO.editorCallback(e.value)}
              style={{ width: '10%' }}
            />
          </div>
        )
      }
    },
    {
      field: 'NUCODBARRAS',
      header: 'Código de Barras',
      body: row => row.NUCODBARRAS,
      sortable: true
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => row.DSNOME,
      sortable: true
    },
    {
      field: 'TAMANHO',
      header: 'Tamanho',
      body: row => row.TAMANHO,
      sortable: true
    },
    {
      field: 'PRECOVENDA',
      header: 'PR. Venda',
      body: row => row.PRECOVENDA,
      sortable: true
    },
    {
      field: 'DSLISTAPRECO',
      header: 'Grupo',
      body: row => row.DSLISTAPRECO,
      sortable: true
    },
    {
      field: 'DSESTILO',
      header: 'Estilo',
      body: row => row.DSESTILO,
      sortable: true
    },
    {
      field: 'MARCA',
      header: 'Marca',
      body: row => row.MARCA,
      sortable: true
    },

  ]

  const bodyQuantidade = (row) => {
    return (
      <div style={{ background: '', }}>
        <InputNumber
          value={qtdProduto}
          onValueChange={(e) => row.IDPRODUTO.editorCallback(e.value)}
          style={{ width: '10%' }}
        />
      </div>
    )
  }

  return (

    <Fragment>
      <div className="panel" style={{ marginTop: "10rem" }}>
        <div className="panel-hdr">
          <h2>Lista de Produtos</h2>
        </div>

        <div className="card">
          <DataTable
            title="Vendas por Loja"
            value={dados}
            // header={header}
            selectionMode={'single'}
            sortField="VRTOTALPAGO"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >

            <Column
              field="contador"
              header="Nº"
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}
            />
            <Column
              selectionMode="single"
              field="DSLOCALEXPOSICAO"
              header="Opções"
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem', width: '10rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}
            />
            <Column

              field="DSLOCALEXPOSICAO"
              header="Quantidade"
              body={bodyQuantidade}
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}
            />
            <Column

              field="NUCODBARRAS"
              header="Cod. Barras"
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}
            />
            <Column
              field="DSNOME"
              header="Produto"
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}
            />
            <Column
              field="TAMANHO"
              header="Tamanho"
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}
            />
            <Column
              field="PRECOVENDA"
              header="PR. Venda"
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}
            />
            <Column
              field="DSLISTAPRECO"
              header="Grupo"
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}
            />
            <Column
              field="DSESTILO"
              header="Estilo"
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}
            />
            <Column
              field="MARCA"
              header="Marca"
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}
            />

          </DataTable>
        </div>
      </div>


    </Fragment>
  )
}
