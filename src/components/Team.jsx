import React from 'react';
import styles from '../style';
import { team } from '../constants';
import { TeamMember } from '../components';

function shuffleArray(arr) {
  // Start from the last element and swap
  // one by one. We don't need to run for
  // the first element that's why i > 0
  for (let i = arr.length - 1; i > 0; i--) {
    // pick a random index from 0 to i inclusive
    const j = Math.floor(Math.random() * (i + 1)); // at random index
    // Swap arr[i] with the element
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const names = shuffleArray(Object.keys(team.members));

function genTeamMember(name, tm) {
  return(
  <div key={name} className='px-10'>
    <TeamMember name={name} teamMember={tm[name]}/>
  </div>);
}

const Team = () => {
  return (
    <div className='flex flex-col py-20 w-full items-start'>
      <h1 className={`${styles.textTitle2} py-6`}>
        { team.title }
      </h1>
      <p className={`${styles.paragraph2} py-6`}>
        { team.content1} <br/> {team.content2}
      </p>
      <div className='flex flex-row py-6 w-full overflow-x-scroll items-start'>
        { names.map((x) => genTeamMember(x, team.members)) }
      </div>
    </div>
  )
}

export default Team