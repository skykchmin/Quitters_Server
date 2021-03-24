const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const certificationschedulerDao = require('../dao/certificationschedulerDao');
const challengecertificationDao = require('../dao/challengecertificationDao');

const { constants } = require('buffer');


// function getFormatDate(date){
//     var year = date.getFullYear();
//     var month = (1 + date.getMonth());
//     month = month > 10 ? month : '0' + month; // 10이 넘지 않으면 앞에 0을 붙인다
//     var day = date.getDate();
//     day = day > 10 ? day : '0' + day; // 10이 넘지 않으면 앞에 0을 붙인다
//     var hours = date.getHours();
//     hours = hours > 10 ? hours : '0' + hours; // 10이 넘지 않으면 앞에 0을 붙인다
//     var minutes = date.getMinutes();
//     minutes =  minutes > 10 ? minutes : '0' + minutes; // 10이 넘지 않으면 앞에 0을 붙인다
//     var seconds = date.getSeconds();
//     seconds = seconds > 10 ? seconds : '0' + seconds; // 10이 넘지 않으면 앞에 0을 붙인다

//     // return year + '-' + month + '-' + day;
//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} `
// }

// 종료 날짜에 따른 챌린지 성공 전환
exports.updateChallengeSuccess = async function (req, res) {
    
    try {
        const updateChallengeSuccessInfoRows = await certificationschedulerDao.updateChallengeSuccessInfo(); // 챌린지 진행여부 조회

        console.log("챌린지 종료일에 따른 챌린지 성공 전환 성공!");
        return true;     
    } catch (err) {
        await connection.rollback(); // ROLLBACK
        console.log("챌린지 종료일에 따른 챌린지 성공 전환 실패!");
        logger.error(`App - 챌린지 중간 인증 자동 추가 이벤트 Query error\n: ${err.message}`);
        return res.status(4000).send(`Error: ${err.message}`);
    }
};

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
                // console.log(getChallengeStatusInfoRows[0][i])
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

