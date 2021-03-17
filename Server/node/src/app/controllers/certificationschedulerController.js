const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const certificationschedulerDao = require('../dao/certificationschedulerDao');
const challengecertificationDao = require('../dao/challengecertificationDao');

const { constants } = require('buffer');

// 챌린지 인증 추가
exports.updateChallengeParticipation = async function (req, res) {
    
    const connection = await pool.getConnection(); // 트랜잭션 시작

        try {
            
            await connection.beginTransaction();
            const getChallengeDeclarerObserverInfoRows = await certificationschedulerDao.getChallengeDeclarerObserverInfo(); // 친구의 챌린지 조회

            for(var i = 0; i < getChallengeDeclarerObserverInfoRows[0].length; i++){
                // console.log(getChallengeDeclarerObserverInfoRows[0][i])
                // console.log(getChallengeDeclarerObserverInfoRows[0][i].challengeIdx)
                // console.log(getChallengeDeclarerObserverInfoRows[0][i].observerIdx)

                var updateCertificationChallengeIdx = getChallengeDeclarerObserverInfoRows[0][i].challengeIdx;
                var updateCertificationObserverIdx = getChallengeDeclarerObserverInfoRows[0][i].observerIdx;

                const updateChallengeCertificationInfoParams = [updateCertificationChallengeIdx,  updateCertificationObserverIdx];
                const updateChallengeCertificationInfoRows = await certificationschedulerDao.updateChallengeCertificationInfo(updateChallengeCertificationInfoParams);
            }
            
            await connection.commit();
            console.log("감시자 자동 추가 이벤트 성공!");
            return true;
            
        } catch (err) {
            await connection.rollback(); // ROLLBACK
            console.log("감시자 자동 추가 이벤트 실패!");
            logger.error(`App - 챌린지 참여 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
};

// 챌린지 중간 인증 추가
exports.updateIntermediateCertification = async function (req, res) {
    
    const connection = await pool.getConnection(); // 트랜잭션 시작

        try {
            
            await connection.beginTransaction();
            const getChallengeStatusInfoRows = await certificationschedulerDao.getChallengeStatusInfo(); // 챌린지 진행여부 조회

            for(var i = 0; i < getChallengeStatusInfoRows[0].length; i++){
                console.log(getChallengeStatusInfoRows[0][i])
                // console.log(getChallengeStatusInfoRows[0][i].challengeIdx)
                var updateCertificationIntermediateChallengeIdx = getChallengeStatusInfoRows[0][i].challengeIdx;
                const updateChallengeIntermediateCertificationInfoParams = [updateCertificationIntermediateChallengeIdx];
                const updateChallengeIntermediateCertificationInfoRows = await certificationschedulerDao.updateChallengeIntermediateCertificationInfo(updateChallengeIntermediateCertificationInfoParams);
            }
            
            await connection.commit();
            console.log("챌린지 중간 인증 자동 추가 이벤트 성공!");
            return true;
            
        } catch (err) {
            await connection.rollback(); // ROLLBACK
            console.log("챌린지 중간 인증 자동 추가 이벤트 실패!");
            logger.error(`App - 챌린지 중간 인증 자동 추가 이벤트 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
};

// 중간 인증 상태 변화(자동)
exports.patchAutoChallengeIntermediateCertification = async function (req, res) {
    // const { id } = req.verifiedToken;

    // const timeNumber = req.params.timeNumber; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const connection = await pool.getConnection(); // 트랜잭션 정의
    var excludingFailureStatusCount = 0; // 실패를 제외한 횟수 
    
        try {
            temp = [];
            await connection.beginTransaction(); // 트랜잭션 시작

            const getChallengeStatusInfoRows = await certificationschedulerDao.getChallengeStatusInfo(); // 챌린지 진행여부 조회 

            // for(var i = 0; i < getChallengeStatusInfoRows[0].length; i++){
            //     // console.log(getChallengeStatusInfoRows[0][i].challengeIdx)
            //     var patchAutoChallengeIntermediateCertificationChallengeIdx = getChallengeStatusInfoRows[0][i].challengeIdx; // 챌린지 번호 뽑아오기
            //     const patchAutoChallengeIntermediateCertificationInfoParams = [patchAutoChallengeIntermediateCertificationChallengeIdx];
            //     const patchAutoChallengeIntermediateCertificationInfoRows = await certificationschedulerDao.patchAutoChallengeIntermediateCertificationInfo(patchAutoChallengeIntermediateCertificationInfoParams);
            // }
            
            for(var i = 0; i < getChallengeStatusInfoRows[0].length; i++){
                // console.log(getChallengeStatusInfoRows[0][i]);
                // console.log(getChallengeStatusInfoRows[0][i].challengeIdx)

                var challengeIdx = getChallengeStatusInfoRows[0][i].challengeIdx; // 챌린지 번호 뽑아오기
                temp.push(challengeIdx);
                // const getChallengeCertification_0InfoParams = ChallengeIdx; // 뽑아온 챌린지 번호를 매개변수로 만들어서
                // console.log(challengeIdx);
                // console.log(getChallengeCertification_0InfoParams);
                // console.log(typeof getChallengeCertification_0InfoParams);
                
                
                // console.log(getChallengeCertification_0InfoRows[0]);
            
                // 성공, 몰라요가 섞여 있을 경우 
                // for(var i = 0; i <getChallengeCertification_0InfoRows[0].length; i++){
                //     // console.log(getChallengeCertification_0InfoRows[0][i]);
                //     if(getChallengeCertification_0InfoRows[0][i].challengeCertificationStatus != '1' ){
                //         excludingFailureStatusCount++;
                //     }
                    
                // }
                //const patchAutoChallengeIntermediateCertificationInfoParams = [patchAutoChallengeIntermediateCertificationChallengeIdx]; // 뽑아온 챌린지 번호를 매개변수로 만들기
                // const patchAutoChallengeIntermediateCertificationInfoRows = await certificationschedulerDao.patchAutoChallengeIntermediateCertificationInfo(patchAutoChallengeIntermediateCertificationInfoParams);
            }
            // console.log(temp); // 뽑아온 챌린지 번호

            // for(var i = 0; i < temp.length; i++ ){
            //     // console.log(temp[i])
            //     const getChallengeCertification_0InfoRows = await certificationschedulerDao.getChallengeCertification_0Info(temp[i]);
            //     console.log(getChallengeCertification_0InfoRows) //    
            // }
            const getChallengeCertification_0InfoRows = await certificationschedulerDao.getChallengeCertification_0Info(); // 챌린지 진행여부 조회 
            for(var i = 0; i < getChallengeCertification_0InfoRows.length; i++){
                console.log(getChallengeCertification_0InfoRows[i]);
                // console.log(getChallengeCertification_0InfoRows[i].challengeCertificationStatus);
            }
            // console.log(getChallengeCertification_0InfoRows[0]);
            // for(var i = 0; i <getChallengeCertification_0InfoRows[0].length; i++){
            //     console.log(getChallengeCertification_0InfoRows[0][i]);
            // }
        
            await connection.commit();
            console.log("챌린지 중간 인증 상태 성공 전환!");
            // return true;
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 중간 상태 성공 전환",
                // challengeCertificationList: getChallengeCertification_0InfoRows[0],
            });
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 중간 상태 성공 전환 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
      
};



///

// exports.updateChallengeParticipation = async function (req, res) {
//     // const { id } = req.verifiedToken;

//     const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
//     const observerIdx = req.params.observerIdx; 

//     // if (checkString(challengeDeclarer) == false){
//     //     return res.json({isSuccess: false, code: 2501, message: "문자를 이용해주세요"});
//     // }
    
//         try {
            
//             const getChallengeDeclarerObserverInfoRows = await challengecertificationDao.getChallengeDeclarerObserverInfo(); // 친구의 챌린지 조회

//             for(var i = 0; i < getChallengeDeclarerObserverInfoRows[0].length; i++){
//                 console.log(getChallengeDeclarerObserverInfoRows[0][i])
//                 console.log(getChallengeDeclarerObserverInfoRows[0][i].challengeIdx)
//                 console.log(getChallengeDeclarerObserverInfoRows[0][i].observerIdx)

//                 var updateCertificationChallengeIdx = getChallengeDeclarerObserverInfoRows[0][i].challengeIdx;
//                 var updateCertificationObserverIdx = getChallengeDeclarerObserverInfoRows[0][i].observerIdx;

//                 const updateChallengeCertificationInfoParams = [updateCertificationChallengeIdx,  updateCertificationObserverIdx];
//                 const updateChallengeCertificationInfoRows = await challengecertificationDao.updateChallengeCertificationInfo(updateChallengeCertificationInfoParams);
//             }
            
//             console.log("감시자 자동 추가 이벤트 성공!");
//             return true;
            
//             // return res.json({
//             //     isSuccess: true,
//             //     code: 1000,
//             //     message: "메인 조회 성공",
//             //     myChallenge:getChallengeDeclarerObserverInfoRows[0],
//             // });

//         } catch (err) {
//             // await connection.rollback(); // ROLLBACK
//             console.log("감시자 자동 추가 이벤트 실패!");
//             logger.error(`App - 챌린지 참여 Query error\n: ${err.message}`);
//             return res.status(4000).send(`Error: ${err.message}`);
//         } 
// };


// temp - 실험용

// exports.updateChallengeParticipation = async function (req, res) {
//     // const { id } = req.verifiedToken;

//     const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
//     const observerIdx = req.params.observerIdx; 

//     // if (checkString(challengeDeclarer) == false){
//     //     return res.json({isSuccess: false, code: 2501, message: "문자를 이용해주세요"});
//     // }
    
//         try {
            
//             const getChallengeDeclarerObserverInfoRows = await challengecertificationDao.getChallengeDeclarerObserverInfo(observerIdx); // 친구의 챌린지 조회

//             for(var i = 0; i < getChallengeDeclarerObserverInfoRows[0].length; i++){
//                 console.log(getChallengeDeclarerObserverInfoRows[0][i])
//                 console.log(getChallengeDeclarerObserverInfoRows[0][i].challengeIdx)
//                 console.log(getChallengeDeclarerObserverInfoRows[0][i].observerIdx)

//                 var updateCertificationChallengeIdx = getChallengeDeclarerObserverInfoRows[0][i].challengeIdx;
//                 var updateCertificationObserverIdx = getChallengeDeclarerObserverInfoRows[0][i].observerIdx;

//                 const updateChallengeCertificationInfoParams = [updateCertificationChallengeIdx,  updateCertificationObserverIdx];
//                 const updateChallengeCertificationInfoRows = await challengecertificationDao.updateChallengeCertificationInfo(updateChallengeCertificationInfoParams);
//             }
            

//             // const updateChallengeCertificationInfoParams = [challengeIdx, observerIdx];
//             // const updateChallengeCertificationInfoRows = await challengecertificationDao.updateChallengeCertificationInfo(updateChallengeCertificationInfoParams);

//             // console.log("감시자 자동 추가 이벤트 성공!");
//             // return true;
            
//             return res.json({
//                 isSuccess: true,
//                 code: 1000,
//                 message: "메인 조회 성공",
//                 myChallenge:getChallengeDeclarerObserverInfoRows[0],
//             });

//         } catch (err) {
//             // await connection.rollback(); // ROLLBACK
//             logger.error(`App - 챌린지 참여 Query error\n: ${err.message}`);
//             return res.status(4000).send(`Error: ${err.message}`);
//         } 
// };