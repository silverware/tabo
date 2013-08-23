formHelper = require "../helpers/form_helper"
viewHelper = require "../helpers/view_helper"

controllers = [
  require "./common_controller"
  require "./user_controller"
  require "./tacticboard_controller"
]

module.exports = (app) ->
  # Helper
  app.use formHelper
  app.use viewHelper

  #Error Handler
  app.use (err, req, res, next) ->
    console.error err.stack
    if req.xhr
      res.send 500, error: 'Something blew up!'
    else
      res.status 500
      res.render '500', {error: err}

  process.on 'uncaughtException', (err) ->
    console.log err, "oops"

  # Param Settings
  for controller in controllers
    for param, func of controller.params
        app.param param, func

  # Routes
  for controller in controllers
    middleware = []

    # add before middleware
    for route, func of controller
      if route is 'before'
        middleware.push func

    for route, func of controller
      if route.indexOf "/" is 0
        app.get route, func
        console.log route
      else if route.indexOf("POST:") is 0
        route = route.replace "POST:", ""
        app.post route, middleware, func
        console.log route, "POST"


  app.get /^\/([^\s]+)\.template$/, (req, res) ->
    res.render req.params[0],
      layout: false


