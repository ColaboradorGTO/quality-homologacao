import { Fragment } from "react"
import { toFloat } from "../../../../../utils/toFloat"
import { formatMoeda } from "../../../../../utils/formatMoeda"
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { ActionListaDetalheSempreco } from "./actionListaDetalheSempreco";

export const ActionNotaPDFSemPreco = ({ dadosPedidoSemPreco, dadosDetalhePedido }) => {

    const styles = StyleSheet.create({
        page: { padding: 30 },
        section: { marginBottom: 10 },
        title: { fontSize: 18, marginBottom: 10 },
    });


    const dados = dadosPedidoSemPreco.map((item, index) => {
        let dsTipoFretePedido = '';
        let dsTipoFiscalPedido = '';
        let dsTipoArquivoPedido = '';
        let dsTipoEnviar = '';
        let logoPedido = '';

        if (item.IDSUBGRUPOPEDIDO == 1) {
            logoPedido = '../img/tesoura.png'
        } else if (item.IDSUBGRUPOPEDIDO == 2) {
            logoPedido = '../img/magazine.png'
        } else if (item.IDSUBGRUPOPEDIDO == 3) {
            logoPedido = '../img/freecenter.png'
        } else {
            logoPedido = '../img/yorus.png'
        }

        if (item.TPARQUIVO == 'NE') {
            dsTipoArquivoPedido = 'NÃO ENVIAR';
        } else if (item.TPARQUIVO == 'ET') {
            dsTipoArquivoPedido = 'ETIQUETA';
        } else if (item.TPARQUIVO == 'AR') {
            dsTipoArquivoPedido = 'ARQUIVO';
        }

        if (item.TPFRETE == 'PAGO') {
            dsTipoFretePedido = 'PAGO A CIF';
        } else if (item.TPFRETE == 'APAGAR') {
            dsTipoFretePedido = 'A PAGAR - FOB';
        }


        if (item.TPFISCAL == 'N') {
            dsTipoFiscalPedido = 'Lucro Presumido';
        } else if (item.TPFISCAL == 'S') {
            dsTipoFiscalPedido = 'Simples Nacional';
        } else {
            dsTipoFiscalPedido = 'Lucro Real';
        }

        if (item.TPARQUIVO == 'NE') {
            dsTipoEnviar = 'NÃO ENVIAR';
        } else if (item.TPARQUIVO == 'ET') {
            dsTipoEnviar = 'ETIQUETA';
        } else {
            dsTipoEnviar = 'ARQUIVO';
        }

        return {
            IDPEDIDO: item.IDPEDIDO,
            IDGRUPOPEDIDO: item.IDGRUPOPEDIDO,
            IDSUBGRUPOPEDIDO: item.IDSUBGRUPOPEDIDO,
            NOFANTASIA: item.NOFANTASIA,
            IDCOMPRADOR: item.IDCOMPRADOR,
            NOMECOMPRADOR: item.NOMECOMPRADOR,
            IDCONDICAOPAGAMENTO: item.IDCONDICAOPAGAMENTO,
            DSCONDICAOPAG: item.DSCONDICAOPAG,
            IDFORNECEDOR: item.IDFORNECEDOR,
            NOFORNECEDOR: item.NOFORNECEDOR,
            NOFANTASIAFORNECEDOR: item.NOFANTASIAFORNECEDOR,
            EEMAILFATURAMENTO: item.EEMAILFATURAMENTO,
            NUTELFATURAMENTO: item.NUTELFATURAMENTO,
            EEMAILCOBRANCA: item.EEMAILCOBRANCA,
            NUTELCOBRANCA: item.NUTELCOBRANCA,
            EEMAILFINANCEIRO: item.EEMAILFINANCEIRO,
            NUTELFINANCEIRO: item.NUTELFINANCEIRO,
            EEMAILCOMPRAS: item.EEMAILCOMPRAS,
            NUTELCOMPRAS: item.NUTELCOMPRAS,
            EEMAILCADASTRO: item.EEMAILCADASTRO,
            NUTELCADASTRO: item.NUTELCADASTRO,
            CNPJFORN: item.CNPJFORN,
            INSCESTFORN: item.INSCESTFORN,
            EMAILFORN: item.EMAILFORN,
            FONEFORN: item.FONEFORN,
            ENDFORN: item.ENDFORN,
            NUMEROFORN: item.NUMEROFORN,
            COMPFORN: item.COMPFORN,
            BAIRROFORN: item.BAIRROFORN,
            CIDADEFORN: item.CIDADEFORN,
            UFFORN: item.UFFORN,
            CEPFORN: item.CEPFORN,
            IDTRANSPORTADORA: item.IDTRANSPORTADORA,
            NOMETRANSPORTADORA: item.NOMETRANSPORTADORA,
            IDANDAMENTO: item.IDANDAMENTO,
            DSANDAMENTO: item.DSANDAMENTO,
            MODPEDIDO: item.MODPEDIDO,
            NOVENDEDOR: item.NOVENDEDOR,
            EEMAILVENDEDOR: item.EEMAILVENDEDOR,
            DTPEDIDOFORMATADA: item.DTPEDIDOFORMATADA,
            DTPEDIDO: item.DTPEDIDO,
            DTPREVENTREGAFORMATADA: item.DTPREVENTREGAFORMATADA,
            DTENTREGAFORMATADA2: item.DTENTREGAFORMATADA2,
            TPFRETE: item.TPFRETE,
            OBSPEDIDO: item.OBSPEDIDO,
            OBSPEDIDO2: item.OBSPEDIDO2,
            DTFECHAMENTOPEDIDO: item.DTFECHAMENTOPEDIDO,
            DTCADASTRO: item.DTCADASTRO,
            STDISTRIBUIDO: item.STDISTRIBUIDO,
            STAGRUPAPRODUTO: item.STAGRUPAPRODUTO,
            NUTOTALITENS: item.NUTOTALITENS,
            QTDTOTPRODUTOS: item.QTDTOTPRODUTOS,
            VRTOTALBRUTO: item.VRTOTALBRUTO,
            VRTOTALLIQUIDO: item.VRTOTALLIQUIDO,
            DESCPERC01: item.DESCPERC01,
            DESCPERC02: item.DESCPERC02,
            DESCPERC03: item.DESCPERC03,
            PERCCOMISSAO: item.PERCCOMISSAO,
            TPFISCAL: item.TPFISCAL,
            STCANCELADO: item.STCANCELADO,
            TPARQUIVO: item.TPARQUIVO,
            FABRICANTE: item.FABRICANTE,
            dsTipoFretePedido: dsTipoFretePedido,
            dsTipoFiscalPedido: dsTipoFiscalPedido,
            dsTipoArquivoPedido: dsTipoArquivoPedido,
            dsTipoEnviar: dsTipoEnviar,
            logoPedido: logoPedido
        }
    })


    return (
        <Fragment>
            <div style={styles.page}>

                <table width="100%" className="bordasimples">
                    <tbody>
                        <tr>
                            <td rowspan="2" width="200" align="center" id="marcapedido">
                                <img src={dados[0]?.logoPedido} style={{ width: '200px', height: '100px', border: 'none' }} />
                            </td>
                            <td rowspan="2" width="200" align="center" >
                                <p style={{ fontSize: '1rem', margin: '0px', padding: '0px' }}> PEDIDO DE COMPRAS<br />{dados[0]?.MODPEDIDO}</p>
                                <p style={{ fontSize: '1rem', margin: '0px' }}>Nº: <b>{dados[0]?.IDPEDIDO}</b></p></td>
                            <td align="center" style={{ fontSize: '0.563rem' }}>
                                Fabricante: <br />
                                <b><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.FABRICANTE}</p></b>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ fontSize: '0.563rem' }}>
                                Razão Social Fornecedor: <br />
                                <p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.NOFORNECEDOR}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table width="100%" className="bordasimples">
                    <tbody>
                        <tr>
                            <td rowspan="2" width="400" style={{ fontSize: '0.563rem' }}>
                                Calçados: andre.compras@grupotesouradeouro.com.br - (61) 99697-2844 <br />
                                Faturamento: {dados[0]?.EEMAILFATURAMENTO} - {dados[0]?.NUTELFATURAMENTO}<br />
                                Cobrança: {dados[0]?.EEMAILCOBRANCA} - {dados[0]?.NUTELCOBRANCA}<br />
                                Financeiro: {dados[0]?.EEMAILFINANCEIRO} - {dados[0]?.NUTELFINANCEIRO}<br />
                                Compras: {dados[0]?.EEMAILCOMPRAS} - {dados[0]?.NUTELCOMPRAS}<br />
                                Cadastro: {dados[0]?.EEMAILCADASTRO} - {dados[0]?.NUTELCADASTRO}<br />
                            </td>
                            <td width="200" style={{ fontSize: '0.563rem' }}>CNPJ: <br />
                                <p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.CNPJFORN}</p>
                            </td>
                            <td style={{ fontSize: '0.563rem' }}>Email: <br />
                                <p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.EMAILFORN}</p>
                            </td>
                            <td width="100" style={{ fontSize: '0.563rem' }}>Tel: <br />
                                <p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.FONEFORN}</p>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" width="200" >INSC EST: <br />
                                <p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.INSCESTFORN}</p>
                            </td>
                            <td style={{ fontSize: '0.563rem' }}>Cel: <br />
                                <p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.FONEFORN}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>


                <table width="100%" className="bordasimples">
                    <tbody>
                        <tr>
                            <td width="200" style={{ fontSize: '0.563rem' }}>Data do Pedido: <br />
                                <p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.DTPEDIDO}</p>
                            </td>
                            <td width="200" style={{ fontSize: '0.563rem' }}>Data da Entrega: <br />
                                <p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.DTPREVENTREGAFORMATADA}</p>
                            </td>
                            <td style={{ fontSize: '0.563rem' }}>Endereço: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.ENDFORN}</p> </td>
                            <td style={{ fontSize: '0.563rem' }}>Complemento: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.COMPFORN}</p> <strong></strong> </td>
                        </tr>
                    </tbody>
                </table>

                <table width="100%" className="bordasimples">
                    <tbody>
                        <tr>
                            <td width="400" style={{ fontSize: '0.563rem' }}>
                                Comprador: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.NOMECOMPRADOR}</p>
                            </td>
                            <td style={{ fontSize: '0.563rem' }}>N°: <br />
                                <p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.NUMEROFORN}</p>
                            </td>
                            <td style={{ fontSize: '0.563rem' }}>
                                Bairro: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.BAIRROFORN}</p>
                            </td>
                            <td style={{ fontSize: '0.563rem' }}>
                                Transportadora/Telefone: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.NOMETRANSPORTADORA} - </p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table width="100%" className="bordasimples">
                    <tbody>
                        <tr>
                            <td width="400" style={{ fontSize: '0.563rem' }}>
                                Vendedor: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.NOVENDEDOR}</p>
                            </td>

                            <td width="400" style={{ fontSize: '0.563rem' }}>
                                Cidade: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.CIDADEFORN}</p>
                            </td>
                            <td style={{ fontSize: '0.563rem' }}>
                                Desc. I (%): <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{formatMoeda(toFloat(dados[0]?.DESCPERC01))}</p>
                            </td>
                            <td style={{ fontSize: '0.563rem' }}>
                                Desc. II(%): <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{formatMoeda(toFloat(dados[0]?.DESCPERC02))}</p>
                            </td>
                            <td style={{ fontSize: '0.563rem' }}>
                                Desc. III(%): <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{formatMoeda(toFloat(dados[0]?.DESCPERC03))}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table width="100%" className="bordasimples">
                    <tbody><tr>
                        <td width="400" style={{ fontSize: '0.563rem' }}>
                            Cond. Pagamento: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.DSCONDICAOPAG}</p>
                        </td>

                        <td style={{ fontSize: '0.563rem' }}>
                            CEP: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.CEPFORN}</p>
                        </td>
                        <td style={{ fontSize: '0.563rem' }}>
                            UF: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.UFFORN}</p>
                        </td>
                        <td style={{ fontSize: '0.563rem' }}>
                            Frete: <br />
                            <p style={{ fontSize: '0.813rem', margin: '0px' }}>
                                {dados[0]?.dsTipoFretePedido}
                            </p>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <table width="100%" className="bordasimples">
                    <tbody>
                        <tr>
                            <td width="400" style={{ fontSize: '0.563rem' }}>
                                Observações: <br /><p style={{ fontSize: '0.563rem' }}>{dados[0]?.OBSPEDIDO} - {dados[0]?.OBSPEDIDO2} </p>
                            </td>
                            <td style={{ fontSize: '0.563rem' }}>
                                Fiscal: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.dsTipoFiscalPedido}</p>
                            </td>
                            <td style={{ fontSize: '0.563rem' }}>
                                Enviar: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.dsTipoEnviar} </p>
                            </td>
                            <td style={{ fontSize: '0.563rem' }}>
                                Tipo: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{dados[0]?.MODPEDIDO} </p>
                            </td>
                            <td style={{ fontSize: '0.563rem' }}>
                                Comissão: <br /><p style={{ fontSize: '0.813rem', margin: '0px' }}>{formatMoeda(toFloat(dados[0]?.PERCCOMISSAO))} </p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <ActionListaDetalheSempreco dadosDetalhePedido={dadosDetalhePedido} />
            </div>
        </Fragment>
    )
}