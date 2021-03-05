const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const userDao = require('../dao/userDao');
const { constants } = require('buffer');

// 공백이 있나 없나 체크 
function checkSpace(str) { 
    if(str.search(/\s/) != -1) { 
        return true; 
    } 
        else { 
            return false; 
        } 
}
 // 특수 문자가 있나 없나 체크 
 function checkSpecial(str) { 
     var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi; 
     if(special_pattern.test(str) == true) { 
         return true; 
        } 
        else { 
            return false; 
        } 
}

// 한글인지 체크
function checkLanguage(str) { 
    var pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if(pattern_kor.test(str) == true) { 
        return true; 
       } 
       else { 
           return false; 
       } 
}

// 비밀번호 영문이나 숫자를 썼는지 확인
function checkPasswordLanguage(str) { 
    var passwordCheck = /^[A-Za-z0-9]*$/;
    if(passwordCheck.test(str) == true) { 
        return true; 
       } 
       else { 
           return false; 
       } 
}


exports.test = async function (req, res) {
    console.log("GET 메소드를 사용하는 /test 라우팅 연결이 성공하였습니다.");
    res.json({"message" : "GET 메소드를 사용하는 /test 라우팅 연결이 성공하였습니다."});
};


/**
 update : 2021.03.04
 01.signUp API = 회원가입
 validation 처리는 여기를 참고하면 된다.
 */
exports.signUp = async function (req, res) {
    const { // body로 들어오는 email, password, nickname 을 가지고 있고  
        id, nickName, password
    } = req.body;
    
    if (!id) return res.json({isSuccess: false, code: 2019, message: "id를 입력해주세요"});
    if (id.length < 5 || id.length > 20) return res.json({
        isSuccess: false,
        code: 2020,
        message: "id는 5자리 이상 20자리 미만으로 입력해주세요."
    });

    if (checkSpace(id)) 
    return res.json({isSuccess: false, code: 2022, message: "id에 공백을 제거해주세요"});

    if (checkSpecial(id)) 
    return res.json({isSuccess: false, code: 2023, message: "id에 특수문자는 들어갈 수 없습니다."});

    if (checkLanguage(id)) 
    return res.json({isSuccess: false, code: 2024, message: "id에는 영문과 숫자만 이용해주세요."});

    if (checkSpace(nickName)) 
    return res.json({isSuccess: false, code: 2025, message: "닉네임에 공백을 제거해주세요"});

    if (checkSpecial(nickName)) 
    return res.json({isSuccess: false, code: 2026, message: "닉네임에 특수문자는 들어갈 수 없습니다."});

    if (!password) return res.json({isSuccess: false, code: 2027, message: "비밀번호를 입력 해주세요."});

    if (!checkPasswordLanguage(password)) 
    return res.json({isSuccess: false, code: 2028, message: "비밀번호는 영문과 숫자만 사용해주세요"});

    if (password.length < 6 || password.length > 20) return res.json({
        isSuccess: false,
        code: 2029,
        message: "비밀번호는 6~20자리를 입력해주세요."
    });

    if (!nickName) return res.json({isSuccess: false, code: 2030, message: "닉네임을 입력 해주세요."});
    if (nickName.length <1 || nickName.length > 10) return res.json({
        isSuccess: false,
        code: 2021,
        message: "닉네임은 1자리 이상 10자리 미만으로 입력해주세요."
    });
        try {
            // 아이디 중복 확인: : 중복확인을 할때는 데이터베이스를 확인해봐야하기 때문에 데이터베이스 연동이 필요합니다
            const idRows = await userDao.userIdCheck(id); // userDao에서 userIdCheck 파라미터로 id을 넘겨줬습니다.
            if (idRows.length > 0) { // retun된 idrows 길이가 1이 넘는다면 존재한다는 의미 

                return res.json({
                    isSuccess: false,
                    code: 2031,
                    message: "중복된 아이디입니다."
                });
            }
/*
            // 닉네임 중복 확인
            const nicknameRows = await userDao.userNicknameCheck(nickname);
            if (nicknameRows.length > 0) {
                return res.json({
                    isSuccess: false,
                    code: 309,
                    message: "중복된 닉네임입니다."
                });
            }
*/
            const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex'); // 비밀번호를 저장하기위해 crypto 모듈을 이용해서 sha512 방식과 hex방식으로 변환을 해준다
            const insertUserInfoParams = [id, hashedPassword, nickName];
            
            const insertUserRows = await userDao.insertUserInfo(insertUserInfoParams); // insertUserInfo 모듈에 userinfo를 파라미터로 넘겨준다 

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "회원가입 성공"
            });
        } catch (err) { // 에러가 발생했다면 에러를 알려줍니다. 
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};

