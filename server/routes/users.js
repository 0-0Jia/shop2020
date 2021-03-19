var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var uuid = require('uuid');
require('../util/util');
// var md5=require('md5');  
var $conf = require('../conf/conf');
// 使用连接池
var pool = mysql.createPool($conf.mysql);
router.use(express.static('public'));
router.get('/', function (req, res, next) {
  if (pool) {
    res.json({
      status: '0000',
      msg: 'succees'
    });
  } else {
    res.json({
      status: '-1',
      msg: 'error!'
    });
  }
});
// 注册接口
router.get('/register', (req, res, next) => {
  var userName = req.param('userName'); // 获取前台传过来的userName值
  var userId = req.param('userId'); // 获取前台传过来的userId值
  var userPwd = req.param('userPwd'); // 获取前台传过来的userPwd值
  if (pool) {
    let sql = `insert into user(userId,userName,userPwd) values('${userId}','${userName}','${userPwd}')`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '0',
          msg: err.message
        });
      } else {
        res.json({
          status: '1',
          msg: '',
          result: ''
        });
      }
    });
  } else {
    res.json({
      status: '-1',
      msg: 'error!'
    });
  }
});
// 该账号是否存在
router.get('/userExist', (req, res, next) => {
  var userId = req.param('userId'); // 获取前台传过来的userId值
  if (pool) {
    let sql = `select id from user where userId=${userId}`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '0',
          msg: err.message
        });
      } else if (result.length) {
        res.json({
          status: '1',
          msg: '',
          result: ''
        });
      } else {
        res.json({
          status: '2',
          msg: ''
        });
      }
    });
  } else {
    res.json({
      status: '-1',
      msg: 'error!'
    });
  }
});
// 登录接口
router.get('/login', (req, res, next) => {
  var userId = req.param('userId'); // 获取前台传过来的userId值
  var userPwc = req.param('userPw'); // 获取前台传过来的密码
  if (pool) {
    let sql = `select * from user where userId=${userId}`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message
        });
      } else {
        if (result.length === 0) {
          res.json({
            status: '404',// 用户不存在
            msg: 'user not exist'
          });
        } else {
          let checkPw = result[0].userPwd;
          let myName = result[0].userName;
          let myId = result[0].userId;
          if (userPwc != checkPw) {
            res.json({
              status: '-2',//密码错误
              msg: 'password error'
            });
          } else {
            res.cookie('userId', myId, {
              path: '/',
              maxAge: 1000 * 60 * 60 // 设置cookie时间
            });
            res.cookie('userName', myName, {
              path: '/',
              maxAge: 1000 * 60 * 60 // 设置cookie时间
            });
            res.json({
              status: '1',
              msg: '登录成功!',
              result: result
            });
          }
        }
      }
    });
  } else {
    res.json({
      status: '-1',
      msg: 'error!'
    });
  }
});
//登出接口
router.get('/logout', function (req, res, next) {
  res.cookie("userId", "", {
    path: "/",
    maxAge: -1
  });
  res.cookie("userName", "", {
    path: "/",
    maxAge: -1
  });
  res.json({
    status: "1",
    msg: '',
    result: ''
  })
});

//检查是否登录
router.get("/checkLogin", function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '1',
      msg: '',
      result: req.cookies.userName || ''
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录',
      result: ''
    });
  }
});

// 购物车数据
router.get("/getCartData", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    // 通过内连接得到购物车中商品的信息
    let sql = `select * 
    from cartlist 
    INNER JOIN goods 
    on cartlist.productId=goods.productId
    where userId=${userId} order by cartId desc`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message
        });
      } else {
        res.json({
          status: '1',
          msg: '获取数据成功',
          result: result
        });

      }
    });

  } else {
    res.json({
      status: '0',
      msg: '未登录'
    });
  }
});

//删除商品信息
router.get("/delProduct", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let proId = req.param('productId'); // 获取前台传过来的要删除的productId值
    let sql = `delete from cartlist where productId=${proId} and userId=${userId}`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message
        });
      } else {
        res.json({
          status: '1',
          msg: '删除成功'
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录'
    });
  }
});

// 修改商品数量
router.get("/editProductNum", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let proId = req.param('productId'); // 获取前台传过来的要删除的productId值
    let proNum = req.param('productNum'); // 获取前台传过来的要删除的productNum值
    let checked = req.param('checked'); // 获取前台传过来的要删除的chencked值
    let sql = `update cartlist set productNum=${proNum},checked=${checked} where productId=${proId} and userId=${userId}`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message
        });
      } else {
        res.json({
          status: '1',
          msg: '更新成功',
          result: result
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录'
    });
  }
});

//全选购物车商品
router.get("/editSelectAll", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let checked = req.param('checked'); // 获取前台传过来的chencked值
    let sql = `update cartlist set checked=${checked} where userId=${userId}`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message
        });
      } else {
        res.json({
          status: '1',
          msg: '更新成功',
          result: result
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录'
    });
  }
});

//获取用户地址信息
router.get("/addressList", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let sql = `select * from addresslist where userId=${userId} order by addressId desc`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message
        });
      } else {
        res.json({
          status: '1',
          msg: '',
          result: result
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录'
    });
  }
})

//设置默认地址
router.get("/setDefauleAdr", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let defaultFlag = '1';
    let allFlag = '0';
    let addressId = req.param('addressId'); // 获取前台传过来addressId值
    let sql1 = `update addresslist set isDefault=${allFlag} where userId=${userId}`;
    let sql = `update addresslist set isDefault=${defaultFlag} where userId=${userId} and addressId=${addressId}`;
    pool.query(sql1, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message
        });
      } else {
        pool.query(sql, (err, result) => {
          if (err) {
            res.json({
              status: '-1',
              msg: err.message
            });
          } else {
            res.json({
              status: '1',
              msg: '',
              result: ''
            });
          }
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录'
    });
  }
});

