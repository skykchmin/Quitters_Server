const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const challengeDao = require('../dao/challengeDao');
const challengecertificationDao = require('../dao/challengecertificationDao');
const declarerobserverDao = require('../dao/declarerobserverDao');
const { constants } = require('buffer');

// 챌린지 참가
exports.insertChallengeParticipation = async function (req, res) {
    const observerIdx = req.verifiedToken.id;
    
    const {
        challengeCode
    } = req.body;

    const connection = await pool.getConnection(); // 트랜잭션 시작

    // if (checkString(challengeDeclarer) == false){
    //     return res.json({isSuccess: false, code: 2501, message: "문자를 이용해주세요"});
    // }
    
    if(!challengeCode){
        return res.json({
            isSuccess: false, 
            code: 2560, 
            message: "챌린지 코드를 입력해주세요"
        });
    }

        try {
            
            await connection.beginTransaction();

            const challengeParticipationCodeRows = await challengeDao.challengeParticipationCodeCheck(challengeCode); // 챌린지 참여코드 확인
            console.log(challengeParticipationCodeRows[0].challengeCode) // 챌린지 참여 코드

            //챌린지 코드 확인
            if(challengeCode != challengeParticipationCodeRows[0].challengeCode){
                return res.json({
                    isSuccess: false,
                    code: 2561,
                    message: "챌린지 번호를 다시 입력해주세요"
                });
            }

            const challengeIdx = challengeParticipationCodeRows[0].challengeIdx // 초대코드에 맞는 챌린지 번호 뽑아내기

            const challengeParticipationCheckNumberRows = await declarerobserverDao.challengeParticipationCheckNumber(challengeIdx); // 챌린지 참여인원 확인
            // 챌린지 참여 인원이 8명 이상일 경우
            if (challengeParticipationCheckNumberRows.length > 8){
                return res.json({
                    isSuccess: false,
                    code: 2562,
                    message: "감시자는 8명 이상 추가할 수 없습니다"
                });
            }
            // 추가된 부분 - 21.03.26 챌린지 중복 참여 방지
            const getObserverDuplicateCheckInfoParams = [challengeIdx, observerIdx];
            const getObserverDuplicateCheckInfoRows = await declarerobserverDao.getObserverDuplicateCheckInfo(getObserverDuplicateCheckInfoParams);
            
            if (getObserverDuplicateCheckInfoRows.length > 0){
                return res.json({
                    isSuccess: false,
                    code: 2563,
                    message: "이미 챌린지에 참여하고 있습니다"
                });
            }
            //

            const insertDeclarerObserverInfoParams = [challengeIdx, observerIdx];
            const insertDeclarerObserverInfoRows = await declarerobserverDao.insertDeclarerObserverInfo(insertDeclarerObserverInfoParams);

            const insertChallengeCertificationInfoParams = [challengeIdx, observerIdx];
            const insertChallengeCertificationInfoRows = await challengecertificationDao.insertChallengeCertificationInfo(insertChallengeCertificationInfoParams);

            await connection.commit();

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 참여 성공",

            });
        } catch (err) {
           await connection.rollback(); // ROLLBACK
            logger.error(`App - 챌린지 참여 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
};


// 챌린지 참여자 관리(선언자)
exports.patchChallengeParticipation = async function (req, res) {
    // const { id } = req.verifiedToken;
   
    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const observerIdx = req.params.observerIdx; 
    
    
    if(!challengeIdx){
        return res.json({
            isSuccess: false, 
            code: 2580, 
            message: "챌린지 번호를 입력해주세요"
        });
    }

    if(!observerIdx){
        return res.json({
            isSuccess: false, 
            code: 2581, 
            message: "감시자 번호를 입력해주세요"
        });
    }

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

// 챌린지 감시자 참여 중단
exports.patchChallengeStopParticipation = async function (req, res) {
    // const { id } = req.verifiedToken;
   
    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const observerIdx = req.params.observerIdx; 
    
    if(!challengeIdx){
        return res.json({
            isSuccess: false, 
            code: 2600, 
            message: "챌린지 번호를 입력해주세요"
        });
    }

    if(!observerIdx){
        return res.json({
            isSuccess: false, 
            code: 2601, 
            message: "감시자 번호를 입력해주세요"
        });
    }

        try {
            
            const patchStopDeclarerObserverInfoParams = [challengeIdx, observerIdx];
            const patchStopDeclarerObserverInfoRows = await declarerobserverDao.patchStopDeclarerObserverInfo(patchStopDeclarerObserverInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 감시자 참여중단 성공",
                data: patchStopDeclarerObserverInfoRows

            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 감시자 참여중단 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

