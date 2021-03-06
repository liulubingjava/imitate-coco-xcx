// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    scrollLenth: [],
    activeIndex: 0,
    toView: 'a0',
    scrollTop: 100,
    screenWidth: 667,
    showModalStatus: false,
    currentType: 0,
    currentIndex: 0,
    sizeIndex: 0,
    sugarIndex: 0,
    temIndex: 0,
    sugar: ['常规糖', '无糖', '微糖', '半糖', '多糖'],
    tem: ['常规冰', '多冰', '少冰', '去冰', '温', '热'],
    size: ['常规', '珍珠', '西米露'],
    cartList: [],
    sumMonney: 0,
    cupNumber: 0,
    showCart: false,
    loading: false,
    detail: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var sysinfo = wx.getSystemInfoSync().windowHeight;
    console.log(sysinfo)
    wx.showLoading({
      title: '努力加载中',
    })
    //将本来的后台换成了easy-mock 的接口，所有数据一次请求完 略大。。
    wx.request({
      url: 'https://easy-mock.com/mock/59abab95e0dc66334199cc5f/coco/aa',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        var listData = res.data; //获取listDate
        var scrollLenth = [0]; //滑动的高度数组
        for (var i = 1; i < listData.length; i++) {
          if (i == 1) {
            scrollLenth[i] = Math.ceil(listData[i - 1].foods.length * 74.3125) + scrollLenth[i - 1];
            continue;
          }
          scrollLenth[i] = Math.ceil(listData[i - 1].foods.length * 74.3125 + 8.4) + scrollLenth[i - 1];
        }
        that.setData({
          listData: res.data,
          loading: true,
          scrollLenth: scrollLenth
        })
      }
    })

  },
  onReady: function() {

  },
  /** 左侧美食列表的对应方法 */
  selectMenu: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log('点击的美食列表下标为' + index);
    var toview = 'a' + index;
    this.setData({
      activeIndex: index,
      toView: toview
    })
  },
  scroll: function(e) {
    var dis = e.detail.scrollTop;
    var listData = this.data.listData; //获取listDate
    var scrollLenth = this.data.scrollLenth; //获取scrollLenth
    for (var i = 0; i < listData.length; i++) {
      if (dis > scrollLenth[i]  && dis < scrollLenth[i+1]) {
        this.setData({
          activeIndex: i,
        })
      }
      if (dis > scrollLenth[listData.length-1]){
        this.setData({
          activeIndex: listData.length - 1,
        })
      }
    } 
  },
  /**
   * 选择口味
   */
  selectInfo: function(e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    this.setData({
      showModalStatus: !this.data.showModalStatus,
      currentType: type,
      currentIndex: index,
      sizeIndex: 0,
      sugarIndex: 0,
      temIndex: 0
    });
  },
  /** 商品详情里选择口味选择口味*/
  selectInfoDetail: function(e) {
    this.setData({
      showModalStatus: !this.data.showModalStatus,
      detail: !this.data.detail,

    })
  },

  chooseSE: function(e) {
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    if (type == 0) {
      this.setData({
        sizeIndex: index
      });
    }
    if (type == 1) {
      this.setData({
        sugarIndex: index
      });
    }
    if (type == 2) {
      this.setData({
        temIndex: index
      });
    }
  },
  /**添加购物车 */
  addToCart: function() {
    var a = this.data
    var addItem = {
      "name": a.listData[a.currentType].foods[a.currentIndex].name,
      "price": a.listData[a.currentType].foods[a.currentIndex].specfoods[0].price,
      "detail": a.size[a.sizeIndex] + "+" + a.sugar[a.sugarIndex] + "+" + a.tem[a.temIndex],
      "number": 1,
      "sum": a.listData[a.currentType].foods[a.currentIndex].specfoods[0].price,
    }
    var sumMonney = a.sumMonney + a.listData[a.currentType].foods[a.currentIndex].specfoods[0].price;
    var cartList = this.data.cartList;
    cartList.push(addItem);
    this.setData({
      cartList: cartList,
      showModalStatus: false,
      sumMonney: sumMonney,
      cupNumber: a.cupNumber + 1
    });
    console.log(this.data.cartList)
  },
  /**显示购物车 */
  showCartList: function() {
    console.log("showCart 的值：" + this.data.showCart)
    if (this.data.cartList.length != 0) {
      this.setData({
        showCart: !this.data.showCart,
      });
    }

  },
  /**清空购物车 */
  clearCartList: function() {
    this.setData({
      cartList: [],
      showCart: false,
      sumMonney: 0
    });
  },
  /**添加商品数量 */
  addNumber: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var cartList = this.data.cartList;
    cartList[index].number++;
    var sum = this.data.sumMonney + cartList[index].price;
    cartList[index].sum += cartList[index].price;

    this.setData({
      cartList: cartList,
      sumMonney: sum,
      cupNumber: this.data.cupNumber + 1
    });
  },
  /**减少商品数量 */
  decNumber: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var cartList = this.data.cartList;

    var sum = this.data.sumMonney - cartList[index].price;
    cartList[index].sum -= cartList[index].price;
    cartList[index].number == 1 ? cartList.splice(index, 1) : cartList[index].number--;
    this.setData({
      cartList: cartList,
      sumMonney: sum,
      showCart: cartList.length == 0 ? false : true,
      cupNumber: this.data.cupNumber - 1
    });
  },
  goBalance: function() {
    if (this.data.sumMonney != 0) {
      wx.setStorageSync('cartList', this.data.cartList);
      wx.setStorageSync('sumMonney', this.data.sumMonney);
      wx.setStorageSync('cupNumber', this.data.cupNumber);
      wx.navigateTo({
        url: '../order/balance/balance'
      })
    }
  },
  /**
   * 展示详情页面
   */
  showDetail: function(e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    this.setData({
      detail: !this.data.detail,
      currentType: type,
      currentIndex: index,
      sizeIndex: 0,
      sugarIndex: 0,
      temIndex: 0
    })
  },

  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})