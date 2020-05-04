/* ======================= axios start ======================= **/
const $axios = axios.create({
  // baseURL: 'http://casa.herogame.com',
  method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 30000,
  transformRequest: [function (data) {
    return Qs.stringify(data)
  }]
})

var loading
// request拦截器
$axios.interceptors.request.use(
  config => {
    loading = layer.open({ type: 2 });
    return config
  },
  error => {
    Promise.reject(error)
  })

// respone拦截器
$axios.interceptors.response.use(
  response => {
    layer.close(loading)
    const res = response.data
    return res
  },
  error => {
    return Promise.reject(error)
  }
)
/* ======================= axios end ======================= **/
// 顶部导航
$(".header-menuBtn").click(function () {
  if ($(".header-nav").hasClass("cur")) {
    $(".header-nav").removeClass("cur")
  } else {
    $(".header-nav").addClass("cur")
  }
})
// 左侧分类切换
$(".com-left-con").on("click", "li", function () {
  var i = $(this).index()
  $(".com-left-con li").eq(i).addClass("cur").siblings().removeClass("cur")
  $(".com-sideBar-con li").eq(i).addClass("cur").siblings().removeClass("cur")
})
$(".com-sideBar-con").on("click", "li", function () {
  var i = $(this).index()
  $(".com-left-con li").eq(i).addClass("cur").siblings().removeClass("cur")
  $(".com-sideBar-con li").eq(i).addClass("cur").siblings().removeClass("cur")
})

$(".com-sideBar-btn").click(function () {
  if ($(".com-sideBar-mask").hasClass("cur")) {
    $(".com-sideBar-mask").removeClass("cur")
    $(".com-sideBar-con").removeClass("cur")
  } else {
    $(".com-sideBar-mask").addClass("cur")
    $(".com-sideBar-con").addClass("cur")
  }
})

$(".com-sideBar-mask").click(function () {
  $(".com-sideBar-mask").removeClass("cur")
  $(".com-sideBar-con").removeClass("cur")
})

// 产品二级分类切换
$(".pl-right-type li").click(function () {
  var i = $(this).index()
  $(".pl-right-type li").eq(i).addClass("cur").siblings().removeClass("cur")
})

/* ======================= 接口 ======================= **/
// 获取首页轮播图 - recommend
async function getAds(name) {
  var res = await $axios.get("http://www.dayongfz.com/api/ads/getOne", {
    params: {
      name: name
    }
  })
  if (res.status == 200) {
    return res.data
  }
}
// getAds("recommend")


// 查看文章列表 - 文章分类ID - 当前页面 - 每页记录数
async function getConList(typeId, current, pageSize) {
  var res = await $axios.get("http://www.dayongfz.com/api/content/getList", {
    params: {
      typeId: typeId,
      current: current ? current : "",
      pageSize: pageSize ? pageSize : ""
    }
  })
  if (res.status == 200) {
    return res.data
  }
}
// getConList("N3kPAWfdm")

// 查看文章详情 - 文章ID
async function getConItem(id) {
  var res = await $axios.get("http://www.dayongfz.com/api/content/getContent", {
    params: {
      id: id
    }
  })
  if (res.status == 200) {
    return res.data
  }
}
// getConItem("wOyrWTrTQ")


// 获取分类的tree结构列表
async function getTreelist() {
  var res = await $axios.get("http://www.dayongfz.com/api/contentCategory/getTreelist")
  if (res.status == 200) {
    return res.data
  }
}
// getTreelist()

