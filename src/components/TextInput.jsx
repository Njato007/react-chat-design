import './../App.css'
import React from 'react'
import { Mention, MentionComponent } from '@syncfusion/ej2-react-dropdowns'
import { ImUser } from 'react-icons/im';
import { registerLicense } from '@syncfusion/ej2-base'

const TextInput = ({ mentionData }) => {
    
  const mentionTarget = '#inputMention';

  const mentionItemTemplate = (props) => {
    return (
      <div className='flex items-center gap-1 p-1 bg-white hover:bg-indigo-400'>
        <ImUser />
        <span className=''>{props.display ?? ""}</span>
      </div>
    )
  }
  const itemDisplayTemplate = (props) => {
    return (<span className='font-bold text-slate-800'>@{props.display}</span>)
  }
  return (
    <div className='w-full relative'>
        <MentionComponent
            target={mentionTarget}
            dataSource={mentionData}
            fields={{ text: 'display'}}
            itemTemplate={mentionItemTemplate}
            style={{ display: 'absolute'}}
            displayTemplate={itemDisplayTemplate}
            suffixText={'&nbsp;'}
            locale='fr-FR'
            change={(e) => console.log(e)}
            
        ></MentionComponent>
        <div id='inputMention' placeholder='Tapez un message' className='w-full px-2 py-2 outline-none bg-transparent text-black'></div>
    </div>
  )
}

export default TextInput