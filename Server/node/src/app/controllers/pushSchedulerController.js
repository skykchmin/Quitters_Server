const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');

const pushScheduleDao = require('../dao/pushScheduleDao');


// 일시 정지 세팅 체크
exports.updatePausePush = async function (req, res) {

    console.log("푸시 알림 일시 정지 체크");
        try {
            const userPushInfoRows = await pushScheduleDao.setUserPushAlarm();

           return true;

        } catch (err) {
            logger.error(`App - set Schedule Pause Push alarm Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
};

// 방해 금지 push 알람 ON
exports.updateSilencePushOn = async function (req, res) {

    console.log("방해 금지 알림 on 체크");
        try {
            const pushOnRows = await pushScheduleDao.setUserPushOn();

           return true;

        } catch (err) {
            logger.error(`App - set Schedule Push alarm On Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
};

// 방해 금지 push 알림 OFF
exports.updateSilencePushOff = async function (req, res) {

    console.log("방해 금지 알림 off 체크");
        try {
            const pushOffRows = await pushScheduleDao.setUserPushOff();

           return true;

        } catch (err) {
            logger.error(`App - set Schedule Push alarm Off Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
};