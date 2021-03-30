const { pool } = require("../../../config/database");

// 최초 실행 - 챌린지 참여
async function insertChallengeCertificationInfo(insertChallengeCertificationInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const insertChallengeCertificationInfoQuery = `
    insert into challengecertification(challengeIdx, observerIdx, challengeCertificationStatus, challengeCertificationTime, challengeProgressTime, createdAt, updatedAt)
    values (?, ?, 0, now(), 0, now(), now())
    `;
    
    const insertChallengeCertificationInfoRows = await connection.query(
      insertChallengeCertificationInfoQuery,
      insertChallengeCertificationInfoParams
    );
    connection.release();
    return insertChallengeCertificationInfoRows;
  }



// 선언자 - 감시자에서 챌린지 번호, 감시자 번호 뽑아내기 
async function getChallengeDeclarerObserverInfo(getChallengeDeclarerObserverInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeDeclarerObserverInfoQuery = `
  select challenge.challengeIdx as challengeIdx, d.ObserverIdx as observerIdxt
  from challenge
  inner join declarerobserver d on challenge.challengeIdx = d.challengeIdx
  where challenge.challengeStatus = '0' and d.ObserverStatus ='F';
  `;
  
  const getChallengeDeclarerObserverInfoRows = await connection.query(
    getChallengeDeclarerObserverInfoQuery,
    getChallengeDeclarerObserverInfoParams
  );
  connection.release();
  return getChallengeDeclarerObserverInfoRows;
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
  const getChallengeCheckListContentInfoRows = await connection.query(
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
  select userNickName, userProfilePicture, declarerObserver.challengeCertificationStatus, declarerObserver.challengeCertificationTime, declarerObserver.observerIdx
  from user
  inner join (select distinct c.observerIdx, c.challengeCertificationStatus, c.challengeIdx, c.createdAt, c.challengeCertificationTime
  from declarerobserver
  inner join challengecertification c on declarerobserver.challengeIdx = c.challengeIdx
  where declarerobserver.challengeIdx = ? and declarerobserver.ObserverStatus = 'F'
    and c.createdAt between concat(curdate(), ' 00:00:00') and concat(curdate(), ' 03:59:59')) as declarerObserver on userIdx = declarerObserver.observerIdx
  order by field(challengeCertificationStatus, '3', '1', '2', '0');
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
  select userNickName, userProfilePicture, declarerObserver.challengeCertificationStatus, declarerObserver.challengeCertificationTime, declarerObserver.observerIdx
  from user
  inner join (select distinct c.observerIdx, c.challengeCertificationStatus, c.challengeIdx, c.createdAt, c.challengeCertificationTime
  from declarerobserver
  inner join challengecertification c on declarerobserver.challengeIdx = c.challengeIdx
  where declarerobserver.challengeIdx = ? and declarerobserver.ObserverStatus = 'F'
    and c.createdAt between concat(curdate(), ' 04:00:00') and concat(curdate(), ' 07:59:59')) as declarerObserver on userIdx = declarerObserver.observerIdx
  order by field(challengeCertificationStatus, '3', '1', '2', '0');
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
  select userNickName, userProfilePicture, declarerObserver.challengeCertificationStatus, declarerObserver.challengeCertificationTime, declarerObserver.observerIdx
  from user
  inner join (select distinct c.observerIdx, c.challengeCertificationStatus, c.challengeIdx, c.createdAt, c.challengeCertificationTime
  from declarerobserver
  inner join challengecertification c on declarerobserver.challengeIdx = c.challengeIdx
  where declarerobserver.challengeIdx = ? and declarerobserver.ObserverStatus = 'F'
    and c.createdAt between concat(curdate(), ' 08:00:00') and concat(curdate(), ' 11:59:59')) as declarerObserver on userIdx = declarerObserver.observerIdx
  order by field(challengeCertificationStatus, '3', '1', '2', '0');
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
  select userNickName, userProfilePicture, declarerObserver.challengeCertificationStatus, declarerObserver.challengeCertificationTime, declarerObserver.observerIdx
  from user
  inner join (select distinct c.observerIdx, c.challengeCertificationStatus, c.challengeIdx, c.createdAt, c.challengeCertificationTime
  from declarerobserver
  inner join challengecertification c on declarerobserver.challengeIdx = c.challengeIdx
  where declarerobserver.challengeIdx = ? and declarerobserver.ObserverStatus = 'F'
    and c.createdAt between concat(curdate(), ' 12:00:00') and concat(curdate(), ' 15:59:59')) as declarerObserver on userIdx = declarerObserver.observerIdx
  order by field(challengeCertificationStatus, '3', '1', '2', '0');
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
  select userNickName, userProfilePicture, declarerObserver.challengeCertificationStatus, declarerObserver.challengeCertificationTime, declarerObserver.observerIdx
  from user
  inner join (select distinct c.observerIdx, c.challengeCertificationStatus, c.challengeIdx, c.createdAt, c.challengeCertificationTime
  from declarerobserver
  inner join challengecertification c on declarerobserver.challengeIdx = c.challengeIdx
  where declarerobserver.challengeIdx = ? and declarerobserver.ObserverStatus = 'F'
    and c.createdAt between concat(curdate(), ' 16:00:00') and concat(curdate(), ' 19:59:59')) as declarerObserver on userIdx = declarerObserver.observerIdx
  order by field(challengeCertificationStatus, '3', '1', '2', '0');
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
  select userNickName, userProfilePicture, declarerObserver.challengeCertificationStatus, declarerObserver.challengeCertificationTime, declarerObserver.observerIdx
  from user
  inner join (select distinct c.observerIdx, c.challengeCertificationStatus, c.challengeIdx, c.createdAt, c.challengeCertificationTime
  from declarerobserver
  inner join challengecertification c on declarerobserver.challengeIdx = c.challengeIdx
  where declarerobserver.challengeIdx = ? and declarerobserver.ObserverStatus = 'F'
    and c.createdAt between concat(curdate(), ' 20:00:00') and concat(curdate(), ' 23:59:59')) as declarerObserver on userIdx = declarerObserver.observerIdx
  order by field(challengeCertificationStatus, '3', '1', '2', '0');
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
  
  const getChallengeIntermediateCertification_0InfoRows = await connection.query(
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
  
  const getChallengeIntermediateCertification_4InfoRows = await connection.query(
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
  
  const getChallengeIntermediateCertification_8InfoRows = await connection.query(
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
  
  const getChallengeIntermediateCertification_12InfoRows = await connection.query(
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
  
  const getChallengeIntermediateCertification_16InfoRows = await connection.query(
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
  
  const getChallengeIntermediateCertification_20InfoRows = await connection.query(
    getChallengeIntermediateCertification_20InfoQuery,
    getChallengeIntermediateCertification_20InfoParams
  );
  connection.release();
  return getChallengeIntermediateCertification_20InfoRows;
}

// 어제날짜부터 업데이트를 해야한다!!
// 20~24시 중간 인증 자동전환 - 성공
async function patchChallengeIntermediateCertificationSuccessInfo_20(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationInfoQuery_20 = `
  update challengeintermediatecertification ci
  set ChallengeIntermediateCertificationStatus = '1'
  where challengeIdx = ? and ci.createdAt between concat(curdate() - interval 1 day , ' 20:00:00') and concat(curdate() - interval 1 day , ' 23:59:59');
  `;
  
  const patchChallengeIntermediateCertificationInfoParams_20 = [challengeIdx];
  const patchChallengeIntermediateCertificationInfoRows_20 = await connection.query(
    patchChallengeIntermediateCertificationInfoQuery_20,
    patchChallengeIntermediateCertificationInfoParams_20
  );
  connection.release();
  return patchChallengeIntermediateCertificationInfoRows_20;
}


// 0~4시 중간 인증 자동전환 - 성공
async function patchChallengeIntermediateCertificationSuccessInfo_0(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationInfoQuery_0 = `
  update challengeintermediatecertification ci
  set ChallengeIntermediateCertificationStatus = '1'
  where challengeIdx = ? and ci.createdAt between concat(curdate(), ' 00:00:00') and concat(curdate(), ' 03:59:59');
  `;
  
  const patchChallengeIntermediateCertificationInfoParams_0 = [challengeIdx];
  const patchChallengeIntermediateCertificationInfoRows_0 = await connection.query(
    patchChallengeIntermediateCertificationInfoQuery_0,
    patchChallengeIntermediateCertificationInfoParams_0
  );
  connection.release();
  return patchChallengeIntermediateCertificationInfoRows_0;
}

// 4~8시 중간 인증 자동전환 - 성공
async function patchChallengeIntermediateCertificationSuccessInfo_4(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationInfoQuery_4 = `
  update challengeintermediatecertification ci
  set ChallengeIntermediateCertificationStatus = '1'
  where challengeIdx = ? and ci.createdAt between concat(curdate(), ' 04:00:00') and concat(curdate(), ' 07:59:59');
  `;
  
  const patchChallengeIntermediateCertificationInfoParams_4 = [challengeIdx];
  const patchChallengeIntermediateCertificationInfoRows_4 = await connection.query(
    patchChallengeIntermediateCertificationInfoQuery_4,
    patchChallengeIntermediateCertificationInfoParams_4
  );
  connection.release();
  return patchChallengeIntermediateCertificationInfoRows_4;
}

// 8~12시 중간 인증 자동전환 - 성공
async function patchChallengeIntermediateCertificationSuccessInfo_8(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationInfoQuery_8 = `
  update challengeintermediatecertification ci
  set ChallengeIntermediateCertificationStatus = '1'
  where challengeIdx = ? and ci.createdAt between concat(curdate(), ' 08:00:00') and concat(curdate(), ' 11:59:59');
  `;
  
  const patchChallengeIntermediateCertificationInfoParams_8 = [challengeIdx];
  const patchChallengeIntermediateCertificationInfoRows_8 = await connection.query(
    patchChallengeIntermediateCertificationInfoQuery_8,
    patchChallengeIntermediateCertificationInfoParams_8
  );
  connection.release();
  return patchChallengeIntermediateCertificationInfoRows_8;
}

// 12~16시 중간 인증 자동전환 - 성공
async function patchChallengeIntermediateCertificationSuccessInfo_12(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationInfoQuery_12 = `
  update challengeintermediatecertification ci
  set ChallengeIntermediateCertificationStatus = '1'
  where challengeIdx = ? and ci.createdAt between concat(curdate(), ' 12:00:00') and concat(curdate(), ' 15:59:59');
  `;
  
  const patchChallengeIntermediateCertificationInfoParams_12 = [challengeIdx];
  const patchChallengeIntermediateCertificationInfoRows_12 = await connection.query(
    patchChallengeIntermediateCertificationInfoQuery_12,
    patchChallengeIntermediateCertificationInfoParams_12
  );
  connection.release();
  return patchChallengeIntermediateCertificationInfoRows_12;
}

// 16~20시 중간 인증 자동전환 - 성공
async function patchChallengeIntermediateCertificationSuccessInfo_16(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationInfoQuery_16 = `
  update challengeintermediatecertification ci
  set ChallengeIntermediateCertificationStatus = '1'
  where challengeIdx = ? and ci.createdAt between concat(curdate(), ' 16:00:00') and concat(curdate(), ' 19:59:59');
  `;
  
  const patchChallengeIntermediateCertificationInfoParams_16 = [challengeIdx];
  const patchChallengeIntermediateCertificationInfoRows_16 = await connection.query(
    patchChallengeIntermediateCertificationInfoQuery_16,
    patchChallengeIntermediateCertificationInfoParams_16
  );
  connection.release();
  return patchChallengeIntermediateCertificationInfoRows_16;
}


/// 0~4시 사용자 입력에 따른 인증
async function patchChallengeCertificationInfo_0(patchChallengeCertificationInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeCertificationInfoQuery_0 = `
  update challengecertification
  set challengeCertificationStatus = ?
  where challengeIdx = ? and observerIdx = ? and createdAt between concat(curdate(), ' 00:00:00') and concat(curdate(), ' 03:59:59');
  `;
  
  const patchChallengeCertificationInfoRows_0 = await connection.query(
    patchChallengeCertificationInfoQuery_0,
    patchChallengeCertificationInfoParams
  );
  connection.release();
  return patchChallengeCertificationInfoRows_0;
}

/// 4~8시 사용자 입력에 따른 인증
async function patchChallengeCertificationInfo_4(patchChallengeCertificationInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeCertificationInfoQuery_4 = `
  update challengecertification
  set challengeCertificationStatus = ?
  where challengeIdx = ? and observerIdx = ? and createdAt between concat(curdate(), ' 04:00:00') and concat(curdate(), ' 07:59:59');
  `;
  
  const patchChallengeCertificationInfoRows_4 = await connection.query(
    patchChallengeCertificationInfoQuery_4,
    patchChallengeCertificationInfoParams
  );
  connection.release();
  return patchChallengeCertificationInfoRows_4;
}

/// 8~12시 사용자 입력에 따른 인증
async function patchChallengeCertificationInfo_8(patchChallengeCertificationInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeCertificationInfoQuery_8 = `
  update challengecertification
  set challengeCertificationStatus = ?
  where challengeIdx = ? and observerIdx = ? and createdAt between concat(curdate(), ' 08:00:00') and concat(curdate(), ' 11:59:59');
  `;
  
  const patchChallengeCertificationInfoRows_8 = await connection.query(
    patchChallengeCertificationInfoQuery_8,
    patchChallengeCertificationInfoParams
  );
  connection.release();
  return patchChallengeCertificationInfoRows_8;
}

/// 12~16시 사용자 입력에 따른 인증
async function patchChallengeCertificationInfo_12(patchChallengeCertificationInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeCertificationInfoQuery_12 = `
  update challengecertification
  set challengeCertificationStatus = ?
  where challengeIdx = ? and observerIdx = ? and createdAt between concat(curdate(), ' 12:00:00') and concat(curdate(), ' 15:59:59');
  `;
  
  const patchChallengeCertificationInfoRows_12 = await connection.query(
    patchChallengeCertificationInfoQuery_12,
    patchChallengeCertificationInfoParams
  );
  connection.release();
  return patchChallengeCertificationInfoRows_12;
}

/// 16~20시 사용자 입력에 따른 인증
async function patchChallengeCertificationInfo_16(patchChallengeCertificationInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeCertificationInfoQuery_16 = `
  update challengecertification
  set challengeCertificationStatus = ?
  where challengeIdx = ? and observerIdx = ? and createdAt between concat(curdate(), ' 16:00:00') and concat(curdate(), ' 19:59:59');
  `;
  
  const patchChallengeCertificationInfoRows_16 = await connection.query(
    patchChallengeCertificationInfoQuery_16,
    patchChallengeCertificationInfoParams
  );
  connection.release();
  return patchChallengeCertificationInfoRows_16;
}

/// 20~24시 사용자 입력에 따른 인증
async function patchChallengeCertificationInfo_20(patchChallengeCertificationInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeCertificationInfoQuery_20 = `
  update challengecertification
  set challengeCertificationStatus = ?
  where challengeIdx = ? and observerIdx = ? and createdAt between concat(curdate(), ' 20:00:00') and concat(curdate(), ' 23:59:59');
  `;
  
  const patchChallengeCertificationInfoRows_20 = await connection.query(
    patchChallengeCertificationInfoQuery_20,
    patchChallengeCertificationInfoParams
  );
  connection.release();
  return patchChallengeCertificationInfoRows_20;
}



// 0~4시 챌린지 중간 인증 실패 전환
async function patchChallengeIntermediateCertificationFailInfo_0(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationFailInfoQuery_0 = `
  update challengeintermediatecertification ci
  set ChallengeIntermediateCertificationStatus = '2'
  where challengeIdx = ? and ci.createdAt between concat(curdate(), ' 00:00:00') and concat(curdate(), ' 03:59:59');
  `;
  
  const patchChallengeIntermediateCertificationFailInfoParams_0 = [challengeIdx];
  const patchChallengeIntermediateCertificationFailInfoRows_0 = await connection.query(
    patchChallengeIntermediateCertificationFailInfoQuery_0,
    patchChallengeIntermediateCertificationFailInfoParams_0
  );
  connection.release();
  return patchChallengeIntermediateCertificationFailInfoRows_0;
}

// 0~4시 챌린지 중간 인증 실패 전환
async function patchChallengeIntermediateCertificationFailInfo_0(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationFailInfoQuery_0 = `
  update challengeintermediatecertification ci
  set ChallengeIntermediateCertificationStatus = '2'
  where challengeIdx = ? and ci.createdAt between concat(curdate(), ' 00:00:00') and concat(curdate(), ' 03:59:59');
  `;
  
  const patchChallengeIntermediateCertificationFailInfoParams_0 = [challengeIdx];
  const patchChallengeIntermediateCertificationFailInfoRows_0 = await connection.query(
    patchChallengeIntermediateCertificationFailInfoQuery_0,
    patchChallengeIntermediateCertificationFailInfoParams_0
  );
  connection.release();
  return patchChallengeIntermediateCertificationFailInfoRows_0;
}

// 4~8시 챌린지 중간 인증 실패 전환
async function patchChallengeIntermediateCertificationFailInfo_4(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationFailInfoQuery_4 = `
  update challengeintermediatecertification ci
  set ChallengeIntermediateCertificationStatus = '2'
  where challengeIdx = ? and ci.createdAt between concat(curdate(), ' 04:00:00') and concat(curdate(), ' 07:59:59');
  `;
  
  const patchChallengeIntermediateCertificationFailInfoParams_4 = [challengeIdx];
  const patchChallengeIntermediateCertificationFailInfoRows_4 = await connection.query(
    patchChallengeIntermediateCertificationFailInfoQuery_4,
    patchChallengeIntermediateCertificationFailInfoParams_4
  );
  connection.release();
  return patchChallengeIntermediateCertificationFailInfoRows_4;
}

// 8~12시 챌린지 중간 인증 실패 전환
async function patchChallengeIntermediateCertificationFailInfo_8(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationFailInfoQuery_8 = `
  update challengeintermediatecertification ci
  set ChallengeIntermediateCertificationStatus = '2'
  where challengeIdx = ? and ci.createdAt between concat(curdate(), ' 08:00:00') and concat(curdate(), ' 11:59:59');
  `;
  
  const patchChallengeIntermediateCertificationFailInfoParams_8 = [challengeIdx];
  const patchChallengeIntermediateCertificationFailInfoRows_8 = await connection.query(
    patchChallengeIntermediateCertificationFailInfoQuery_8,
    patchChallengeIntermediateCertificationFailInfoParams_8
  );
  connection.release();
  return patchChallengeIntermediateCertificationFailInfoRows_8;
}

// 12~16시 챌린지 중간 인증 실패 전환
async function patchChallengeIntermediateCertificationFailInfo_12(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationFailInfoQuery_12 = `
  update challengeintermediatecertification ci
  set ChallengeIntermediateCertificationStatus = '2'
  where challengeIdx = ? and ci.createdAt between concat(curdate(), ' 12:00:00') and concat(curdate(), ' 15:59:59');
  `;
  
  const patchChallengeIntermediateCertificationFailInfoParams_12 = [challengeIdx];
  const patchChallengeIntermediateCertificationFailInfoRows_12 = await connection.query(
    patchChallengeIntermediateCertificationFailInfoQuery_12,
    patchChallengeIntermediateCertificationFailInfoParams_12
  );
  connection.release();
  return patchChallengeIntermediateCertificationFailInfoRows_12;
}

// 16~20시 챌린지 중간 인증 실패 전환
async function patchChallengeIntermediateCertificationFailInfo_16(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationFailInfoQuery_16 = `
  update challengeintermediatecertification ci
  set ChallengeIntermediateCertificationStatus = '2'
  where challengeIdx = ? and ci.createdAt between concat(curdate(), ' 00:00:00') and concat(curdate(), ' 03:59:59');
  `;
  
  const patchChallengeIntermediateCertificationFailInfoParams_16 = [challengeIdx];
  const patchChallengeIntermediateCertificationFailInfoRows_16 = await connection.query(
    patchChallengeIntermediateCertificationFailInfoQuery_16,
    patchChallengeIntermediateCertificationFailInfoParams_16
  );
  connection.release();
  return patchChallengeIntermediateCertificationFailInfoRows_16;
}

// 20~24시 챌린지 중간 인증 실패 전환
async function patchChallengeIntermediateCertificationFailInfo_20(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeIntermediateCertificationFailInfoQuery_20 = `
  update challengeintermediatecertification ci
  set ChallengeIntermediateCertificationStatus = '2'
  where challengeIdx = ? and ci.createdAt between concat(curdate(), ' 20:00:00') and concat(curdate(), ' 23:59:59');
  `;
  
  const patchChallengeIntermediateCertificationFailInfoParams_20 = [challengeIdx];
  const patchChallengeIntermediateCertificationFailInfoRows_20 = await connection.query(
    patchChallengeIntermediateCertificationFailInfoQuery_20,
    patchChallengeIntermediateCertificationFailInfoParams_20
  );
  connection.release();
  return patchChallengeIntermediateCertificationFailInfoRows_20;
}


// 챌린지 실패 전환(사용자 입력)
async function patchChallengeFailInfo(patchChallengeFailInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchChallengeFailInfoQuery = `
  update challenge
  set shareState = '1', challengeStatus = '2', challengeFailText = ?
  where challengeIdx = ?;
  `;
  
  const patchChallengeFailInfoRows = await connection.query(
    patchChallengeFailInfoQuery,
    patchChallengeFailInfoParams
  );
  connection.release();
  return patchChallengeFailInfoRows;
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

async function getDeviceToken(challengeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getDeviceTokenQuery = `
  SELECT user.userDeviceToken FROM declarerobserver
JOIN user ON user.userIdx = declarerobserver.ObserverIdx
WHERE challengeIdx = ${challengeId} AND user.userPushStatus = 'Y' AND NOT user.userDeviceToken = 'default';
                `;

  const [getDeviceTokenRows] = await connection.query(
    getDeviceTokenQuery
  );
  connection.release();
  return [getDeviceTokenRows];
}

async function challengeCheck(challengeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkChallengeQuery = `
  SELECT challengeDeclarer FROM challenge WHERE challengeIdx = ${challengeId};
                `;

  const [checkChallengeRows] = await connection.query(
    checkChallengeQuery
  );
  connection.release();
  return [checkChallengeRows];
}

async function getFailUser(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const failUserQuery = `
  SELECT userNickName FROM user WHERE userIdx = ${userId};
                `;

  const [failUserRows] = await connection.query(
    failUserQuery
  );
  connection.release();
  return [failUserRows];
}

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
    
    patchChallengeIntermediateCertificationSuccessInfo_0,
    patchChallengeIntermediateCertificationSuccessInfo_4,
    patchChallengeIntermediateCertificationSuccessInfo_8,
    patchChallengeIntermediateCertificationSuccessInfo_12,
    patchChallengeIntermediateCertificationSuccessInfo_16,
    patchChallengeIntermediateCertificationSuccessInfo_20,

    patchChallengeIntermediateCertificationFailInfo_0,
    patchChallengeIntermediateCertificationFailInfo_4,
    patchChallengeIntermediateCertificationFailInfo_8,
    patchChallengeIntermediateCertificationFailInfo_12,
    patchChallengeIntermediateCertificationFailInfo_16,
    patchChallengeIntermediateCertificationFailInfo_20,

    patchChallengeCertificationInfo_0,
    patchChallengeCertificationInfo_4,
    patchChallengeCertificationInfo_8,
    patchChallengeCertificationInfo_12,
    patchChallengeCertificationInfo_16,
    patchChallengeCertificationInfo_20,

    patchChallengeFailInfo,
    getDeviceToken,
    challengeCheck,
    getFailUser
};