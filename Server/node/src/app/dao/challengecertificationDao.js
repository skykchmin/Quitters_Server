const { pool } = require("../../../config/database");

// 최초 실행 - 챌린지 참여
async function insertChallengeCertificationInfo(insertChallengeCertificationInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const insertChallengeCertificationInfoInfoQuery = `
    insert into challengecertification(challengeIdx, observerIdx, challengeCertificationStatus, challengeCertificationTime, challengeProgressTime, createdAt, updatedAt)
    values (?, ?, 0, now(), 0, now(), now())
    `;
    
    const insertChallengeCertificationInfoInfoRows = await connection.query(
      insertChallengeCertificationInfoInfoQuery,
      insertChallengeCertificationInfoParams
    );
    connection.release();
    return insertChallengeCertificationInfoInfoRows;
  }

// 선언자 - 감시자에서 챌린지 번호, 감시자 번호 뽑아내기 
async function getChallengeDeclarerObserverInfo(getChallengeDeclarerObserverInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeDeclarerObserverInfoInfoQuery = `
  select challenge.challengeIdx as challengeIdx, d.ObserverIdx as observerIdx
  from challenge
  inner join declarerobserver d on challenge.challengeIdx = d.challengeIdx
  where challenge.challengeStatus = '0' and d.ObserverStatus ='F';
  `;
  
  const getChallengeDeclarerObserverInfoInfoRows = await connection.query(
    getChallengeDeclarerObserverInfoInfoQuery,
    getChallengeDeclarerObserverInfoParams
  );
  connection.release();
  return getChallengeDeclarerObserverInfoInfoRows;
}

// 업데이트 실행
async function updateChallengeCertificationInfo(updateChallengeCertificationInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const updateChallengeCertificationInfoQuery = `
  insert into challengecertification(challengeIdx, observerIdx, challengeCertificationStatus, challengeCertificationTime, challengeProgressTime, createdAt, updatedAt)
  values (?, ?, 0, now(), 0, now(), now())
  `;
  
  const updateChallengeCertificationInfoRows = await connection.query(
    updateChallengeCertificationInfoQuery,
    updateChallengeCertificationInfoParams
  );
  connection.release();
  return updateChallengeCertificationInfoRows;
}

// 챌린지 인증목록 상단 챌린지 내용 확인
async function getChallengeCheckListContentInfo(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeCheckListContentInfoQuery = `
  select challengeDeclarer, challengeText
  from challenge
  where challengeIdx = ?;
  `;
  
  const getChallengeCheckListContentInfoParams = [challengeIdx]
  const [getChallengeCheckListContentInfoRows] = await connection.query(
    getChallengeCheckListContentInfoQuery,
    getChallengeCheckListContentInfoParams
  );
  connection.release();
  return getChallengeCheckListContentInfoRows;
}

// 0시 ~ 4시 인증 목록
async function getChallengeCertification_0Info(getChallengeCertification_0InfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeCertification_0InfoQuery = `
  select userProfilePicture, userNickName, c.challengeCertificationTime, c.challengeCertificationStatus
from declarerobserver
inner join challengecertification c on declarerobserver.ObserverIdx = c.observerIdx
inner join user on user.userIdx = declarerobserver.ObserverIdx
where declarerobserver.challengeIdx = ? and declarerobserver.ObserverStatus = 'F'
    and c.createdAt between concat(curdate(), ' 00:00:00') and concat(curdate(), ' 03:59:59');
  `;
  
  const getChallengeCertification_0InfoRows = await connection.query(
    getChallengeCertification_0InfoQuery,
    getChallengeCertification_0InfoParams
  );
  connection.release();
  return getChallengeCertification_0InfoRows;
}

// 4시 ~ 8시 인증 목록
async function getChallengeCertification_4Info(getChallengeCertification_4InfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeCertification_4InfoQuery = `
  select userProfilePicture, userNickName, c.challengeCertificationTime, c.challengeCertificationStatus
  from declarerobserver
  inner join challengecertification c on declarerobserver.ObserverIdx = c.observerIdx
  inner join user on user.userIdx = declarerobserver.ObserverIdx
  where declarerobserver.challengeIdx = ? and declarerobserver.ObserverStatus = 'F'
    and c.createdAt between concat(curdate(), ' 04:00:00') and concat(curdate(), ' 07:59:59');
  `;
  
  const getChallengeCertification_4InfoRows = await connection.query(
    getChallengeCertification_4InfoQuery,
    getChallengeCertification_4InfoParams
  );
  connection.release();
  return getChallengeCertification_4InfoRows;
}

