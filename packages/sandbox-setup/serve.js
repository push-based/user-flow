let i = 0;
const id = setInterval(() => {
  console.log(++i);
  if(i > 3) {
    console.log(`
    Available on:
    http://172.23.48.1:3400
    http://192.168.56.1:3400
    http://192.168.0.71:3400
    http://127.0.0.1:3400
    `)
    clearInterval(id);
  }
}, 1000)
