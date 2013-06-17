var header = document.querySelector('.column-header')
var results = document.querySelector('.results-list')
var openMenuButton = document.querySelector('.open-menu')
var searchOptions = document.querySelector('.search-by')

var snapper = new Snap({
  element: document.querySelector('.app'),
  disable: 'right'
})

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
setResults(activeList, prefix, title)

var input = document.querySelector('input')

input.addEventListener('keyup', throttle(function(e) {
  if (input.value.length === 0) setResults(activeList, prefix, title)
  else setResults(filterResults(activeList, input.value), prefix, title)
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
    setResults(activeList, prefix, title)
  }
  return false
})

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
  objs.map(function(obj) {
    if (obj.title.trim().toLowerCase().match(str.trim().toLowerCase())) matches.push(obj)
  })
  return matches
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

