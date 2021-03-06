const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const challengeDao = require('../dao/challengeDao');
const declarerobserverDao = require('../dao/declarerobserverDao');
const { constants } = require('buffer');


// 한글, 영문, 숫자 체크
function checkString(string) { 
    var checkText = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,10}$/;
    if(checkText.test(string) == true) { 
        return true; 
       } 
    else { 
        return false; 
    } 
}



//챌린지생성
exports.insertChallenge = async function (req, res) {
    // const { id } = req.verifiedToken;
   
    const {
        userIdx, challengeStartDate, challengeEndDate, smokingAmount, cigarattePrice, challengeDeclarer, challengeText, challengeCreateTime, challengeUpdateTime
    } = req.body

    function makeRandomChallengeCode(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 6; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    
    if (checkString(challengeDeclarer) == false){
        return res.json({isSuccess: false, code: 2501, message: "선언자는 한글, 영문만 이용해주세요"});
    }
    
        try {
            var challengeCode = makeRandomChallengeCode()
            console.log(challengeCode)
            const challengeCodeRows = await challengeDao.challengeCodeCheck(challengeCode);
            
            //중복이 있다면 재할당
            if(challengeCodeRows.length > 0){
                var challengeCode = makeRandomChallengeCode()
            } else {
                return true;
            }

            const insertChallengeInfoParams = [userIdx, challengeStartDate, challengeEndDate, smokingAmount, cigarattePrice, challengeDeclarer, challengeText, challengeCode, challengeCreateTime, challengeUpdateTime];
            const insertChallengeInfoRows = await challengeDao.insertChallengeInfo(insertChallengeInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 생성 성공",
                data: insertChallengeInfoRows

            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 생성 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 챌린지 수정
exports.patchChallenge = async function (req, res) {
    // const { id } = req.verifiedToken;
    const {
        challengeStartDate, challengeEndDate, smokingAmount, cigarattePrice, challengeDeclarer, challengeText
    } = req.body;

    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것

        try {
            
            const patchChallengeInfoParams = [challengeStartDate, challengeEndDate, smokingAmount, cigarattePrice, challengeDeclarer, challengeText, challengeIdx];
            const patchChallengeInfoRows = await challengeDao.patchChallengeInfo(patchChallengeInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 수정 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 수정 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 챌린지 삭제
exports.deleteChallenge = async function (req, res) {
    // const { id } = req.verifiedToken;

    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것

        try {
            
            // const deleteChallengeInfoParams = [challengeIdx];
            const deleteChallengeInfoRows = await challengeDao.deleteChallengeInfo(challengeIdx);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 삭제 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 삭제 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 챌린지 참가  
exports.insertChallengeParticipation = async function (req, res) {
    // const { id } = req.verifiedToken;
   
    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const observerIdx = req.params.observerIdx; 

    // if (checkString(challengeDeclarer) == false){
    //     return res.json({isSuccess: false, code: 2501, message: "문자를 이용해주세요"});
    // }
    
        try {
            const challengeParticipationCodeRows = await challengeDao.challengeParticipationCodeCheck(challengeIdx); // 챌린지 참여코드 확인
            console.log(challengeParticipationCodeRows)

            const insertDeclarerObserverInfoParams = [challengeIdx, observerIdx];
            const insertDeclarerObserverInfoRows = await declarerobserverDao.insertDeclarerObserverInfo(insertDeclarerObserverInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 참여 성공",
                data: insertDeclarerObserverInfoRows

            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 참여 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};