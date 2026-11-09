let api = $.import("quality.concentrador_homologacao.api.apiResponse", "int_api");

function setStringOrNull(stmt, fieldId, value) {
    if (value) {
        stmt.setString(fieldId, value);
    } else {
        stmt.setNull(fieldId);
    }
}

function fnInserirHistoricoAdiantamento(conn, idAdiantamento, statusAnterior, statusNovo, acao, dsObservacao, idUsuario) {
    let queryHistorico = `
        INSERT INTO "VAR_DB_NAME"."ADIANTAMENTO_HISTORICO"
        (
            "IDADIANTAMENTO",
            "STATUSANTERIOR",
            "STATUSNOVO",
            "ACAO",
            "DSOBSERVACAO",
            "IDUSUARIO",
            "DATAACAO"
        )
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    let pStmtHistorico = conn.prepareStatement(api.replaceDbName(queryHistorico));

    pStmtHistorico.setInt(1, idAdiantamento);
    setStringOrNull(pStmtHistorico, 2, statusAnterior);
    pStmtHistorico.setString(3, statusNovo);
    pStmtHistorico.setString(4, acao);
    setStringOrNull(pStmtHistorico, 5, dsObservacao);
    pStmtHistorico.setInt(6, idUsuario);

    pStmtHistorico.execute();
    pStmtHistorico.close();
}

function fnBuscarSolicitacao(conn, idAdiantamento) {
    let query = `
        SELECT "STATUS", "ANEXONOTAFISCAL"
        FROM "VAR_DB_NAME"."ADIANTAMENTO_SOLICITACAO"
        WHERE "IDADIANTAMENTO" = ?
    `;

    let pStmt = conn.prepareStatement(api.replaceDbName(query));
    pStmt.setInt(1, idAdiantamento);

    let rs = pStmt.executeQuery();
    let solicitacao = { status: null, anexoNotaFiscal: null };

    if (rs.next()) {
        solicitacao.status = rs.getString(1);
        solicitacao.anexoNotaFiscal = rs.getString(2);
    }

    rs.close();
    pStmt.close();

    return solicitacao;
}

/*
    FLUXO DE STATUS APÓS O PAGAMENTO
    - PAGO sem comprovante            => PAGO
    - PAGO com comprovante            => COMPROVANTE ANEXADO
    - Sem nota fiscal na solicitação  => AGUARDANDO NOTA FISCAL (logo após o pagamento)
    - Recusado pelo solicitante       => PAGAMENTO RECUSADO
    - DTPAGAMENTO > 7 dias sem nota   => NOTA FISCAL EM ATRASO (adiantamento-departamento.xsjs GET)
*/
function fnAtualizarStatusPorPagamento(conn, registro, idUsuario) {
    // A observação do pagamento (DSOBSERVACAO) sempre vai para ADIANTAMENTO_SOLICITACAO.DSJUSTIFICATIVAPAGAMENTO
    let dsJustificativaPagamento = registro.DSOBSERVACAO || null;

    if (!registro.STATUS) {
        fnAtualizarSolicitacaoPorPagamento(conn, registro.IDADIANTAMENTO, null, dsJustificativaPagamento, idUsuario);
        return;
    }

    let solicitacao = fnBuscarSolicitacao(conn, registro.IDADIANTAMENTO);
    let statusAnterior = solicitacao.status;

    if (registro.STATUS !== 'PAGO') {
        fnAtualizarSolicitacaoPorPagamento(conn, registro.IDADIANTAMENTO, registro.STATUS, dsJustificativaPagamento, idUsuario);
        fnInserirHistoricoAdiantamento(conn, registro.IDADIANTAMENTO, statusAnterior, registro.STATUS, 'PAGAMENTO', registro.DSOBSERVACAO, idUsuario);
        return;
    }

    let statusPago = registro.ANEXOCOMPROVANTE ? 'COMPROVANTE ANEXADO' : 'PAGO';
    fnInserirHistoricoAdiantamento(conn, registro.IDADIANTAMENTO, statusAnterior, statusPago, 'PAGAMENTO', registro.DSOBSERVACAO, idUsuario);

    let statusFinal = statusPago;

    if (!solicitacao.anexoNotaFiscal) {
        statusFinal = 'AGUARDANDO NOTA FISCAL';
        fnInserirHistoricoAdiantamento(conn, registro.IDADIANTAMENTO, statusPago, statusFinal, 'PAGAMENTO', 'Aguardando o solicitante anexar a nota fiscal', idUsuario);
    }

    fnAtualizarSolicitacaoPorPagamento(conn, registro.IDADIANTAMENTO, statusFinal, dsJustificativaPagamento, idUsuario);
}

function fnAtualizarSolicitacaoPorPagamento(
    conn,
    idAdiantamento,
    status,
    dsJustificativaPagamento,
    idUsuarioAlteracao
) {

    // DSJUSTIFICATIVA é a proposta do solicitante e não é alterada pelo pagamento
    let query = `
        UPDATE "VAR_DB_NAME"."ADIANTAMENTO_SOLICITACAO"
        SET
            "STATUS" = IFNULL(?, "STATUS"),
            "DSJUSTIFICATIVAPAGAMENTO" = ?,
            "IDUSUARIOALTERACAO" = ?,
            "DATAALTERACAO" = CURRENT_TIMESTAMP
        WHERE "IDADIANTAMENTO" = ?
    `;

    let pStmt = conn.prepareStatement(api.replaceDbName(query));

    setStringOrNull(pStmt, 1, status);
    setStringOrNull(pStmt, 2, dsJustificativaPagamento);
    pStmt.setInt(3, idUsuarioAlteracao);
    pStmt.setInt(4, idAdiantamento);

    let resultado = pStmt.executeUpdate();

    pStmt.close();

    if (resultado === 0) {
        throw new Error(
            "Nenhum adiantamento encontrado para atualização."
        );
    }
}

function fnHandleGet(id) {
    let idAdiantamento = $.request.parameters.get("idAdiantamento");
    let dataPesquisaInicio = $.request.parameters.get("dataPesquisaInicio");
    let dataPesquisaFim = $.request.parameters.get("dataPesquisaFim");
    let formaPagamento = $.request.parameters.get("formaPagamento");
    let stAtivo = $.request.parameters.get("stAtivo");

    let query = `
        SELECT
            "IDPAGAMENTO",
            "IDADIANTAMENTO",
            "VLPAGAMENTO",
            "DATAPAGAMENTO",
            "FORMAPAGAMENTO",
            "NUPAGAMENTO",
            "ANEXOCOMPROVANTE",
            "DSOBSERVACAO",
            "IDUSUARIOCRIACAO",
            "DATACRIACAO",
            "STATIVO"
        FROM "VAR_DB_NAME"."ADIANTAMENTO_PAGAMENTO"
        WHERE 1 = ?
    `;

    if(id) {
        query += `AND "IDPAGAMENTO" = ${id} `;
    }

    if(idAdiantamento) {
        query += `AND "IDADIANTAMENTO" = ${idAdiantamento} `;
    }

    if(dataPesquisaInicio && dataPesquisaFim) {
        query += `
            AND TO_DATE("DATAPAGAMENTO")
                BETWEEN '${dataPesquisaInicio}'
                AND '${dataPesquisaFim}'
        `;
    }

    if(formaPagamento) {
        query += `AND "FORMAPAGAMENTO" = '${formaPagamento}' `;
    }

    if(stAtivo) {
        query += `AND "STATIVO" = '${stAtivo}' `;
    }

    query += ` ORDER BY "DATACRIACAO" DESC `;

	let request = {
		page: $.request.parameters.get("page"),
		pageSize: $.request.parameters.get("pageSize")
	};

	api.responseWithQuery(query, request, 1);
}

function fnHandlePut() {
    let conn = $.db.getConnection();
    let bodyJson = JSON.parse($.request.body.asString());

    let query = `
        UPDATE "VAR_DB_NAME"."ADIANTAMENTO_PAGAMENTO"
        SET
            "IDADIANTAMENTO" = ?,
            "VLPAGAMENTO" = ?,
            "DATAPAGAMENTO" = ?,
            "FORMAPAGAMENTO" = ?,
            "NUPAGAMENTO" = ?,
            "ANEXOCOMPROVANTE" = ?,
            "DSOBSERVACAO" = ?,
            "STATIVO" = IFNULL(?, "STATIVO")
        WHERE "IDPAGAMENTO" = ?
    `;

    let pStmt = conn.prepareStatement(api.replaceDbName(query));

    try {
        for (var i = 0; i < bodyJson.length; i++) {
            var registro = bodyJson[i];

            pStmt.setInt(1, registro.IDADIANTAMENTO);
            pStmt.setFloat(2, registro.VLPAGAMENTO);
            pStmt.setDate(3, registro.DATAPAGAMENTO);
            pStmt.setString(4, registro.FORMAPAGAMENTO || '');
            setStringOrNull(pStmt, 5, registro.NUPAGAMENTO);
            setStringOrNull(pStmt, 6, registro.ANEXOCOMPROVANTE);
            setStringOrNull(pStmt, 7, registro.DSOBSERVACAO);
            setStringOrNull(pStmt, 8, registro.STATIVO);
            pStmt.setInt(9, registro.IDPAGAMENTO);

            pStmt.execute();

            fnAtualizarStatusPorPagamento(conn, registro, registro.IDUSUARIOCRIACAO);
        }

        conn.commit();

    } catch (e) {

        conn.rollback();
        throw e;

    } finally {

        pStmt.close();
        conn.close();
    }

    return {
	    msg : "Atualização realizada com sucesso!"
	};
}

function fnHandlePost() {

    let conn = $.db.getConnection();

    var idPagamento = api.executeScalar(`
        SELECT IFNULL(MAX(TO_INT("IDPAGAMENTO")), 0) + 1
        FROM "VAR_DB_NAME"."ADIANTAMENTO_PAGAMENTO"
        WHERE 1 = ?
    `, 1);

    let bodyJson = JSON.parse($.request.body.asString());

    let query = `
        INSERT INTO "VAR_DB_NAME"."ADIANTAMENTO_PAGAMENTO"
        (
            "IDPAGAMENTO",
            "IDADIANTAMENTO",
            "VLPAGAMENTO",
            "DATAPAGAMENTO",
            "FORMAPAGAMENTO",
            "NUPAGAMENTO",
            "ANEXOCOMPROVANTE",
            "DSOBSERVACAO",
            "IDUSUARIOCRIACAO",
            "DATACRIACAO",
            "STATIVO"
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'True')
    `;

    let pStmt = conn.prepareStatement(
        api.replaceDbName(query)
    );

    try {

        for (let registro of bodyJson) {

            pStmt.setInt(1, idPagamento);

            pStmt.setInt(
                2,
                registro.IDADIANTAMENTO
            );

            pStmt.setFloat(
                3,
                registro.VLPAGAMENTO
            );

            pStmt.setDate(
                4,
                registro.DATAPAGAMENTO
            );

            setStringOrNull(
                pStmt,
                5,
                registro.FORMAPAGAMENTO
            );

            setStringOrNull(
                pStmt,
                6,
                registro.NUPAGAMENTO
            );

            setStringOrNull(
                pStmt,
                7,
                registro.ANEXOCOMPROVANTE
            );

            setStringOrNull(
                pStmt,
                8,
                registro.DSOBSERVACAO
            );

            pStmt.setInt(
                9,
                registro.IDUSUARIOCRIACAO
            );

            pStmt.execute();

            fnAtualizarStatusPorPagamento(conn, registro, registro.IDUSUARIOCRIACAO);

            idPagamento++;
        }

        conn.commit();

    } catch (e) {

        conn.rollback();
        throw e;

    } finally {

        pStmt.close();
        conn.close();
    }

    return {
        msg: "Inclusão realizada com sucesso!"
    };
}

$.response.contentType = 'application/json';
$.response.status = $.net.http.OK;

try {
	switch ($.request.method) {

		//Handle your GET calls here
		case $.net.http.GET:
			let id = $.request.parameters.get("id");
		    fnHandleGet(id);
		    break;
		case $.net.http.PUT:
            var docReturn = fnHandlePut();
            $.response.setBody(JSON.stringify(docReturn));
            break;
		case $.net.http.POST:
            var docReturn = fnHandlePost();
            $.response.setBody(JSON.stringify(docReturn));
            break;
	}

 } catch (e) {
    var detalheError = e.stack ? e.stack.split('\n') : '';

    detalheError = detalheError ? detalheError.length > 3 ? detalheError[1].trim() : detalheError[ detalheError.length - 3].trim() : '';

    if(detalheError){
        detalheError = `Linha: ${detalheError.split(':')[1]} da Funcao ${detalheError.split('@').shift()}()`;
    }

    $.response.contentType = 'application/json';
    $.response.setBody(JSON.stringify({
        message: e.message || e,
        detalheError
    }));
    $.response.status = 400;
}
