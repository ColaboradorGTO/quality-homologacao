let api = $.import("quality.concentrador.api.apiResponse", "int_api");

function setStringOrNull(stmt, fieldId, value) {
    if (value) {
        stmt.setString(fieldId, value);
    } else {
        stmt.setNull(fieldId);
    }
}

function setIntOrNull(params, value) {
    if (value === null || value === undefined || isNaN(value)) {
        params.push(null);
    } else {
        params.push(parseInt(value, 10));
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

// Status que dependem da nota fiscal do solicitante após o pagamento
const STATUS_AGUARDANDO_NOTA = "'PAGO', 'COMPROVANTE ANEXADO', 'AGUARDANDO NOTA FISCAL'";

function fnAtualizarNotaFiscalEmAtraso() {
    // DTPAGAMENTO > 7 dias e sem ANEXONOTAFISCAL => NOTA FISCAL EM ATRASO
    let condicaoAtraso = `
        "STATUS" IN (${STATUS_AGUARDANDO_NOTA})
        AND IFNULL("ANEXONOTAFISCAL", '') = ''
        AND ADD_DAYS(
            CASE
                WHEN "DTPAGAMENTO" IS NULL OR LENGTH("DTPAGAMENTO") < 10 THEN NULL
                ELSE TO_DATE(LEFT("DTPAGAMENTO", 10), 'YYYY-MM-DD')
            END, 7
        ) < CURRENT_DATE
    `;

    let queryHistorico = `
        INSERT INTO "VAR_DB_NAME"."ADIANTAMENTO_HISTORICO"
        ("IDADIANTAMENTO", "STATUSANTERIOR", "STATUSNOVO", "ACAO", "DSOBSERVACAO", "IDUSUARIO", "DATAACAO")
        SELECT
            "IDADIANTAMENTO",
            "STATUS",
            'NOTA FISCAL EM ATRASO',
            'ATUALIZACAO AUTOMATICA',
            'Nota fiscal não anexada após 7 dias do pagamento',
            IFNULL("IDUSUARIOALTERACAO", "IDUSUARIOCRIACAO"),
            CURRENT_TIMESTAMP
        FROM "VAR_DB_NAME"."ADIANTAMENTO_SOLICITACAO"
        WHERE ${condicaoAtraso}
    `;

    let queryUpdate = `
        UPDATE "VAR_DB_NAME"."ADIANTAMENTO_SOLICITACAO"
        SET
            "STATUS" = 'NOTA FISCAL EM ATRASO',
            "DATAALTERACAO" = CURRENT_TIMESTAMP
        WHERE ${condicaoAtraso}
    `;

    let conn = $.db.getConnection();

    try {
        let pStmtHistorico = conn.prepareStatement(api.replaceDbName(queryHistorico));
        pStmtHistorico.execute();
        pStmtHistorico.close();

        let pStmtUpdate = conn.prepareStatement(api.replaceDbName(queryUpdate));
        pStmtUpdate.executeUpdate();
        pStmtUpdate.close();

        conn.commit();
    } catch (e) {
        conn.rollback();
        throw e;
    } finally {
        conn.close();
    }
}

// Quando o solicitante anexa a nota, sai de AGUARDANDO/ATRASO e volta para o status do pagamento
function fnDefinirStatusAposNotaFiscal(conn, idAdiantamento) {
    let query = `
        SELECT MAX("ANEXOCOMPROVANTE")
        FROM "VAR_DB_NAME"."ADIANTAMENTO_PAGAMENTO"
        WHERE "IDADIANTAMENTO" = ?
    `;

    let pStmt = conn.prepareStatement(api.replaceDbName(query));
    pStmt.setInt(1, idAdiantamento);

    let rs = pStmt.executeQuery();
    let anexoComprovante = rs.next() ? rs.getString(1) : null;

    rs.close();
    pStmt.close();

    return anexoComprovante ? 'COMPROVANTE ANEXADO' : 'PAGO';
}

function fnHandleGet(id) {
    fnAtualizarNotaFiscalEmAtraso();

    let idEmpresa = $.request.parameters.get("idEmpresa");
    let dataPesquisaInicio = $.request.parameters.get("dataPesquisaInicio");
    let dataPesquisaFim = $.request.parameters.get("dataPesquisaFim"); 
    let status = $.request.parameters.get("status");
	let departamento = $.request.parameters.get("departamento");

      let query = `
        SELECT
            ad."IDADIANTAMENTO",
            ad."IDEMPRESA",
            ad."NUCNPJEMPRESA",
            ad."CNPJFATURAMENTO",
            ad."VRSOLICITADO",
            ad."DESCRICAO",
            ad."ANEXOORCAMENTO",
            ad."ANEXONOTAFISCAL",
            ad."STATUS",
            ad."DSJUSTIFICATIVA",
            ad."IDUSUARIOCRIACAO",
            ad."DATACRIACAO",
            ad."IDUSUARIOALTERACAO",
            ad."DATAALTERACAO",
            ad."DATAFINALIZACAO",
            ad."STATIVO",
            ad."RAZAOSOCIALFATURAMENTO",
            ad."DEPARTAMENTO",
            ad."POSSUINOTAFISCAL",
            ad."RAZAOSOCIALEMPRESA",
            ad."TPBENEFICIARIO",
            ad."NUCPFBENEFICIARIO",
            ad."NOBENEFICIARIO",
            ad."NURGBENEFICIARIO",
            ad."EMAILBENEFICIARIO",
            ad."NUCEPBENEFICIARIO",
            ad."ENDERECOBENEFICIARIO",
            ad."TELEFONEBENEFICIARIO",
            ad."DTNASCIMENTOBENEFICIARIO",
            ad."TPDESPESA",
            ad."NOFAVORECIDO",
            ad."FORMAPAGAMENTO",
            ad."CHAVEPIX",
            ad."IDBANCO",
            ad."NUAGENCIA",
            ad."NUCONTA",
            ad."NUDIGITOCONTA",
            ad."UNIDADENEGOCIO",
            ad."CENTROCUSTO",
            ad."DTPAGAMENTO",
            ad."MATRICULASOLICITANTE",
            ad."NOMESOLICITANTE",
            MAX(pg."FORMAPAGAMENTO") AS "FORMAPAGAMENTOPAGAMENTO",
            MAX(pg."STATIVO") AS "STATUSPAGAMENTO"
        FROM "VAR_DB_NAME"."ADIANTAMENTO_SOLICITACAO" ad
        LEFT JOIN "VAR_DB_NAME"."ADIANTAMENTO_PAGAMENTO" pg
            ON pg."IDADIANTAMENTO" = ad."IDADIANTAMENTO"
        WHERE 1 = ?
    `;


    if(id) {
        query += ` AND ad."IDADIANTAMENTO" = ${id} `;
    }
    if(idEmpresa) {
        query += ` AND ad."IDEMPRESA" = ${idEmpresa} `;
    }

    if (dataPesquisaInicio && dataPesquisaFim) {
        query += `
            AND TO_DATE(ad."DATACRIACAO")
                BETWEEN '${dataPesquisaInicio}'
                AND '${dataPesquisaFim}'
        `;
    }

    if(status) {
        query += ` AND ad."STATUS" = '${status}' `;
    }

    if(departamento) {
        query += ` AND ad."DEPARTAMENTO" = '${departamento}' `;
    }

    query += `
        GROUP BY
            ad."IDADIANTAMENTO",
            ad."IDEMPRESA",
            ad."NUCNPJEMPRESA",
            ad."CNPJFATURAMENTO",
            ad."VRSOLICITADO",
            ad."DESCRICAO",
            ad."ANEXOORCAMENTO",
            ad."ANEXONOTAFISCAL",
            ad."STATUS",
            ad."DSJUSTIFICATIVA",
            ad."IDUSUARIOCRIACAO",
            ad."DATACRIACAO",
            ad."IDUSUARIOALTERACAO",
            ad."DATAALTERACAO",
            ad."DATAFINALIZACAO",
            ad."STATIVO",
            ad."RAZAOSOCIALFATURAMENTO",
            ad."DEPARTAMENTO",
            ad."POSSUINOTAFISCAL",
            ad."RAZAOSOCIALEMPRESA",
            ad."TPBENEFICIARIO",
            ad."NUCPFBENEFICIARIO",
            ad."NOBENEFICIARIO",
            ad."NURGBENEFICIARIO",
            ad."EMAILBENEFICIARIO",
            ad."NUCEPBENEFICIARIO",
            ad."ENDERECOBENEFICIARIO",
            ad."TELEFONEBENEFICIARIO",
            ad."DTNASCIMENTOBENEFICIARIO",
            ad."TPDESPESA",
            ad."NOFAVORECIDO",
            ad."FORMAPAGAMENTO",
            ad."CHAVEPIX",
            ad."IDBANCO",
            ad."NUAGENCIA",
            ad."NUCONTA",
            ad."NUDIGITOCONTA",
            ad."UNIDADENEGOCIO",
            ad."CENTROCUSTO",
            ad."DTPAGAMENTO",
            ad."MATRICULASOLICITANTE",
            ad."NOMESOLICITANTE"
        ORDER BY ad."DATACRIACAO" DESC
    `;

	let request = {
		page: $.request.parameters.get("page"),
		pageSize: $.request.parameters.get("pageSize")
	};

	api.responseWithQuery(query, request, 1);

}

function fnHandlePut() {
    let conn = $.db.getConnection();
    let bodyJson = JSON.parse($.request.body.asString());
    let queryStatusAnterior = `
            SELECT "STATUS"
            FROM "VAR_DB_NAME"."ADIANTAMENTO_SOLICITACAO"
            WHERE "IDADIANTAMENTO" = ?
    `;
      let query = `
            UPDATE "VAR_DB_NAME"."ADIANTAMENTO_SOLICITACAO"
            SET
                "DEPARTAMENTO" = ?,
                "DATACRIACAO" = IFNULL(?, "DATACRIACAO"),
                "IDEMPRESA" = ?,
                "NUCNPJEMPRESA" = ?,
                "RAZAOSOCIALEMPRESA" = ?,
                "TPBENEFICIARIO" = ?,
                "NUCPFBENEFICIARIO" = ?,
                "NOBENEFICIARIO" = ?,
                "NURGBENEFICIARIO" = ?,
                "EMAILBENEFICIARIO" = ?,
                "NUCEPBENEFICIARIO" = ?,
                "ENDERECOBENEFICIARIO" = ?,
                "TELEFONEBENEFICIARIO" = ?,
                "DTNASCIMENTOBENEFICIARIO" = ?,
                "TPDESPESA" = ?,
                "NOFAVORECIDO" = ?,
                "FORMAPAGAMENTO" = ?,
                "CHAVEPIX" = ?,
                "IDBANCO" = ?,
                "NUAGENCIA" = ?,
                "NUCONTA" = ?,
                "NUDIGITOCONTA" = ?,
                "UNIDADENEGOCIO" = ?,
                "CENTROCUSTO" = ?,
                "DTPAGAMENTO" = ?,
                "CNPJFATURAMENTO" = ?,
                "VRSOLICITADO" = ?,
                "DESCRICAO" = ?,
                "POSSUINOTAFISCAL" = ?,
                "ANEXOORCAMENTO" = ?,
                "ANEXONOTAFISCAL" = ?,
                "RAZAOSOCIALFATURAMENTO" = ?,
                "DSJUSTIFICATIVA" = ?,
                "STATUS" = ?,
                "IDUSUARIOALTERACAO" = ?,
                "DATAALTERACAO" = CURRENT_TIMESTAMP

            WHERE "IDADIANTAMENTO" = ?
        `;

    let pStmtStatus = conn.prepareStatement(
        api.replaceDbName(queryStatusAnterior)
    );

    let pStmt = conn.prepareStatement(api.replaceDbName(query));

    for (var i = 0; i < bodyJson.length; i++) {
        var registro = bodyJson[i];

        
        pStmtStatus.setInt(1, registro.IDADIANTAMENTO);

        let rsStatus = pStmtStatus.executeQuery();

        let statusAnterior = null;

        if (rsStatus.next()) {
            statusAnterior = rsStatus.getString(1);
        } else {
            rsStatus.close();
        }

        rsStatus.close();

        let statusNovo = registro.STATUS || statusAnterior;
        let acaoHistorico = 'ALTERACAO';

        if (
            registro.ANEXONOTAFISCAL &&
            (statusAnterior === 'AGUARDANDO NOTA FISCAL' || statusAnterior === 'NOTA FISCAL EM ATRASO')
        ) {
            statusNovo = fnDefinirStatusAposNotaFiscal(conn, registro.IDADIANTAMENTO);
            acaoHistorico = 'ANEXO NOTA FISCAL';
        }

          pStmt.setString(1, registro.DEPARTAMENTO);
            setStringOrNull(pStmt, 2, registro.DATACRIACAO);
            pStmt.setInt(3, registro.IDEMPRESA);
            pStmt.setString(4, registro.NUCNPJEMPRESA);
            pStmt.setString(5, registro.RAZAOSOCIALEMPRESA || '');

            // Dados do beneficiário
            pStmt.setString(6, registro.TPBENEFICIARIO || '');
            pStmt.setString(7, registro.NUCPFBENEFICIARIO || '');
            pStmt.setString(8, registro.NOBENEFICIARIO || '');
            pStmt.setString(9, registro.NURGBENEFICIARIO || '');
            pStmt.setString(10, registro.EMAILBENEFICIARIO || '');
            pStmt.setString(11, registro.NUCEPBENEFICIARIO || '');
            pStmt.setString(12, registro.ENDERECOBENEFICIARIO || '');
            pStmt.setString(13, registro.TELEFONEBENEFICIARIO || '');
            pStmt.setString(14, registro.DTNASCIMENTOBENEFICIARIO || '');

            // Dados da despesa
            pStmt.setString(15, registro.TPDESPESA || '');
            pStmt.setString(16, registro.NOFAVORECIDO || '');
            pStmt.setString(17, registro.FORMAPAGAMENTO || '');
            pStmt.setString(18, registro.CHAVEPIX || '');

            // Dados bancários
            if (
                registro.IDBANCO !== null &&
                registro.IDBANCO !== undefined &&
                registro.IDBANCO !== ''
            ) {
                pStmt.setInt(19, parseInt(registro.IDBANCO, 10));
            } else {
                pStmt.setNull(19, $.db.types.INTEGER);
            }

            pStmt.setString(20, registro.NUAGENCIA || '');
            pStmt.setString(21, registro.NUCONTA || '');
            pStmt.setString(22, registro.NUDIGITOCONTA || '');

            // Unidade e centro de custo
            pStmt.setString(23, registro.UNIDADENEGOCIO || '');
            pStmt.setString(24, registro.CENTROCUSTO || '');

            // Data de pagamento
            pStmt.setString(25, registro.DTPAGAMENTO || '');

            // Dados fiscais e valores
            pStmt.setString(26, registro.CNPJFATURAMENTO || '');
            pStmt.setFloat(27, parseFloat(registro.VRSOLICITADO));
            pStmt.setString(28, registro.DESCRICAO || '');
            pStmt.setString(29, registro.POSSUINOTAFISCAL || '');
            pStmt.setString(30, registro.ANEXOORCAMENTO || '');
            pStmt.setString(31, registro.ANEXONOTAFISCAL || '');
            pStmt.setString(32, registro.RAZAOSOCIALFATURAMENTO || '');
            pStmt.setString(33, registro.DSJUSTIFICATIVA || '');

            // Status e usuário
            pStmt.setString(34, statusNovo);
            pStmt.setInt(35, registro.IDUSUARIOALTERACAO);

            // Identificação do registro
            pStmt.setInt(36, registro.IDADIANTAMENTO);

        pStmt.execute();

        fnInserirHistoricoAdiantamento(
            conn,
            registro.IDADIANTAMENTO,
            statusAnterior,
            statusNovo,
            acaoHistorico,
            registro.DSJUSTIFICATIVA || registro.DESCRICAO,
            registro.IDUSUARIOALTERACAO
        );
    }
    pStmtStatus.close();
    pStmt.close();

    conn.commit();

    return {
	    msg : "Atualização realizada com sucesso!"
	};
}

function fnHandlePost() {
    let conn = $.db.getConnection();
    var idAdiantamento = api.executeScalar(' SELECT IFNULL(MAX(TO_INT("IDADIANTAMENTO")),0) + 1 FROM "VAR_DB_NAME"."ADIANTAMENTO_SOLICITACAO" WHERE 1 = ? ', 1);
    
    try {
        let query = ` 
            INSERT INTO "VAR_DB_NAME"."ADIANTAMENTO_SOLICITACAO"
            (
                "IDADIANTAMENTO",
                "DEPARTAMENTO",
                "DATACRIACAO",
                "IDEMPRESA",
                "NUCNPJEMPRESA",
                "RAZAOSOCIALEMPRESA",
                "TPBENEFICIARIO",
                "NUCPFBENEFICIARIO",
                "NOBENEFICIARIO",
                "NURGBENEFICIARIO",
                "EMAILBENEFICIARIO",
                "NUCEPBENEFICIARIO",
                "ENDERECOBENEFICIARIO",
                "TELEFONEBENEFICIARIO",
                "DTNASCIMENTOBENEFICIARIO",
                "TPDESPESA",
                "NOFAVORECIDO",
                "FORMAPAGAMENTO",
                "CHAVEPIX",
                "IDBANCO",
                "NUAGENCIA",
                "NUCONTA",
                "NUDIGITOCONTA",
                "UNIDADENEGOCIO",
                "CENTROCUSTO",
                "DTPAGAMENTO",
                "CNPJFATURAMENTO",
                "VRSOLICITADO",
                "DESCRICAO",
                "POSSUINOTAFISCAL",
                "ANEXOORCAMENTO",
                "ANEXONOTAFISCAL",
                "RAZAOSOCIALFATURAMENTO",
                "DSJUSTIFICATIVA",
                "STATUS",
                "IDUSUARIOCRIACAO"
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, 'AGUARDANDO FINANCEIRO', ?
            )
        `;
                
        let pStmt = conn.prepareStatement(api.replaceDbName(query));
        let bodyJson = JSON.parse($.request.body.asString());

        for(var i = 0; i < bodyJson.length; i++) {
            var registro = bodyJson[i];

        	pStmt.setInt(1, idAdiantamento);
            pStmt.setString(2, registro.DEPARTAMENTO);
            pStmt.setString(3, registro.DATACRIACAO);
            pStmt.setInt(4, registro.IDEMPRESA);
            pStmt.setString(5, registro.NUCNPJEMPRESA);
            pStmt.setString(6, registro.RAZAOSOCIALEMPRESA);

             // Dados do beneficiário
            pStmt.setString(7, registro.TPBENEFICIARIO);
            pStmt.setString(8, registro.NUCPFBENEFICIARIO);
            pStmt.setString(9, registro.NOBENEFICIARIO);
            pStmt.setString(10, registro.NURGBENEFICIARIO);
            pStmt.setString(11, registro.EMAILBENEFICIARIO);
            pStmt.setString(12, registro.NUCEPBENEFICIARIO);
            pStmt.setString(13, registro.ENDERECOBENEFICIARIO);
            pStmt.setString(14, registro.TELEFONEBENEFICIARIO);
            pStmt.setString(15, registro.DTNASCIMENTOBENEFICIARIO);

            // Dados da despesa
            pStmt.setString(16, registro.TPDESPESA);
            pStmt.setString(17, registro.NOFAVORECIDO);
            pStmt.setString(18, registro.FORMAPAGAMENTO);
            pStmt.setString(19, registro.CHAVEPIX);

            if (registro.IDBANCO !== null && registro.IDBANCO !== undefined && registro.IDBANCO !== '') {
                pStmt.setInt(20, parseInt(registro.IDBANCO, 10));
            } else {
                pStmt.setNull(20, $.db.types.INTEGER);
            }
            pStmt.setString(21, registro.NUAGENCIA);
            pStmt.setString(22, registro.NUCONTA);
            pStmt.setString(23, registro.NUDIGITOCONTA);

            // Unidade e centro de custo
            pStmt.setString(24, registro.UNIDADENEGOCIO);
            pStmt.setString(25, registro.CENTROCUSTO);

            // Data de pagamento
            pStmt.setString(26, registro.DTPAGAMENTO);

            // Dados fiscais e valores
            pStmt.setString(
                27,
                registro.CNPJFATURAMENTO || ''
            );
            pStmt.setFloat(28, parseFloat(registro.VRSOLICITADO));
            pStmt.setString(29, registro.DESCRICAO);
            pStmt.setString(30, registro.POSSUINOTAFISCAL);
            pStmt.setString(31, registro.ANEXOORCAMENTO);
            pStmt.setString(32, registro.ANEXONOTAFISCAL);
            pStmt.setString(33, registro.RAZAOSOCIALFATURAMENTO);
            pStmt.setString(34, registro.DSJUSTIFICATIVA);

            // Usuário responsável
            pStmt.setInt(35, registro.IDUSUARIOCRIACAO);
            pStmt.setInt(36, registro.MATRICULASOLICITANTE);
            pStmt.setInt(37, registro.NOMESOLICITANTE);

            pStmt.execute();
            fnInserirHistoricoAdiantamento(
                conn,
                idAdiantamento,
                null,
                'AGUARDANDO FINANCEIRO',
                'INCLUSAO',
                registro.DESCRICAO,
                registro.IDUSUARIOCRIACAO
            );
        }

        pStmt.close();
        conn.commit();
        return {
            msg : "Atualização realizada com sucesso!"
        };
    } catch(e) {
        throw e;
    } 
    
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