const { pool } = require("../../../config/database");

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
    values (?, ?, 0, 0, 0, now(), now())
    `;
    
    const updateChallengeCertificationInfoRows = await connection.query(
      updateChallengeCertificationInfoQuery,
      updateChallengeCertificationInfoParams
    );
    connection.release();
    return updateChallengeCertificationInfoRows;
  }
  
// 진행중인 챌린지만 뽑아내기
async function getChallengeStatusInfo(getChallengeStatusInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeStatusInfoInfoQuery = `
  select challengeIdx, challengeStatus
  from challenge
  where challengeStatus = '0';
  `;
  
  const getChallengeStatusInfoInfoRows = await connection.query(
    getChallengeStatusInfoInfoQuery,
    getChallengeStatusInfoParams
  );
  connection.release();
  return getChallengeStatusInfoInfoRows;
}

// 챌린지 중간 인증 업데이트 실행
async function updateChallengeIntermediateCertificationInfo(updateChallengeIntermediateCertificationInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const updateChallengeIntermediateCertificationInfoQuery = `
  insert into challengeintermediatecertification(challengeIdx, ChallengeIntermediateCertificationStatus, createdAt)
  values (?, '0', now());
  `;
  
  const updateChallengeIntermediateCertificationInfoRows = await connection.query(
    updateChallengeIntermediateCertificationInfoQuery,
    updateChallengeIntermediateCertificationInfoParams
  );
  connection.release();
  return updateChallengeIntermediateCertificationInfoRows;
}

async function patchAutoChallengeIntermediateCertificationInfo(patchAutoChallengeIntermediateCertificationInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchAutoChallengeIntermediateCertificationInfoQuery = `
  update challengeintermediatecertification
  set ChallengeIntermediateCertificationStatus = '1'
  where challengeIdx = ?;
  `;
  
  const patchAutoChallengeIntermediateCertificationInfoRows = await connection.query(
    patchAutoChallengeIntermediateCertificationInfoQuery,
    patchAutoChallengeIntermediateCertificationInfoParams
  );
  connection.release();
  return patchAutoChallengeIntermediateCertificationInfoRows;
}

// 0시 ~ 4시 인증 목록
async function getChallengeCertification_0Info(getChallengeCertification_0InfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeCertification_0InfoQuery = `
  select userProfilePicture, userNickName, c.challengeCertificationTime, c.challengeCertificationStatus, challenge.challengeIdx
from declarerobserver
inner join challengecertification c on declarerobserver.ObserverIdx = c.observerIdx
inner join user on user.userIdx = declarerobserver.ObserverIdx
inner join challenge on c.challengeIdx = challenge.challengeIdx
where declarerobserver.ObserverStatus = 'F'
    and c.createdAt between concat(curdate(), ' 00:00:00') and concat(curdate(), ' 03:59:59');
  `;
  
  const [getChallengeCertification_0InfoRows] = await connection.query(
    getChallengeCertification_0InfoQuery,
    getChallengeCertification_0InfoParams
  );
  connection.release();
  return getChallengeCertification_0InfoRows;
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
      getChallengeDeclarerObserverInfo,
      updateChallengeCertificationInfo,
      getChallengeStatusInfo,
      updateChallengeIntermediateCertificationInfo,
      patchAutoChallengeIntermediateCertificationInfo,
      getChallengeCertification_0Info
  };