exports.patchAutoChallengeIntermediateCertification = async function (req, res) {
    // const { id } = req.verifiedToken;

    var date = new Date();
    var hours = date.getHours();

    const connection = await pool.getConnection(); // 트랜잭션 정의
    
    if(hours >= 0 && hours < 4){
        try {
            
            await connection.beginTransaction(); // 트랜잭션 시작

            const getChallengeStatusInfoRows = await certificationschedulerDao.getChallengeStatusInfo(); // 챌린지 진행여부 조회 

            for(var i = 0; i < getChallengeStatusInfoRows[0].length; i++){    
                var patchAutoChallengeIntermediateCertificationChallengeIdx = getChallengeStatusInfoRows[0][i].challengeIdx; // 챌린지 번호 뽑아오기
                // console.log(patchAutoChallengeIntermediateCertificationChallengeIdx);
                const patchAutoChallengeIntermediateCertificationInfoParams = [patchAutoChallengeIntermediateCertificationChallengeIdx];
                const patchAutoChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo_20(patchAutoChallengeIntermediateCertificationInfoParams);
            }
            
            await connection.commit();
            console.log("챌린지 중간 인증 상태 어제 20시 ~  24시 성공 전환!");
            return true;
           
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
           logger.error(`App - 챌린지 중간 인증 상태 어제 20시 ~  24시 성공 전환 Query error\n: ${JSON.stringify(err)}`);
           return false;
        } finally {
            connection.release();
        }
    }
    else if(hours >= 4 && hours < 8){
        try {
            
            await connection.beginTransaction(); // 트랜잭션 시작

            const getChallengeStatusInfoRows = await certificationschedulerDao.getChallengeStatusInfo(); // 챌린지 진행여부 조회 

            for(var i = 0; i < getChallengeStatusInfoRows[0].length; i++){    
                var patchAutoChallengeIntermediateCertificationChallengeIdx = getChallengeStatusInfoRows[0][i].challengeIdx; // 챌린지 번호 뽑아오기
                // console.log(patchAutoChallengeIntermediateCertificationChallengeIdx);
                const patchAutoChallengeIntermediateCertificationInfoParams = [patchAutoChallengeIntermediateCertificationChallengeIdx];
                const patchAutoChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo_0(patchAutoChallengeIntermediateCertificationInfoParams);
            }
            
            await connection.commit();
            console.log("챌린지 중간 인증 상태 0시 ~ 4시 성공 전환!");
            return true;
            
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 중간 인증 상태 0시 ~ 4시 성공 전환 Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    }
    else if(hours >= 8 && hours < 12){
        try {
            
            await connection.beginTransaction(); // 트랜잭션 시작

            const getChallengeStatusInfoRows = await certificationschedulerDao.getChallengeStatusInfo(); // 챌린지 진행여부 조회 

            for(var i = 0; i < getChallengeStatusInfoRows[0].length; i++){    
                var patchAutoChallengeIntermediateCertificationChallengeIdx = getChallengeStatusInfoRows[0][i].challengeIdx; // 챌린지 번호 뽑아오기
                // console.log(patchAutoChallengeIntermediateCertificationChallengeIdx);
                const patchAutoChallengeIntermediateCertificationInfoParams = [patchAutoChallengeIntermediateCertificationChallengeIdx];
                const patchAutoChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo_4(patchAutoChallengeIntermediateCertificationInfoParams);
            }
            
            await connection.commit();
            console.log("챌린지 중간 인증 상태 4시 ~ 8시 성공 전환!");
            return true;
            
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 중간 인증 상태 4시 ~ 8시 성공 Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    }
    else if(hours >= 12 && hours < 16){
        try {
            await connection.beginTransaction(); // 트랜잭션 시작

            const getChallengeStatusInfoRows = await certificationschedulerDao.getChallengeStatusInfo(); // 챌린지 진행여부 조회 

            for(var i = 0; i < getChallengeStatusInfoRows[0].length; i++){    
                var patchAutoChallengeIntermediateCertificationChallengeIdx = getChallengeStatusInfoRows[0][i].challengeIdx; // 챌린지 번호 뽑아오기
                // console.log(patchAutoChallengeIntermediateCertificationChallengeIdx);
                const patchAutoChallengeIntermediateCertificationInfoParams = [patchAutoChallengeIntermediateCertificationChallengeIdx];
                const patchAutoChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo_8(patchAutoChallengeIntermediateCertificationInfoParams);
            }
            
            await connection.commit();
            console.log("챌린지 중간 인증 상태 8시 ~ 12시 성공 전환!");
            return true;
            
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 중간 인증 상태 8시 ~ 12시 성공 전환 Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    }
    else if(hours >= 16 && hours < 20){
        try {
            
            await connection.beginTransaction(); // 트랜잭션 시작

            const getChallengeStatusInfoRows = await certificationschedulerDao.getChallengeStatusInfo(); // 챌린지 진행여부 조회 

            for(var i = 0; i < getChallengeStatusInfoRows[0].length; i++){    
                var patchAutoChallengeIntermediateCertificationChallengeIdx = getChallengeStatusInfoRows[0][i].challengeIdx; // 챌린지 번호 뽑아오기
                // console.log(patchAutoChallengeIntermediateCertificationChallengeIdx);
                const patchAutoChallengeIntermediateCertificationInfoParams = [patchAutoChallengeIntermediateCertificationChallengeIdx];
                const patchAutoChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo_12(patchAutoChallengeIntermediateCertificationInfoParams);
            }
            
            await connection.commit();
            console.log("챌린지 중간 인증 상태 12시~16시 성공 전환!");
            return true;
            
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 중간 인증 상태 12시~16시 성공 전환 Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    }
    else if(hours >= 20 && hours < 24){
        try {
            
            await connection.beginTransaction(); // 트랜잭션 시작

            const getChallengeStatusInfoRows = await certificationschedulerDao.getChallengeStatusInfo(); // 챌린지 진행여부 조회 

            for(var i = 0; i < getChallengeStatusInfoRows[0].length; i++){    
                var patchAutoChallengeIntermediateCertificationChallengeIdx = getChallengeStatusInfoRows[0][i].challengeIdx; // 챌린지 번호 뽑아오기
                // console.log(patchAutoChallengeIntermediateCertificationChallengeIdx);
                const patchAutoChallengeIntermediateCertificationInfoParams = [patchAutoChallengeIntermediateCertificationChallengeIdx];
                const patchAutoChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo_16(patchAutoChallengeIntermediateCertificationInfoParams);
                
            }
            
            await connection.commit();
            console.log("챌린지 중간 인증 상태 16시~20시 성공 전환!");
            return true;
            
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 중간 인증 상태 16시~20시 성공 전환 Query error\n: ${err.message}`);
            return false;
        } finally {
            connection.release();
        }
    }
      
};





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