
const wait = seconds => new Promise((resolve, _) => setTimeout(() => resolve(), seconds))

const redirect = async (url) => {
   let counter = 0
   while (counter < 3) {
      document.getElementById('counter').innerText = 3 - counter
      await wait(1000)
      counter += 1
   }
   window.location.replace(url)
}
if (user) {
   let url = `http://localhost:3000/auth/login?token=${user.token}`
   redirect(url)
   //window.location.replace(url)
}