import { Fragment, useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { FaCheck } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { toFloat } from "../../../../utils/toFloat";


export const ActionListaQuebra = ({ dadosExtratoLojaPeriodo }) => {
  const [modalCadastro, setModalCadastro] = useState(false)
  const [modalAjuste, setModalAjuste] = useState(false)

  const dados = Array.isArray(dadosExtratoLojaPeriodo) ? dadosExtratoLojaPeriodo.map((item) => {
    let saldoAnterior = 0
    const saldoAnterior2 = parseFloat(item.primeiraVendaSaldo.SALDO) + parseFloat(item.primeiraVendaSaldo.TOTALQUEBRA);
    const saldoAnteriorVendas = saldoAnterior2 + parseFloat(item.venda.VRRECDINHEIRO ?? 0)
    const saldoAnteriorFaturas = parseFloat(saldoAnteriorVendas) + parseFloat(item.totalFaturas[0]?.VRRECEBIDO ?? 0)
    const saldoAnteriorDespesas = saldoAnteriorFaturas - parseFloat(item.despesas[0]?.VRDESPESA ?? 0)
    const saldoAnteriorAdiantamentos = saldoAnteriorDespesas - parseFloat(item.adiantamentos.VRVALORDESCONTO ?? 0)

    const calcularTotalDinheiroInformado = () => {
      if (item.quebracaixa[0]?.VRAJUSTDINHEIRO > 0) {
        return toFloat(item.quebracaixa[0]?.VRAJUSTDINHEIRO);
      } else {
        return toFloat(item.quebracaixa[0]?.VRRECDINHEIRO);
      }
    };

    const dinheiroInformado = calcularTotalDinheiroInformado()

    const totalQuebraCaixa = calcularTotalDinheiroInformado() - toFloat(item.quebracaixa[0]?.VRFISICODINHEIRO ?? 0);
    const saldoAnteriorQuebra = saldoAnteriorAdiantamentos + totalQuebraCaixa ?? 0;
    const saldoAnteriorDepositos = saldoAnteriorQuebra - parseFloat(item.totalDepositos[0]?.VRDEPOSITO ?? 0);
    const calcularSaldoExtrato = () => {
      let saldoAnteriorExtrato = 0;
      if (item.ajusteextrato.STCANCELADO == 'False') {
        saldoAnteriorExtrato + parseFloat(item.ajusteextrato[0]?.VRCREDITO)

      } else {
        saldoAnteriorExtrato - parseFloat(item.ajusteextrato[0]?.VRDEBITO)
      }
    }

    const totalSaldoAnteriorExtrato = calcularSaldoExtrato();

    return {

      VRRECDINHEIRO: item.venda.VRRECDINHEIRO,
      DTHORAFECHAMENTOFORMATADA: item.venda.DTHORAFECHAMENTOFORMATADA,

      DTPROCESSAMENTOFORMATADA: item.totalFaturas[0]?.DTPROCESSAMENTOFORMATADA,
      VRRECEBIDO: item.totalFaturas[0]?.VRRECEBIDO,
      saldoAnteriorFaturas: toFloat(saldoAnteriorFaturas),

      IDAJUSTEEXTRATO: item.ajusteextrato[0]?.IDAJUSTEEXTRATO,
      DTCADASTROFORMATADA: item.ajusteextrato[0]?.DTCADASTROFORMATADA,
      VRDEBITO: item.ajusteextrato[0]?.VRDEBITO,
      VRCREDITO: item.ajusteextrato[0]?.VRCREDITO,
      HISTORICO: item.ajusteextrato[0]?.HISTORICO,
      STCANCELADO: item.ajusteextrato[0]?.STCANCELADO,
      totalSaldoAnteriorExtrato: totalSaldoAnteriorExtrato,

      DTDESPESAFORMATADA: item.despesas[0]?.DTDESPESAFORMATADA,
      DSHISTORIO: item.despesas[0]?.DSHISTORIO,
      DSCATEGORIA: item.despesas[0]?.DSCATEGORIA,
      VRDESPESA: item.despesas[0]?.VRDESPESA,
      DSPAGOA: item.despesas[0]?.DSPAGOA,
      saldoAnteriorDespesas: saldoAnteriorDespesas,

      DTLANCAMENTOADIANTAMENTO: item.adiantamentos.DTLANCAMENTOADIANTAMENTO,
      NOFUNCIONARIO: item.adiantamentos.NOFUNCIONARIO,
      DSMOTIVO: item.adiantamentos.DSMOTIVO,
      VRVALORDESCONTO: item.adiantamentos.VRVALORDESCONTO,
      saldoAnteriorAdiantamentos: saldoAnteriorAdiantamentos,

      IDMOV: item.quebracaixa[0]?.IDMOV,
      DTMOVCAIXA: item.quebracaixa[0]?.DTMOVCAIXA,
      FUNCIONARIOMOV: item.quebracaixa[0]?.FUNCIONARIOMOV,
      VRFISICODINHEIRO: item.quebracaixa[0]?.VRFISICODINHEIRO,
      VRRECDINHEIRO: item.quebracaixa[0]?.VRRECDINHEIRO,
      VRAJUSTDINHEIRO: item.quebracaixa[0]?.VRAJUSTDINHEIRO,
      totalQuebraCaixa: totalQuebraCaixa,
      saldoAnteriorQuebra: saldoAnteriorQuebra,

      IDDEPOSITOLOJA: item.totalDepositos[0]?.IDDEPOSITOLOJA,
      DTDEPOSITOFORMATADA: item.totalDepositos[0]?.DTDEPOSITOFORMATADA,
      DTMOVIMENTOCAIXAFORMATADA: item.totalDepositos[0]?.DTMOVIMENTOCAIXAFORMATADA,
      FUNCIONARIO: item.totalDepositos[0]?.FUNCIONARIO,
      VRDEPOSITO: item.totalDepositos[0]?.VRDEPOSITO,
      DSBANCO: item.totalDepositos[0]?.DSBANCO,
      STCANCELADO: item.totalDepositos[0]?.STCANCELADO,
      STCONFERIDO: item.totalDepositos[0]?.STCONFERIDO,
      NUDOCDEPOSITO: item.totalDepositos[0]?.NUDOCDEPOSITO,
      saldoAnteriorDepositos: saldoAnteriorDepositos,

      saldoAnteriorVendas: saldoAnteriorVendas,
      saldoAnterior2: saldoAnterior2,
      dinheiroInformado: dinheiroInformado
    }
  }) : []

  const renderButtons = (item) => {
    if (item.STCANCELADO === 'False' && (item.STCONFERIDO === 'False' || item.STCONFERIDO === null || item.STCONFERIDO === '')) {
      return (
        <Fragment>
          <ButtonTable
            titleButton={"Confirmar Conferência"}
            cor={"success"}
            Icon={FaCheck}
            IconSize={20}
            onClickButton={() => console.log("Confirmar Conferência")}
          />
          <ButtonTable
            titleButton={"Cancelar Depósito"}
            cor={"danger"}
            Icon={BsTrash3}
            IconSize={20}
            onClickButton={() => console.log("Cancelar Depósito")}
          />
          <ButtonTable
            titleButton={"Editar Depósito"}
            cor={"warning"}
            Icon={CiEdit}
            IconSize={20}
            onClickButton={() => console.log("Editar Depósito")}
          />
        </Fragment>
      );
    } else if (item.STCANCELADO === 'False' && item.STCONFERIDO === 'True') {
      return <td></td>;
    } else if (item.STCANCELADO === 'True' && (item.STCONFERIDO === 'False' || item.STCONFERIDO === null || item.STCONFERIDO === '')) {
      return (
        <ButtonTable
          titleButton={"Confirmar Conferência"}
          cor={"success"}
          Icon={FaCheck}
          IconSize={20}
          onClickButton={() => console.log("Confirmar Conferência")}
        />
      );
    } else if (item.STCANCELADO === 'True' && item.STCONFERIDO === 'True') {
      return <td></td>;
    }
  };


  return (

    <Fragment>

      <table className="table table-bordered table-hover table-responsive-lg table-striped w-100">
        
        <tbody>
          {dados.map((item, index) => (
            <Fragment>

              <tr key={index} className="table-success">
                <td>{item.DTHORAFECHAMENTOFORMATADA}</td>
                <td>Mov. Dinheiro do Caixa {item.DTHORAFECHAMENTOFORMATADA}</td>
                <td>Vendas Dinheiro</td>
                <td></td>
                <td>0,00</td>
                <td>{formatMoeda(item.VRRECDINHEIRO) ? formatMoeda(item.VRRECDINHEIRO) : '0,00'}</td>
                <td>{formatMoeda(item.saldoAnteriorVendas)}</td>
                <td></td>
                <td></td>

              </tr>



              {dadosExtratoLojaPeriodo[0].totalFaturas.length > 0 && (
                <tr className="table-success">
                  <td>{item.DTPROCESSAMENTOFORMATADA}</td>
                  <td>Mov. Fatura {item.DTPROCESSAMENTOFORMATADA}</td>
                  <td>Recebimento de Faturas</td>
                  <td></td>
                  <td>0,00</td>
                  <td>{formatMoeda(item.VRRECEBIDO)}</td>
                  <td>{formatMoeda(item.saldoAnteriorFaturas)}</td>
                  <td></td>
                  <td></td>

                </tr>
              )}

              {dadosExtratoLojaPeriodo[0].despesas.length > 0 && (

                <tr className="table-danger">

                  <td>{item.DTDESPESAFORMATADA}</td>
                  <td>{item.DSHISTORIO}</td>
                  <td>{item.DSPAGOA}</td>
                  <td>{item.DSCATEGORIA}</td>
                  <td>{formatMoeda(item.VRDESPESA)}</td>
                  <td>0,00</td>
                  <td>{formatMoeda(item.saldoAnteriorDespesas) ? formatMoeda(item.saldoAnteriorDespesas) : 0}</td>
                  <td></td>
                  <td></td>

                </tr>
              )}

              {dadosExtratoLojaPeriodo[0].adiantamentos.length > 0 && (
                <tr className="table-danger">

                  <td>{item.DTLANCAMENTOADIANTAMENTO}</td>
                  <td>Adiantamento de Salário </td>
                  <td>{item.NOFUNCIONARIO}</td>
                  <td>{item.DSMOTIVO}</td>
                  <td>{formatMoeda(item.VRVALORDESCONTO)}</td>
                  <td>0,00</td>
                  <td>{formatMoeda(item.saldoAnteriorDespesas) ? (item.saldoAnteriorDespesas) : 0}</td>
                  <td></td>
                  <td></td>

                </tr>

              )}


              {dadosExtratoLojaPeriodo[0].quebracaixa.length > 0 && (

                <tr className="table-primary">

                  <td>{item.DTMOVCAIXA}</td>
                  <td>Quebra Caixa Mov.: {item.IDMOV} </td>
                  <td>Operador: {item.FUNCIONARIOMOV}</td>
                  <td style={{ color: item.dinheiroInformado > 0 ? 'blue' : 'red' }}>
                    {formatMoeda(item.dinheiroInformado) > 0 ? 0 : formatMoeda(item.dinheiroInformado)}
                  </td>
                  <td>0,00</td>
                  <td>{formatMoeda(item.totalQuebraCaixa)}</td>
                  <td>{formatMoeda(item.saldoAnteriorQuebra) ? formatMoeda(item.saldoAnteriorQuebra) : 0}</td>
                  <td></td>
                  <td></td>

                </tr>
              )}

              {dadosExtratoLojaPeriodo[0].totalDepositos.length > 0 && (
                <tr className="table-warning">

                  <td>{item.DTDEPOSITOFORMATADA}</td>
                  <td>{item.FUNCIONARIO} Dep. Dinh  {item.DTMOVIMENTOCAIXAFORMATADA} </td>
                  <td colSpan={2}>{item.DSBANCO} {item.NUDOCDEPOSITO}</td>

                  <td style={{}}>{formatMoeda(item.VRDEPOSITO)}</td>
                  <td>0,00</td>
                  <td>   {item.saldoAnteriorDepositos && item.VRDEPOSITO ?
                    formatMoeda(parseFloat(item.saldoAnteriorDepositos) - parseFloat(item.VRDEPOSITO))
                    : '0,00'}
                  </td>

                  <td style={{ color: item.STCONFERIDO == 'False' || item.STCONFERIDO == null || item.STCONFERIDO == '' ? 'red' : 'blue' }} >

                    {item.STCONFERIDO == 'False' || item.STCONFERIDO == null || item.STCONFERIDO == '' ? 'Sem Conferir' : 'Conferido'}
                  </td>
                  <td  >
                    {renderButtons(item)}
                  </td>

                </tr>
              )}

              {dadosExtratoLojaPeriodo[0].ajusteextrato.length > 0 && (

                <tr className="table-secondary">

                  <td>{item.DTCADASTROFORMATADA}</td>
                  <td>{item.HISTORICO} </td>
                  <td colSpan={2}>Ajuste de Extrato</td>
                  <td style={{ color: 'red' }}>{formatMoeda(item.VRDEBITO)}</td>
                  <td style={{ color: 'red' }}>{formatMoeda(item.VRCREDITO)}</td>
                  <td>{formatMoeda(item.totalSaldoAnteriorExtrato) ? formatMoeda(item.totalSaldoAnteriorExtrato) : 0}</td>
                  <td style={{ color: item.STCANCELADO == 'False' ? 'blue' : 'red' }} >
                    {item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'}
                  </td>
                  <td></td>
                </tr>
              )}

            </Fragment>
          ))}
        </tbody>
      </table>

    </Fragment>
  )
};
