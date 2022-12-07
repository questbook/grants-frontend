export function today() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate().toString().padStart(2, '0')}`;
}

export function validateDate(dateToValidate: string) {
  const todayDate = today()
  
  return dateToValidate >= todayDate;
}