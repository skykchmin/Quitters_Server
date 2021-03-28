const { pool } = require("../../../config/database");


//change Push status
async function setUserPush(userId,status) {
  const connection = await pool.getConnection(async (conn) => conn);
  const changeUserPushQuery = `
  UPDATE User SET userPushStatus = '${status}' where userIdx = ${userId};
                `;

  const [userPushRows] = await connection.query(
    changeUserPushQuery
  );
  connection.release();
  return [userPushRows];
}

//일시정지 테이블 생성되어있는지 체크
async function checkPause(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserPauseQuery = `
  SELECT * FROM pause WHERE userIdx = ${userId};
                `;

  const [selectUserPauseRows] = await connection.query(
    selectUserPauseQuery
  );
  connection.release();
  return [selectUserPauseRows];
}

// 일시정지 세팅(처음하는 경우)
async function insertPause(userId,time) {
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    try{
      await connection.beginTransaction(); // START TRANSACTION
      const userPushQuery = `
      UPDATE user SET userPushStatus = 'N' WHERE userIdx = ${userId};
      `;
      const [userPushRows] = await connection.query(
        userPushQuery
      );

      const userPushPauseQuery = `
      UPDATE user SET userPushPauseStatus = 'Y' WHERE userIdx = ${userId};
      `;
      const [userPushPauseRows] = await connection.query(
        userPushPauseQuery
      );

      if(!(time == 8)){
        const insertPauseQuery =`
      INSERT INTO pause (userIdx, pauseTime) VALUES (${userId},DATE_ADD(NOW(),INTERVAL ${time} HOUR));
      `;
      
      const [insertPauseRows] = await connection.query(
        insertPauseQuery
      );
      await connection.commit(); // COMMIT
      connection.release();
      return insertPauseRows;
      }
      else{
        const insertPauseQuery =`
      INSERT INTO pause (userIdx, pauseTime) VALUES (${userId},'08:00:00');
      `;
      
      const [insertPauseRows] = await connection.query(
        insertPauseQuery
      );
      await connection.commit(); // COMMIT
      connection.release();
      return insertPauseRows;
      }
      
    }catch(err){
               await connection.rollback(); // ROLLBACK
              connection.release();
              logger.error(`insert pause Query error\n: ${JSON.stringify(err)}`);
              return false;
    }
  }catch(err){
      logger.error(`insert puase DB Connection error\n: ${JSON.stringify(err)}`);
      connection.release();
      return false;
  }
}

// 일시정지 세팅(두번째)
async function updatePause(userId,time) {
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    try{
      await connection.beginTransaction(); // START TRANSACTION
      const userPushQuery = `
      UPDATE user SET userPushStatus = 'N' WHERE userIdx = ${userId};
      `;
      const [userPushRows] = await connection.query(
        userPushQuery
      );

      const userPushPauseQuery = `
      UPDATE user SET userPushPauseStatus = 'Y' WHERE userIdx = ${userId};
      `;
      const [userPushPauseRows] = await connection.query(
        userPushPauseQuery
      );

      if(!(time == 8)){
        const updatePauseQuery =`
        UPDATE pause SET pauseTime = DATE_ADD(NOW(),INTERVAL ${time} HOUR) WHERE userIdx =${userId};
      `;
      
      const [updatePauseRows] = await connection.query(
        updatePauseQuery
      );
      await connection.commit(); // COMMIT
      connection.release();
      return updatePauseRows;
      }
      else{
        const updatePauseQuery =`
        UPDATE pause SET pauseTime = '08:00:00' WHERE userIdx=${userId};
      `;
      
      const [updatePauseRows] = await connection.query(
        updatePauseQuery
      );
      await connection.commit(); // COMMIT
      connection.release();
      return updatePauseRows;
      }
      
    }catch(err){
               await connection.rollback(); // ROLLBACK
              connection.release();
              logger.error(`update pause Query error\n: ${JSON.stringify(err)}`);
              return false;
    }
  }catch(err){
      logger.error(`update puase DB Connection error\n: ${JSON.stringify(err)}`);
      connection.release();
      return false;
  }
}



