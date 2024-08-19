import * as React from 'react';
import Dashboard from './Dashboard';
function Projects({tab}) {
    console.log(tab)
    return (
      <>
      <Dashboard></Dashboard>
      { tab }
      </>
    )
}

export default Projects
  

