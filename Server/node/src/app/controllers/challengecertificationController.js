const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const challengecertificationDao = require('../dao/challengecertificationDao');
const { constants } = require('buffer');

const config = {
    apiKey: "AIzaSyAMuxxEj8mcAVMz-O7p_HNST6ebTbNf3co",
    authDomain: "nosmoking-dev.firebaseapp.com",
    appId: "1:263372481580:android:ac7d61d57585bce312dd89",
    messagingSenderId: "263372481580"
};


const admin = require('firebase-admin');

exports.getChallengeCertification = async function (req, res) {
    // const { id } = req.verifiedToken;
    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const timeNumber = req.params.timeNumber; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const connection = await pool.getConnection(); // 트랜잭션 시작

    if(!challengeIdx){
        return res.json({
            isSuccess: false, 
            code: 2660, 
            message: "챌린지 번호를 입력해주세요"
        });
    }

    if(!timeNumber){
        return res.json({
            isSuccess: false, 
            code: 2661, 
            message: "유효한 시간대 번호를 입력해주세요"
        });
    }

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

// 중간 인증 상태 변화(사용자 입력)
exports.patchChallengeCertification = async function (req, res) {
    // const { id } = req.verifiedToken;

    const {
        challengeCertificationStatus, challengeFailText
    } = req.body;

    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const observerIdx = req.params.observerIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const timeNumber = req.params.timeNumber; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    
    const connection = await pool.getConnection(); // 트랜잭션 정의
    var excludingFailureStatusCount = 0; // 실패를 제외한 횟수 

    var patchChallengeCertificationInfoParams = [challengeCertificationStatus, challengeIdx, observerIdx];
    var patchChallengeFailInfoParams = [challengeFailText, challengeIdx];

    if(!challengeIdx){
        return res.json({
            isSuccess: false, 
            code: 2680, 
            message: "챌린지 번호를 입력해주세요"
        });
    }

    if(!observerIdx){
        return res.json({
            isSuccess: false, 
            code: 2681, 
            message: "감시자 번호를 입력해주세요"
        });
    }

    if(!timeNumber){
        return res.json({
            isSuccess: false, 
            code: 2682, 
            message: "유효한 시간대 번호를 입력해주세요"
        });
    }
    

    if (!challengeCertificationStatus) return res.json({isSuccess: false, code: 2683, message: "챌린지 인증 상태를 입력해주세요"});
    if (challengeFailText.length > 60){
        return res.json({
            isSuccess: false,
            code: 2684,
            message: "실패사유는 60자리 미만으로 입력해주세요.",
          });
    }
        try {
            await connection.beginTransaction(); // 트랜잭션 시작

            if(timeNumber == 0){
                if(challengeCertificationStatus == '3'){ // 실패일 경우 
                    const patchChallengeCertificationInfoRows_0 = await challengecertificationDao.patchChallengeCertificationInfo_0(patchChallengeCertificationInfoParams); // 챌린지 인증 상태 변경
                    const patchChallengeFailInfoRows = await challengecertificationDao.patchChallengeFailInfo(patchChallengeFailInfoParams); // 챌린지 실패 전환 - 즉시 실패 전환
                    const patchChallengeIntermediateCertificationFailInfoRows_0 = await challengecertificationDao.patchChallengeIntermediateCertificationFailInfo_0(challengeIdx); // 챌린지 중간 인증 실패

                    if (!admin.apps.length) {
                        admin.initializeApp({
                            credential: admin.credential.applicationDefault()
                        });
                    }
                    const [userChallengeInfoRows] = await challengecertificationDao.challengeCheck(challengeIdx);

                    const [registrationTokens] = await challengecertificationDao.getDeviceToken(challengeIdx);

                    const [failUserInfoRows] = await challengecertificationDao.getFailUser(observerIdx);

                    if (registrationTokens.length < 1) {
                        return res.json({
                            isSuccess: true,
                            code: 1000,
                            message: "알림 기능을 켜둔 감시자가 없습니다. 챌린지 중간 상태(사용자입력)-실패 변경 성공",
                        });
                    }

                    const message = {
                        notification: {
                            title: userChallengeInfoRows[0].challengeDeclarer + ' 님의 챌린지가 실패했습니다.',
                            body: failUserInfoRows[0].userNickName + " 님이"+"'"+challengeFailText+"'"+"이라는 실패 사유를 작성했습니다."
                        },
                        data: { score: '850', time: '2:45' },
                        tokens: registrationTokens,
                    }

                    await admin.messaging().sendMulticast(message)
                        .then((response) => {
                            // Response is a message ID string.
                            console.log(response.successCount + ' messages were sent successfully');
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                            return res.json({
                                isSuccess: false,
                                code: 2000,
                                message: "푸시 알림 전송 실패"
                            });
                        });
                    return res.json({
                        isSuccess: true,
                        code: 1000,
                        message: "챌린지 중간 상태(사용자입력)-실패 변경 성공"
                    });
                }
                else{ // 실패를 제외한 경우
                    var successStatusCount = 0

                    const patchChallengeCertificationInfoRows_0 = await challengecertificationDao.patchChallengeCertificationInfo_0(patchChallengeCertificationInfoParams); // 챌린지 인증 상태 변경
                    const getChallengeCertification_0InfoRows = await challengecertificationDao.getChallengeCertification_0Info(challengeIdx); // 챌린지 조회 
                    
                    for(var i = 0; i<getChallengeCertification_0InfoRows[0].length; i++){
                        // console.log(getChallengeCertification_0InfoRows[0][i]);
                        // console.log(getChallengeCertification_0InfoRows[0][i].challengeCertificationStatus);

                        if(getChallengeCertification_0InfoRows[0][i].challengeCertificationStatus == '1'){
                            successStatusCount++;
                        }
                        
                    }
                    // console.log("성공 갯수" + successStatusCount);
                    // console.log("길이" + getChallengeCertification_0InfoRows[0].length);
                    
                    // 모두 성공일 경우 - 즉시 전환
                    if(successStatusCount == getChallengeCertification_0InfoRows[0].length){
                        const patchChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo_0(challengeIdx); // 챌린지 중간 상태 성공 전환
                        successStatusCount = 0; // 초기화
                        console.log("챌린지 중간 상태 성공(모두 성공) 전환!");
                    }

                    return res.json({
                        isSuccess: true,
                        code: 1000,
                        message: "챌린지 중간 상태(사용자입력) 변경 성공"
                    });
                }
                
            }
            else if(timeNumber == 4){
                if(challengeCertificationStatus == '3'){ // 실패일 경우 
                    const patchChallengeCertificationInfoRows_4 = await challengecertificationDao.patchChallengeCertificationInfo_4(patchChallengeCertificationInfoParams); // 챌린지 인증 상태 변경
                    const patchChallengeFailInfoRows = await challengecertificationDao.patchChallengeFailInfo(patchChallengeFailInfoParams); // 챌린지 실패 전환 - 즉시 실패 전환
                    const patchChallengeIntermediateCertificationFailInfoRows_4 = await challengecertificationDao.patchChallengeIntermediateCertificationFailInfo_4(challengeIdx); // 챌린지 중간 인증 실패

                    if (!admin.apps.length) {
                        admin.initializeApp({
                            credential: admin.credential.applicationDefault()
                        });
                    }
                    const [userChallengeInfoRows] = await challengecertificationDao.challengeCheck(challengeIdx);

                    const [registrationTokens] = await challengecertificationDao.getDeviceToken(challengeIdx);

                    const [failUserInfoRows] = await challengecertificationDao.getFailUser(observerIdx);

                    if (registrationTokens.length < 1) {
                        return res.json({
                            isSuccess: true,
                            code: 1000,
                            message: "알림 기능을 켜둔 감시자가 없습니다. 챌린지 중간 상태(사용자입력)-실패 변경 성공",
                        });
                    }

                    const message = {
                        notification: {
                            title: userChallengeInfoRows[0].challengeDeclarer + ' 님의 챌린지가 실패했습니다.',
                            body: failUserInfoRows[0].userNickName + " 님이"+"'"+challengeFailText+"'"+"이라는 실패 사유를 작성했습니다."
                        },
                        data: { score: '850', time: '2:45' },
                        tokens: registrationTokens,
                    }

                    await admin.messaging().sendMulticast(message)
                        .then((response) => {
                            // Response is a message ID string.
                            console.log(response.successCount + ' messages were sent successfully');
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                            return res.json({
                                isSuccess: false,
                                code: 2000,
                                message: "푸시 알림 전송 실패"
                            });
                        });

                    return res.json({
                        isSuccess: true,
                        code: 1000,
                        message: "챌린지 중간 상태(사용자입력)-실패 변경 성공"
                    });
                }
                else{ // 실패를 제외한 경우
                    var successStatusCount = 0

                    const patchChallengeCertificationInfoRows_4 = await challengecertificationDao.patchChallengeCertificationInfo_4(patchChallengeCertificationInfoParams); // 챌린지 인증 상태 변경
                    const getChallengeCertification_4InfoRows = await challengecertificationDao.getChallengeCertification_4Info(challengeIdx); // 챌린지 조회 
                    
                    for(var i = 0; i<getChallengeCertification_4InfoRows[0].length; i++){
                        // console.log(getChallengeCertification_4InfoRows[0][i]);
                        // console.log(getChallengeCertification_4InfoRows[0][i].challengeCertificationStatus);

                        if(getChallengeCertification_4InfoRows[0][i].challengeCertificationStatus == '1'){
                            successStatusCount++;
                        }
                        
                    }
                    // console.log("성공 갯수" + successStatusCount);
                    // console.log("길이" + getChallengeCertification_4InfoRows[0].length);
                    
                    // 모두 성공일 경우 - 즉시 전환
                    if(successStatusCount == getChallengeCertification_4InfoRows[0].length){
                        const patchChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo_4(challengeIdx); // 챌린지 중간 상태 성공 전환
                        successStatusCount = 0; // 초기화
                        console.log("챌린지 중간 상태 성공(모두 성공) 전환!");
                    }

                    return res.json({
                        isSuccess: true,
                        code: 1000,
                        message: "챌린지 중간 상태(사용자입력) 변경 성공"
                    });
                }
            }
            else if(timeNumber == 8){
                if(challengeCertificationStatus == '3'){ // 실패일 경우 
                    const patchChallengeCertificationInfoRows_8 = await challengecertificationDao.patchChallengeCertificationInfo_8(patchChallengeCertificationInfoParams); // 챌린지 인증 상태 변경
                    const patchChallengeFailInfoRows = await challengecertificationDao.patchChallengeFailInfo(patchChallengeFailInfoParams); // 챌린지 실패 전환 - 즉시 실패 전환
                    const patchChallengeIntermediateCertificationFailInfoRows_8 = await challengecertificationDao.patchChallengeIntermediateCertificationFailInfo_8(challengeIdx); // 챌린지 중간 인증 실패

                    if (!admin.apps.length) {
                        admin.initializeApp({
                            credential: admin.credential.applicationDefault()
                        });
                    }
                    const [userChallengeInfoRows] = await challengecertificationDao.challengeCheck(challengeIdx);

                    const [registrationTokens] = await challengecertificationDao.getDeviceToken(challengeIdx);

                    const [failUserInfoRows] = await challengecertificationDao.getFailUser(observerIdx);

                    if (registrationTokens.length < 1) {
                        return res.json({
                            isSuccess: true,
                            code: 1000,
                            message: "알림 기능을 켜둔 감시자가 없습니다. 챌린지 중간 상태(사용자입력)-실패 변경 성공",
                        });
                    }

                    const message = {
                        notification: {
                            title: userChallengeInfoRows[0].challengeDeclarer + ' 님의 챌린지가 실패했습니다.',
                            body: failUserInfoRows[0].userNickName + " 님이"+"'"+challengeFailText+"'"+"이라는 실패 사유를 작성했습니다."
                        },
                        data: { score: '850', time: '2:45' },
                        tokens: registrationTokens,
                    }

                    await admin.messaging().sendMulticast(message)
                        .then((response) => {
                            // Response is a message ID string.
                            console.log(response.successCount + ' messages were sent successfully');
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                            return res.json({
                                isSuccess: false,
                                code: 2000,
                                message: "푸시 알림 전송 실패"
                            });
                        });

                    return res.json({
                        isSuccess: true,
                        code: 1000,
                        message: "챌린지 중간 상태(사용자입력)-실패 변경 성공"
                    });
                }
                else{ // 실패를 제외한 경우
                    var successStatusCount = 0

                    const patchChallengeCertificationInfoRows_8 = await challengecertificationDao.patchChallengeCertificationInfo_8(patchChallengeCertificationInfoParams); // 챌린지 인증 상태 변경
                    const getChallengeCertification_8InfoRows = await challengecertificationDao.getChallengeCertification_8Info(challengeIdx); // 챌린지 조회 
                    
                    for(var i = 0; i<getChallengeCertification_8InfoRows[0].length; i++){
                        // console.log(getChallengeCertification_8InfoRows[0][i]);
                        // console.log(getChallengeCertification_8InfoRows[0][i].challengeCertificationStatus);

                        if(getChallengeCertification_8InfoRows[0][i].challengeCertificationStatus == '1'){
                            successStatusCount++;
                        }
                        
                    }
                    // console.log("성공 갯수" + successStatusCount);
                    // console.log("길이" + getChallengeCertification_8InfoRows[0].length);
                    
                    // 모두 성공일 경우 - 즉시 전환
                    if(successStatusCount == getChallengeCertification_8InfoRows[0].length){
                        const patchChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo_8(challengeIdx); // 챌린지 중간 상태 성공 전환
                        successStatusCount = 0; // 초기화
                        console.log("챌린지 중간 상태 성공(모두 성공) 전환!");
                    }

                    return res.json({
                        isSuccess: true,
                        code: 1000,
                        message: "챌린지 중간 상태(사용자입력) 변경 성공"
                    });
                }
            }
            else if(timeNumber == 12){
                if(challengeCertificationStatus == '3'){ // 실패일 경우 
                    const patchChallengeCertificationInfoRows_12 = await challengecertificationDao.patchChallengeCertificationInfo_12(patchChallengeCertificationInfoParams); // 챌린지 인증 상태 변경
                    const patchChallengeFailInfoRows = await challengecertificationDao.patchChallengeFailInfo(patchChallengeFailInfoParams); // 챌린지 실패 전환 - 즉시 실패 전환
                    const patchChallengeIntermediateCertificationFailInfoRows_12 = await challengecertificationDao.patchChallengeIntermediateCertificationFailInfo_12(challengeIdx); // 챌린지 중간 인증 실패

                    if (!admin.apps.length) {
                        admin.initializeApp({
                            credential: admin.credential.applicationDefault()
                        });
                    }
                    const [userChallengeInfoRows] = await challengecertificationDao.challengeCheck(challengeIdx);

                    const [registrationTokens] = await challengecertificationDao.getDeviceToken(challengeIdx);

                    const [failUserInfoRows] = await challengecertificationDao.getFailUser(observerIdx);

                    if (registrationTokens.length < 1) {
                        return res.json({
                            isSuccess: true,
                            code: 1000,
                            message: "알림 기능을 켜둔 감시자가 없습니다. 챌린지 중간 상태(사용자입력)-실패 변경 성공",
                        });
                    }

                    const message = {
                        notification: {
                            title: userChallengeInfoRows[0].challengeDeclarer + ' 님의 챌린지가 실패했습니다.',
                            body: failUserInfoRows[0].userNickName + " 님이"+"'"+challengeFailText+"'"+"이라는 실패 사유를 작성했습니다."
                        },
                        data: { score: '850', time: '2:45' },
                        tokens: registrationTokens,
                    }

                    await admin.messaging().sendMulticast(message)
                        .then((response) => {
                            // Response is a message ID string.
                            console.log(response.successCount + ' messages were sent successfully');
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                            return res.json({
                                isSuccess: false,
                                code: 2000,
                                message: "푸시 알림 전송 실패"
                            });
                        });

                    return res.json({
                        isSuccess: true,
                        code: 1000,
                        message: "챌린지 중간 상태(사용자입력)-실패 변경 성공"
                    });
                }
                else{ // 실패를 제외한 경우
                    var successStatusCount = 0

                    const patchChallengeCertificationInfoRows_12 = await challengecertificationDao.patchChallengeCertificationInfo_12(patchChallengeCertificationInfoParams); // 챌린지 인증 상태 변경
                    const getChallengeCertification_12InfoRows = await challengecertificationDao.getChallengeCertification_12Info(challengeIdx); // 챌린지 조회 
                    
                    for(var i = 0; i<getChallengeCertification_12InfoRows[0].length; i++){
                        // console.log(getChallengeCertification_12InfoRows[0][i]);
                        // console.log(getChallengeCertification_12InfoRows[0][i].challengeCertificationStatus);

                        if(getChallengeCertification_12InfoRows[0][i].challengeCertificationStatus == '1'){
                            successStatusCount++;
                        }
                        
                    }
                    // console.log("성공 갯수" + successStatusCount);
                    // console.log("길이" + getChallengeCertification_12InfoRows[0].length);
                    
                    // 모두 성공일 경우 - 즉시 전환
                    if(successStatusCount == getChallengeCertification_12InfoRows[0].length){
                        const patchChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo_12(challengeIdx); // 챌린지 중간 상태 성공 전환
                        successStatusCount = 0; // 초기화
                        console.log("챌린지 중간 상태 성공(모두 성공) 전환!");
                    }

                    return res.json({
                        isSuccess: true,
                        code: 1000,
                        message: "챌린지 중간 상태(사용자입력) 변경 성공"
                    });
                }
            }
            else if(timeNumber == 16){
                if(challengeCertificationStatus == '3'){ // 실패일 경우 
                    const patchChallengeCertificationInfoRows_16 = await challengecertificationDao.patchChallengeCertificationInfo_16(patchChallengeCertificationInfoParams); // 챌린지 인증 상태 변경
                    const patchChallengeFailInfoRows = await challengecertificationDao.patchChallengeFailInfo(patchChallengeFailInfoParams); // 챌린지 실패 전환 - 즉시 실패 전환
                    const patchChallengeIntermediateCertificationFailInfoRows_16 = await challengecertificationDao.patchChallengeIntermediateCertificationFailInfo_16(challengeIdx); // 챌린지 중간 인증 실패

                    if (!admin.apps.length) {
                        admin.initializeApp({
                            credential: admin.credential.applicationDefault()
                        });
                    }
                    const [userChallengeInfoRows] = await challengecertificationDao.challengeCheck(challengeIdx);

                    const [registrationTokens] = await challengecertificationDao.getDeviceToken(challengeIdx);

                    const [failUserInfoRows] = await challengecertificationDao.getFailUser(observerIdx);

                    if (registrationTokens.length < 1) {
                        return res.json({
                            isSuccess: true,
                            code: 1000,
                            message: "알림 기능을 켜둔 감시자가 없습니다. 챌린지 중간 상태(사용자입력)-실패 변경 성공",
                        });
                    }

                    const message = {
                        notification: {
                            title: userChallengeInfoRows[0].challengeDeclarer + ' 님의 챌린지가 실패했습니다.',
                            body: failUserInfoRows[0].userNickName + " 님이"+"'"+challengeFailText+"'"+"이라는 실패 사유를 작성했습니다."
                        },
                        data: { score: '850', time: '2:45' },
                        tokens: registrationTokens,
                    }

                    await admin.messaging().sendMulticast(message)
                        .then((response) => {
                            // Response is a message ID string.
                            console.log(response.successCount + ' messages were sent successfully');
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                            return res.json({
                                isSuccess: false,
                                code: 2000,
                                message: "푸시 알림 전송 실패"
                            });
                        });

                    return res.json({
                        isSuccess: true,
                        code: 1000,
                        message: "챌린지 중간 상태(사용자입력)-실패 변경 성공"
                    });
                }
                else{ // 실패를 제외한 경우
                    var successStatusCount = 0

                    const patchChallengeCertificationInfoRows_16 = await challengecertificationDao.patchChallengeCertificationInfo_16(patchChallengeCertificationInfoParams); // 챌린지 인증 상태 변경
                    const getChallengeCertification_16InfoRows = await challengecertificationDao.getChallengeCertification_16Info(challengeIdx); // 챌린지 조회 
                    
                    for(var i = 0; i<getChallengeCertification_16InfoRows[0].length; i++){
                        // console.log(getChallengeCertification_16InfoRows[0][i]);
                        // console.log(getChallengeCertification_16InfoRows[0][i].challengeCertificationStatus);

                        if(getChallengeCertification_16InfoRows[0][i].challengeCertificationStatus == '1'){
                            successStatusCount++;
                        }
                        
                    }
                    // console.log("성공 갯수" + successStatusCount);
                    // console.log("길이" + getChallengeCertification_16InfoRows[0].length);
                    
                    // 모두 성공일 경우 - 즉시 전환
                    if(successStatusCount == getChallengeCertification_16InfoRows[0].length){
                        const patchChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo_16(challengeIdx); // 챌린지 중간 상태 성공 전환
                        successStatusCount = 0; // 초기화
                        console.log("챌린지 중간 상태 성공(모두 성공) 전환!");
                    }

                    return res.json({
                        isSuccess: true,
                        code: 1000,
                        message: "챌린지 중간 상태(사용자입력) 변경 성공"
                    });
                }
            }
            else if(timeNumber == 20){
                if(challengeCertificationStatus == '3'){ // 실패일 경우 
                    const patchChallengeCertificationInfoRows_20 = await challengecertificationDao.patchChallengeCertificationInfo_20(patchChallengeCertificationInfoParams); // 챌린지 인증 상태 변경
                    const patchChallengeFailInfoRows = await challengecertificationDao.patchChallengeFailInfo(patchChallengeFailInfoParams); // 챌린지 실패 전환 - 즉시 실패 전환
                    const patchChallengeIntermediateCertificationFailInfoRows_20 = await challengecertificationDao.patchChallengeIntermediateCertificationFailInfo_20(challengeIdx); // 챌린지 중간 인증 실패

                    if (!admin.apps.length) {
                        admin.initializeApp({
                            credential: admin.credential.applicationDefault()
                        });
                    }
                    const [userChallengeInfoRows] = await challengecertificationDao.challengeCheck(challengeIdx);

                    const [registrationTokens] = await challengecertificationDao.getDeviceToken(challengeIdx);

                    const [failUserInfoRows] = await challengecertificationDao.getFailUser(observerIdx);

                    if (registrationTokens.length < 1) {
                        return res.json({
                            isSuccess: true,
                            code: 1000,
                            message: "알림 기능을 켜둔 감시자가 없습니다. 챌린지 중간 상태(사용자입력)-실패 변경 성공",
                        });
                    }

                    const message = {
                        notification: {
                            title: userChallengeInfoRows[0].challengeDeclarer + ' 님의 챌린지가 실패했습니다.',
                            body: failUserInfoRows[0].userNickName + " 님이"+"'"+challengeFailText+"'"+"이라는 실패 사유를 작성했습니다."
                        },
                        data: { score: '850', time: '2:45' },
                        tokens: registrationTokens,
                    }

                    await admin.messaging().sendMulticast(message)
                        .then((response) => {
                            // Response is a message ID string.
                            console.log(response.successCount + ' messages were sent successfully');
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                            return res.json({
                                isSuccess: false,
                                code: 2000,
                                message: "푸시 알림 전송 실패"
                            });
                        });

                    return res.json({
                        isSuccess: true,
                        code: 1000,
                        message: "챌린지 중간 상태(사용자입력)-실패 변경 성공"
                    });
                }
                else{ // 실패를 제외한 경우
                    var successStatusCount = 0

                    const patchChallengeCertificationInfoRows_20 = await challengecertificationDao.patchChallengeCertificationInfo_20(patchChallengeCertificationInfoParams); // 챌린지 인증 상태 변경
                    const getChallengeCertification_20InfoRows = await challengecertificationDao.getChallengeCertification_20Info(challengeIdx); // 챌린지 조회 
                    
                    for(var i = 0; i<getChallengeCertification_20InfoRows[0].length; i++){
                        // console.log(getChallengeCertification_20InfoRows[0][i]);
                        // console.log(getChallengeCertification_20InfoRows[0][i].challengeCertificationStatus);
                        
                        if(getChallengeCertification_20InfoRows[0][i].challengeCertificationStatus == '1'){
                            successStatusCount++;
                        }
                        
                    }
                    // console.log("성공 갯수" + successStatusCount);
                    // console.log("길이" + getChallengeCertification_20InfoRows[0].length);
                    
                    // 모두 성공일 경우 - 즉시 전환
                    if(successStatusCount == getChallengeCertification_20InfoRows[0].length){
                        const patchChallengeIntermediateCertificationInfoRows = await challengecertificationDao.patchChallengeIntermediateCertificationSuccessInfo_20(challengeIdx); // 챌린지 중간 상태 성공 전환
                        successStatusCount = 0; // 초기화
                        console.log("챌린지 중간 상태 성공(모두 성공) 전환!");
                    }

                    return res.json({
                        isSuccess: true,
                        code: 1000,
                        message: "챌린지 중간 상태(사용자입력) 변경 성공"
                    });
                }
            }

            await connection.commit();
            
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App -챌린지 중간 상태(사용자입력) 변경 성공 Query error\n: ${err.message}`);
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