// 根据类别id查询子类 - 类别id
async function getCurrentCategoriesById(typeId) {
  var res = await $axios.get("http://www.dayongfz.com/api/contentCategory/getCurrentCategoriesById", {
    params: {
      typeId: typeId
    }
  })
  if (res.status == 200) {
    return res.data
  }
}
// getCurrentCategoriesById("Z_j0cEFGB")
/* ======================= common ======================= **/
// 截取邀请参数
function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}
/* ======================= 首页 ======================= **/
function indexInit() {
  indexFunc.carousel()
  indexFunc.aboutCompany()
  indexFunc.newsList()
  indexFunc.productList()
  indexFunc.getFooterInfo()
  indexFunc.getFooterQr()
}
var indexFunc = {
  // 轮播图
  async carousel() {
    var data = await getAds("recommend")
    // console.log(data)
    var swiperHTML = ""
    var swiperItemHTML = ""
    for (var i = 0; i < data.items.length; i++) {
      swiperItemHTML = `
      <div class="swiper-slide">
        <img src="http://www.dayongfz.com${data.items[i].sImg}" alt="" class="">
      </div>
      `
      swiperHTML = swiperHTML + swiperItemHTML
    }
    $(".swiper-container-banner .swiper-wrapper").html(swiperHTML)
    var mySwiper = new Swiper('.swiper-container-banner', {
      loop: true,
      speed: 500,
      autoplay: data.carousel,
      pagination: {
        el: '.swiper-pagination-banner',
        clickable: true,
      },
      navigation: {
        nextEl: '.banner-next',
        prevEl: '.banner-prev',
      },
    })
  },
  // 企业简介
  async aboutCompany() {
    var data = await getConItem("wOyrWTrTQ")
    // console.log(data)
    $(".home-company-con-info").html(data.simpleComments[0].content)
    $(".home-company-con-img").html("http://www.dayongfz.com" + data.sImg)
  },
  // 新闻动态
  async newsList() {
    var data = await getConList("Th4j4KMtM", 1, 5)
    // console.log(data)
    var newsConList = ""
    var newsConLi = ""
    for (var i = 0; i < data.docs.length; i++) {
      newsConLi = `
      <li class="home-news-conLi">
        <a href="/detail?id=${data.docs[i].id}">
          <span class="glyphicon glyphicon-play home-news-conLi-icon"></span>
          <span class="home-news-conLi-title">${data.docs[i].title}</span>
          <span class="home-news-conLi-time">${data.docs[i].date.slice(0, 10)}</span>
        </a>
      </li>
      `
      newsConList = newsConList + newsConLi
    }
    $(".home-news-con").html(newsConList)
  },
  // 产品列表
  async productList() {
    var data = await getConList("Z_j0cEFGB", 1, 4)
    // console.log(data)
    var productList = ""
    var productLi = ""
    for (var i = 0; i < data.docs.length; i++) {
      productLi = `
      <li class="home-production-conLi col-lg-3 col-md-3 col-sm-12 col-xs-12">
        <a href="/detail?id=${data.docs[i].id}">
          <img src="http://www.dayongfz.com${data.docs[i].sImg}" alt="">
          <span>${data.docs[i].title}</span>
        </a>
      </li>`
      productList = productList + productLi
    }
    $(".home-production-con").html(productList)
  },
  // 底部信息
  async getFooterInfo() {
    var data = await getAds("footer_info")
    // console.log(data)
    for (var i = 0; i < data.items.length; i++) {
      if (data.items[i].title == "店铺") {
        $(".footer-p-ali").html(`<span class="glyphicon glyphicon-shopping-cart"></span> ${data.items[i].link}`)
      }
      if (data.items[i].title == "电话") {
        $(".footer-p-tel").html(`<span class="glyphicon glyphicon-phone-alt"></span> ${data.items[i].link}`)
      }
      if (data.items[i].title == "邮箱") {
        $(".footer-p-email").html(`<span class="glyphicon glyphicon-envelope"></span> ${data.items[i].link}`)
      }
      if (data.items[i].title == "手机号") {
        $(".footer-p-phone").html(`<span class="glyphicon glyphicon-phone"></span> ${data.items[i].link}`)
      }
      if (data.items[i].title == "地址") {
        $(".footer-p-address").html(`<span class="glyphicon glyphicon-map-marker"></span> ${data.items[i].link}`)
      }
      if (data.items[i].title == "公司英文") {
        $(".footer-p-company2").html(data.items[i].link)
      }
      if (data.items[i].title == "公司") {
        $(".footer-p-company1").html(data.items[i].link)
      }
    }
  },
  // 底部二维码
  async getFooterQr() {
    var data = await getAds("footer_QR")
    // console.log(data)
    var QrList = ""
    var QrLi = ""
    for (var i = 0; i < data.items.length; i++) {
      QrLi = `
      <li>
        <img src="http://www.dayongfz.com${data.items[i].sImg}" alt="">
        <span>${data.items[i].alt}</span>
      </li>`
      QrList = QrList + QrLi
    }
    $(".footer-qr").html(QrList)
  }
}
/* ======================= 新闻列表 ======================= **/
async function newsListInit() {
  var type = getQueryString("type") ? getQueryString("type") : "ZmZEN8Wn7"
  await newsFunc.getNewsType(type)
  var newsTitle = $(".nl-left-con ul .cur").attr("data-title")
  $(".nl-right-title span").html(newsTitle)
  newsFunc.getNewsList(type)

  $(".nl-left-con ul").on("click", "li", function () {
    newsTitle = $(this).attr("data-title")
    $(".nl-right-title span").html(newsTitle)
    type = $(this).attr("data-type")
    newsFunc.getNewsList(type)
  })
  $(".nl-sideBar-con ul").on("click", "li", function () {
    newsTitle = $(this).attr("data-title")
    $(".nl-right-title span").html(newsTitle)
    type = $(this).attr("data-type")
    newsFunc.getNewsList(type)
  })
}
var newsFunc = {
  // 获取新闻分类列表
  async getNewsType(type) {
    var data = await getCurrentCategoriesById("Th4j4KMtM")
    // console.log(data)
    var newsList = ""
    var newsLi = ""
    for (var i = 0; i < data.cates.length; i++) {
      if (data.cates[i].id == type) {
        newsLi = `
        <li class="cur" data-type="${data.cates[i].id}" data-title="${data.cates[i].name}"><a href="javascript:;">${data.cates[i].name}<i class="glyphicon glyphicon-play nl-left-icon"></i></a></li>
        `
      } else {
        newsLi = `
        <li data-type="${data.cates[i].id}" data-title="${data.cates[i].name}"><a href="javascript:;">${data.cates[i].name}<i class="glyphicon glyphicon-play nl-left-icon"></i></a></li>
        `
      }
      newsList = newsList + newsLi
    }
    $(".nl-left-con ul").html(newsList)
    $(".nl-sideBar-con ul").html(newsList)
  },
  // 获取新闻列表
  async getNewsList(type) {
    var data = await getConList(type)
    // console.log(data)
    var newsList = ""
    var newsLi = ""
    for (var i = 0; i < data.docs.length; i++) {
      newsLi = `
      <li class="nl-news-conLi">
        <a href="detail?id=${data.docs[i].id}">
          <span class="glyphicon glyphicon-play nl-news-conLi-icon"></span>
          <span class="nl-news-conLi-title">${data.docs[i].title}</span>
          <span class="nl-news-conLi-time">${data.docs[i].date.slice(0, 10)}</span>
        </a>
      </li>
      `
      newsList = newsList + newsLi
    }
    $(".nl-news-con").html(newsList)
  }
}
/* ======================= 产品列表 ======================= **/
async function productListInit() {
  var type = getQueryString("type") ? getQueryString("type") : "fonDULHoc"
  await productFunc.getProductType(type)
  var productTitle = $(".pl-left-con ul .cur").attr("data-title")
  $(".pl-right-title span").html(productTitle)
  await productFunc.getProductSubtype(type)
  var subtype = $(".pl-right-type ul .cur").attr("data-type")
  await productFunc.getProductList(subtype)
  // 左侧栏目切换
  $(".pl-left-con ul").on("click", "li", async function(){
    type = $(this).attr("data-type")
    productTitle = $(this).attr("data-title")
    $(".pl-right-title span").html(productTitle)
    await productFunc.getProductSubtype(type)
    subtype = $(".pl-right-type ul .cur").attr("data-type")
    console.log(subtype)
    if(subtype) {
      await productFunc.getProductList(subtype)
    } else {
      $(".pl-right-con ul").html("")
    }
  })
  // 侧边栏目切换
  $(".pl-sideBar-con ul").on("click", "li", async function(){
    type = $(this).attr("data-type")
    productTitle = $(this).attr("data-title")
    $(".pl-right-title span").html(productTitle)
    await productFunc.getProductSubtype(type)
    subtype = $(".pl-right-type ul .cur").attr("data-type")
    console.log(subtype)
    if(subtype) {
      await productFunc.getProductList(subtype)
    } else {
      $(".pl-right-con ul").html("")
    }
  })
  // 右侧栏目切换
  $(".pl-right-type ul").on("click", "li", async function(){
    $(this).addClass("cur").siblings().removeClass("cur")
    subtype = $(this).attr("data-type")
    await productFunc.getProductList(subtype)
  })

}
var productFunc = {
  // 获取产品一级分类列表
  async getProductType(type) {
    var data = await getCurrentCategoriesById("Z_j0cEFGB")
    // console.log(data)
    var productList = ""
    var productLi = ""
    for (var i = 0; i < data.cates.length; i++) {
      if (data.cates[i].id == type) {
        productLi = `
        <li class="cur" data-type="${data.cates[i].id}" data-title="${data.cates[i].name}"><a href="javascript:;">${data.cates[i].name}<i class="glyphicon glyphicon-play nl-left-icon"></i></a></li>
        `
      } else {
        productLi = `
        <li data-type="${data.cates[i].id}" data-title="${data.cates[i].name}"><a href="javascript:;">${data.cates[i].name}<i class="glyphicon glyphicon-play nl-left-icon"></i></a></li>
        `
      }
      productList = productList + productLi
    }
    $(".pl-left-con ul").html(productList)
    $(".pl-sideBar-con ul").html(productList)
  },
  // 获取产品二级分类列表
  async getProductSubtype(type) {
    var data = await getCurrentCategoriesById(type)
    // console.log(data)
    var productSubtypeList = ""
    var productSubtypeLi = ""
    for(var i = 0; i < data.cates.length; i++) {
      if(i == 0) {
        productSubtypeLi = `
        <li class="cur" data-type="${data.cates[i].id}">${data.cates[i].name}</li>
        `
      } else {
        productSubtypeLi = `
        <li data-type="${data.cates[i].id}">${data.cates[i].name}</li>
        `
      }
      productSubtypeList = productSubtypeList + productSubtypeLi
    }
    $(".pl-right-type ul").html(productSubtypeList)
  },
  // 获取产品列表
  async getProductList(subtype) {
    if(!subtype) {
      $(".pl-right-con ul").html("")
      return
    }
    var data = await getConList(subtype)
    // console.log(data)
    var productList = ""
    var productLi = ""
    for(var i = 0; i < data.docs.length; i++) {
      var productLi = `
      <li class="pl-right-conLi">
        <a href="http://www.dayongfz.com/detail?id=${data.docs[i].id}">
          <img src="http://www.dayongfz.com${data.docs[i].sImg}" alt="">
          <span>${data.docs[i].title}</span>
        </a>
      </li>
      `
      productList = productList + productLi
    }
    $(".pl-right-con ul").html(productList)
  }
}
/* ======================= 关于我们 ======================= **/
async function aboutInit() {
  await aboutFunc.getAboutType()
  var aboutTitle = $(".a-left-con ul li.cur").attr("data-title")
  $(".a-right-title span").html(aboutTitle)
  var type = $(".a-left-con ul li.cur").attr("data-type")
  await aboutFunc.getAboutCon(type)

  $(".a-left-con ul").on("click", "li", async function(){
    aboutTitle = $(this).attr("data-title")
    $(".a-right-title span").html(aboutTitle)
    type = $(this).attr("data-type")
    await aboutFunc.getAboutCon(type)
  })

  $(".a-sideBar-con ul").on("click", "li", async function(){
    aboutTitle = $(this).attr("data-title")
    $(".a-right-title span").html(aboutTitle)
    type = $(this).attr("data-type")
    await aboutFunc.getAboutCon(type)
  })


}
var aboutFunc = {
  // 获取关于我们分类列表
  async getAboutType() {
    var data = await getCurrentCategoriesById("lIco7OiN4")
    console.log(data)
    var aboutList = ""
    var aboutLi = ""
    for(var i = 0; i < data.cates.length; i++) {
      if(i == 0) {
        aboutLi = `
        <li class="cur" data-type="${data.cates[i].id}" data-title="${data.cates[i].name}"><a href="javascript:;">${data.cates[i].name}<i class="glyphicon glyphicon-play a-left-icon"></i></a></li>
        `
      } else {
        aboutLi = `
        <li data-type="${data.cates[i].id}" data-title="${data.cates[i].name}"><a href="javascript:;">${data.cates[i].name}<i class="glyphicon glyphicon-play a-left-icon"></i></a></li>
        `
      }
      aboutList = aboutList + aboutLi
      $(".a-left-con ul").html(aboutList)
      $(".a-sideBar-con ul").html(aboutList)
    }
  },
  // 获取分类内容
  async getAboutCon(type) {
    var data = await getConList(type, 1, 1)
    console.log(data)
    if(!data.docs.length) {
      $(".a-right-con").html("")
      return
    }
    var id = data.docs[0].id
    var res = await getConItem(id)
    $(".a-right-con").html(res.comments)
  }
}
/* ======================= 详情页 ======================= **/
async function detailInit() {
  var id = getQueryString("id")
  detailFunc.getdetailCon(id)
}

