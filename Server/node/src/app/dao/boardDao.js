const { pool } = require("../../../config/database");

// selectBoard 
async function selectBoard(email) {
  const connection = await pool.getConnection(async (conn) => conn); // 데이터베이스 pool을 getconnection해줍니다.
  const selectBoardQuery = ` 
                SELECT title, contents
                FROM Board;
                `;
                // 쿼리를 명시해줍니다
  // const selectBoardParams = [email]; // email을 selectEmailParams 로 재정의
  const [boardRows] = await connection.query( // emailRows라는 최종적인 결과값에 await connection query를 해줘서 쿼리안에 쿼리문이 들어가게 되고 ? 안에는 email 값이 들어가게 되어서 selectEmailParams로 명시가 되었고 
    selectBoardQuery // 쿼리안에 쿼리문이 들어가게 되고
    
  );
  connection.release(); // connection release처리를 해주고

  return boardRows; // 결과값 return
}

module.exports = {
  selectBoard
};
