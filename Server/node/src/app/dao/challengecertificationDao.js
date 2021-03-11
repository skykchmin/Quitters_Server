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
    updateChallengeCertificationInfo
};