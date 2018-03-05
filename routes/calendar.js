var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  const { exec } = require('child_process');
  exec('cat *.js  | wc -l', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
  res.render('events', { // 輸出
    data: 'please give me /$year/$month behind the URL'
  });
});

var days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

router.get('/:year/:month', function (req, res) {
  var year = Number(req.params.year);
  var month = Number(req.params.month);
  var reg = /^[0-9]*$/;
  var month_name = ["x", "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0))) {
   days[2] = 29;
  } else {
   days[2] = 28;
  }
  if(!reg.test(year) || year == 0) {
    res.set({ 'content-type': 'application/json; charset=utf-8' });
    res.json({ //輸出
      body: [
      "error!!",
      "年份錯誤"
      ]
    })
  } else if(!reg.test(month) || month == 0 || month > 12) {
    res.set({ 'content-type': 'application/json; charset=utf-8' });
    res.json({ //輸出
      body: [
      "error!!",
      "月份錯誤"
      ]
    })
  } else {
    //算出當月份1號是星期幾
    var firstday = getfirstday(year, month);
    //算出表格需要的列數  是因為有標題列日 一......
    var rows = Math.ceil((days[month] + firstday) / 7) + 1;
    // res.set('Content-Type', 'application/javascript');
    // res.render('events', { // 輸出
    //   data: 'please give me ' + year +' '+ month + ' behind the URL'
    // });
    var last_year = year, last_month = month-1, next_year = year, next_month = month+1;
    if (month == 1) {
      last_year = year-1;
      last_month = 12;
    } else if (month == 12) {
      next_year = year+1;
      next_month = 1;
    }
    res.render('calendar', { 
      last_year: last_year,
      next_year: next_year,
      last_month: last_month,
      next_month: next_month,
      rows: rows,
      firstday: firstday,
      lastday: days[month],
      month_name: month_name[month]
    });
  }
});
function getfirstday(year, month) {
  //算出到前一年底種共過了幾天 
  var alldays = (year - 1) * 365 + parseInt((year - 1) / 4)
  alldays -= parseInt((year - 1) / 100);
  alldays += parseInt((year - 1) / 400);
  //算出到前一月底總共過了幾天
  for( i = 1; i < month; i++) {
   alldays += days[i];
  }
  //當月1號 除以7取餘數的星期幾 0=星期日
  day = (alldays + 1) % 7;
  return day;
}
module.exports = router;
