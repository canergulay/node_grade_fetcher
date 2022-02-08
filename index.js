const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
var requestify = require('requestify'); 
const mailer = require('./mailer.js')


let url = 'https://sis.bilgi.edu.tr/web2/student/home/preparestudentgradebook'

function getCookie  (){
    try {  
        var data = fs.readFileSync('cookie.txt', 'utf8');
        return data.toString()
    } catch(e) {
        console.log('Error:', e.stack);
    }
}


let headers = { Cookie:getCookie() }
let dataCached = 'initialdata'
let requestNumber = 0
var lastDate = getDate()
let doWeHaveNewGrade = false

app.get('/',  async (req, res) =>  {
    res.send({
        'Açıklanan yeni not var mı ? :':doWeHaveNewGrade,
        'En son kontrol ettiğim zaman :': getDate(),
        '15 Dakikada bir kontrol ettim, şuana kadar ettiğim kontrol sayısı :':requestNumber,
    })
})

app.get('/last', (req, res) =>  {
    res.send(dataCached)
})

app.get('/reset',(req, res) =>  {
    doWeHaveNewGrade = false
    res.send('ALRIGHT, RESETLEDIK')
})


app.listen(port, async () => {
  mailer.sendmail()
  dataCached = await requestInformation()
  checkContiniously()
  console.log(`Example app listening on port ${port}`)
})

function checkContiniously(){
    setInterval(async ()=>{ 
        let data = await requestInformation()
        if (data !== dataCached){
            doWeHaveNewGrade = true
        }
    },1200000) // 15 DAKIKALIK BIR ARALIK 
}


async function requestInformation(){
   try{
    lastDate = getDate()
    requestNumber++
    var response = await requestify.request(url,{method:'GET',headers: headers})
    return response.getBody()
   }catch(e){
    dataCached = e
   }
}

function getDate(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime
}
