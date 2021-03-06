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
  set challengeStartDate = ? , challengeEndDate = ?, smokingAmount = ?, cigarattePrice = ?, noSmokingTime = 0, savingMoney = 0, challengeCreateTime = now(), challengeDeclarer = ?, challengeText = ?, challengeUpdateTime = now()
  where challengeIdx = ?;
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
async function challengeParticipationCodeCheck(challengeCode) {
  const connection = await pool.getConnection(async (conn) => conn);
  const challengeParticipationCodeCheckInfoQuery = `
  select challengeIdx, challengeCode
  from challenge
  where challengeCode = ?
  `;
  const challengeParticipationCodeCheckInfoParams = [challengeCode]
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
  select challengeIdx, challengeDeclarer, u.userProfilePicture ,challengeStartDate, challengeEndDate, challengeText, challengeCode, challengeStatus
  from challenge
  inner join user u on challenge.userIdx = u.userIdx
  where challenge.userIdx = ? and challengeStatus = '0';
  `;
  const getMyChallengeInfoInfoParams = [userIdx]
  const getMyChallengeInfoInfoRows = await connection.query(
    getMyChallengeInfoInfoQuery,
    getMyChallengeInfoInfoParams
  );
  connection.release();
  return getMyChallengeInfoInfoRows;
}

// 친구의 챌린지
async function getFriendsChallengeInfo(observerIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getFriendsChallengeInfoInfoQuery = `
  select challenge.challengeIdx, challengeDeclarer, u.userProfilePicture, challengeStartDate, challengeEndDate, challengeText, challengeStatus
  from challenge
  inner join declarerobserver d on challenge.challengeIdx = d.challengeIdx
  inner join user u on challenge.userIdx = u.userIdx
  where ObserverIdx = ? and challengeStatus = '0' and ObserverStatus = 'F';
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
  select challengeDeclarer, challengeText, smokingAmount, cigarattePrice, savingMoney, noSmokingTime, challengeStartDate, challengeEndDate, challengeCode, userIdx
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
  select userNickName, challengeFailText
from user
inner join (select c.observerIdx, challengeFailText
from challenge
inner join challengecertification c on challenge.challengeIdx = c.challengeIdx
where challenge.challengeIdx = ? and challenge.challengeStatus = '2' and c.challengeCertificationStatus ='3') as observerInfo on observerIdx = userIdx
  `;
  
  const [getChallengeFailMessageInfoRows] = await connection.query(
    getChallengeFailMessageInfoQuery,
    getChallengeFailMessageInfoParams
  );
  connection.release();
  return getChallengeFailMessageInfoRows;
}

// 챌린지 목록 관리 - 나의 챌린지
async function getMyChallengeListInfo(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getMyChallengeListInfoQuery = `
  select challengeIdx, challengeDeclarer, u.userProfilePicture, challengeStartDate, challengeEndDate, challengeText, challengeStatus, challengeUpdateTime
  from challenge
  inner join user u on challenge.userIdx = u.userIdx
  where challenge.userIdx = ? and not challengeStatus = '3'
  order by field(challengeStatus, '0', '1', '2');
  `;
  
  const getMyChallengeListInfoParams = [userIdx]
  const getMyChallengeListInfoRows = await connection.query(
    getMyChallengeListInfoQuery,
    getMyChallengeListInfoParams
  );
  connection.release();
  return getMyChallengeListInfoRows;
}

// 챌린지 목록 관리 - 친구의 챌린지
async function getFriendChallengeListInfo(observerIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getFriendChallengeListInfoQuery = `
  select challenge.challengeIdx, challengeDeclarer, challengeStartDate, challengeEndDate, challengeText, challengeStatus, d.challengeIdx, u.userProfilePicture, challengeUpdateTime
  from challenge
  inner join declarerobserver d on challenge.challengeIdx = d.challengeIdx
  inner join user u on challenge.userIdx = u.userIdx
  where observerIdx = ? and observerStatus = 'F'
  order by field(challengeStatus, '0', '1', '2');
  `;
  
  const getFriendChallengeListInfoParams = [observerIdx]
  const getFriendChallengeListInfoRows = await connection.query(
    getFriendChallengeListInfoQuery,
    getFriendChallengeListInfoParams
  );
  connection.release();
  return getFriendChallengeListInfoRows;
}

// 챌린지 중복 확인
async function challengeDuplicateCheckInfo(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const challengeDuplicateCheckInfoQuery = `
  select userIdx, challengeIdx, challengeStatus
  from challenge
  where userIdx = ? and challengeStatus = 0;
  `;
  
  const challengeDuplicateCheckInfoParams = [userIdx]
  const challengeDuplicateCheckInfoRows = await connection.query(
    challengeDuplicateCheckInfoQuery,
    challengeDuplicateCheckInfoParams
  );
  connection.release();
  return challengeDuplicateCheckInfoRows;
}

  // 챌린지 중간 인증 생성 - 챌린지 생성하자마자
  async function insertChallengeIntermediateCertificationInfo(pickChallengeIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const insertChallengeIntermediateCertificationInfoQuery = `
    insert into challengeintermediatecertification(challengeIdx, ChallengeIntermediateCertificationStatus, createdAt)
    values (?, 0, now())
    `;
    
    const insertChallengeIntermediateCertificationInfoParams = [pickChallengeIdx]
    const insertChallengeIntermediateCertificationInfoRows = await connection.query(
      insertChallengeIntermediateCertificationInfoQuery,
      insertChallengeIntermediateCertificationInfoParams
    );
    connection.release();
    return insertChallengeIntermediateCertificationInfoRows;
  }


  async function getChallengeIdxInfo(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getChallengeIdxInfoQuery = `
    SELECT challengeIdx 
    FROM challenge 
    WHERE userIdx = ? order by challengeCreateTime desc LIMIT 1;
    `;
    
    const getChallengeIdxInfoParams = [userIdx]
    const [getChallengeIdxInfoRows] = await connection.query(
      getChallengeIdxInfoQuery,
      getChallengeIdxInfoParams
    );
    connection.release();
    return getChallengeIdxInfoRows;
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
    getChallengeFailMessageInfo,
    getMyChallengeListInfo,
    getFriendChallengeListInfo,
    challengeDuplicateCheckInfo,
    insertChallengeIntermediateCertificationInfo,
    getChallengeIdxInfo
};