// 删除地址
router.get("/delAdr", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let addressId = req.param('addressId'); // 获取前台传过来的要删除的addressId值
    let sql = `delete from addresslist where userId=${userId} and addressId=${addressId}`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message
        });
      } else {
        res.json({
          status: '1',
          msg: '删除成功',
          result: ''
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录'
    });
  }
});

//增加新地址
router.get("/insertAdr", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;


    let postName = req.param('postName'); // 获取前台传值


    let streetName = req.param('streetName'); // 获取前台传值
    let tel = req.param('tel'); // 获取前台值
    let postCode = req.param('postCode'); // 获取前台传值
    let defaultFlag = '0';
    let sql = `insert into addresslist(userId,postName,streetName,postCode,tel,isDefault) values('${userId}','${postName}','${streetName}','${postCode}','${tel}','${defaultFlag}')`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message
        });
      } else {
        res.json({
          status: '1',
          msg: '添加成功',
          result: ''
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录'
    });
  }
});

// 生成订单
router.get("/payOrder", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    var userId = req.cookies.userId;
    var itemPrice = req.param('itemPrice'); // 获取前台传值
    var totalPrice = req.param('totalPrice'); // 获取前台传值
    var discount = req.param('discount'); // 获取前台传值
    var shipPrice = req.param('shipPrice'); // 获取前台传值
    var freightRisk = req.param('freightRisk'); // 获取前台传值
    var productNum = req.param('productNum'); // 获取前台传值
    var checked = 1;
    var defaultVal = '1';
    // 先搜索出该用户购物车中选中的商品信息
    let sql = 
    `select * from cartlist where userId=${userId} and checked=${checked}`;
    // 再搜索出该用户的默认地址
    let adrsql = 
    `select * from addresslist where userId=${userId} and isDefault=${defaultVal}`;
    var goodsList = [];
    var addrContent = '';
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message
        });
      } else {
        goodsList = result;
        pool.query(adrsql, (err, result) => {
          if (err) {
            res.json({
              status: '-1',
              msg: err.message
            });
          } else {
            addrContent = result;
            var platform = '6228';
            var r1 = Math.floor(Math.random() * 10);
            var r2 = Math.floor(Math.random() * 10);
            var sysDate = new Date().Format('yyyyMMddhhmmss');
            var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
            var orderIdVal = platform + r1 + sysDate + r2;
            var ifPay = 1;
            var addressId = addrContent[0].addressId;
            var orderId = uuid.v1()
            // 将商品信息和收货地址等插入到订单表中
            let inSql = 
            `insert into orderlist(orderId, userId,addressId,productNum,
              totalPrice,discount,shipPrice,freightRisk,createDate,ifPay) 
            values('${orderIdVal}','${userId}','${addressId}',
            '${productNum}','${totalPrice}','${discount}','${shipPrice}'
            ,'${freightRisk}','${createDate}','${ifPay}')`;
            // 删除购物车中之前选中的商品
            let delSql = `delete from cartlist where checked=${checked}`;
            pool.query(inSql, (err, result) => {
              if (err) {
                res.json({
                  status: '-1',
                  msg: err.message
                });
              } else {
                pool.query(delSql, (err, result) => {
                  if (err) {
                    res.json({
                      status: '-1',
                      msg: err.message
                    });
                  } else {
                    let flag = 1;
                    // 同步插入到订单详情表
                    goodsList.forEach((item, i)=>{
                      let inSql2 = `insert into order_detail(orderId, productId, proNum) 
                      values('${orderIdVal}','${item.productId}','${item.productNum}')`;
                      pool.query(inSql2, (err, result) => {
                        if (err) {
                          res.json({
                            status: '-1',
                            msg: err.message
                          });
                          flag = 0;
                        }
                      });
                    })
                    if(flag){
                      res.json({
                        status: '1',
                        msg: 'suc',
                        result: orderId
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录'
    });
  }
});

// 获取订单信息
router.get("/getOrderData", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let sql = `select *
    from orderlist a 
    INNER JOIN order_detail b 
    INNER JOIN goods c
    on a.orderId=b.orderId and b.productId=c.productId 
    where userId=${userId} order by createDate desc`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message
        });
      } else {
        res.json({
          status: '1',
          msg: '获取数据成功',
          result: result
        });
      }
    });

  } else {
    res.json({
      status: '0',
      msg: '未登录'
    });
  }
});

// 删除订单
router.get("/delOrder", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    var orderId = req.param('orderId'); // 获取前台传值
    let sql = `delete from orderlist where orderId=${orderId}`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message
        });
      } else {
        res.json({
          status: '1',
          msg: '',
          result: ''
        });
      }
    });

  } else {
    res.json({
      status: '0',
      msg: '未登录'
    });
  }
});

//更新订单
router.get("/updateOrder", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let orderId = req.param('orderId'); // 获取前台传值
    let ifPay = 1;
    let sql = `update orderlist set ifPay=${ifPay} where orderId=${orderId} and userId=${userId}`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message
        });
      } else {
        res.json({
          status: '1',
          msg: '',
          result: ''
        });
      }
    });

  } else {
    res.json({
      status: '0',
      msg: '未登录'
    });
  }
});
module.exports = router;
