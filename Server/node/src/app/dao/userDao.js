const { pool } = require("../../../config/database");

// Signup
async function userIdCheck(id) {
  const connection = await pool.getConnection(async (conn) => conn); // 데이터베이스 pool을 getconnection해줍니다.
  const selectIdQuery = ` 
                SELECT userId, UserNickname 
                FROM User 
                WHERE userId = ?;
                `;
                // 쿼리를 명시해줍니다
  const selectIdParams = [id]; // email을 selectEmailParams 로 재정의
  const [idRows] = await connection.query( // emailRows라는 최종적인 결과값에 await connection query를 해줘서 쿼리안에 쿼리문이 들어가게 되고 ? 안에는 email 값이 들어가게 되어서 selectEmailParams로 명시가 되었고 
    selectIdQuery, // 쿼리안에 쿼리문이 들어가게 되고
    selectIdParams // ? 안에는 email 값이 들어가게 되어서 selectEmailParams로 명시가 되었고
  );
  connection.release(); // connection release처리를 해주고

  return idRows; // 결과값 return
}
/*
async function userNicknameCheck(nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectNicknameQuery = `
                SELECT email, nickname 
                FROM UserInfo 
                WHERE nickname = ?;
                `;
  const selectNicknameParams = [nickname];
  const [nicknameRows] = await connection.query(
    selectNicknameQuery,
    selectNicknameParams
  );
  connection.release();
  return nicknameRows;
}
*/
async function insertUserInfo(insertUserInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn); // connection을 진행해주고
  const insertUserInfoQuery = `
  INSERT INTO User(userId,userPassword,userNickName,userLoginMethod,userProfilePicture) 
  VALUES (?,?,?,0,'default');
    `;
    // 위의 쿼리를 실행해준다면 insertUserInfoParams 로 넘어온 정보를 ? 쪽에 들어가게 됩니다. 
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );
  connection.release(); // connection release를 해주고 
  return insertUserInfoRow; // 값을 return 해준다면 
}

//SignIn
async function selectUserInfo(id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserInfoQuery = `
                SELECT userIdx, userId, userPassword, userNickName, userStatus, userLoginMethod 
                FROM User 
                WHERE userId = ?;
                `;

  let selectUserInfoParams = [id];
  const [userInfoRows] = await connection.query(
    selectUserInfoQuery,
    selectUserInfoParams
  );
  connection.release();
  return [userInfoRows];
}

//changeUserInfo
async function changeUserInfo(userId,nickname,profileUrl) {
  const connection = await pool.getConnection(async (conn) => conn);
  const changeUserInfoQuery = `
  UPDATE User SET userNickName = '${nickname}', userProfilePicture = '${profileUrl}' where userIdx = ${userId};
                `;

  const [userInfoRows] = await connection.query(
    changeUserInfoQuery
  );
  connection.release();
  return [userInfoRows];
}

//checkProfileUrl
async function checkProfile(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkProfileQuery = `
  SELECT userProfilePicture
                FROM User 
                WHERE userIdx = ${userId};
                `;

  const [profileRows] = await connection.query(
    checkProfileQuery
  );
  connection.release();
  return [profileRows];
}

//changeUserId
async function changeUserId(id,userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const changeUserInfoQuery = `
  UPDATE User SET userId = '${id}' where userIdx = ${userId};
                `;

  const [userInfoRows] = await connection.query(
    changeUserInfoQuery
  );
  connection.release();
  return [userInfoRows];
}

//아이디 변경할때 계정 상태(소셜로그인인지) 확인
async function userStatusCheck(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkUserInfoQuery = `
  SELECT userLoginMethod,userPassword FROM User WHERE userIdx = ${userId};
                `;

  const [userInfoRows] = await connection.query(
    checkUserInfoQuery
  );
  connection.release();
  return [userInfoRows];
}

// 아이디 변경할때 중복된 아이디 체크
async function userIdChangeCheck(id,userId) {
  const connection = await pool.getConnection(async (conn) => conn); 
  const selectIdQuery = ` 
                SELECT userId, UserNickname 
                FROM User 
                WHERE userId = ? AND NOT userIdx = ${userId};
                `;
                
  const selectIdParams = [id]; 
  const [idRows] = await connection.query(
    selectIdQuery, 
    selectIdParams 
  );
  connection.release();

  return idRows;
}


//changeUserId
async function changeUserPassword(password,userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const changeUserInfoQuery = `
  UPDATE User SET userPassword = '${password}' where userIdx = ${userId};
                `;

  const [userInfoRows] = await connection.query(
    changeUserInfoQuery
  );
  connection.release();
  return [userInfoRows];
}

//delete User Info
async function deleteUserInfo(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deleteUserInfoQuery = `
  UPDATE User SET userStatus = 2 WHERE userIdx = ${userId};
                `;

  const [userInfoRows] = await connection.query(
    deleteUserInfoQuery
  );
  connection.release();
  return [userInfoRows];
}

//get User Info
async function getUserInfo(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getUserInfoQuery = `
  SELECT userIdx,userProfilePicture,userNickName FROM User WHERE userIdx = ${userId};
                `;

  const [userInfoRows] = await connection.query(
    getUserInfoQuery
  );
  connection.release();
  return [userInfoRows];
}


//get User Push Info
async function getUserPushInfo(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getUserPushInfoQuery = `
  SELECT userIdx,userPushStatus,userPushBanStatus FROM user WHERE userIdx = ${userId};
                `;

  const [userPushInfoRows] = await connection.query(
    getUserPushInfoQuery
  );
  connection.release();
  return [userPushInfoRows];
}

//get User Silence Push Info
async function getUserSilenceInfo(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getUserSilenceInfoQuery = `
  SELECT notDisturbStartTime as startTime, notDisturbEndTime as endTime FROM alarm where userIdx = ${userId};
                `;

  const [userSilenceInfoRows] = await connection.query(
    getUserSilenceInfoQuery
  );
  connection.release();
  return [userSilenceInfoRows];
}

// 디바이스 토큰 갱신

async function setUserDeviceInfo(userId,deviceToken) {
  const connection = await pool.getConnection(async (conn) => conn);
  const setDeviceTokenInfoQuery = `
  UPDATE user SET userDeviceToken = '${deviceToken}' WHERE userIdx = ${userId};
                `;

  const [deviceTokenInfoRows] = await connection.query(
    setDeviceTokenInfoQuery
  );
  connection.release();
  return [deviceTokenInfoRows];
}


module.exports = {
  userIdCheck,
  insertUserInfo,
  selectUserInfo,
  changeUserInfo,
  checkProfile,
  changeUserId,
  userStatusCheck,
  userIdChangeCheck,
  changeUserPassword,
  deleteUserInfo,
  getUserInfo,
  getUserPushInfo,
  getUserSilenceInfo,
  setUserDeviceInfo
};



