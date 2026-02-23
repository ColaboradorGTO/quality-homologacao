import { Fragment } from "react";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import { mascaraValor } from "../../../../utils/mascaraValor";
export const ActionListaExtratoContaCorrenteLoja = ({
  dadosExtratoLojaPeriodo,
}) => {
  let saldoAnterior = 0;
  const venda = dadosExtratoLojaPeriodo[0]?.primeiraVendaSaldo.SALDO;
  const totalQuebra = dadosExtratoLojaPeriodo[0]?.primeiraVendaSaldo.TOTALQUEBRA;
  saldoAnterior = toFloat(venda) + toFloat(totalQuebra);
  let saldoAnteriorVenda = saldoAnterior + toFloat(dadosExtratoLojaPeriodo[0]?.venda.VRRECDINHEIRO);
  let saldoAnteriorFatura = saldoAnteriorVenda + toFloat(dadosExtratoLojaPeriodo[0]?.totalFaturas[0]?.VRRECEBIDO);
  let saldoAnteriorDespesa = saldoAnteriorFatura;
  let saldoAnteriorAdiantamento = saldoAnteriorDespesa;
  let saldoAnteriorQuebra = saldoAnteriorAdiantamento;
  let saldoAnteriorDeposito = saldoAnteriorQuebra;
  let saldoAnteriorAjuste = saldoAnteriorDeposito;


  const renderizarLinhasExtrato = () => {
    let saldoAtual = saldoAnterior;

    return dadosExtratoLojaPeriodo.map((ret, i) => {
      const linhas = [];

      if (i > 0) {
        linhas.push(
          <tr key={`espaco-${i}-1`}>
            <td colSpan="9"></td>
          </tr>,
          <tr key={`espaco-${i}-2`}>
            <td colSpan="9"></td>
          </tr>
        );
      }

      saldoAtual += toFloat(ret['venda']['VRRECDINHEIRO'])
      linhas.push(
        <tr className="table-success">
          <td style={{ fontSize: '12px' }}>{ret['venda']['DTHORAFECHAMENTOFORMATADA']}</td>
          <td style={{ fontSize: '12px' }}>Mov. Dinheiro do Caixa {ret['venda']['DTHORAFECHAMENTOFORMATADA']}</td>
          <td style={{ fontSize: '12px' }}>Vendas Dinheiro</td>
          <td></td>
          <td style={{ textAlign: 'right', fontSize: '12px' }}><b>0,00</b></td>
          <td style={{ textAlign: 'right', fontSize: '12px' }}><b>{formatMoeda(toFloat(ret['venda']['VRRECDINHEIRO']).toFixed(2))}</b></td>
          <td style={{ textAlign: 'right', fontSize: '12px' }}><b>{formatMoeda(saldoAtual)}</b></td>
          <td style={{ textAlign: 'right', fontSize: '12px' }}></td>
          <td style={{ textAlign: 'right', fontSize: '12px' }}></td>
        </tr>
      );

      if (ret['totalFaturas'].length > 0) {
        saldoAtual += toFloat(ret['totalFaturas'][0]['VRRECEBIDO'])
        linhas.push(
          <tr className="table-success">
            <td style={{ fontSize: '12px' }}>{ret['totalFaturas'][0]['DTPROCESSAMENTOFORMATADA']}</td>
            <td style={{ fontSize: '12px' }}>Mov. Fatura {ret['totalFaturas'][0]['DTPROCESSAMENTOFORMATADA']}</td>
            <td style={{ fontSize: '12px' }}>Recebimento de Faturas</td>
            <td></td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}><b>0,00</b></td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}><b>{formatMoeda(toFloat(ret['totalFaturas'][0]['VRRECEBIDO']).toFixed(2))}</b></td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}><b>{formatMoeda(saldoAtual)}</b></td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}></td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}></td>
          </tr>

        )
      }

      ret['despesas'].forEach((despesa, j) => {
        saldoAtual -= toFloat(despesa['VRDESPESA']);

        linhas.push(
          <tr className="table-danger" key={j}>
            <td style={{ fontSize: '12px' }}>{despesa['DTDESPESAFORMATADA']}</td>
            <td style={{ fontSize: '12px' }}>{despesa['DSHISTORIO']}</td>
            <td style={{ fontSize: '12px' }}>{despesa['DSPAGOA']}</td>
            <td style={{ textAlign: 'center', fontSize: '12px' }}>{despesa['DSCATEGORIA']}</td>
            {/* <td style={{ textAlign: 'right', fontSize: '12px' }} className="txt-color-red">
              <b>{formatMoeda(toFloat(despesa['VRDESPESA']).toFixed(2))}</b>
            </td> */}
            <td style={{ textAlign: 'right', fontSize: '12px' }} className="txt-color-red">
              <b>{formatMoeda(Math.abs(toFloat(despesa['VRDESPESA'])).toFixed(2))}</b>
            </td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}><b>0,00</b></td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}><b>{formatMoeda(saldoAtual)}</b></td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}></td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}></td>
          </tr>
        );
      })

      ret['adiantamentos'].forEach((adiantamento, j) => {
        saldoAtual -= toFloat(adiantamento['VRVALORDESCONTO']);
        linhas.push(
          <tr className="table-danger" key={j}>
            <td style={{ fontSize: '12px' }}>{adiantamento['DTLANCAMENTOADIANTAMENTO']}</td>
            <td style={{ fontSize: '12px' }}>Adiantamento de Salário</td>
            <td style={{ fontSize: '12px' }}>{adiantamento['NOFUNCIONARIO']}</td>
            <td style={{ textAlign: 'center', fontSize: '12px' }}>{adiantamento['DSMOTIVO']}</td>

            {/* <td style={{ textAlign: 'right', fontSize: '12px' }} className="txt-color-red">
              <b>{formatMoeda(toFloat(adiantamento['VRVALORDESCONTO']).toFixed(2))}</b>
            </td> */}

            <td style={{ textAlign: 'right', fontSize: '12px' }} className="txt-color-red">
              <b>{formatMoeda(Math.abs(toFloat(adiantamento['VRVALORDESCONTO'])).toFixed(2))}</b>
            </td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}><b>0,00</b></td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}>
              <b>{formatMoeda(saldoAnteriorAdiantamento)}</b>
            </td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}></td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}></td>
          </tr>
        );
      })

      ret['quebracaixa'].forEach((quebra, j) => {
        const totalDinheiroInformado = toFloat(quebra['VRAJUSTDINHEIRO']) > 0
          ? toFloat(quebra['VRAJUSTDINHEIRO'])
          : toFloat(quebra['VRRECDINHEIRO']);

        const totalQuebraCaixa = totalDinheiroInformado - toFloat(quebra['VRFISICODINHEIRO']);
        saldoAtual += totalQuebraCaixa;

        linhas.push(
          <tr className="table-primary" key={`quebra-${i}-${j}`}>
            <td style={{ fontSize: '12px' }}>{quebra['DTMOVCAIXA']}</td>
            <td style={{ fontSize: '12px' }}>Quebra Caixa Mov.: {quebra['IDMOV']}</td>
            <td colSpan="2" style={{ fontSize: '12px' }}>Operador: {quebra['FUNCIONARIOMOV']}</td>
            <td style={{ textAlign: 'right', fontSize: '12px' }} className="txt-color-blue">
              <b>{totalQuebraCaixa > 0 ? '0,00' : formatMoeda(Math.abs(totalQuebraCaixa))}</b>
            </td>
            <td style={{ textAlign: 'right', fontSize: '12px' }} className="txt-color-blue">
              <b>{totalQuebraCaixa > 0 ? formatMoeda(totalQuebraCaixa) : '0,00'}</b>
            </td>
            <td style={{ textAlign: 'right', fontSize: '12px' }} className="txt-color-blue">
              <b>{formatMoeda(saldoAtual)}</b>
            </td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}></td>
            <td style={{ textAlign: 'right', fontSize: '12px' }}></td>
          </tr>
        );
      });

      ret['totalDepositos'].forEach((deposito, j) => {
        saldoAtual -= toFloat(deposito['VRDEPOSITO']);

        linhas.push(
          <tr className="table-warning" key={`deposito-${i}-${j}`}>
            <td style={{ fontSize: '12px' }}><b>{deposito['DTDEPOSITOFORMATADA']}</b></td>
            <td style={{ fontSize: '12px' }}><b>{deposito['FUNCIONARIO']} Dep. Dinh {deposito['DTDEPOSITOFORMATADA']}</b></td>
            <td colSpan="2" style={{ fontSize: '12px' }}><b>{deposito['DSBANCO']} - {deposito['NUDOCDEPOSITO']}</b></td>

            <td style={{ textAlign: 'right', fontSize: '12px' }} className="txt-color-red">
              <b>{formatMoeda(Math.abs(toFloat(deposito['VRDEPOSITO']).toFixed(2)))}</b>
            </td>

            <td style={{ textAlign: 'right', fontSize: '12px' }}><b>0,00</b></td>
            <td style={{ textAlign: 'right', fontSize: '12px' }} className="txt-color-red">
              <b>{formatMoeda(saldoAtual)}</b>
            </td>
            <td style={{ textAlign: 'center', fontSize: '12px' }}>
              <label style={{ color: deposito['STCONFERIDO'] === 'False' || !deposito['STCONFERIDO'] ? 'red' : 'blue' }}>
                {deposito['STCONFERIDO'] === 'False' || !deposito['STCONFERIDO'] ? 'Sem Conferir' : 'Conferido'}
              </label>
            </td>
            <td></td>
          </tr>
        );
      });

      ret['ajusteextrato'].forEach((ajuste, j) => {
        if (ajuste['STCANCELADO'] === 'False') {
          if (toFloat(ajuste['VRCREDITO']) > 0) {
            saldoAtual -= toFloat(ajuste['VRCREDITO']);
          } else {
            saldoAtual += toFloat(ajuste['VRDEBITO']);
          }
        }

        linhas.push(
          <tr className="table-secondary" key={`ajuste-${i}-${j}`}>
            <td style={{ fontSize: '12px' }}><b>{ajuste['DTCADASTROFORMATADA']}</b></td>
            <td style={{ fontSize: '12px' }}><b>{ajuste['HISTORICO']}</b></td>
            <td colSpan="2" style={{ fontSize: '12px' }}><b>Ajuste de Extrato</b></td>

            <td style={{ textAlign: 'right', fontSize: '12px' }} className="txt-color-red">
              <b>{formatMoeda(Math.abs(toFloat(ajuste['VRDEBITO'])))}</b>
            </td>

            <td style={{ textAlign: 'right', fontSize: '12px' }} className="txt-color-red">
              <b>{formatMoeda(toFloat(ajuste['VRCREDITO']).toFixed(2))}</b>
            </td>
            <td style={{ textAlign: 'right', fontSize: '12px' }} className="txt-color-red">
              <b>{formatMoeda(saldoAtual)}</b>
            </td>
            <td style={{ textAlign: 'center', fontSize: '12px' }}>
              <label style={{ color: ajuste['STCANCELADO'] === 'False' ? 'blue' : 'red' }}>
                {ajuste['STCANCELADO'] === 'False' ? 'Ativo' : 'Cancelado'}
              </label>
            </td>
            <td></td>
          </tr>
        );
      });

      return linhas;
    })
  }

  return (
    <div>
      <table className="table table-bordered  table-responsive-lg table-striped w-100">

        <thead style={{ width: '100%' }}>
          <tr>
            <th>Informativo</th>
          </tr>
          <tr>
            <td colspan="9"><b >Extrato a partir do dia 11 de dezembro de 2020</b ></td>
          </tr>
        </thead>
        <tbody>

          <tr class="table-primary" style={{ width: '100%' }}>
            <td colspan="4" style={{ textAlign: "right", fontSize: "12px" }}><b>Saldo Anterior</b></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ textAlign: "right", fontSize: "12px" }}><b> {`${formatMoeda(saldoAnterior)}`}</b></td>
            <td colSpan={2}></td>
          </tr>

          <tr>
            <td colspan="9"></td>
          </tr>

          <tr>
            <td colspan="9"></td>
          </tr>
        </tbody>

        <tbody className="bg-primary-700 w-100">
          <tr>
            <th>Dt. Lançamento </th>
            <th>Histórico  </th>
            <th>Pago A </th>
            <th>Despesa </th>
            <th>Débito </th>
            <th>Crédito    </th>
            <th>Saldo </th>
            <th>Situação  </th>
            <th>Opção </th>
          </tr>
        </tbody>
        <tbody id="resultadoExtratoLoja">
          {renderizarLinhasExtrato()}
        </tbody>
      </table>
    </div>
  );
};
