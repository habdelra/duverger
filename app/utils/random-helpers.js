//TODO: unit test these things
// unit testing a function that literally does random things is making my brain explode.
// I'm going to revisit this after satan is done dining out of my open skull

function shuffle(array) {
  for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x) {}
  return array;
}

function randomlySelect (items, numberOfItemsToChoose) {
  if (numberOfItemsToChoose >= items.length) { return items; }

  var randomizedItems = shuffle(items);
  return randomizedItems.splice(0, numberOfItemsToChoose);
}

export { shuffle, randomlySelect };