// 8시 ~ 12시 인증 목록
async function getChallengeCertification_8Info(getChallengeCertification_8InfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeCertification_8InfoQuery = `
  select userProfilePicture, userNickName, c.challengeCertificationTime, c.challengeCertificationStatus
  from declarerobserver
  inner join challengecertification c on declarerobserver.ObserverIdx = c.observerIdx
  inner join user on user.userIdx = declarerobserver.ObserverIdx
  where declarerobserver.challengeIdx = ? and declarerobserver.ObserverStatus = 'F'
    and c.createdAt between concat(curdate(), ' 08:00:00') and concat(curdate(), ' 11:59:59');
  `;
  
  const getChallengeCertification_8InfoRows = await connection.query(
    getChallengeCertification_8InfoQuery,
    getChallengeCertification_8InfoParams
  );
  connection.release();
  return getChallengeCertification_8InfoRows;
}

// 12시 ~ 16시 인증 목록
async function getChallengeCertification_12Info(getChallengeCertification_12InfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeCertification_12InfoQuery = `
  select userProfilePicture, userNickName, c.challengeCertificationTime, c.challengeCertificationStatus
  from declarerobserver
  inner join challengecertification c on declarerobserver.ObserverIdx = c.observerIdx
  inner join user on user.userIdx = declarerobserver.ObserverIdx
  where declarerobserver.challengeIdx = ? and declarerobserver.ObserverStatus = 'F'
    and c.createdAt between concat(curdate(), ' 12:00:00') and concat(curdate(), ' 15:59:59');
  `;
  
  const getChallengeCertification_12InfoRows = await connection.query(
    getChallengeCertification_12InfoQuery,
    getChallengeCertification_12InfoParams
  );
  connection.release();
  return getChallengeCertification_12InfoRows;
}

// 16시 ~ 20시 인증 목록
async function getChallengeCertification_16Info(getChallengeCertification_16InfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeCertification_16InfoQuery = `
  select userProfilePicture, userNickName, c.challengeCertificationTime, c.challengeCertificationStatus
  from declarerobserver
  inner join challengecertification c on declarerobserver.ObserverIdx = c.observerIdx
  inner join user on user.userIdx = declarerobserver.ObserverIdx
  where declarerobserver.challengeIdx = ? and declarerobserver.ObserverStatus = 'F'
    and c.createdAt between concat(curdate(), ' 16:00:00') and concat(curdate(), ' 19:59:59');
  `;
  
  const getChallengeCertification_16InfoRows = await connection.query(
    getChallengeCertification_16InfoQuery,
    getChallengeCertification_16InfoParams
  );
  connection.release();
  return getChallengeCertification_16InfoRows;
}

// 20시 ~ 24시 인증 목록
async function getChallengeCertification_20Info(getChallengeCertification_20InfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeCertification_20InfoQuery = `
  select userProfilePicture, userNickName, c.challengeCertificationTime, c.challengeCertificationStatus
  from declarerobserver
  inner join challengecertification c on declarerobserver.ObserverIdx = c.observerIdx
  inner join user on user.userIdx = declarerobserver.ObserverIdx
  where declarerobserver.challengeIdx = ? and declarerobserver.ObserverStatus = 'F'
    and c.createdAt between concat(curdate(), ' 20:00:00') and concat(curdate(), ' 23:59:59');
  `;
  
  const getChallengeCertification_20InfoRows = await connection.query(
    getChallengeCertification_20InfoQuery,
    getChallengeCertification_20InfoParams
  );
  connection.release();
  return getChallengeCertification_20InfoRows;
}

// 챌린지 중간 인증 상태 0~4시
async function getChallengeIntermediateCertification_0Info(getChallengeIntermediateCertification_0InfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeIntermediateCertification_0InfoQuery = `
  select challengeIntermediateCertificationStatus
  from challengeintermediatecertification
  where challengeIdx = ? and createdAt between concat(curdate(), ' 00:00:00') and concat(curdate(), ' 03:59:59');
  `;
  
  const [getChallengeIntermediateCertification_0InfoRows] = await connection.query(
    getChallengeIntermediateCertification_0InfoQuery,
    getChallengeIntermediateCertification_0InfoParams
  );
  connection.release();
  return getChallengeIntermediateCertification_0InfoRows;
}

// 챌린지 중간 인증 상태 4~8시
async function getChallengeIntermediateCertification_4Info(getChallengeIntermediateCertification_4InfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeIntermediateCertification_4InfoQuery = `
  select challengeIntermediateCertificationStatus
  from challengeintermediatecertification
  where challengeIdx = ? and createdAt between concat(curdate(), ' 04:00:00') and concat(curdate(), ' 07:59:59');
  `;
  
  const [getChallengeIntermediateCertification_4InfoRows] = await connection.query(
    getChallengeIntermediateCertification_4InfoQuery,
    getChallengeIntermediateCertification_4InfoParams
  );
  connection.release();
  return getChallengeIntermediateCertification_4InfoRows;
}

