const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const boardDao = require('../dao/boardDao');

exports.getBoard = async function (req, res) { // board를 가져오는 것
    try {        
        const boardRows = await boardDao.selectBoard(); // userDao에서 userEmailCheck 파라미터로 email을 넘겨줬습니다.
        if (!boardRows) { // boardRows가 null이 아니라면 
            return res.json({
                isSuccess: true,
                code: 200,
                message: "게시물 조회 성공",
                data: boardRows // data에 boardRows를 넣어주게 됩니다
            });
        } 
        return res.json({ // 게시물이 존재하지 않는다면 
            isSuccess: false,
            code: 300,
            message: "게시물이 존재하지 않습니다"
            });
        } catch (err) { // 에러가 발생했다면 에러를 알려줍니다. 
            // await connection.rollback(); // ROLLBACK
            // connection.release();
             logger.error(`App - getBoard Query error\n: ${err.message}`);
             return res.status(500).send(`Error: ${err.message}`);
        }
};