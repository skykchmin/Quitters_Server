const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const challengeDao = require('../dao/challengeDao');
const declarerobserverDao = require('../dao/declarerobserverDao');
const { constants } = require('buffer');

// 챌린지 참가  
exports.insertChallengeParticipation = async function (req, res) {
    // const { id } = req.verifiedToken;
   
    const {
        challengeCode
    } = req.body;

    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const observerIdx = req.params.observerIdx; 

    // if (checkString(challengeDeclarer) == false){
    //     return res.json({isSuccess: false, code: 2501, message: "문자를 이용해주세요"});
    // }
    
        try {
            const challengeParticipationCheckNumberRows = await declarerobserverDao.challengeParticipationCheckNumber(challengeIdx); // 챌린지 참여인원 확인
            // 챌린지 참여 인원이 8명 이상일 경우
            if (challengeParticipationCheckNumberRows.length > 8){
                return res.json({
                    isSuccess: false,
                    code: 2600,
                    message: "감시자는 8명 이상 추가할 수 없습니다"
                });
            }
            
            const challengeParticipationCodeRows = await challengeDao.challengeParticipationCodeCheck(challengeIdx); // 챌린지 참여코드 확인
            console.log(challengeParticipationCodeRows[0].challengeCode) // 챌린지 참여 코드

            //챌린지 코드 확인
            if(challengeCode != challengeParticipationCodeRows[0].challengeCode){
                return res.json({
                    isSuccess: false,
                    code: 2601,
                    message: "챌린지 번호를 다시 입력해주세요"
                });
            }

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

// 챌린지 참여자 관리  
exports.patchChallengeParticipation = async function (req, res) {
    // const { id } = req.verifiedToken;
   
    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const observerIdx = req.params.observerIdx; 
    
        try {
            
            const patchDeclarerObserverInfoParams = [challengeIdx, observerIdx];
            const patchDeclarerObserverInfoRows = await declarerobserverDao.patchDeclarerObserverInfo(patchDeclarerObserverInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 참여자 삭제 성공",
                data: patchDeclarerObserverInfoRows

            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 참여자 삭제 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};