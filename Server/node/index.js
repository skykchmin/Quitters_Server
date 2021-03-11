const express = require('./config/express');
const {logger} = require('./config/winston');
var cron = require('node-cron');

const port = 3100; // 포트변경이 있을 시에 변경해주면 된다
express().listen(port);

cron.schedule('0-59/2 * 1-31 * *', function(){
    console.log('node-cron 실행 테스트');
  });

logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`); // 어떤 포트로 실행이 된다라는 것을 알려준다.