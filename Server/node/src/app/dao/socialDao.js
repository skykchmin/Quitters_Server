const { pool } = require("../../../config/database");

// 로그인
async function userCheck(email) {
  const connection = await pool.getConnection(async (conn) => conn); 
  const selectIdQuery = ` 
                SELECT userId, UserNickname 
                FROM User 
                WHERE userId = '${email}';
                `;
                
  const [idRows] = await connection.query( 
    selectIdQuery
  );
  connection.release();

  return idRows; 
}

// 회원가입
async function insertUserInfo(nickName,email,profileUrl,loginType,password) {
  const connection = await pool.getConnection(async (conn) => conn); 
  const insertUserInfoQuery = `
  INSERT INTO User(userId,userPassword,userNickName,userLoginMethod,userProfilePicture) 
  VALUES ('${email}','${password}','${nickName}',${loginType},'${profileUrl}');
    `;
     
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery
  );
  connection.release();  
  return insertUserInfoRow; 
}

//SignIn
async function selectUserInfo(id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserInfoQuery = `
                SELECT userIdx, userId, userPassword, userNickName, userStatus ,userLoginMethod
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
module.exports = {
  userCheck,
  insertUserInfo,
  selectUserInfo
};



