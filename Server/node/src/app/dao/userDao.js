const { pool } = require("../../../config/database");

// Signup
async function userEmailCheck(email) {
  const connection = await pool.getConnection(async (conn) => conn); // 데이터베이스 pool을 getconnection해줍니다.
  const selectEmailQuery = ` 
                SELECT email, nickname 
                FROM UserInfo 
                WHERE email = ?;
                `;
                // 쿼리를 명시해줍니다
  const selectEmailParams = [email]; // email을 selectEmailParams 로 재정의
  const [emailRows] = await connection.query( // emailRows라는 최종적인 결과값에 await connection query를 해줘서 쿼리안에 쿼리문이 들어가게 되고 ? 안에는 email 값이 들어가게 되어서 selectEmailParams로 명시가 되었고 
    selectEmailQuery, // 쿼리안에 쿼리문이 들어가게 되고
    selectEmailParams // ? 안에는 email 값이 들어가게 되어서 selectEmailParams로 명시가 되었고
  );
  connection.release(); // connection release처리를 해주고

  return emailRows; // 결과값 return
}

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

async function insertUserInfo(insertUserInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn); // connection을 진행해주고
  const insertUserInfoQuery = `
        INSERT INTO UserInfo(email, pswd, nickname)
        VALUES (?, ?, ?);
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
async function selectUserInfo(email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserInfoQuery = `
                SELECT id, email , pswd, nickname, status 
                FROM UserInfo 
                WHERE email = ?;
                `;

  let selectUserInfoParams = [email];
  const [userInfoRows] = await connection.query(
    selectUserInfoQuery,
    selectUserInfoParams
  );
  return [userInfoRows];
}

module.exports = {
  userEmailCheck,
  userNicknameCheck,
  insertUserInfo,
  selectUserInfo,
};



