const express = require('express')
var router = express.Router();
const axios = require('axios')
const fetch = require('node-fetch')
const fs = require('fs')
const { getBuffer } = require('../lib/function')

const mynimeku = require('../scraper/mynime')


router.get('/mynimekuSearch', async(req, res) => {
  var query = req.query.query
  if (!query) return res.json({ message: 'masukan parameter query' })
  var result = await mynimeku.Search(query)
  if (result > 1) return res.json({ message: 'anime not found!' })
  res.json(result)
})

router.get('/mynimekuDetail', async(req, res) => {
  var link = req.query.link
	if (!link) return res.json({ message: 'masukan parameter Link' })
   var result = await mynimeku.animeDetail(link)
   res.json(result)
})

router.get('/mynimekuDownload', async(req, res) => {
  var link = req.query.link
	if (!link) return res.json({ message: 'masukan parameter Link' })
   var result = await mynimeku.downloadEps(link)
   res.json(result)
})

router.get('/storyanime', async(req, res) => {
  var story = (await axios.get('https://raw.githubusercontent.com/Arya-was/endak-tau/main/storyanime.json')).data
  const nime = await story[Math.floor(Math.random() * (story.length))]
  var dl = (await axios.get(`https://tyz-api.herokuapp.com/downloader/igdl?link=${nime}`)).data
  const buffer = await getBuffer(dl[0])
  await fs.writeFileSync(__path +'/tmp/video.mp4', buffer)
  await res.sendFile(__path +'/tmp/video.mp4')
  await fs.unlinkSync(__path +'/tmp/video.mp4', buffer)
})

router.get('/quotesnime', async(req, res) => {
 var quote = (await axios.get('https://raw.githubusercontent.com/Arya-was/endak-tau/main/quotenime.json')).data
 var randquote = quote[Math.floor(Math.random() * (quote.length))]
 res.json(randquote)
})


module.exports = router
