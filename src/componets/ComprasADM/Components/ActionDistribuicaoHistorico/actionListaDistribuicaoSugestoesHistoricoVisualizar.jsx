import { Fragment, useRef, useState, useEffect } from "react";
import './styles.css'
import './print-styles.css'
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import { put } from '../../../../api/funcRequest';
import Swal from 'sweetalert2';

export const ActionListaDistribuicaoSugestoesHistoricoVisualizar = ({ 
  dadosSugestoesHistorico, 
}) => {

  const dataTableRef = useRef();

  const [dadosProcessados, setDadosProcessados] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // 🆕 buffer de edição
  const [editingValues, setEditingValues] = useState({});

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');
    if (usuarioArmazenado) {
      setUsuarioLogado(JSON.parse(usuarioArmazenado));
    }
  }, []);

  // 🔥 NOVA FUNÇÃO DE SALVAR (centralizada)
  const salvarValor = async (filial, produto, value) => {
    const numero = parseInt(value);

    if (isNaN(numero)) return;

    // limpa edição
    setEditingValues(prev => {
      const copia = { ...prev };
      delete copia[filial.inputId];
      return copia;
    });

    // atualiza tela primeiro (UX melhor)
    setDadosProcessados(prev =>
      prev.map(prod => {
        if (prod.CodBarras === produto.CodBarras) {

          const novasFiliais = prod.filiais.map(fil => {
            if (fil.IdFilial === filial.IdFilial) {
              return { ...fil, qtdsugestaoalterada: numero };
            }
            return fil;
          });

          const novoTotal = novasFiliais.reduce(
            (acc, fil) => acc + (parseInt(fil.qtdsugestaoalterada) || 0),
            0
          );

          return {
            ...prod,
            filiais: novasFiliais,
            totalqtd: novoTotal
          };
        }
        return prod;
      })
    );
    console.log(dadosProcessados, 'dadosProcessados');
    try {
      await put("/compras/distribuicao-compras-historico", [{
        IDDISTRIBUICAOCOMPRASHISTORICO: parseInt(filial.inputId.split(":")[0]),
        IDPEDIDOCOMPRA: parseInt(filial.inputId.split(":")[1]),
        IDEMPRESA: parseInt(filial.inputId.split(":")[2]),
        IDFILIAL: parseInt(filial.inputId.split(":")[3]),
        CODBARRAS: filial.inputId.split(":")[4],
        QTDSUGESTAOALTERACAOHISTORICO: numero,
        IDUSUARIOALTERACAO: usuarioLogado?.id,
        FINALIZAR: 0
      }]);

      Swal.fire({
        icon: 'success',
        title: 'Atualizado!',
        timer: 1000,
        showConfirmButton: false
      });

    } catch (err) {
      Swal.fire('Erro ao salvar');
    }
  };

  console.log(dadosSugestoesHistorico, 'dadosSugestoesHistorico');
  const processarDadosParaTabela = (dados) => {
    if (!dados?.length) return { produtos: [], filiais: [] };

    const filiais = dados[0]?.Filiais || [];
    
    console.log(dados[0], 'dados');
    const produtos = dados.map(registro => {
      let totalqtd = 0;
      console.log(registro, 'registro');
      const filiaisProcessadas = registro.Filiais.map(fil => {
        const sug = registro.Sugestao.find(s => s.IdFilial === fil.IdFilial);

        const qtd = sug?.QtdSugestao || 0;
        const qtdAlt = sug?.QtdSugestaoAlteracao || qtd;

        totalqtd += qtdAlt;

        return {
          IdFilial: fil.IdFilial,
          DescFilial: fil.DescFilial,
          qtdsugestao: qtd,
          qtdsugestaoalterada: qtdAlt,
          inputId: `${sug?.IdDistribuicaoCompras}:${registro.IdPedidoCompra}:${registro.IdEmpresa}:${fil.IdFilial}:${registro.CodBarras}`
        };
      });

      return {
        ...registro,
        totalqtd,
        filiais: filiaisProcessadas
      };
    });

    setDadosProcessados(produtos);

    return { produtos, filiais };
  };

  const { produtos, filiais } = processarDadosParaTabela(dadosSugestoesHistorico);

  return (
    <Fragment>

      <div ref={dataTableRef}>
        <table className="table table-bordered">

          <thead>
            <tr>
              <th>Produto</th>
              <th>Total</th>
              {filiais.map(f => (
                <th key={f.IdFilial}>{f.DescFilial}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {produtos.map(produto => {

              const produtoAtualizado = dadosProcessados.find(p => p.CodBarras === produto.CodBarras);

              return (
                <tr key={produto.CodBarras}>
                  <td>{produto.DescProduto}</td>
                  <td>{produtoAtualizado?.totalqtd}</td>

                  {produto.filiais.map(filial => {

                    const valorAtual = produtoAtualizado?.filiais.find(f => f.IdFilial === filial.IdFilial)?.qtdsugestaoalterada;

                    return (
                      <td key={filial.IdFilial}>
                        <input
                          type="number"

                          value={
                            editingValues[filial.inputId] !== undefined
                              ? editingValues[filial.inputId]
                              : valorAtual ?? ''
                          }

                          onChange={(e) => {
                            setEditingValues(prev => ({
                              ...prev,
                              [filial.inputId]: e.target.value
                            }));
                          }}

                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const value = editingValues[filial.inputId];
                              if (value === '') return;
                              salvarValor(filial, produto, value);
                              e.target.blur();
                            }

                            if (e.key === 'Escape') {
                              setEditingValues(prev => {
                                const copia = { ...prev };
                                delete copia[filial.inputId];
                                return copia;
                              });
                              e.target.blur();
                            }
                          }}

                          onBlur={() => {
                            const value = editingValues[filial.inputId];

                            if (value === '' || value === undefined) return;

                            salvarValor(filial, produto, value);
                          }}

                          style={{
                            width: 50,
                            backgroundColor:
                              editingValues[filial.inputId] !== undefined
                                ? '#fff3cd'
                                : 'white'
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </Fragment>
  );
};