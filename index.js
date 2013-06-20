
// assumes you have the crossfilter.js bundle loaded
var crossfilter = require('crossfilter')

var header = document.querySelector('.column-header')
var results = document.querySelector('.results-list')
var openMenuButton = document.querySelector('.open-menu')
var searchOptions = document.querySelector('.search-by')
var contentContainer = document.querySelector('.app')
var inputEl = document.querySelector('input')
var openLeft = document.querySelector('#open-left')
var snapDrawer = document.querySelector('.snap-drawer')

var snapper = new Snap({
  element: contentContainer,
  disable: 'right'
})

makeCrossBrowserCompatible()

var lists = {
  ingredients: function getAllIngredients() {
    return getList(flavors.ingredients, function(ingredient) {
      return {
        title: ingredient.ingredient,
        description: ingredient.complements,
        extra: ingredient.techniques
      }
    })
  },
  seasonings: function getAllSeasonings() {
    return getList(flavors.seasonings, function(seasoning) {
      return {
        title: seasoning.seasoning,
        description: seasoning.complements
      }
    })
  },
  regions: function getAllRegions() {
    return getList(flavors.regions, function(region) {
      return {
        title: region.region,
        description: region.ingredients
      }
    })
  }
}

var url = parseUrl()
var input = inputEl

var prefix = "eat with"
var title = url.list || "ingredients"
var activeList = lists.ingredients()
if(lists[url.list]) activeList = lists[url.list]()

input.value = url.search

updateResults(input.value, activeList, prefix, title)

input.addEventListener('keyup', function(e) {
  updateResults(input.value, activeList, prefix, title)
})

addEvent(openLeft, 'click', function(){
  if (snapper.state().state === 'closed') snapper.open('left')
  else snapper.close('left')
})

addEvent(searchOptions, 'click', function(e) {
  e.preventDefault()
  var searchBy = e.target.getAttribute('data-search')
  prefix = e.target.getAttribute('data-prefix')
  title = e.target.getAttribute('data-title')
  if (searchBy) {
    snapper.close('left')
    activeList = lists[searchBy]()
    updateResults(input.value, activeList, prefix, title)
  }
  return false
})

function getList(objs, func) {
  var list = objs.map(func)
  var xf = crossfilter(list)
  xf.title = xf.dimension(function(d) { return d.title })
  xf.description = xf.dimension(function(d) { return d.description })
  return xf
}

function makeCrossBrowserCompatible() {
  // https://github.com/piatra/flavors/commit/c21bd731e6572ddce6d5c50ceb543fc8b037f559
  if (navigator.userAgent.match(/Android 2/i)) {
    snapDrawer.style.overflow = 'inherit'
  }
}

function addEvent(element, eventName, func) {
  if (element.addEventListener) {
    return element.addEventListener(eventName, func, false)
  } else if (element.attachEvent) {
    return element.attachEvent("on" + eventName, func)
  }
}

function setResults(objs, itemPrefix, titleName) {
  results.innerHTML = ''
  var htmls = ''
  objs.title.top(Infinity).reverse().map(function(obj) {
    htmls += '<li class="topcoat-list__item">'
      + '<span class="title">' + obj.title + '</span>'
      + ' - ' + itemPrefix + ' <span class="description">' + obj.description + '</span>'
    + '</li>'
  })
  results.innerHTML += htmls
  header.innerText = "Showing " + objs.length + " " + titleName
}

function filterResults(objs, str) {
  str = str.trim().toLowerCase()
  if (str.length > 0) objs.title.filterRange([str, str + String.fromCharCode(str.charCodeAt(0) + 1)])
  else objs.title.filterAll()
  return
}

function updateResults(value, activeList, prefix, title){
  setUrl(title, value)
  if (value.length === 0) {
    filterResults(activeList, value)
    setResults(activeList, prefix, title)
  } else {
    filterResults(activeList, value)
    setResults(activeList, prefix, title)
  }
}

function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250)
  var last
  var deferTimer
  return function () {
    var context = scope || this

    var now = +new Date
    var args = arguments
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, threshhold)
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}

function setUrl(list, terms) {
  location.hash = list + '/' + terms
}

function parseUrl(){
  var parts = (location.hash || '').replace('#', '').split('/')
  var obj = { list: false, search: '' }
  if (parts.length === 1) return obj
  obj.list = parts[0]
  obj.search = parts[1]
  return obj
}
