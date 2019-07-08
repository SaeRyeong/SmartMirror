function gohome(entity, callback) {

   console.log(entity);
   var result = '홈화면으로 돌아가겠습니다.';
   callback(result);
}

module.exports = {
  gohome : gohome
}
