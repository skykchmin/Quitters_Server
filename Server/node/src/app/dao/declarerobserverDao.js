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

// 챌린지 인원 확인
async function challengeParticipationCheckNumber(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const challengeParticipationCheckNumberInfoQuery = `
  select ObserverIdx
  from declarerobserver
  where challengeIdx = ? and ObserverStatus = 'F'
  `;
  const challengeParticipationCheckNumberInfoParams = [challengeIdx]
  const [challengeParticipationCheckNumberInfoRows] = await connection.query(
    challengeParticipationCheckNumberInfoQuery,
    challengeParticipationCheckNumberInfoParams
  );
  connection.release();
  return challengeParticipationCheckNumberInfoRows;
}


// 선언자 감시자 삭제
async function patchDeclarerObserverInfo(patchDeclarerObserverInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchDeclarerObserverInfoQuery = `
  update declarerobserver
  set ObserverStatus =
    case
        when ObserverStatus = 'F' then 'N'
        when ObserverStatus = 'N' then 'N'
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

// 감시자 참여중단
async function patchStopDeclarerObserverInfo(patchStopDeclarerObserverInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchStopDeclarerObserverInfoQuery = `
  update declarerobserver
  set ObserverStatus =
    case
        when ObserverStatus = 'F' then 'N'
        when ObserverStatus = 'N' then 'F'
    end
  where challengeIdx = ? and ObserverIdx = ?;
  `;
  const patchStopDeclarerObserverInfoRows = await connection.query(
    patchStopDeclarerObserverInfoQuery,
    patchStopDeclarerObserverInfoParams
  );
  connection.release();
  return patchStopDeclarerObserverInfoRows;
}




module.exports = {
    insertDeclarerObserverInfo,
    patchDeclarerObserverInfo,
    challengeParticipationCheckNumber,
    patchStopDeclarerObserverInfo
};