var detailFunc = {
  // 获取文章详情
  async getdetailCon(id) {
    if(!id) return
    var res = await getConItem(id)
    if(!res) {
      $(".d-right-con").html("")
      return
    }
    $(".d-right-con").html(res.comments)
    // 左侧列表
    var curSubtypeName = res.categories[2].name
    var curSubtypeId = res.categories[2].id
    var curTypeName = res.categories[1].name
    var curTypeId = res.categories[1].id
    $(".d-right-title span").html(curSubtypeName)
    $(".d-left-con h1 em").html(curTypeName)
    if(curTypeName == "新闻中心") {
      $(".d-left-con h1 i").html("NEWS")
    } else {
      $(".d-left-con h1 i").html("production")
    }
    var data = await getCurrentCategoriesById(curTypeId)
    var typeList = ""
    var typeLi = ""
    if(curTypeName == "新闻中心") {
      for (var i = 0; i < data.cates.length; i++) {
        if (data.cates[i].id == curSubtypeId) {
          typeLi = `
          <li class="cur" data-type="${data.cates[i].id}" data-title="${data.cates[i].name}"><a href="news?type=${data.cates[i].id}">${data.cates[i].name}<i class="glyphicon glyphicon-play d-left-icon"></i></a></li>
          `
        } else {
          typeLi = `
          <li data-type="${data.cates[i].id}" data-title="${data.cates[i].name}"><a href="news?type=${data.cates[i].id}">${data.cates[i].name}<i class="glyphicon glyphicon-play d-left-icon"></i></a></li>
          `
        }
        typeList = typeList + typeLi
      }
    } else {
      for (var i = 0; i < data.cates.length; i++) {
        if (data.cates[i].id == curSubtypeId) {
          typeLi = `
          <li class="cur" data-type="${data.cates[i].id}" data-title="${data.cates[i].name}"><a href="product?type=${data.cates[i].id}">${data.cates[i].name}<i class="glyphicon glyphicon-play d-left-icon"></i></a></li>
          `
        } else {
          typeLi = `
          <li data-type="${data.cates[i].id}" data-title="${data.cates[i].name}"><a href="product?type=${data.cates[i].id}">${data.cates[i].name}<i class="glyphicon glyphicon-play d-left-icon"></i></a></li>
          `
        }
        typeList = typeList + typeLi
      }
    }

    $(".d-left-con ul").html(typeList)
    $(".d-sideBar-con ul").html(typeList)
  }
}