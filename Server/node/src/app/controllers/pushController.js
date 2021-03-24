const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');

const pushDao = require('../dao/pushDao');


const config = {
    apiKey: "AIzaSyAMuxxEj8mcAVMz-O7p_HNST6ebTbNf3co",
    authDomain: "nosmoking-dev.firebaseapp.com",
    appId: "1:263372481580:android:ac7d61d57585bce312dd89",
    messagingSenderId: "263372481580"
};


const admin = require('firebase-admin');

// 푸시 알람 설정
exports.setPush = async function (req, res) {

    const id = req.verifiedToken.id;
    const status = req.body.status;

    if(status == "undefined" || status == null || status == ""){
        return res.json({
            isSuccess: false,
            code: 2360,
            message: "status를 입력해주세요"
        });
    }
    if(!(status == 'Y' || status == 'N')){
        return res.json({
            isSuccess: false,
            code: 2361,
            message: "status는 Y나 N만 입력해주세요"
        });
    }

        try {
            const [userPushInfoRows] = await pushDao.setUserPush(id,status);

           return res.json({
                isSuccess: true,
                code: 1000,
                message: "푸시 알람 설정 완료"
            });

        } catch (err) {
            return res.json({
                isSuccess: false,
                code: 2000,
                message: "푸시 알람 설정 실패",
            });
        }
};

// 푸시 알람 일시 정지
exports.setPause = async function (req, res) {

    const id = req.verifiedToken.id;
    const time = req.body.time;

    if(time == "undefined" || time == null || time == ""){
        return res.json({
            isSuccess: false,
            code: 2370,
            message: "time을 입력해주세요"
        });
    }
    if(!(time == 1 || time == 3 || time == 8)){
        return res.json({
            isSuccess: false,
            code: 2371,
            message: "time은 1,3,8만 입력해주세요"
        });
    }

        try {
            const [userPauseCheckRows] = await pushDao.checkPause(id);
            
            if(userPauseCheckRows.length < 1){
                const userPauseInsertRows = await pushDao.insertPause(id,time);

                return res.json({
                    isSuccess: true,
                    code: 1000,
                    message: "알림 일시중지 설정 완료"
                });
            }

            else{
                
                const userPauseRows = await pushDao.updatePause(id,time);
                
                return res.json({
                    isSuccess: true,
                    code: 1000,
                    message: "알림 일시중지 설정 완료"
                });
            }

        } catch (err) {
            return res.json({
                isSuccess: false,
                code: 2000,
                message: "알림 일시중지 설정 실패",
            });
        }
};

// 방해 금지 모드 설정
exports.setSilence = async function (req, res) {

    const id = req.verifiedToken.id;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;

    let pattern = /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/;

    if(startTime == "undefined" || startTime == null || startTime == ""){
        return res.json({
            isSuccess: false,
            code: 2380,
            message: "startTime을 입력해주세요"
        });
    }

    if(endTime == "undefined" || endTime == null || endTime == ""){
        return res.json({
            isSuccess: false,
            code: 2381,
            message: "endTime을 입력해주세요"
        });
    }

    if(!(pattern.test(startTime) || pattern.test(endTime))){
        return res.json({
            isSuccess: false,
            code: 2382,
            message: "startTime과 endTime의 형식은 HH:MM의 형태로 해주세요"
        });
    }

        try {
            const [userSilenceCheckRows] = await pushDao.checkSilence(id);
            
            if(userSilenceCheckRows.length < 1){
                const userSilenceInsertRows = await pushDao.insertSilence(id,startTime,endTime);

                return res.json({
                    isSuccess: true,
                    code: 1000,
                    message: "방해금지 모드 설정 완료"
                });
            }

            else{
                
                const userSilenceRows = await pushDao.updateSilence(id,startTime,endTime);
                
                return res.json({
                    isSuccess: true,
                    code: 1000,
                    message: "방해금지 모드 설정 완료"
                });
            }

        } catch (err) {
            return res.json({
                isSuccess: false,
                code: 2000,
                message: "방해금지 모드 설정 실패",
            });
        }
};


// 방해금지 끄기
exports.setSilenceOff = async function (req, res) {

    const id = req.verifiedToken.id;

        try {
            const userSilenceOffRows = await pushDao.setUserSilenceOff(id);

           return res.json({
                isSuccess: true,
                code: 1000,
                message: "방해 금지 모드 해제 완료"
            });

        } catch (err) {
            return res.json({
                isSuccess: false,
                code: 2000,
                message: "방해 금지 모드 해제 실패",
            });
        }
};


// 인증 요청 메시지 전송

exports.postRequest = async function (req, res) {

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
    }

    const challengeId = req.body.challengeId;
    const id = req.verifiedToken.id;

    const [userChallengeInfoRows] = await pushDao.challengeCheck(id, challengeId);

    if (userChallengeInfoRows.length < 1) {
        return res.json({
            isSuccess: false,
            code: 2420,
            message: "인증 요청 권한이 없습니다.",
        });
    }
    const [observerCheckRows] = await pushDao.checkObserver(challengeId);

    if (observerCheckRows.length < 1) {
        return res.json({
            isSuccess: false,
            code: 2421,
            message: "참여중인 감시자가 없습니다.",
        });
    }

    const [registrationTokens] = await pushDao.getDeviceToken(challengeId);

    if (registrationTokens.length < 1) {
        return res.json({
            isSuccess: false,
            code: 2422,
            message: "알림 기능을 켜둔 감시자가 없습니다.",
        });
    }

    const message = {
        notification: {
            title: userChallengeInfoRows[0].challengeDeclarer + ' 님의 챌린지가 잘 진행되고 있나요?',
            body: userChallengeInfoRows[0].challengeDeclarer + ' 님이 챌린지 인증을 요청하였습니다.'
        },
        data: { score: '850', time: '2:45' },
        tokens: registrationTokens,
    }

    await admin.messaging().sendMulticast(message)
        .then((response) => {
            // Response is a message ID string.
            console.log(response.successCount + ' messages were sent successfully');
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "푸시 알림 전송 성공"
            });
        })
        .catch((error) => {
            console.log('Error sending message:', error);
            return res.json({
                isSuccess: false,
                code: 2000,
                message: "푸시 알림 전송 실패"
            });
        });
};
