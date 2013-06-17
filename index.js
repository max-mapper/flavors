var header = document.querySelector('.column-header')
var results = document.querySelector('.results-list')

function setResults(objs) {
  results.innerHTML = ''
  var htmls = ''
  objs.map(function(obj) {
    htmls += '<li class="topcoat-list__item">'
      + '<span class="title">' + obj.title + '</span>'
      + ' - pairs with <span class="description">' + obj.description + '</span>'
    + '</li>'
  })
  results.innerHTML += htmls
  header.innerText = "Showing " + objs.length + " ingredients"
}

function filterResults(objs, str) {
  var matches = []
  objs.map(function(obj) {
    if (obj.title.toLowerCase().match(str.toLowerCase())) matches.push(obj)
  })
  return matches
}

var ingredients = flavors.ingredients.map(function(ingredient) {
  return {
    title: ingredient.ingredient,
    description: ingredient.complements,
    extra: ingredient.techniques
  }
})

setResults(ingredients)

var input = document.querySelector('input')

input.addEventListener('keyup', function(e) {
  if (input.value.length === 0) setResults(ingredients)
  else setResults(filterResults(ingredients, input.value))
})
