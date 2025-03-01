export default function searchInObject(searchFor: string, searchIn: object): boolean {
  for(const key in searchIn) {
    if(String(searchIn[key]).search(searchFor) !== -1){
      return true;
    }
  }

  return false;
}