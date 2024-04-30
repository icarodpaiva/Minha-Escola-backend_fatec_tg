export const generateRandomNumber = (length: number) => {
  let number = ""

  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 10)

    number += digit
  }

  return number
}
