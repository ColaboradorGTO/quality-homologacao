var api = $.import("quality.concentrador.api.apiResponse", "int_api");

function setTimestampOrNull(stmt, fieldId, value) {
	if (!value) {
		stmt.setNull(fieldId);
		return;
	}
	stmt.setTimestamp(fieldId, value);
}

function setDateOrNull(stmt, fieldId, value) {
	if (!value) {
		stmt.setNull(fieldId);
		return;
	}
	stmt.setDate(fieldId, value);
}

function setStringOrNull(stmt, fieldId, value) {
    if (value) {
        stmt.setString(fieldId, String(value));
    } else {
        stmt.setNull(fieldId);
    }
}

function setIntOrNull(stmt, fieldId, value) {
	if (value === undefined || value === null || value === '') {
		stmt.setNull(fieldId);
		return;
	}
	stmt.setInt(fieldId, parseInt(value, 10));
}

function escapeSql(value) {
    return String(value).replace(/'/g, "''");
}

function fnHandleGet(byId) {

    var idEmpresa = $.request.parameters.get("idEmpresa");
    var idProduto = $.request.parameters.get("idProduto");

    var query = `
        SELECT
            IDPRODUTO,
            PRECO_VENDA,
            DTHORAINICIOVIGENCIA,
            DTHORAFIMVIGENCIA,
            IDSUBGRUPOEMPRESARIAL,
            DTULTIMAATUALIZACAO,
            IDEMPRESA
        FROM "VAR_DB_NAME"."PRODUTOPRECOCLUBE"
        WHERE 1 = ?
    `;

    if (idProduto) {
        var ids;
        if (Array.isArray(idProduto)) {
            ids = idProduto.map(function(id) { return "'" + String(id).trim() + "'"; }).join(',');
        } else {
            ids = String(idProduto).split(',').map(function(id) { return "'" + id.trim() + "'"; }).join(',');
        }
        query = query + ' AND tbp.IDPRODUTO IN (' + ids + ') ';
    }

    if (idEmpresa) {
        var ids;
        if (Array.isArray(idEmpresa)) {
            ids = idEmpresa.map(function(id) { return "'" + String(id).trim() + "'"; }).join(',');
        } else {
            ids = String(idEmpresa).split(',').map(function(id) { return "'" + id.trim() + "'"; }).join(',');
        }
        query = query + ' AND tbp.IDEMPRESA IN (' + ids + ') ';
    }

    query += ` ORDER BY DTHORAINICIOVIGENCIA ASC `;

    var request = {
        page:  $.request.parameters.get("page"),
        pageSize:  $.request.parameters.get("pageSize")
    };

    return api.responseWithQuery(query, request, 1);
}

// Atualiza o registro do produto NA MESMA EMPRESA (IDPRODUTO + IDEMPRESA)
function fnHandlePut() {
    var conn = $.db.getConnection();

    try {
        var query = `
            UPDATE "VAR_DB_NAME"."PRODUTOPRECOCLUBE" SET
                "PRECO_VENDA" = ?,
                "DTHORAINICIOVIGENCIA" = ?,
                "DTHORAFIMVIGENCIA" = ?,
                "IDSUBGRUPOEMPRESARIAL" = ?,
                "DTULTIMAATUALIZACAO" = CURRENT_TIMESTAMP
            WHERE "IDPRODUTO" = ? AND "IDEMPRESA" = ?
        `;

        var pStmt = conn.prepareStatement(api.replaceDbName(query));
        var bodyJson = JSON.parse($.request.body.asString());

        pStmt.setBatchSize(bodyJson.length);

        for (var i = 0; i < bodyJson.length; i++) {
            var registro = bodyJson[i];

            pStmt.setFloat(1, registro.PRECO_VENDA);
            setDateOrNull(pStmt, 2, registro.DTHORAINICIOVIGENCIA);
            setDateOrNull(pStmt, 3, registro.DTHORAFIMVIGENCIA);
            setIntOrNull(pStmt, 4, registro.IDSUBGRUPOEMPRESARIAL);
            pStmt.setString(5, String(registro.IDPRODUTO));
            pStmt.setInt(6, parseInt(registro.IDEMPRESA, 10));

            pStmt.addBatch();
        }

        pStmt.executeBatch();
        pStmt.close();
        conn.commit();

        return {
            "type": 'success',
            "msg" : "Atualização realizada com sucesso!",
            "totalRegistros": bodyJson.length
        };

    } catch (error) {
        conn.rollback();
        throw error;
    } finally {
        conn.close();
    }
}

// Insere os produtos que ainda não existem para a empresa (IDPRODUTO vem do Excel)
function fnHandlePost() {
    var conn = $.db.getConnection();

    try {
        var query = `
            INSERT INTO "VAR_DB_NAME"."PRODUTOPRECOCLUBE"
            (
                "IDPRODUTO",
                "PRECO_VENDA",
                "DTHORAINICIOVIGENCIA",
                "DTHORAFIMVIGENCIA",
                "IDSUBGRUPOEMPRESARIAL",
                "IDEMPRESA",
                "DTULTIMAATUALIZACAO"
            )
            VALUES(?,?,?,?,?,?, CURRENT_TIMESTAMP)
        `;

        var pStmt = conn.prepareStatement(api.replaceDbName(query));
        var bodyJson = JSON.parse($.request.body.asString());

        pStmt.setBatchSize(bodyJson.length);

        for (var i = 0; i < bodyJson.length; i++) {
            var registro = bodyJson[i];

            pStmt.setString(1, String(registro.IDPRODUTO));
            pStmt.setFloat(2, registro.PRECO_VENDA);
            setDateOrNull(pStmt, 3, registro.DTHORAINICIOVIGENCIA);
            setDateOrNull(pStmt, 4, registro.DTHORAFIMVIGENCIA);
            setIntOrNull(pStmt, 5, registro.IDSUBGRUPOEMPRESARIAL);
            pStmt.setInt(6, parseInt(registro.IDEMPRESA, 10));

            pStmt.addBatch();
        }

        pStmt.executeBatch();
        pStmt.close();
        conn.commit();

        return {
            "type": 'success',
            "msg" : "Cadastro realizado com sucesso!",
            "totalRegistros": bodyJson.length
        };

    } catch (error) {
        conn.rollback();
        throw error;
    } finally {
        conn.close();
    }
}

$.response.contentType = 'application/json';
$.response.status = $.net.http.OK;

try {
    switch ( $.request.method ) {
        case $.net.http.PUT:
            var docReturn = fnHandlePut();
            $.response.setBody(JSON.stringify(docReturn));
            break;

        case $.net.http.GET:
            var id = $.request.parameters.get("id");
            var retornoGet = fnHandleGet(id);
            // responseWithQuery normalmente já escreve o body; só sobrescreve se retornar algo
            if (retornoGet !== undefined) {
                $.response.setBody(JSON.stringify(retornoGet));
            }
            break;

        case $.net.http.POST:
            var doc = fnHandlePost();
            $.response.setBody(JSON.stringify(doc));
            break;

        default:
            break;
    }

} catch(e) {
    $.response.contentType = 'application/json';
    $.response.setBody(JSON.stringify({ message : e.toString() }));
    $.response.status = 400;
}
