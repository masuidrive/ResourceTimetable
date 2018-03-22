import moment from 'moment-timezone';

export class Calendar {

  // Get resource list from GCAL
  loadResources() {
    const gapi = window.gapi;
    return new Promise((resolve, reject) => {
      gapi.client.directory.resources.calendars.list({customer: 'my_customer'}).then(
        (response) => {
          var result = []
          for(let res of response.result.items) {
            result.push({
              calendarId: res.resourceEmail,
              name: res.resourceName,
            })
          }
          resolve(result)
        },
        (reason) => {
          reject(reason)
      })
    });
  }

  // get events
  async loadEvents(date) {
    var date = moment(date)

    const gapi = window.gapi;
    var resources = await this.loadResources()
    var batch = await this.execBatch(resources.map(r => ({
      request: this.requestEventList(r.calendarId, date),
      resource: r
    })))

    for(let command of batch) {
      const resource = command.resource
      resource.events = []
      for(let item of command.result.items) {
        // attendees[].emailにresource idと、 responseStatusが"accepted"なのを確認
        const active = typeof((item.attendees || []).
          find((a) => a.email == resource.calendarId && a.responseStatus == "accepted")) == "object"

        if(active && typeof item.start.dateTime == "string") {
          // 時間枠に入るなら
          const start = moment(item.start.dateTime)
          const end = moment(item.end.dateTime)
          if(date.startOf('day') <= end && start <= date.endOf('day')) {
            resource.events.push({
              id: item.id,
              title: item.summary,
              url: item.htmlLink,
              start: start,
              end: end,
              href: item.htmlLink
            })
          }
        }
      }
    }
    return resources
  }

  requestEventList(calendarId, date) {
    const gapi = window.gapi;
    return gapi.client.calendar.events.list({
      'calendarId': calendarId,
      'timeMin': date.startOf('day').toISOString(),
      'timeMax': date.endOf('day').toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    });
  }

  execBatch(commands) {
    return new Promise((resolve, reject) => {
      var batch = gapi.client.newBatch();
      commands.forEach((c) => c.batchId = batch.add(c.request))
      batch.then(
        (batchResponse) => {
          for(let batchId in batchResponse.result) {
            var command = commands.find((c) => c.batchId == batchId)
            command.result = batchResponse.result[batchId].result
          }
          resolve(commands)
        },
        (reason) => {
          reject(reason)
        }
      )
    })
  }
}

export let calendar = new Calendar();
