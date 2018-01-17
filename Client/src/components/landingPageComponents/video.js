import React from 'react'
import { Embed } from 'semantic-ui-react'
import { Button,  Icon, Modal, Image } from 'semantic-ui-react';

const Video = () => (

  <Modal trigger={
      <div className='ui embed'>
        <i aria-hidden="true" className="video play icon"></i>
        <img className="placeholder" src="http://semantic-ui.com/images/vimeo-example.jpg" />
      </div>
    } blurring  size='small' dimmer='blurring' closeIcon='close'>

    <Modal.Content>
        <Embed
          autoplay
          id='7cUELYuzRGc'
          placeholder='http://semantic-ui.com/images/vimeo-example.jpg'
          source='youtube'
        />
    </Modal.Content>

  </Modal>

)

export default Video
