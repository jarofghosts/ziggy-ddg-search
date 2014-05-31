var ddg = require('ddg')
  , commands

commands = [
    '!search'
  , '!whats'
  , '!define'
  , '!ddg'
]

var not_found = [
    'I don\'t know what that is.'
  , 'You can\'t expect me to know everything!'
  , 'Well if you don\'t know, how am I expected to know?'
  , 'Some questions are better left unanswered...Grasshopper...'
  , 'Cannot Compute, try again!'
  , 'I\'m sorry Dave, I can\'t let you do that...'
]

search.help = '!search, !whats, !define, !ddg <term> - define <term>'

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

      var result = data.AbstractText ||
          remove_def(data.Definition) ||
          (data.RelatedTopics && data.RelatedTopics.length &&
           data.RelatedTopics[0].Text) ||
          not_found[Math.floor(Math.random() * not_found.length)]

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
