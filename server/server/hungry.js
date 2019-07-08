function hungry(entity, callback) {
   if(entity.length === 0)
     callback('배고파? 뭐먹고싶어?');

else {
  console.log(entity);
  var result = entity[0].value +' 먹고싶니?-?';
  callback(result);
}

}

module.exports = {
  hungry : hungry
}
