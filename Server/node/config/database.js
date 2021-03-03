const mysql = require('mysql2/promise'); // mysql2 promise라는 모듈을 사용해서 mysql을 잡아오고
const {logger} = require('./winston');

const pool = mysql.createPool({ // 기본적인 데이터베이스의 정보 
    host: '3.35.8.165',
    user: 'skykchmin',
    port: 3306,
    password: '1234',
    database: 'Kream'
});

module.exports = { // 만들어진 pool을 다른곳에서 이용할 수 있게 export를 해준다
    pool: pool
};


// 트랜잭션을 하는것과 안하는 것의 예시코드를 넣어놓은 것인데 non트랜잭션은 
// pool에 저장되어있는 계정정보를 가지고있는 것에 getconnection을 통해 
const exampleNonTransaction = async (sql, params) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query(sql, params); // connection해준 것의 쿼리를 sql과 파라미터에 넣어준다 -> 끝난정보는 rows에 들어가게 되고
            connection.release(); // connection 해온 것에 대한 결과값이 나오게 된다면 release를 꼭 해줘서 connection을 풀어줘야합니다. 
            return rows;
        } catch(err) { // 만약 try에서 오류가 발생했다면 try-catch를 통해 에러가 발생했다고 알려준 후  
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release(); //connection release를 통해 false를 반환해준다 
            return false;
        }
    } catch(err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};

// 트랜잭션인 경우 
const exampleTransaction = async (sql, params) => {
    try {
        const connection = await pool.getConnection(async conn => conn); // pool을 바탕으로 getconnection을 진행해주고
        try {
            await connection.beginTransaction(); // START TRANSACTION : connection 가져온 것을 start해줍니다. 
            const [rows] = await connection.query(sql, params); // 연결된 connection을 가지고서 쿼리를 진행해준다 sql에는 실질적인 sql이 들어가고, params에는 sql의 where문 뒤에 들어갈 parameter들을 가져오게 됩니다.
            await connection.commit(); // COMMIT : 진행된 쿼리문에 대해서 완벽히 됐다고 저장하는 단계
            connection.release(); // connection을 release 시킵니다
            return rows;
        } catch(err) { // 만약 에러가 났을 경우 
            await connection.rollback(); // ROLLBACK : connection을 전부 rollback 시켜 처음의 상태로 만들어줍니다 
            connection.release(); // connection을 release 시킵니다
            logger.error(`example transaction Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
    } catch(err) {
        logger.error(`example transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};