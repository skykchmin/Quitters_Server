const { pool } = require("../../../config/database");

// 감시자 테이블 입력 
async function insertDeclarerObserverInfo(insertDeclarerObserverInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const insertDeclarerObserverInfoQuery = `
    insert into declarerobserver(challengeIdx, observeridx, observerstatus, createdat, updatedat)
    values (?, ?, 'F', now(), now())
    `;
    const insertDeclarerObserverInfoRows = await connection.query(
      insertDeclarerObserverInfoQuery,
      insertDeclarerObserverInfoParams
    );
    connection.release();
    return insertDeclarerObserverInfoRows;
  }

module.exports = {
    insertDeclarerObserverInfo
};