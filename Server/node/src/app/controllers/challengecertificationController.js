const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
var cron = require('node-cron')
// const challengecertificationDao = require('../dao/challengecertificationDao');
const { constants } = require('buffer');


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
