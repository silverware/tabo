marked = require 'marked'

module.exports =
  "/": (req, res) ->
    res.render 'index'

  "/site/impressum": (req, res) ->
    res.render 'impressum'

  "/site/sitemap": (req, res) ->
    tournamentDao.findAllTournamentIdentifiers (tournaments)->
      res.render 'sitemap',
        tournaments: tournaments
        layout: false

  "/lang/:lang": (req, res) ->
  	req.session.language = req.params.lang
  	res.redirect req.param "next"

  "/editor/preview": (req, res) ->
  	res.send marked req.param "markdown"



