const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
var cron = require('node-cron')
const certificationschedulerDao = require('../dao/certificationschedulerDao');
const { constants } = require('buffer');

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