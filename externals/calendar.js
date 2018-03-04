import moment from 'moment-timezone';

export class Calendar {
  async resourceEvents(date) {
    var date = moment(date)

    const gapi = window.gapi;
    return new Promise((resolve, reject) => {
      gapi.client.calendar.calendarList.list().then(
        (response) => {
          var batch = gapi.client.newBatch();
          var result = {};

          for(let cal of response.result.items) {
            if(String(cal.id).match(/@resource\.calendar\.google\.com$/)) {
                console.log(cal.summary, cal.timeZone, cal.id);
                const batchId = batch.add(this.requestEventList(cal.id, date));
                result[batchId] = {
                  timeZone: cal.timeZone,
                  name: cal.summary,
                  id: cal.id
                }
            }
          }
          
          batch.then(
            (batchResponse) => {
              for(let batchId in batchResponse.result) {
                let singleResponse = batchResponse.result[batchId]
                result[batchId].events = []
                for(let item of singleResponse.result.items) {
                  if(typeof item.start.dateTime == "string") {
                    const start = moment(item.start.dateTime).tz(result[batchId].timeZone)
                    const end = moment(item.end.dateTime).tz(result[batchId].timeZone)
                    if(date.startOf('day') <= end && start <= date.endOf('day')) {
                      result[batchId].events.push({
                        id: item.id,
                        title: item.summary,
                        url: item.htmlLink,
                        start: start,
                        end: end,
                      })
                    }
                  }
                }
              }
              resolve(Object.values(result));
            },
            (reason) => {
              reject(reason)
            }
          )
        },
        (reason) => {
          reject(reason)
        }
      )
    });
  }

  async calendarList() {
    const gapi = window.gapi;
    return new Promise((resolve, reject) => {
      gapi.client.calendar.calendarList.list().then(
        (response) => {
          resolve(response.result.items);
        },
        (reason) => {
          reject(reason)
      })
    });
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
}




export let calendar = new Calendar();
