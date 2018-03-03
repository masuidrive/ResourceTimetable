
export class Calendar {
  async resourceEvents() {
    const gapi = window.gapi;
    return new Promise((resolve, reject) => {
      gapi.client.calendar.calendarList.list().then(
        (response) => {
          var batch = gapi.client.newBatch();
          var result = {};

          for(let cal of response.result.items) {
            if(String(cal.id).match(/@resource\.calendar\.google\.com$/)) {
                console.log(cal.summary, cal.timeZone, cal.id);
                const batchId = batch.add(this.requestEventList(cal.id));
                result[batchId] = {
                  calendar: cal
                }
            }
          }

          batch.then(
            (batchResponse) => {
              console.log(batchResponse)
              for(let batchId in batchResponse.result) {
                console.log(singleResponse)
                let singleResponse = batchResponse.result[batchId]
                result[batchId].events = []
                for(let item of singleResponse.result.items) {
                  console.log(item)
                  result[batchId].events.push(item)
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


  requestEventList(calendarId) {
    const gapi = window.gapi;
    return gapi.client.calendar.events.list({
      'calendarId': calendarId,
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    });
  }  
}




export let calendar = new Calendar();