// 챌린지 중간 인증 상태 8~12시
async function getChallengeIntermediateCertification_8Info(getChallengeIntermediateCertification_8InfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeIntermediateCertification_8InfoQuery = `
  select challengeIntermediateCertificationStatus
  from challengeintermediatecertification
  where challengeIdx = ? and createdAt between concat(curdate(), ' 08:00:00') and concat(curdate(), ' 11:59:59');
  `;
  
  const [getChallengeIntermediateCertification_8InfoRows] = await connection.query(
    getChallengeIntermediateCertification_8InfoQuery,
    getChallengeIntermediateCertification_8InfoParams
  );
  connection.release();
  return getChallengeIntermediateCertification_8InfoRows;
}

// 챌린지 중간 인증 상태 12~16시
async function getChallengeIntermediateCertification_12Info(getChallengeIntermediateCertification_12InfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeIntermediateCertification_12InfoQuery = `
  select challengeIntermediateCertificationStatus
  from challengeintermediatecertification
  where challengeIdx = ? and createdAt between concat(curdate(), ' 12:00:00') and concat(curdate(), ' 15:59:59');
  `;
  
  const [getChallengeIntermediateCertification_12InfoRows] = await connection.query(
    getChallengeIntermediateCertification_12InfoQuery,
    getChallengeIntermediateCertification_12InfoParams
  );
  connection.release();
  return getChallengeIntermediateCertification_12InfoRows;
}

// 챌린지 중간 인증 상태 16~20시
async function getChallengeIntermediateCertification_16Info(getChallengeIntermediateCertification_16InfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeIntermediateCertification_16InfoQuery = `
  select challengeIntermediateCertificationStatus
  from challengeintermediatecertification
  where challengeIdx = ? and createdAt between concat(curdate(), ' 16:00:00') and concat(curdate(), ' 19:59:59');
  `;
  
  const [getChallengeIntermediateCertification_16InfoRows] = await connection.query(
    getChallengeIntermediateCertification_16InfoQuery,
    getChallengeIntermediateCertification_16InfoParams
  );
  connection.release();
  return getChallengeIntermediateCertification_16InfoRows;
}

// 챌린지 중간 인증 상태 20~24시
async function getChallengeIntermediateCertification_20Info(getChallengeIntermediateCertification_20InfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeIntermediateCertification_20InfoQuery = `
  select challengeIntermediateCertificationStatus
  from challengeintermediatecertification
  where challengeIdx = ? and createdAt between concat(curdate(), ' 20:00:00') and concat(curdate(), ' 23:59:59');
  `;
  
  const [getChallengeIntermediateCertification_20InfoRows] = await connection.query(
    getChallengeIntermediateCertification_20InfoQuery,
    getChallengeIntermediateCertification_20InfoParams
  );
  connection.release();
  return getChallengeIntermediateCertification_20InfoRows;
}


// 성공 즉시 실행
async function patchChallengeIntermediateCertificationSuccessInfo(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationInfoInfoQuery = `
  update challengeintermediatecertification
  set ChallengeIntermediateCertificationStatus = '1'
  where challengeIdx = ?;
  `;
  
  const patchChallengeIntermediateCertificationInfoParams = [challengeIdx];
  const patchChallengeIntermediateCertificationInfoInfoRows = await connection.query(
    patchChallengeIntermediateCertificationInfoInfoQuery,
    patchChallengeIntermediateCertificationInfoParams
  );
  connection.release();
  return patchChallengeIntermediateCertificationInfoInfoRows;
}



// 선언자 - 감시자에서 챌린지 번호, 감시자 번호 뽑아내기 - 테스트용
// async function getChallengeDeclarerObserverInfo(getChallengeDeclarerObserverInfoParams) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const getChallengeDeclarerObserverInfoInfoQuery = `
//   select challenge.challengeIdx as challengeIdx, d.ObserverIdx as observerIdx
//   from challenge
//   inner join declarerobserver d on challenge.challengeIdx = d.challengeIdx
//   where challenge.challengeStatus = '0' and d.ObserverStatus ='F' and d.challengeIdx = ?;
//   `;
  
//   const getChallengeDeclarerObserverInfoInfoRows = await connection.query(
//     getChallengeDeclarerObserverInfoInfoQuery,
//     getChallengeDeclarerObserverInfoParams
//   );
//   connection.release();
//   return getChallengeDeclarerObserverInfoInfoRows;
// }



module.exports = {
    insertChallengeCertificationInfo,
    getChallengeDeclarerObserverInfo,
    updateChallengeCertificationInfo,
    getChallengeCheckListContentInfo,
    getChallengeCertification_0Info,
    getChallengeCertification_4Info,
    getChallengeCertification_8Info,
    getChallengeCertification_12Info,
    getChallengeCertification_16Info,
    getChallengeCertification_20Info,
    getChallengeIntermediateCertification_0Info,
    getChallengeIntermediateCertification_4Info,
    getChallengeIntermediateCertification_8Info,
    getChallengeIntermediateCertification_12Info,
    getChallengeIntermediateCertification_16Info,
    getChallengeIntermediateCertification_20Info,
    patchChallengeIntermediateCertificationSuccessInfo
};