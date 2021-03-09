const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const socialDao = require('../dao/socialDao');
const { constants } = require('buffer');


// 카카오 로그인
exports.getKakao = async function (req, res) {
      let naverUser;
      var header = "Bearer " + req.headers['access-token'];
      var api_url = 'https://kapi.kakao.com/v2/user/me';
       var request = require('request');
       var options = {
           url: api_url,
           headers: {'Authorization': header}
        };
        
       request.get(options, async function (error, responses, body) {
         if (!error && responses.statusCode == 200) {
           const temp = await JSON.parse(body);
           
        
           try {
               const nickName = temp.properties.nickname;
               const email = temp.kakao_account.email;
               const profileUrl = temp.properties.profile_image;

               const userRows = await socialDao.userCheck(email);
    
               if (!(userRows.length > 0)) {
    
                const hashedPassword = await crypto.createHash('sha512').update('quitters').digest('hex');
                const insertUserRows = await socialDao.insertUserInfo(nickName,email,profileUrl,1,hashedPassword);
    
                const [userInfoRows] = await socialDao.selectUserInfo(email);
    
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
                    jwt: token,
                    isSuccess: true,
                    code: 1000,
                    message: "신규 회원 카카오 로그인 성공"
                });
                }
    
                else{
    
                    const [userInfoRows] = await socialDao.selectUserInfo(email);
    
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
    
              return  res.json({
                    jwt: token,
                    isSuccess: true,
                    code: 1000,
                    message: "기존 회원 카카오 로그인 성공"
                });
    
                }
            }
                catch (err) {
                    logger.error(`App - login Query error\n: ${err.message}`);
                    return res.json({
                        isSuccess: false,
                        code: 2000,
                        message: "카카오 로그인 실패",
                    });
                }
            }
          else {
           console.log('error');
           if(responses != null) {
             console.log('error = ' + responses.statusCode);
             return res.json({
              isSuccess: false,
              code: 3203,
              message: "카카오 토큰이 유효하지 않습니다!"
          });
           }
         }
       });
    };