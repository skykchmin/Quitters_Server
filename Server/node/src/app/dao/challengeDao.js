const { pool } = require("../../../config/database");

// 챌린지 생성
async function insertChallengeInfo(insertChallengeInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertChallengeInfoQuery = `
  insert into challenge(userIdx, challengeStartDate, challengeEndDate, smokingAmount, cigarattePrice, challengeDeclarer, challengeText, noSmokingTime, savingMoney, shareState, challengeCode, challengeCreateTime, challengeUpdateTime)
  values (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, now(), now())
  `;
  const insertChallengeInfoRows = await connection.query(
    insertChallengeInfoQuery,
    insertChallengeInfoParams
  );
  connection.release();
  return insertChallengeInfoRows;
}

// 챌린지 중복 체크
async function challengeCodeCheck(challengeCode) {
    const connection = await pool.getConnection(async (conn) => conn);
    const challengeCodeCheckInfoQuery = `
    select challengeCode
    from challenge
    where challengeCode = ?
    `;
    const challengeCodeCheckInfoParams = [challengeCode]
    const challengeCodeCheckInfoRows = await connection.query(
      challengeCodeCheckInfoQuery,
      challengeCodeCheckInfoParams
    );
    connection.release();
    return challengeCodeCheckInfoRows;
}

// 챌린지 수정
async function patchChallengeInfo(patchChallengeInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeInfoQuery = `
  update challenge
  set challengeStartDate = ? , challengeEndDate = ?, smokingAmount = ?, cigarattePrice = ?, challengeDeclarer = ?, challengeText = ?, challengeUpdateTime = now()
  where challengeIdx = ?
  `;
  
  const patchChallengeInfoRows = await connection.query(
    patchChallengeInfoQuery,
    patchChallengeInfoParams
  );
  connection.release();
  return patchChallengeInfoRows;
}

// 챌린지 삭제
async function deleteChallengeInfo(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deleteChallengeInfoQuery = `
  update challenge
  set challengeStatus = 3
  where challengeIdx = ?
  `;
  
  const deleteChallengeInfoParams = [challengeIdx];
  const deleteChallengeInfoRows = await connection.query(
    deleteChallengeInfoQuery,
    deleteChallengeInfoParams
  );
  connection.release();
  return deleteChallengeInfoRows;
}

// 챌린지 초대코드 확인
async function challengeParticipationCodeCheck(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const challengeParticipationCodeCheckInfoQuery = `
  select challengeCode
  from challenge
  where challengeIdx = ?
  `;
  const challengeParticipationCodeCheckInfoParams = [challengeIdx]
  const challengeParticipationCodeCheckInfoRows = await connection.query(
    challengeParticipationCodeCheckInfoQuery,
    challengeParticipationCodeCheckInfoParams
  );
  connection.release();
  return challengeParticipationCodeCheckInfoRows;
}

module.exports = {
    insertChallengeInfo,
    challengeCodeCheck,
    patchChallengeInfo,
    deleteChallengeInfo,
    challengeParticipationCodeCheck
};