import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { put } from "../../../../../api/funcRequest";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { registrarLogAuditoria } from "../../../../../services/auditLog";


export const useEditarDescontoFuncionario = ({
    handleClose,
    dadosDescontoFuncionarios,
    handleClick,
    refetch,
    usuarioLogado,
    optionsModulos,
}) => {
    const [empresa, setEmpresa] = useState('');
    const [cpf, setCpf] = useState('');
    const [funcionario, setFuncionario] = useState('');
    const [motivoDesconto, setMotivoDesconto] = useState('');
    const [percentualDesconto, setPercentualDesconto] = useState('');
    const [dataInicioDesconto, setDataInicioDesconto] = useState('');
    const [dataFimDesconto, setDataFimDesconto] = useState('');

    useEffect(() => {
        const dataAtual = getDataAtual();
        setDataInicioDesconto(dataAtual);
        setDataFimDesconto(dataAtual);
    }, [])

    useEffect(() => {
        if (dadosDescontoFuncionarios) {
            setEmpresa(dadosDescontoFuncionarios[0]?.NOFANTASIA);
            setCpf(dadosDescontoFuncionarios[0]?.NUCPF);
            setFuncionario(dadosDescontoFuncionarios[0]?.NOFUNCIONARIO);
            setPercentualDesconto(dadosDescontoFuncionarios[0]?.PERCDESCUSUAUTORIZADO || "0" );
        }
    }, [dadosDescontoFuncionarios]);

    const onSubmit = async (e) => {

        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Acesso Negado',
                text: 'Usuário não tem permissão para Atualizar Funcionários',
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            return;
        }

        const putData = {
            DTINICIODESC: String(dataInicioDesconto),
            DTFIMDESC: String(dataFimDesconto),
            PERCDESCUSUAUTORIZADO: percentualDesconto ? parseFloat(percentualDesconto) : 0,
            TXTMOTIVODESCONTO: motivoDesconto,
            IDFUNCALTERACAO: Number(usuarioLogado?.id),
            ID: Number(dadosDescontoFuncionarios[0]?.ID),

        }
        try {

            const response = await put('/funcionarioDescontoRH/:id', putData)

            await registrarLogAuditoria({
                idFuncionario: usuarioLogado.id,
                pathFuncao: 'RH/ATUALIZAR DESCONTO FUNCIONARIO AUTORIZADO',
                dados: putData
            });

            Swal.fire({
                title: 'Atualização',
                text: 'Atualização Realizada com Sucesso',
                icon: 'success',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            refetch();
            handleClose();
            return response.data;
        } catch (error) {
            const responsePost = await registrarLogAuditoria({
                idFuncionario: usuarioLogado.id,
                pathFuncao: 'RH/ERRO AO ATUALIZAR DESCONTO FUNCIONARIO',
                dados: putData
            });

            Swal.fire({
                title: 'Erro ao Atualizar',
                text: 'Erro ao Tentar Atualizar',
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClick()
            return responsePost.data;

        }
    }

    return {
        empresa,
        setEmpresa,
        cpf,
        setCpf,
        funcionario,
        setFuncionario,
        motivoDesconto,
        setMotivoDesconto,
        percentualDesconto,
        setPercentualDesconto,
        dataInicioDesconto,
        setDataInicioDesconto,
        dataFimDesconto,
        setDataFimDesconto,
        onSubmit,
    }
}
