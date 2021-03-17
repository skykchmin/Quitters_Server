const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const challengecertificationDao = require('../dao/challengecertificationDao');
const { constants } = require('buffer');

exports.getChallengeCertification = async function (req, res) {
    // const { id } = req.verifiedToken;
    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const timeNumber = req.params.timeNumber; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const connection = await pool.getConnection(); // 트랜잭션 시작

    if(timeNumber == 0){
        try {
            await connection.beginTransaction();

            const getChallengeCheckListContentInfoRows = await challengecertificationDao.getChallengeCheckListContentInfo(challengeIdx); // 챌린지 인증목록 상단 챌린지 내용 확인
            const getChallengeIntermediateCertification_0InfoRows = await challengecertificationDao.getChallengeIntermediateCertification_0Info(challengeIdx); // 챌린지 중간 인증 확인
            const getChallengeCertification_0InfoRows = await challengecertificationDao.getChallengeCertification_0Info(challengeIdx); //
            

            await connection.commit();
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "인증목록 0시~4시 조회 성공",
                challengeContent: getChallengeCheckListContentInfoRows[0],
                challengeIntermediateCertificationStatus: getChallengeIntermediateCertification_0InfoRows[0],
                challengeCertificationList: getChallengeCertification_0InfoRows[0]
            });
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 인증목록 0시~4시 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
    }
    
    else if(timeNumber == 4){
        try {
            await connection.beginTransaction();

            const getChallengeCheckListContentInfoRows = await challengecertificationDao.getChallengeCheckListContentInfo(challengeIdx); // 챌린지 인증목록 상단 챌린지 내용 확인
            const getChallengeIntermediateCertification_4InfoRows = await challengecertificationDao.getChallengeIntermediateCertification_4Info(challengeIdx); // 챌린지 중간 인증 확인
            const getChallengeCertification_4InfoRows = await challengecertificationDao.getChallengeCertification_4Info(challengeIdx); //

            await connection.commit();
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "인증목록 4시~8시 조회 성공",
                challengeContent: getChallengeCheckListContentInfoRows[0],
                challengeIntermediateCertificationStatus: getChallengeIntermediateCertification_4InfoRows[0],
                challengeCertificationList: getChallengeCertification_4InfoRows[0]
            });
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 인증목록 4시~8시 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
    }
    
    else if(timeNumber == 8){
        try {
            await connection.beginTransaction();

            const getChallengeCheckListContentInfoRows = await challengecertificationDao.getChallengeCheckListContentInfo(challengeIdx); // 챌린지 인증목록 상단 챌린지 내용 확인
            const getChallengeIntermediateCertification_8InfoRows = await challengecertificationDao.getChallengeIntermediateCertification_8Info(challengeIdx); // 챌린지 중간 인증 확인
            const getChallengeCertification_8InfoRows = await challengecertificationDao.getChallengeCertification_8Info(challengeIdx); //

            await connection.commit();
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "인증목록 8시~12시 조회 성공",
                challengeContent: getChallengeCheckListContentInfoRows[0],
                challengeIntermediateCertificationStatus: getChallengeIntermediateCertification_8InfoRows[0],
                challengeCertificationList: getChallengeCertification_8InfoRows[0]
            });
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 인증목록 8시~12시 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
    }  

    else if(timeNumber == 12){
        try {
            await connection.beginTransaction();

            const getChallengeCheckListContentInfoRows = await challengecertificationDao.getChallengeCheckListContentInfo(challengeIdx); // 챌린지 인증목록 상단 챌린지 내용 확인
            const getChallengeIntermediateCertification_12InfoRows = await challengecertificationDao.getChallengeIntermediateCertification_12Info(challengeIdx); // 챌린지 중간 인증 확인
            const getChallengeCertification_12InfoRows = await challengecertificationDao.getChallengeCertification_12Info(challengeIdx); //

            await connection.commit();
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "인증목록 12시~16시 조회 성공",
                challengeContent: getChallengeCheckListContentInfoRows[0],
                challengeIntermediateCertificationStatus: getChallengeIntermediateCertification_12InfoRows[0],
                challengeCertificationList: getChallengeCertification_12InfoRows[0]
            });
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 인증목록 12시~16시 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
    }  

    else if(timeNumber == 16){
        try {
            await connection.beginTransaction();

            const getChallengeCheckListContentInfoRows = await challengecertificationDao.getChallengeCheckListContentInfo(challengeIdx); // 챌린지 인증목록 상단 챌린지 내용 확인
            const getChallengeIntermediateCertification_16InfoRows = await challengecertificationDao.getChallengeIntermediateCertification_16Info(challengeIdx); // 챌린지 중간 인증 확인
            const getChallengeCertification_16InfoRows = await challengecertificationDao.getChallengeCertification_16Info(challengeIdx); //

            await connection.commit();
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "인증목록 16시~20시 조회 성공",
                challengeContent: getChallengeCheckListContentInfoRows[0],
                challengeIntermediateCertificationStatus: getChallengeIntermediateCertification_16InfoRows[0],
                challengeCertificationList: getChallengeCertification_16InfoRows[0]
            });
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 인증목록 16시~20시 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
    }  

    else if(timeNumber == 20){
        try {
            await connection.beginTransaction();

            const getChallengeCheckListContentInfoRows = await challengecertificationDao.getChallengeCheckListContentInfo(challengeIdx); // 챌린지 인증목록 상단 챌린지 내용 확인
            const getChallengeIntermediateCertification_20InfoRows = await challengecertificationDao.getChallengeIntermediateCertification_20Info(challengeIdx); // 챌린지 중간 인증 확인
            const getChallengeCertification_20InfoRows = await challengecertificationDao.getChallengeCertification_20Info(challengeIdx); //

            await connection.commit();
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "인증목록 20시~24시 조회 성공",
                challengeContent: getChallengeCheckListContentInfoRows[0],
                challengeIntermediateCertificationStatus: getChallengeIntermediateCertification_20InfoRows[0],
                challengeCertificationList: getChallengeCertification_20InfoRows[0]
            });
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 인증목록 20시~24시 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
    }  
};

