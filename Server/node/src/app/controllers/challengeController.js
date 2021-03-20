const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const challengeDao = require('../dao/challengeDao');
const challengecertificationDao = require('../dao/challengecertificationDao');
// const declarerobserverDao = require('../dao/declarerobserverDao');
const { constants } = require('buffer');


// 한글, 영문, 숫자 체크
function checkString(string) { 
    var checkText = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,10}$/;
    if(checkText.test(string) == true) { 
        return true; 
       } 
    else { 
        return false; 
    } 
}

// DateFormat
function getFormatDate(date){
    var year = date.getFullYear();
    var month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month; // 10이 넘지 않으면 앞에 0을 붙인다
    var day = date.getDate();
    day = day >= 10 ? day : '0' + day; // 10이 넘지 않으면 앞에 0을 붙인다
    return year + '-' + month + '-' + day;
}


//챌린지생성
exports.insertChallenge = async function (req, res) {
    // const { id } = req.verifiedToken;
   
    const connection = await pool.getConnection(); // 트랜잭션 정의

    const {
        userIdx, challengeStartDate, challengeEndDate, smokingAmount, cigarattePrice, challengeDeclarer, challengeText, challengeCreateTime, challengeUpdateTime
    } = req.body

    function makeRandomChallengeCode(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 6; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    
    if(!userIdx){
        return res.json({
            isSuccess: false, 
            code: 2500, 
            message: "유저번호를 입력해주세요"
        });
    }

    if(!challengeStartDate){
        return res.json({
            isSuccess: false, 
            code: 2501, 
            message: "시작일을 입력해주세요"
        });
    }

    if(!challengeEndDate){
        return res.json({
            isSuccess: false, 
            code: 2502, 
            message: "종료일을 입력해주세요"
        });
    }

    if(!smokingAmount || smokingAmount < 0){
        return res.json({
            isSuccess: false, 
            code: 2503, 
            message: "유효한 하루흡연량을 입력해주세요"
        });
    }

    if(!cigarattePrice || cigarattePrice < 0){
        return res.json({
            isSuccess: false, 
            code: 2504, 
            message: "유효한 담배 한 갑의 가격을 입력해주세요"
        });
    }

    if(!challengeDeclarer){
        return res.json({
            isSuccess: false, 
            code: 2505, 
            message: "선언자를 입력해주세요"
        });
    }

    if(!challengeText){
        return res.json({
            isSuccess: false, 
            code: 2506, 
            message: "실패 공약을 입력해주세요"
        });
    }
    
    if (checkString(challengeDeclarer) == false){
        return res.json({isSuccess: false, code: 2507, message: "선언자는 한글, 영문만 이용해주세요"});
    }
    
    var date = getFormatDate(new Date()); // 오늘 날짜 지정

    // 시작일이 오늘 날짜보다 과거일 경우
    if (challengeStartDate < date){
        return res.json({
            isSuccess: false, 
            code: 2508, 
            message: "유효한 시작일을 선택해주세요"
        });
    } 

    // 종료일이 오늘 날짜보다 과거일 경우
    if (challengeEndDate < date){
        return res.json({
            isSuccess: false, 
            code: 2509, 
            message: "유효한 종료일을 선택해주세요"
        });
    }

    // 시작일이 종료일 보다 빠를 경우 
    if (challengeStartDate > challengeEndDate){
        return res.json({
            isSuccess: false, 
            code: 2510, 
            message: "시작일은 종료일보다 빠를 수 없습니다"
        });
    }
        try {
            await connection.beginTransaction(); // 트랜잭션 시작

            var challengeCode = makeRandomChallengeCode()
            console.log(challengeCode)
            const challengeCodeRows = await challengeDao.challengeCodeCheck(challengeCode);
            
            //중복이 있다면 재할당
            if(challengeCodeRows.length > 0){
                var challengeCode = makeRandomChallengeCode()
            } else {
                return true;
            }

            // 챌린지 1개 이상 
            const challengeDuplicateCheckInfoRows = await challengeDao.challengeDuplicateCheckInfo(userIdx);
            console.log(challengeDuplicateCheckInfoRows[0].length);
            if(challengeDuplicateCheckInfoRows[0].length > 0){
                return res.json({
                    isSuccess: false, 
                    code: 2511, 
                    message: "나의 챌린지는 한 개 이상 등록할 수 없습니다"
                });
            }

            const insertChallengeInfoParams = [userIdx, challengeStartDate, challengeEndDate, smokingAmount, cigarattePrice, challengeDeclarer, challengeText, challengeCode, challengeCreateTime, challengeUpdateTime];
            const insertChallengeInfoRows = await challengeDao.insertChallengeInfo(insertChallengeInfoParams);

            await connection.commit();
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 생성 성공",
                data: insertChallengeInfoRows

            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 생성 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
};

// 챌린지 수정
exports.patchChallenge = async function (req, res) {
    // const { id } = req.verifiedToken;
    const {
        challengeStartDate, challengeEndDate, smokingAmount, cigarattePrice, challengeDeclarer, challengeText
    } = req.body;

    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것

    if(!challengeStartDate){
        return res.json({
            isSuccess: false, 
            code: 2520, 
            message: "시작일을 입력해주세요"
        });
    }

    if(!challengeEndDate){
        return res.json({
            isSuccess: false, 
            code: 2521, 
            message: "종료일을 입력해주세요"
        });
    }

    if(!smokingAmount || smokingAmount < 0){
        return res.json({
            isSuccess: false, 
            code: 2522, 
            message: "유효한 하루흡연량을 입력해주세요"
        });
    }

    if(!cigarattePrice || cigarattePrice < 0){
        return res.json({
            isSuccess: false, 
            code: 2523, 
            message: "유효한 담배 한 갑의 가격을 입력해주세요"
        });
    }

    if(!challengeDeclarer){
        return res.json({
            isSuccess: false, 
            code: 2524, 
            message: "선언자를 입력해주세요"
        });
    }

    if(!challengeText){
        return res.json({
            isSuccess: false, 
            code: 2525, 
            message: "실패 공약을 입력해주세요"
        });
    }
    
    if (checkString(challengeDeclarer) == false){
        return res.json({isSuccess: false, code: 2526, message: "선언자는 한글, 영문만 이용해주세요"});
    }
    
    var date = getFormatDate(new Date()); // 오늘 날짜 지정

    // 시작일이 오늘 날짜보다 과거일 경우
    if (challengeStartDate < date){
        return res.json({
            isSuccess: false, 
            code: 2527, 
            message: "유효한 시작일을 선택해주세요"
        });
    } 

    // 종료일이 오늘 날짜보다 과거일 경우
    if (challengeEndDate < date){
        return res.json({
            isSuccess: false, 
            code: 2528, 
            message: "유효한 종료일을 선택해주세요"
        });
    }

    // 시작일이 종료일 보다 빠를 경우 
    if (challengeStartDate > challengeEndDate){
        return res.json({
            isSuccess: false, 
            code: 2529, 
            message: "시작일은 종료일보다 빠를 수 없습니다"
        });
    }
        try {
            
            const patchChallengeInfoParams = [challengeStartDate, challengeEndDate, smokingAmount, cigarattePrice, challengeDeclarer, challengeText, challengeIdx];
            const patchChallengeInfoRows = await challengeDao.patchChallengeInfo(patchChallengeInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 수정 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 수정 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 챌린지 삭제
exports.deleteChallenge = async function (req, res) {
    // const { id } = req.verifiedToken;

    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것

        if(!challengeIdx){
            return res.json({
                isSuccess: false, 
                code: 2540, 
                message: "챌린지 번호를 입력해주세요"
            });
        }

        try {
            
            // const deleteChallengeInfoParams = [challengeIdx];
            const deleteChallengeInfoRows = await challengeDao.deleteChallengeInfo(challengeIdx);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 삭제 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 삭제 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 메인
exports.getMain = async function (req, res) {
    // const { id } = req.verifiedToken;

    const userIdx = req.params.userIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const observerIdx = req.params.userIdx;

    const connection = await pool.getConnection(); // 트랜잭션 정의

    if(!userIdx){
        return res.json({
            isSuccess: false, 
            code: 2620, 
            message: "유저 번호를 입력해주세요"
        });
    }

        try {
            await connection.beginTransaction(); // 트랜잭션 시작

            const getMyChallengeInfoRows = await challengeDao.getMyChallengeInfo(userIdx); // 나의 챌린지 조회
            const getFriendsChallengeInfoRows = await challengeDao.getFriendsChallengeInfo(observerIdx); // 친구의 챌린지 조회

            await connection.commit();
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "메인 조회 성공",
                myChallenge: getMyChallengeInfoRows[0],
                friendsChallenge: getFriendsChallengeInfoRows[0]
            });
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 메인 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
};

// 챌린지 상세조회
exports.getChallengeDetail = async function (req, res) {
    // const { id } = req.verifiedToken;
    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const connection = await pool.getConnection(); // 트랜잭션 정의
    
    if(!challengeIdx){
        return res.json({
            isSuccess: false, 
            code: 2640, 
            message: "챌린지 번호를 입력해주세요"
        });
    }
        try {
            await connection.beginTransaction(); // 트랜잭션 시작

            const getChallengeDetailInfoRows = await challengeDao.getChallengeDetailInfo(challengeIdx) // 챌린지 인증목록 상단 챌린지 내용 확인
            const getChallengeIntermediateCertification_0InfoRows = await challengecertificationDao.getChallengeIntermediateCertification_0Info(challengeIdx); // 챌린지 중간 인증 확인
            const getChallengeIntermediateCertification_4InfoRows = await challengecertificationDao.getChallengeIntermediateCertification_4Info(challengeIdx); // 챌린지 중간 인증 확인
            const getChallengeIntermediateCertification_8InfoRows = await challengecertificationDao.getChallengeIntermediateCertification_8Info(challengeIdx); // 챌린지 중간 인증 확인
            const getChallengeIntermediateCertification_12InfoRows = await challengecertificationDao.getChallengeIntermediateCertification_12Info(challengeIdx); // 챌린지 중간 인증 확인
            const getChallengeIntermediateCertification_16InfoRows = await challengecertificationDao.getChallengeIntermediateCertification_16Info(challengeIdx); // 챌린지 중간 인증 확인
            const getChallengeIntermediateCertification_20InfoRows = await challengecertificationDao.getChallengeIntermediateCertification_20Info(challengeIdx); // 챌린지 중간 인증 확인
            const getChallengeObserverInfoRows = await challengeDao.getChallengeObserverInfo(challengeIdx);

            await connection.commit();
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 상세조회 성공",
                challengeContent: getChallengeDetailInfoRows[0],
                challengeIntermediateCertificationStatus_0: getChallengeIntermediateCertification_0InfoRows[0],
                challengeIntermediateCertificationStatus_4: getChallengeIntermediateCertification_4InfoRows[0],
                challengeIntermediateCertificationStatus_8: getChallengeIntermediateCertification_8InfoRows[0],
                challengeIntermediateCertificationStatus_12: getChallengeIntermediateCertification_12InfoRows[0],
                challengeIntermediateCertificationStatus_16: getChallengeIntermediateCertification_16InfoRows[0],
                challengeIntermediateCertificationStatus_20: getChallengeIntermediateCertification_20InfoRows[0],
                challengeObserverInfo: getChallengeObserverInfoRows[0]
            });
        } catch (err) {
            await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 챌린지 상세조회 성공" Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        } finally {
            connection.release();
        }
      
};

// 챌린지 실패메시지 - 알림
exports.getChallengeFailMessage = async function (req, res) {
    // const { id } = req.verifiedToken;

    const challengeIdx = req.params.challengeIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    const observerIdx = req.params.observerIdx;

    if(!challengeIdx){
        return res.json({
            isSuccess: false, 
            code: 2700, 
            message: "챌린지 번호를 입력해주세요"
        });
    }

    if(!observerIdx){
        return res.json({
            isSuccess: false, 
            code: 2701, 
            message: "감시자 번호를 입력해주세요"
        });
    }

        try {
            
            const getChallengeFailMessageParams = [challengeIdx, observerIdx];
            const getChallengeFailMessageInfoRows = await challengeDao.getChallengeFailMessageInfo(getChallengeFailMessageParams); // 나의 챌린지 조회
            
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "실패 메시지 조회 성공",
                failContent: getChallengeFailMessageInfoRows[0],
                
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - "실패 메시지 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 챌린지 목록 관리 - 나의 챌린지 
exports.getMyChallengeListInfo = async function (req, res) {
    // const { id } = req.verifiedToken;

    const userIdx = req.params.userIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    
    if (!userIdx) return res.json({isSuccess: false, code: 2720, message: "유저번호를 입력해주세요."});

        try {
            
            const getMyChallengeListInfoRows = await challengeDao.getMyChallengeListInfo(userIdx); // 나의 챌린지 조회
            
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 목록 관리 - 나의 챌린지 조회 성공!",
                myChallengeList: getMyChallengeListInfoRows[0],
                
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - "챌린지 목록 관리 - 나의 챌린지 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 챌린지 목록 관리 - 친구의 챌린지
exports.getFriendChallengeListInfo = async function (req, res) {
    // const { id } = req.verifiedToken;

    const observerIdx = req.params.observerIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    
    if (!observerIdx) return res.json({isSuccess: false, code: 2740, message: "감시자 번호를 입력해주세요."});

        try {
            
            const getFriendChallengeListInfoRows = await challengeDao.getFriendChallengeListInfo(observerIdx); // 나의 챌린지 조회
            
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "챌린지 목록 관리 - 친구의 챌린지 조회 성공!",
                friendChallengeList: getFriendChallengeListInfoRows[0],
                
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - "챌린지 목록 관리 - 친구의 챌린지 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};