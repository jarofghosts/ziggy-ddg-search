var ddg = require('ddg')
  , commands

commands = [
    '!search'
  , '!whats'
  , '!ddg'
]

module.exports = search

function search(ziggy) {
  ziggy.on('message', parse_message)
  ziggy.on('pm', parse_pm)
  
  function parse_message(user, channel, text) {
    var bits = text.split(/\s+/)

    var command = bits[0]
      , query

    query = bits.slice(1).join(' ').trim()

    if (commands.indexOf(command) === -1) return

    ddg.query(query, display_result)

    function display_result(err, data) {
      if (err) return ziggy.say(channel, 'Not right now, ask later.')
        console.log(data)

      var result = data.AbstractText ||
          remove_def(data.Definition) ||
          data.RelatedTopics[0].Text ||
          'I don\'t know what that is.'

      ziggy.say(channel, result)
    }
    function remove_def(text) {
      return text.replace(query + ' definition', query)
    }
  }

  function parse_pm(user, text) {
    parse_message(user, user.nick, text)
  }
}
