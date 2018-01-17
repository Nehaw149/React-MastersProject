import React from 'react'
import { Embed } from 'semantic-ui-react'
import { Button,  Icon, Modal, Image, Grid, Item } from 'semantic-ui-react';

const Steps = () => (

  <Grid padded relaxed centered doubling stackable>
   <Grid.Row>
      <Grid.Column>
          <h1>Employ just four simple steps to achieve any Stakeholder analysis for any Project</h1>
      </Grid.Column>
   </Grid.Row>

   <Grid.Row>
     <Grid.Column width={8}>
     <Item className = 'fourth-section-item'>
         <Item.Image  src='../../../public/img/step1.png' width='300px' shape='circular' />
         <Item.Content>
           <Item.Header >1- Define Your Stakeholder with needs and outputs for every one</Item.Header>
           <Item.Description>

           </Item.Description>

         </Item.Content>
     </Item>

     </Grid.Column >

     <Grid.Column width={8}>
     <Item className = 'fourth-section-item'>
         <Item.Image  src='../../../public/img/step2.png' width='300px'  />
         <Item.Content>
           <Item.Header >2- Connect between The Stakeholders</Item.Header>
           <Item.Description>

           </Item.Description>

         </Item.Content>
     </Item>

     </Grid.Column >
  </Grid.Row>

   <Grid.Row>
     <Grid.Column width={8}>
      <Item className = 'fourth-section-item'>
         <Item.Image  src='../../../public/img/step3.png' width='300px' shape='circular' />
         <Item.Content>
           <Item.Header >3- Make Estimation For every Vlaue flow between the Stakeholders</Item.Header>

         </Item.Content>
      </Item>
     </Grid.Column >

     <Grid.Column width={8}>
     <Item className = 'fourth-section-item'>
         <Item.Image  src='../../../public/img/step4.png' width='300px'  />
         <Item.Content>
           <Item.Header >4-  Applay The algorithm  and get the Results</Item.Header>
           <Item.Description>

           </Item.Description>

         </Item.Content>
     </Item>
     </Grid.Column >

   </Grid.Row>
  </Grid>
)

export default Steps
