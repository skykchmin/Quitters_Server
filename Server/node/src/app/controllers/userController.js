const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const userDao = require('../dao/userDao');
const { constants } = require('buffer');



exports.test = async function (req, res) {
    console.log("GET 메소드를 사용하는 /test 라우팅 연결이 성공하였습니다.");
    res.json({"message" : "GET 메소드를 사용하는 /test 라우팅 연결이 성공하였습니다."});
};





/**
 update : 2020.10.4
 01.signUp API = 회원가입
 validation 처리는 여기를 참고하면 된다.
 */
exports.signUp = async function (req, res) {
    const { // body로 들어오는 email, password, nickname 을 가지고 있고  
        email, password, nickname
    } = req.body;

    if (!email) return res.json({isSuccess: false, code: 301, message: "이메일을 입력해주세요."});
    if (email.length > 30) return res.json({
        isSuccess: false,
        code: 302,
        message: "이메일은 30자리 미만으로 입력해주세요."
    });

    if (!regexEmail.test(email)) return res.json({isSuccess: false, code: 303, message: "이메일을 형식을 정확하게 입력해주세요."});

    if (!password) return res.json({isSuccess: false, code: 304, message: "비밀번호를 입력 해주세요."});
    if (password.length < 6 || password.length > 20) return res.json({
        isSuccess: false,
        code: 305,
        message: "비밀번호는 6~20자리를 입력해주세요."
    });

    if (!nickname) return res.json({isSuccess: false, code: 306, message: "닉네임을 입력 해주세요."});
    if (nickname.length > 20) return res.json({
        isSuccess: false,
        code: 307,
        message: "닉네임은 최대 20자리를 입력해주세요."
    });
        try {
            // 이메일 중복 확인: : 중복확인을 할때는 데이터베이스를 확인해봐야하기 때문에 데이터베이스 연동이 필요합니다
            const emailRows = await userDao.userEmailCheck(email); // userDao에서 userEmailCheck 파라미터로 email을 넘겨줬습니다.
            if (emailRows.length > 0) { // retun된 emailrows 길이가 1이 넘는다면 존재한다는 의미 

                return res.json({
                    isSuccess: false,
                    code: 308,
                    message: "중복된 이메일입니다."
                });
            }

            // 닉네임 중복 확인
            const nicknameRows = await userDao.userNicknameCheck(nickname);
            if (nicknameRows.length > 0) {
                return res.json({
                    isSuccess: false,
                    code: 309,
                    message: "중복된 닉네임입니다."
                });
            }

            // TRANSACTION : advanced
           // await connection.beginTransaction(); // START TRANSACTION
            const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex'); // 비밀번호를 저장하기위해 crypto 모듈을 이용해서 sha512 방식과 hex방식으로 변환을 해준다
            const insertUserInfoParams = [email, hashedPassword, nickname];
            
            const insertUserRows = await userDao.insertUserInfo(insertUserInfoParams); // insertUserInfo 모듈에 userinfo를 파라미터로 넘겨준다 

          //  await connection.commit(); // COMMIT
           // connection.release();
            return res.json({
                isSuccess: true,
                code: 200,
                message: "회원가입 성공"
            });
        } catch (err) { // 에러가 발생했다면 에러를 알려줍니다. 
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};

/**
 update : 2020.10.4
 02.signIn API = 로그인
 **/
exports.signIn = async function (req, res) {
    const {
        email, password
    } = req.body;

    if (!email) return res.json({isSuccess: false, code: 301, message: "이메일을 입력해주세요."});
    if (email.length > 30) return res.json({
        isSuccess: false,
        code: 302,
        message: "이메일은 30자리 미만으로 입력해주세요."
    });

    if (!regexEmail.test(email)) return res.json({isSuccess: false, code: 303, message: "이메일을 형식을 정확하게 입력해주세요."});

    if (!password) return res.json({isSuccess: false, code: 304, message: "비밀번호를 입력 해주세요."});
        try {
            const [userInfoRows] = await userDao.selectUserInfo(email)

            if (userInfoRows.length < 1) {
                connection.release();
                return res.json({
                    isSuccess: false,
                    code: 310,
                    message: "아이디를 확인해주세요."
                });
            }

            // const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
            // if (userInfoRows[0].pswd !== hashedPassword) {
            //     connection.release();
            //     return res.json({
            //         isSuccess: false,
            //         code: 311,
            //         message: "비밀번호를 확인해주세요."
            //     });
            // }
            if (userInfoRows[0].status === "INACTIVE") {
                connection.release();
                return res.json({
                    isSuccess: false,
                    code: 312,
                    message: "비활성화 된 계정입니다. 고객센터에 문의해주세요."
                });
            } else if (userInfoRows[0].status === "DELETED") {
                connection.release();
                return res.json({
                    isSuccess: false,
                    code: 313,
                    message: "탈퇴 된 계정입니다. 고객센터에 문의해주세요."
                });
            }
            //토큰 생성
            let token = await jwt.sign({
                    id: userInfoRows[0].id,
                }, // 토큰의 내용(payload)
                secret_config.jwtsecret, // 비밀 키
                {
                    expiresIn: '365d',
                    subject: 'userInfo',
                } // 유효 시간은 365일
            );

            res.json({
                userInfo: userInfoRows[0],
                jwt: token,
                isSuccess: true,
                code: 200,
                message: "로그인 성공"
            });

            connection.release();
        } catch (err) {
            logger.error(`App - SignIn Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
};

/**
 update : 2019.09.23
 03.check API = token 검증
 **/
exports.check = async function (req, res) {
    res.json({
        isSuccess: true,
        code: 200,
        message: "검증 성공",
        info: req.verifiedToken
    })
};