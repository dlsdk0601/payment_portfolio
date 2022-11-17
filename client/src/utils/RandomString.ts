// 랜덤 문자열 (oid 생성시 필요)
function randomStringFunc(index: number): string {
  // 대문자 영문
  var chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXTZ";
  // 반환받을 문자열의 수
  var stringLength = index;
  var randomstring = "";
  for (var i = 0; i < stringLength; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
}

export default randomStringFunc;