/**
 update : 2021.03.04
 02.signIn API = 로그인
 **/
exports.signIn = async function (req, res) {
    const {
        id, password
    } = req.body;

    if (!id) return res.json({isSuccess: false, code: 2019, message: "id를 입력해주세요!"});
    if (id.length < 5 || id.length > 20) return res.json({
        isSuccess: false,
        code: 2020,
        message: "id는 5자리 이상 20자리 미만으로 입력해주세요."
    });

    if (checkSpace(id)) 
    return res.json({isSuccess: false, code: 2022, message: "id에 공백을 제거해주세요"});

    if (checkSpecial(id)) 
    return res.json({isSuccess: false, code: 2023, message: "id에 특수문자는 들어갈 수 없습니다."});

    if (checkLanguage(id)) 
    return res.json({isSuccess: false, code: 2024, message: "id에는 영문과 숫자만 이용해주세요."});

    if (!password) return res.json({isSuccess: false, code: 2027, message: "비밀번호를 입력 해주세요."});
        try {
            const [userInfoRows] = await userDao.selectUserInfo(id)


            if (userInfoRows.length < 1) {
                return res.json({
                    isSuccess: false,
                    code: 2035,
                    message: "아이디를 확인해주세요."
                });
            }

             const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
             if (userInfoRows[0].userPassword !== hashedPassword) {
                 return res.json({
                     isSuccess: false,
                     code: 2036,
                     message: "비밀번호를 확인해주세요."
                 });
             }
            if (userInfoRows[0].userStatus == 1) {
                return res.json({
                    isSuccess: false,
                    code: 3010,
                    message: "비활성화 된 계정입니다. 고객센터에 문의해주세요."
                });
            } else if (userInfoRows[0].userStatus == 2) {
                return res.json({
                    isSuccess: false,
                    code: 3011,
                    message: "탈퇴 된 계정입니다. 고객센터에 문의해주세요."
                });
            }
            //토큰 생성
            let token = await jwt.sign({
                    id: userInfoRows[0].userIdx,
                }, // 토큰의 내용(payload)
                secret_config.jwtsecret, // 비밀 키
                {
                    expiresIn: '365d',
                    subject: 'userInfo',
                } // 유효 시간은 365일
            );

           return res.json({
                userInfo: {userIdx : userInfoRows[0].userIdx,
                            userNickName : userInfoRows[0].userNickName},
                jwt: token,
                isSuccess: true,
                code: 1000,
                message: "로그인 성공"
            });

        } catch (err) {
            logger.error(`App - SignIn Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
};

/**
 update : 2021.03.04
 03.changeProfile API = 프로필 변경
 **/
exports.changeProfile = async function (req, res) {
    let {
        nickName,profileUrl
    } = req.body;
    const id = req.verifiedToken.id;

    if (!nickName) return res.json({isSuccess: false, code: 2030, message: "닉네임을 입력해주세요!"});
    if (nickName.length <1 || nickName.length > 10) return res.json({
        isSuccess: false,
        code: 2021,
        message: "닉네임은 1자리 이상 10자리 미만으로 입력해주세요."
    });

    if (checkSpace(nickName)) 
    return res.json({isSuccess: false, code: 2025, message: "닉네임에 공백을 제거해주세요"});

    if (checkSpecial(nickName)) 
    return res.json({isSuccess: false, code: 2026, message: "닉네임에 특수문자는 들어갈 수 없습니다."});

        try {
            if(profileUrl == "undefined" || profileUrl == null || profileUrl == ""){
                const [userInfo] = await userDao.checkProfile(id);
                profileUrl = userInfo[0].userProfilePicture;
            }
            const [userInfoRows] = await userDao.changeUserInfo(id,nickName,profileUrl);

           return res.json({
                isSuccess: true,
                code: 1000,
                message: "프로필 정보 수정 성공!"
            });

        } catch (err) {
            logger.error(`App - change UserInfo Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
};

/**
 update : 2021.03.04
 04.changeId API = 아이디 변경
 **/
exports.changeId = async function (req, res) {
    const {
        id
    } = req.body;
    const userId = req.verifiedToken.id;

    const [statusRows] = await userDao.userStatusCheck(userId);

    if(statusRows[0].userLoginMethod != 0){
        return res.json({
            isSuccess: false,
            code: 3030,
            message: "소셜 로그인 회원은 아이디 변경을 할 수 없습니다."
        });
    }

    if (!id) return res.json({isSuccess: false, code: 2019, message: "id를 입력해주세요"});
    if (id.length < 5 || id.length > 20) return res.json({
        isSuccess: false,
        code: 2020,
        message: "id는 5자리 이상 20자리 미만으로 입력해주세요."
    });

    if (checkSpace(id)) 
    return res.json({isSuccess: false, code: 2022, message: "id에 공백을 제거해주세요"});

    if (checkSpecial(id)) 
    return res.json({isSuccess: false, code: 2023, message: "id에 특수문자는 들어갈 수 없습니다."});

    if (checkLanguage(id)) 
    return res.json({isSuccess: false, code: 2024, message: "id에는 영문과 숫자만 이용해주세요."});

        try {
            if(id == "undefined" || id == null || id == ""){
                return res.json({isSuccess: false, code: 2040, message: "id를 입력해주세요"});
            }

            const idRows = await userDao.userIdChangeCheck(id,userId); // userDao에서 userIdCheck 파라미터로 id을 넘겨줬습니다.
            if (idRows.length > 0) { // retun된 idrows 길이가 1이 넘는다면 존재한다는 의미 
                return res.json({
                    isSuccess: false,
                    code: 2031,
                    message: "중복된 아이디입니다."
                });
            }

            const [userInfoRows] = await userDao.changeUserId(id,userId);

           return res.json({
                isSuccess: true,
                code: 1000,
                message: "아이디 변경 성공!"
            });

        } catch (err) {
            logger.error(`App - change User ID Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
};


/**
 update : 2021.03.05
 05.changePassword API = 비밀번호 변경
 **/
exports.changePasswordInfo = async function (req, res) {
    const nowPassword = req.body.nowPassword;
    const changePassword = req.body.changePassword;
    const checkPassword = req.body.checkPassword;
    const userId = req.verifiedToken.id;

    const [statusRows] = await userDao.userStatusCheck(userId);

    if(statusRows[0].userLoginMethod != 0){
        return res.json({
            isSuccess: false,
            code: 3031,
            message: "소셜 로그인 회원은 비밀번호 변경을 할 수 없습니다."
        });
    }
    if(nowPassword == "undefined" || nowPassword == null || nowPassword == ""){
        return res.json({isSuccess: false, code: 2043, message: "현재 비밀번호를 입력하세요"});
    }

    const hashedPassword = await crypto.createHash('sha512').update(nowPassword).digest('hex');

    if(!(statusRows[0].userPassword === hashedPassword)){
        return res.json({
            isSuccess: false,
            code: 2044,
            message: "현재 비밀번호가 일치하지 않습니다."
        });
    }

    if(changePassword == "undefined" || changePassword == null || changePassword == ""){
        return res.json({isSuccess: false, code: 2045, message: "변경할 비밀번호를 입력하세요"});
    }
    if(checkPassword == "undefined" || checkPassword == null || checkPassword == ""){
        return res.json({isSuccess: false, code: 2046, message: "변경할 비밀번호 확인을 입력하세요"});
    }

    if (!checkPasswordLanguage(changePassword)){
    return res.json({isSuccess: false, code: 2028, message: "비밀번호는 영문과 숫자만 사용해주세요"});
    }
    if (changePassword.length < 6 || changePassword.length > 20) return res.json({
        isSuccess: false,
        code: 2047,
        message: "변경할 비밀번호는 6~20자리를 입력해주세요."
    });

    if(!(changePassword === checkPassword)){
        return res.json({isSuccess: false, code: 2048, message: "변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다."});
    }

        try {

            const hashedChangePassword = await crypto.createHash('sha512').update(changePassword).digest('hex');

        const [userInfoRows] = await userDao.changeUserPassword(hashedChangePassword,userId);

           return res.json({
                isSuccess: true,
                code: 1000,
                message: "비밀번호 변경 성공!"
            });

        } catch (err) {
            logger.error(`App - change User password Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
};

/**
 update : 2021.03.05
 06.deleteUser API = 회원 탈퇴
 **/
 exports.deleteUser = async function (req, res) {

    const id = req.verifiedToken.id;

        try {
            const [userInfoRows] = await userDao.deleteUserInfo(id);

           return res.json({
                isSuccess: true,
                code: 1000,
                message: "회원 탈퇴 성공!"
            });

        } catch (err) {
            logger.error(`App - delete UserInfo Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
};

/**
 update : 2021.03.05
 07.getUserInfo API = 회원 정보 조회
 **/
 exports.getProfile = async function (req, res) {

    const id = req.verifiedToken.id;

        try {
            const [userInfoRows] = await userDao.getUserInfo(id);

           return res.json({
                userInfo : userInfoRows[0],
                isSuccess: true,
                code: 1000,
                message: "회원 정보 조회 성공!"
            });

        } catch (err) {
            logger.error(`App - delete UserInfo Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
};

/**
 update : 2021.03.04
 00.check API = token 검증
 **/
exports.check = async function (req, res) {
    res.json({
        isSuccess: true,
        code: 200,
        message: "검증 성공",
        info: req.verifiedToken
    })
};