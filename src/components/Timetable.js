import React from 'react';

export default ({resources}) => (
  <div>
  {
    resources.map((resource) => (
      <div>{resource.calendar.summary}</div>
    ))
  }
  </div>
)