// 중간 인증 상태 변화(자동)
exports.patchAutoChallengeIntermediateCertification = async function (req, res) {
    // const { id } = req.verifiedToken;
    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const timeNumber = req.params.timeNumber; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const connection = await pool.getConnection(); // 트랜잭션 정의
    var excludingFailureStatusCount = 0; // 실패를 제외한 횟수 

        try {
            await connection.beginTransaction(); // 트랜잭션 시작

            const getChallengeCertification_0InfoRows = await challengecertificationDao.getChallengeCertification_0Info(challengeIdx); //

            // // 전부 성공일 경우
            for(var i = 0; i <getChallengeCertification_0InfoRows[0].length; i++){
                // console.log(getChallengeCertification_0InfoRows[0][i].challengeCertificationStatus);
                // console.log(getChallengeCertification_0InfoRows[0][i]);
                console.log(getChallengeCertification_0InfoRows[0][i].challengeCertificationStatus); // string
                
                // if(getChallengeCertification_0InfoRows[0][i].challengeCertificationStatus == '1'){
                //     successStatusCount++;
                // }
                
            }

            // console.log("성공 갯수" + successStatusCount);
            // console.log("길이" + getChallengeCertification_0InfoRows[0].length);

            // if(successStatusCount == getChallengeCertification_0InfoRows[0].length){
            //     console.log("챌린지 중간 상태 성공(모두 성공) 전환!");
            //     const patchChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo(challengeIdx); // 챌린지 중간 상태 성공 전환
            // }

            // 성공, 몰라요가 섞여 있을 경우 
            for(var i = 0; i <getChallengeCertification_0InfoRows[0].length; i++){
                // console.log(getChallengeCertification_0InfoRows[0][i]);
                if(getChallengeCertification_0InfoRows[0][i].challengeCertificationStatus != '3' ){
                    excludingFailureStatusCount++;
                }
                
            }

            if(excludingFailureStatusCount == getChallengeCertification_0InfoRows[0].length){
                console.log("챌린지 중간 상태 성공(자동) 전환!");
                const patchChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo(challengeIdx); // 챌린지 중간 상태 성공 전환
            }

            await connection.commit();
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 중간 상태 성공 전환",
                challengeCertificationList: getChallengeCertification_0InfoRows[0],
            });
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 인증목록 0시~4시 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
      
};







////

// exports.getChallengeCertification_0 = async function (req, res) {
//     // const { id } = req.verifiedToken;
//     const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
//     const connection = await pool.getConnection(); // 트랜잭션 시작

//         try {
//             await connection.beginTransaction();

//             const getChallengeCheckListContentInfoRows = await challengecertificationDao.getChallengeCheckListContentInfo(challengeIdx); // 챌린지 인증목록 상단 챌린지 내용 확인
//             const getChallengeCertification_0InfoRows = await challengecertificationDao.getChallengeCertification_0Info(challengeIdx); //

//             await connection.commit();
//             return res.json({
//                 isSuccess: true,
//                 code: 1000,
//                 message: "인증목록 0시~4시 조회 성공",
//                 challengeContent: getChallengeCheckListContentInfoRows[0],
//                 challengeCertificationList: getChallengeCertification_0InfoRows[0]
//             });
//         } catch (err) {
//             await connection.rollback(); // ROLLBACK
//            // connection.release();
//             logger.error(`App - 인증목록 0시~4시 조회 Query error\n: ${err.message}`);
//             return res.status(4000).send(`Error: ${err.message}`);
//         } finally {
//             connection.release();
//         }
// };





