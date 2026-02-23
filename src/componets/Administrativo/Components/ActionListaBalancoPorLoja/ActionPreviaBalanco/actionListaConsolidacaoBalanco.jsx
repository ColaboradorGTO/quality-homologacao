import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import axios from "axios";
import { toFloat } from "../../../../../utils/toFloat";


export const ActionListaConsolidacaoBalanco = ({ 
    dadosBalancoConsolidado, 
    optionsModulos, 
    usuarioLogado,
    handleClose, 
    handleClickResumoBalanco 
}) => {
    const [obsContagem, setObsContagem] = useState('');
    const [obsDivergenciaContagem, setObsDivergenciaContagem] = useState('');
    const [obsDivergenciaGerente, setObsDivergenciaGerente] = useState('');
    const [ipUsuario, setIpUsuario] = useState('');

    useEffect(() => {
        getIPUsuario();
    }, [usuarioLogado]);

    const getIPUsuario = async () => {
        const response = await axios.get('http://ipwho.is/')
        if (response.data) {
            setIpUsuario(response.data.ip);
        }
        return response.data;
    }

     const dados = dadosBalancoConsolidado.map((item, index) => {

        return {
            IDRESUMOBALANCO: item.IDRESUMOBALANCO,
            NOFANTASIA: item.NOFANTASIA,
            DTABERTURA: item.DTABERTURA,
            QTDTOTALANTERIOR: item.QTDTOTALANTERIOR,
            QTDTOTALCONTAGEM: item.QTDTOTALCONTAGEM
        }
    })

    const handleSubmit = async () => {
        const putData = {
            IDRESUMOBALANCO: Number(dadosBalancoConsolidado[0]?.IDRESUMOBALANCO),
            OBSCONTAGEM: obsContagem,
            OBSDIVERGENCIACONTAGEM: obsDivergenciaContagem,
            OBSDIVERGENCIAGERENTE: obsDivergenciaGerente
        }

        try {

            const response = await put('/confirmar-consolidar-balanco/:id', putData)


            const textDados = JSON.stringify(putData)
            let textoFuncao = 'ADMINISTRATIVO/CONFIRMAR E CONSOLIDAR BALANCO';


            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)

            Swal.fire({
                title: 'Atualizado com Sucesso!',
                text: 'Atualizado com Sucesso',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClose();
            handleClickResumoBalanco();
            return responsePost.data;

        } catch (error) {
            let textoFuncao = 'ADMINISTRATIVO/ERRO AO CONFIRMAR E CONSOLIDAR BALANCO';
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: 'ERRO AO CONFIRMAR E CONSOLIDAR BALANCO',
                IP: ipUsuario
            }
            const responsePost = await post('/log-web', postData)
            Swal.fire({
                title: 'Erro ao Atualizar!',
                text: 'Erro ao Atualizar',
                icon: 'error',
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            })
            console.error('Erro ao Tentar Consolidar o Balanço: ', error);
            return responsePost.data;
        }
    }

    return (
        <div>
            <table className="table table-hover table-striped w-100">
                <tr>
                    <th>Número Balanço</th>
                    <th>Empresa</th>
                    <th>Data Abertura</th>
                </tr>
                <tr>
                    <th> {dadosBalancoConsolidado[0]?.IDRESUMOBALANCO}</th>
                    <th>{dadosBalancoConsolidado[0]?.NOFANTASIA}</th>
                    <th>{dadosBalancoConsolidado[0]?.DTABERTURA} </th>
                </tr>
                <tr><td colspan="3"></td></tr>
                <tr>
                    <th>Qtd Estoque Atual: {toFloat(dadosBalancoConsolidado[0]?.QTDTOTALANTERIOR)}</th>
                    <th>Qtd Contagem: {toFloat(dadosBalancoConsolidado[0]?.QTDTOTALCONTAGEM)}</th>
                    <th>Qtd Diferença: {toFloat(dadosBalancoConsolidado[0]?.QTDTOTALCONTAGEM) - toFloat(dadosBalancoConsolidado[0]?.QTDTOTALANTERIOR)}</th>
                </tr>
                <tr><td colspan="3"></td></tr>
                <tr>
                    <th>Observação Contagem</th>
                    <th>Observação Divergência Contagem</th>
                    <th>Observação Divergência Gerente</th>
                </tr>
                <tr>
                    <th>
                        <textarea
                            className="form-control"
                            id="obscontagem"
                            rows="5"
                            maxlength="250"
                            value={obsContagem}
                            onChange={(e) => setObsContagem(e.target.value)}
                        >
                        </textarea>
                    </th>
                    <th>
                        <textarea
                            className="form-control"
                            id="obsdivergenciacontagem"
                            rows="5"
                            maxlength="250"
                            value={obsDivergenciaContagem}
                            onChange={(e) => setObsDivergenciaContagem(e.target.value)}
                        >
                        </textarea>
                    </th>
                    <th>
                        <textarea
                            className="form-control"
                            id="obsdiveregenciagerente"
                            rows="5"
                            maxlength="250"
                            value={obsDivergenciaGerente}
                            onChange={(e) => setObsDivergenciaGerente(e.target.value)}
                        >
                        </textarea>
                    </th>
                </tr>
                <tr><td colspan="3"></td></tr>
                <tr>
                    <td colspan="3" align="center">
                        <button 
                            type="button" 
                            className="btn btn-success waves-effect waves-themed" 
                            title="Confirmar a Consolidação do Balanço" 
                            onClick={handleSubmit}>
                                Confirmar
                        </button>
                    </td>
                </tr>
            </table>
        </div>
    );
}