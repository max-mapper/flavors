var header = document.querySelector('.column-header')
var results = document.querySelector('.results-list')
var openMenuButton = document.querySelector('.open-menu')
var searchOptions = document.querySelector('.search-by')
var hash = (window.location.hash||'').replace('#','')

var snapper = new Snap({
  element: document.querySelector('.app'),
  disable: 'right'
})

makeCrossBrowserCompatible()

var lists = {
  ingredients: function getAllIngredients() {
    return flavors.ingredients.map(function(ingredient) {
      return {
        title: ingredient.ingredient,
        description: ingredient.complements,
        extra: ingredient.techniques
      }
    })
  },
  seasonings: function getAllSeasonings() {
    return flavors.seasonings.map(function(seasoning) {
      return {
        title: seasoning.seasoning,
        description: seasoning.complements
      }
    })
  },
  regions: function getAllRegions() {
    return flavors.regions.map(function(region) {
      return {
        title: region.region,
        description: region.ingredients
      }
    })
  }
}

var prefix = "eat with"
var title = "ingredients"
var activeList = lists.ingredients()
var input = document.querySelector('input')

input.value = hash

updateResults(input.value,activeList,prefix,title)

input.addEventListener('keyup', throttle(function(e) {
  updateResults(input.value,activeList,prefix,title)
}, 1000))


addEvent(document.querySelector('#open-left'), 'click', function(){
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
    input.value = ''
    updateResults('',activeList, prefix, title)
  }
  return false
})

function makeCrossBrowserCompatible() {
  // https://github.com/piatra/flavors/commit/c21bd731e6572ddce6d5c50ceb543fc8b037f559
  if (navigator.userAgent.match(/Android 2/i)) {
    document.querySelector('.snap-drawer').style.overflow = 'inherit'
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
  objs.map(function(obj) {
    htmls += '<li class="topcoat-list__item">'
      + '<span class="title">' + obj.title + '</span>'
      + ' - ' + itemPrefix + ' <span class="description">' + obj.description + '</span>'
    + '</li>'
  })
  results.innerHTML += htmls
  header.innerText = "Showing " + objs.length + " " + titleName
}

function filterResults(objs, str) {
  var matches = []
  str = str.trim().toLowerCase()
  objs.map(function(obj) {
    if (obj.title.trim().toLowerCase().match(str)) matches.push(obj)
    if (obj.description.toLowerCase().match(str)) matches.push(obj)
  })
  return matches
}

function updateResults(value,activeList,prefix,title){
  location.hash = value
  if (value.length === 0) setResults(activeList, prefix, title)
  else setResults(filterResults(activeList, value), prefix, title)
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

