const jwt = require('jsonwebtoken');
const secret_config = require('./secret');
const jwtMiddleware = (req, res, next) => {
    // read the token from header or url : 클라이언트 측에서 request를 받을 때 클라이언트 측에서 x-aceess헤더에 x-access라는 토큰을 보내주게 되거나 token이라는 값을 보내주게 된다면
    const token = req.headers['x-access-token'] || req.query.token;
    // token does not exist
    if(!token) {
        return res.status(403).json({ //token이 없을 때는 로그인이 되어있지 않습니다 라는 response를 보내주고
            isSuccess:false,
            code: 403,
            message: '로그인이 되어 있지 않습니다.'
        });
    }

    // create a promise that decodes the token
    const p = new Promise( // token이 값이 있을 때는 jwt 토큰을 만들 때 방식으로 다시 풀어서 볼 수 있도록 합니다
        (resolve, reject) => { 
            jwt.verify(token, secret_config.jwtsecret , (err, verifiedToken) => {
                if(err) reject(err);
                resolve(verifiedToken)
            })
        }
    );

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        res.status(403).json({
            isSuccess:false,
            code: 403,
            message:"검증 실패"
        });
    };

    // process the promise
    p.then((verifiedToken)=>{
        //비밀 번호 바꼇을 때 검증 부분 추가 할 곳
        req.verifiedToken = verifiedToken;
        next();
    }).catch(onError)
};

module.exports = jwtMiddleware;