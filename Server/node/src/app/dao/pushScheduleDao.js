const { pool } = require("../../../config/database");



// 일시정지 체크 + 유저 테이블 변경
async function setUserPushAlarm() {
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    try{
      await connection.beginTransaction(); // START TRANSACTION
      const checkPauseQuery = `
      SELECT user.userIdx FROM user
JOIN pause on pause.userIdx = user.userIdx
WHERE timestampdiff(minute ,NOW(),pause.pauseTime) = 0 AND user.userPushPauseStatus = 'Y';
      `;
      const [checkPauseRows] = await connection.query(
        checkPauseQuery
      );

      if(checkPauseRows.length>0){
        for(let i=0; i<checkPauseRows.length; i++){
          const setPushQuery = `
      UPDATE user SET userPushStatus = 'Y',userPushPauseStatus = 'N' WHERE userIdx = ${checkPauseRows[i].userIdx};
      `;
      const [setPushRows] = await connection.query(
        setPushQuery
      );
        }
      }
      await connection.commit(); // COMMIT
      connection.release();
      return checkPauseRows;
      
    }catch(err){
               await connection.rollback(); // ROLLBACK
              connection.release();
              logger.error(`set User Push pause Query error\n: ${JSON.stringify(err)}`);
              return false;
    }
  }catch(err){
      logger.error(`set User Push pause DB Connection error\n: ${JSON.stringify(err)}`);
      connection.release();
      return false;
  }
}

// 일시정지 방해 금지 체크 + 푸시 알림 On
async function setUserPushOn() {
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    try{
      await connection.beginTransaction(); // START TRANSACTION
      const checkSilenceOnQuery = `
      SELECT user.userIdx FROM user
JOIN alarm on alarm.userIdx = user.userIdx
WHERE user.userPushBanStatus = 'Y' AND NOT now() between alarm.notDisturbStartTime AND alarm.notDisturbEndTime;
      `;
      const [checkSilenceOnRows] = await connection.query(
        checkSilenceOnQuery
      );

      if(checkSilenceOnRows.length>0){
        for(let i=0; i<checkSilenceOnRows.length; i++){
          const setPushOnQuery = `
      UPDATE user SET userPushStatus = 'Y' WHERE userIdx = ${checkSilenceOnRows[i].userIdx};
      `;
      const [setPushOnRows] = await connection.query(
        setPushOnQuery
      );
        }
      }
      await connection.commit(); // COMMIT
      connection.release();
      return checkSilenceOnRows;
      
    }catch(err){
               await connection.rollback(); // ROLLBACK
              connection.release();
              logger.error(`set User Push On Query error\n: ${JSON.stringify(err)}`);
              return false;
    }
  }catch(err){
      logger.error(`set User Push On DB Connection error\n: ${JSON.stringify(err)}`);
      connection.release();
      return false;
  }
}

// 일시정지 방해 금지 체크 + 푸시 알림 Off
async function setUserPushOff() {
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    try{
      await connection.beginTransaction(); // START TRANSACTION
      const checkSilenceOffQuery = `
      SELECT user.userIdx FROM user
JOIN alarm on alarm.userIdx = user.userIdx
WHERE user.userPushBanStatus = 'Y' AND now() between alarm.notDisturbStartTime AND alarm.notDisturbEndTime;
      `;
      const [checkSilenceOffRows] = await connection.query(
        checkSilenceOffQuery
      );

      if(checkSilenceOffRows.length>0){
        for(let i=0; i<checkSilenceOffRows.length; i++){
          const setPushOffQuery = `
      UPDATE user SET userPushStatus = 'N' WHERE userIdx = ${checkSilenceOffRows[i].userIdx};
      `;
      const [setPushOffRows] = await connection.query(
        setPushOffQuery
      );
        }
      }
      await connection.commit(); // COMMIT
      connection.release();
      return checkSilenceOffRows;
      
    }catch(err){
               await connection.rollback(); // ROLLBACK
              connection.release();
              logger.error(`set User Push Off Query error\n: ${JSON.stringify(err)}`);
              return false;
    }
  }catch(err){
      logger.error(`set User Push Off DB Connection error\n: ${JSON.stringify(err)}`);
      connection.release();
      return false;
  }
}

module.exports = {
  setUserPushAlarm,
  setUserPushOn,
  setUserPushOff
};



