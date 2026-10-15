import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { get, post, put } from "../../../../../api/funcRequest";
import { toFloat } from "../../../../../utils/toFloat";
import { useQuery } from "react-query";
import { removerFormatacaoMoeda } from "../../../../../utils/formatMoeda";
import { registrarLogAuditoria } from "../../../../../services/auditLog";

const extrairDataHora = (valor) => {
    if (!valor) {
        return { data: '', hora: '' };
    }

    const dataCompleta = new Date(valor);

    if (Number.isNaN(dataCompleta.getTime())) {
        return { data: '', hora: '' };
    }

    const data = [
        dataCompleta.getFullYear(),
        String(dataCompleta.getMonth() + 1).padStart(2, '0'),
        String(dataCompleta.getDate()).padStart(2, '0')
    ].join('-');

    const hora = [
        String(dataCompleta.getHours()).padStart(2, '0'),
        String(dataCompleta.getMinutes()).padStart(2, '0')
    ].join(':');

    return { data, hora };
};

export const useUpdateDeposito = ({ handleClose, optionsModulos, usuarioLogado, dadosDeposito }) => {
    const [empresa, setEmpresa] = useState('')
    const [data, setData] = useState('')
    const [hora, setHora] = useState('')
    const [contaSelecionada, setContaSelecionada] = useState('')
    const [historico, setHistorico] = useState('')
    const [documento, setDocumento] = useState('')
    const [vrDeposito, setVrDeposito] = useState('')
    const [dataMovimento, setDataMovimento] = useState('')
    const [horaMovimento, setHoraMovimento] = useState('')
    



    const { data: dadosContaBanco = [], error: errorContaBanco, isLoading: isLoadingContaBanco } = useQuery(
        'contaBanco',
        async () => {
            const response = await get(`/contaBanco`);
            return response.data;
        },
        { staleTime: 5 * 60 * 1000 }
    );

    useEffect(() => {
    const deposito = dadosDeposito?.[0];

    if (deposito) {
        const depositoDataHora = extrairDataHora(
            deposito.DTDEPCOMPLETA
        );

        const movimentoDataHora = extrairDataHora(
            deposito.DTMOVDEPCOMPLETA
        );

        setEmpresa(deposito.NOFANTASIA);

        setData(depositoDataHora.data);
        setHora(depositoDataHora.hora);
        
        setDataMovimento(movimentoDataHora.data);
        setHoraMovimento(movimentoDataHora.hora);

        setContaSelecionada({
            value: deposito.IDCONTABANCO,
            label: deposito.DSCONTABANCO
        });

        setHistorico(deposito.DSHISTORIO);
        setDocumento(deposito.NUDOCDEPOSITO);
        setVrDeposito(toFloat(deposito.VRDEPOSITO));
    }
}, [dadosDeposito]);

    const onSubmit = async () => {
        if (optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Você não tem permissão para criar ajuste de extrato!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        if(historico == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Campo obrigatório Informe o Histórico',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        if(contaSelecionada == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Campo obrigatório Informe a Conta',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        if(data == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Campo obrigatório Informe a Data do depósito',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        // if(hora == '') {
        //     Swal.fire({
        //         position: 'center',
        //         icon: 'error',
        //         title: 'Erro!',
        //         text: 'Campo obrigatório Informe a Hora',
        //         customClass: {
        //             container: 'custom-swal',
        //         },
        //         showConfirmButton: false,
        //         timer: 4000
        //     });
        //     return
        // }

        if(vrDeposito == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Campo obrigatório Informe o Valor do Depósito',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        if(dataMovimento == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Campo obrigatório Informe a Data Movimento',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        // if(horaMovimento == '') {
        //     Swal.fire({
        //         position: 'center',
        //         icon: 'error',
        //         title: 'Erro!',
        //         text: 'Campo obrigatório Informe a Hora Movimento',
        //         customClass: {
        //             container: 'custom-swal',
        //         },
        //         showConfirmButton: false,
        //         timer: 4000
        //     });
        //     return
        // }

        
        const putData = {
            IDDEPOSITOLOJA: parseInt(dadosDeposito[0]?.IDDEPOSITOLOJA),
            IDEMPRESA: parseInt(empresa),
            IDUSR: parseInt(usuarioLogado.id),
            IDCONTABANCO: parseInt(contaSelecionada.value),
            DTDEPOSITO: `${data} ${hora}:00`,
            DTMOVIMENTOCAIXA: `${dataMovimento} ${horaMovimento}:00`,
            DSHISTORIO: historico,
            NUDOCDEPOSITO: documento,
            VRDEPOSITO: removerFormatacaoMoeda(vrDeposito),
            STATIVO: 'True',
            STCANCELADO: 'False',
        }
        try {

            const response = await put('/deposito-loja/:id', putData)

            await registrarLogAuditoria({
                idFuncionario: usuarioLogado?.id,
                pathFuncao: 'FINANCEIRO/EDIÇÃO DEPOSITO PELO EXTRATO DE CONTAS',
                dados: putData
            })


            Swal.fire({
                position: 'center',
                title: 'Sucesso',
                text: 'Deposito Atualizado com Sucesso',
                icon: 'success',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClose()
            return response.data
        } catch (error) {

            await registrarLogAuditoria({
                idFuncionario: usuarioLogado?.id,
                pathFuncao: `FINANCEIRO/ERRO AO ATUALIZAR DEPOSITO`,
                dados: putData
            })

            
            handleClose()
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Erro ao Atualizar Deposito de Extrato!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });

            return;

        }

    }

    return {
        dataMovimento,
        hora,
        historico,
        vrDeposito,
        documento,
        contaSelecionada,
        empresa,
        setVrDeposito,
        setContaSelecionada,
        setDocumento,
        setHistorico,
        setDataMovimento,
        setHora,
        setEmpresa,
        horaMovimento,
        setHoraMovimento,
        data,
        setData,
        dadosContaBanco,
        onSubmit,
    }
}