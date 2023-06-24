const mongod = require('mongoose')

const Id = require('shortid')

const shortenedUrlSchema = new mongod.Schema({

  full: {
        type: String,
        required: true
  },

  shortened: {
        type: String,
        required: true,
        default: Id.generate
  },

  clicks: {
        type: Number,
        default: 0,
        required: true
        
  },
  notes: {
      type: String
  }

})

module.exports = mongod.model('ShortenedURL', shortenedUrlSchema)