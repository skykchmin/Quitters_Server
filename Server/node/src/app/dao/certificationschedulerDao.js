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

// 현재 시간 뽑아내기
async function getHoursInfo() {
  const connection = await pool.getConnection(async (conn) => conn);
  const getHoursInfoQuery = `
  select hour(current_timestamp) as hour;
  `;
  
  const [getHoursInfoRows] = await connection.query(
    getHoursInfoQuery,
  );
  connection.release();
  return getHoursInfoRows;
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

// 챌린지 종료날짜에 따른 성공 전환 (디바이스 토큰을 얻기위해 트랜잭션 추가)
async function updateChallengeSuccessInfo(updateChallengeSuccessInfoParams) {
  try{
  const connection = await pool.getConnection(async (conn) => conn);
  try{
    await connection.beginTransaction(); // START TRANSACTION

    const updateChallengeSuccessInfoQuery = `
  update challenge
  set challengeStatus = '1'
  where challengeEndDate = curdate() and challengeStatus = '0'
  `;
  
  const updateChallengeSuccessInfoRows = await connection.query(
    updateChallengeSuccessInfoQuery,
    updateChallengeSuccessInfoParams
  );
    // 토큰 얻는 쿼리
      const getTokenQuery =`
      SELECT user.userDeviceToken FROM challenge
JOIN user ON user.userIdx = challenge.userIdx
WHERE challengeEndDate = curdate() and challengeStatus ='1';
    `;
    
    const [getTokenRows] = await connection.query(
      getTokenQuery
    );
    await connection.commit(); // COMMIT
    connection.release();
    return getTokenRows;
    
  }catch(err){
             await connection.rollback(); // ROLLBACK
            connection.release();
            logger.error(`update Success Challenge Query error\n: ${JSON.stringify(err)}`);
            return false;
  }
}catch(err){
    logger.error(`update Success Challenge DB Connection error\n: ${JSON.stringify(err)}`);
    connection.release();
    return false;
}
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
      updateChallengeSuccessInfo,
      getHoursInfo
  };