//방해금지 테이블 생성되어있는지 체크
async function checkSilence(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserSilenceQuery = `
  SELECT * FROM alarm WHERE userIdx = ${userId};
                `;

  const [selectUserSilenceRows] = await connection.query(
    selectUserSilenceQuery
  );
  connection.release();
  return [selectUserSilenceRows];
}

// 방해금지 세팅(처음하는 경우)
async function insertSilence(userId,startTime,endTime) {
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    try{
      await connection.beginTransaction(); // START TRANSACTION

      const userPushSilenceQuery = `
      UPDATE user SET userPushBanStatus = 'Y' WHERE userIdx = ${userId};
      `;
      const [userPushSilenceRows] = await connection.query(
        userPushSilenceQuery
      );

        const insertSilenceQuery =`
        INSERT INTO alarm (userIdx, notDisturbStartTime, notDisturbEndTime) VALUES (${userId},'${startTime}','${endTime}');
      `;
      
      const [insertSilenceRows] = await connection.query(
        insertSilenceQuery
      );
      await connection.commit(); // COMMIT
      connection.release();
      return insertSilenceRows;
      
    }catch(err){
               await connection.rollback(); // ROLLBACK
              connection.release();
              logger.error(`insert Silence Query error\n: ${JSON.stringify(err)}`);
              return false;
    }
  }catch(err){
      logger.error(`insert Silence DB Connection error\n: ${JSON.stringify(err)}`);
      connection.release();
      return false;
  }
}

// 방해금지 세팅(두번째)
async function updateSilence(userId,startTime,endTime) {
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    try{
      await connection.beginTransaction(); // START TRANSACTION

      const userPushSilenceQuery = `
      UPDATE user SET userPushBanStatus = 'Y' WHERE userIdx = ${userId};
      `;
      const [userPushSilenceRows] = await connection.query(
        userPushSilenceQuery
      );
      
        const updateSilenceQuery =`
        UPDATE alarm SET notDisturbStartTime = '${startTime}',notDisturbEndTime = '${endTime}' WHERE userIdx = ${userId};
      `;
      
      const [updateSilenceRows] = await connection.query(
        updateSilenceQuery
      );
      await connection.commit(); // COMMIT
      connection.release();
      return updateSilenceRows;
      
    }catch(err){
               await connection.rollback(); // ROLLBACK
              connection.release();
              logger.error(`update Silence Query error\n: ${JSON.stringify(err)}`);
              return false;
    }
  }catch(err){
      logger.error(`update Silence DB Connection error\n: ${JSON.stringify(err)}`);
      connection.release();
      return false;
  }
}


//방해금지 모드 해제
async function setUserSilenceOff(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const offUserSilenceQuery = `
  UPDATE User SET userPushBanStatus = 'N' where userIdx = ${userId};
                `;

  const [offUserSilenceRows] = await connection.query(
    offUserSilenceQuery
  );
  connection.release();
  return [offUserSilenceRows];
}

async function challengeCheck(userId,challengeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkChallengeQuery = `
  SELECT challengeDeclarer FROM challenge WHERE userIdx = ${userId} AND challengeIdx = ${challengeId};
                `;

  const [checkChallengeRows] = await connection.query(
    checkChallengeQuery
  );
  connection.release();
  return [checkChallengeRows];
}

async function checkObserver(challengeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkObserverQuery = `
  SELECT ObserverIdx FROM declarerobserver WHERE challengeIdx = ${challengeId};
                `;

  const [checkObserverRows] = await connection.query(
    checkObserverQuery
  );
  connection.release();
  return [checkObserverRows];
}

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
  let deviceTokenRows = new Array();
  for(var i =0; i<getDeviceTokenRows.length; i++){
    deviceTokenRows[i] = getDeviceTokenRows[i].userDeviceToken;
  }
  connection.release();
  return deviceTokenRows
}



module.exports = {
  setUserPush,
  checkPause,
  insertPause,
  updatePause,
  checkSilence,
  insertSilence,
  updateSilence,
  setUserSilenceOff,
  challengeCheck,
  checkObserver,
  getDeviceToken
};



