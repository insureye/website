import React, {useState} from 'react'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import { dropdownarrow } from '../../assets';



function DropdownBtn({timeFrame, changeTimeFrame, btnstyle}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
  
    const toggle = () => setDropdownOpen((prevState) => !prevState);
  
    return (
      <div>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle className={`${btnstyle}`} caret>
            {timeFrame=="1"? "In 1 year": "In " + timeFrame + " years"}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Set the time frame</DropdownItem>
            <DropdownItem onClick={() => changeTimeFrame("1")}>
                In 1 year
            </DropdownItem>
            <DropdownItem onClick={() => changeTimeFrame("5")}>In 5 years</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }

export default DropdownBtn