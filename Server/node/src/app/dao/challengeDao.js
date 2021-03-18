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
  const [challengeParticipationCodeCheckInfoRows] = await connection.query(
    challengeParticipationCodeCheckInfoQuery,
    challengeParticipationCodeCheckInfoParams
  );
  connection.release();
  return challengeParticipationCodeCheckInfoRows;
}

// 나의 챌린지
async function getMyChallengeInfo(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getMyChallengeInfoInfoQuery = `
  select challengeIdx, challengeDeclarer, challengeStartDate, challengeEndDate, challengeText 
  from challenge
  where userIdx = ?;
  `;
  const getMyChallengeInfoInfoParams = [userIdx]
  const getMyChallengeInfoInfoRows = await connection.query(
    getMyChallengeInfoInfoQuery,
    getMyChallengeInfoInfoParams
  );
  connection.release();
  return getMyChallengeInfoInfoRows;
}

async function getFriendsChallengeInfo(observerIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getFriendsChallengeInfoInfoQuery = `
  select challenge.challengeIdx, challengeDeclarer, challengeStartDate, challengeEndDate, challengeText, challengeStatus
  from challenge
  inner join declarerobserver d on challenge.challengeIdx = d.challengeIdx
  where ObserverIdx = ?;
  `;
  const getFriendsChallengeInfoInfoParams = [observerIdx]
  const getFriendsChallengeInfoInfoRows = await connection.query(
    getFriendsChallengeInfoInfoQuery,
    getFriendsChallengeInfoInfoParams
  );
  connection.release();
  return getFriendsChallengeInfoInfoRows;
}

// 챌린지 상세 조회 
async function getChallengeDetailInfo(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeDetailInfoQuery = `
  select challengeDeclarer, challengeText, savingMoney, challengeCreateTime, challengeStartDate, challengeEndDate
  from challenge
  where challengeIdx = ?;
  `;
  const getChallengeDetailInfoParams = [challengeIdx]
  const [getChallengeDetailInfoRows] = await connection.query(
    getChallengeDetailInfoQuery,
    getChallengeDetailInfoParams
  );
  connection.release();
  return getChallengeDetailInfoRows;
}

// 참여중인 감시자
async function getChallengeObserverInfo(challengeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeObserverInfoQuery = `
  select userNickName, userProfilePicture, observerIdx
  from declarerobserver
  inner join user on user.userIdx = declarerobserver.ObserverIdx
  where challengeIdx = ? and ObserverStatus ='F'
  `;
  const getChallengeObserverInfoParams = [challengeIdx]
  const getChallengeObserverInfoRows = await connection.query(
    getChallengeObserverInfoQuery,
    getChallengeObserverInfoParams
  );
  connection.release();
  return getChallengeObserverInfoRows;
}

// 챌린지 실패 메시지 조회
async function getChallengeFailMessageInfo(getChallengeFailMessageInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getChallengeFailMessageInfoQuery = `
  select challengeDeclarer, u.userNickName, challengeFailText
  from challenge
  inner join challengecertification c on challenge.challengeIdx = c.challengeIdx
  inner join user u on c.observerIdx = u.userIdx
  where c.challengeIdx = ? and c.observerIdx = ? and c.challengeCertificationStatus = '3';
  `;
  
  const [getChallengeFailMessageInfoRows] = await connection.query(
    getChallengeFailMessageInfoQuery,
    getChallengeFailMessageInfoParams
  );
  connection.release();
  return getChallengeFailMessageInfoRows;
}

module.exports = {
    insertChallengeInfo,
    challengeCodeCheck,
    patchChallengeInfo,
    deleteChallengeInfo,
    challengeParticipationCodeCheck,
    getMyChallengeInfo,
    getFriendsChallengeInfo,
    getChallengeDetailInfo,
    getChallengeObserverInfo,
    getChallengeFailMessageInfo
};