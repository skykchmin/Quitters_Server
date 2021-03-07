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

// 감시자 삭제
async function patchDeclarerObserverInfo(patchDeclarerObserverInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchDeclarerObserverInfoQuery = `
  update declarerobserver
  set ObserverStatus =
    case
        when ObserverStatus = 'F' then 'N'
        when ObserverStatus = 'N' then 'F'
    end
  where challengeIdx = ? and ObserverIdx = ?;
  `;
  const patchDeclarerObserverInfoRows = await connection.query(
    patchDeclarerObserverInfoQuery,
    patchDeclarerObserverInfoParams
  );
  connection.release();
  return patchDeclarerObserverInfoRows;
}


module.exports = {
    insertDeclarerObserverInfo,
    patchDeclarerObserverInfo
};