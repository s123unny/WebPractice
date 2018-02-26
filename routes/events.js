var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('events', { // 輸出
    data: 'please give me date behind the URL'
  });
});

router.get('/:year/:month/:day', function (req, res) {
  var year = req.params.year;
  var month = req.params.month;
  var day = req.params.day;
  var reg = /^[0-9]*$/;
  var days = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  res.set({ 'content-type': 'application/json; charset=utf-8' });

  if (month == 2) {
    if((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0))) {
     days[2] = 29;
    } else {
     days[2] = 28;
    }
  }
  if(!reg.test(year) || year == 0) {
    res.json({ //輸出
      body: [
      "error!!",
      "年份錯誤"
      ]
    })
  } else if(!reg.test(month) || month == 0 || month > 12) {
    res.json({ //輸出
      body: [
      "error!!",
      "月份錯誤"
      ]
    })
  } else if(!reg.test(day) || day == 0 || day > days[month]) {
    res.json({ //輸出
      body: [
      "error!!",
      "日期錯誤"
      ]
    })
  } else if (year == 2018 && month == 2 && day == 23) {
    res.json({ //輸出
      body: [
      "完成 Use router and create API 練習!!",
      "在 repo 上寫好 project 項目"
      ]
    })
  } else {
    var data = "this month has " + days[month] + " days";
    res.json({ //輸出
      body: [
      ">________<",
      data
      ]
    })
  }
});

module.exports = router;